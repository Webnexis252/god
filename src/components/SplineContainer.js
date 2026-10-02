"use client";

import { useEffect, useRef, useState } from "react";

// Self-hosted copies of the decoders the runtime otherwise pulls from unpkg and gstatic.
const WASM_PATH = "/spline/wasm";

// The scene is authored at a fixed pixel scale: a smaller canvas does not shrink
// the crowd, it crops it. So the canvas is laid out in the scene's own pixels and
// scaled as a whole, sized and placed so the crowd fills the stage.
//
// CROWD is where the heads sit in those pixels, measured from the scene's centre.
// Everything above `keep` (the top three rows) must stay clear of the copy; the
// rows below it may run on behind the copy.
const CROWD = { left: -550, right: 622, top: -395, bottom: 250, keep: 10 };
// On a screen narrower than this the crowd is cropped at the sides, not shrunk further.
const SCENE_MIN_WIDTH = 760;
const CROWD_GAP_PX = 20;

const MIN_PIXEL_RATIO = 0.6;
const FULL_FRAME_MS = 1000 / 60;
const HALF_FRAME_MS = 1000 / 30;
const QUALITY_WINDOW_MS = 500;
// Frames are slow just after the reveal because the rest of the page is still
// starting up, so nothing is judged until that has passed.
const QUALITY_GRACE_MS = 2500;
const FIRST_FRAME_TIMEOUT_MS = 1500;
const SCROLL_RESUME_MS = 140;
const RESIZE_SETTLE_MS = 120;
// Every head in the scene looks at one invisible object, which the scene drifts
// around by itself. To make the crowd watch the cursor, that object is placed
// under the cursor instead, on a plane this far in front of the scene's origin:
// just in front of the faces, so heads beside the cursor turn sharply towards it.
const FOCUS_DEPTH = 520;
// How quickly the crowd's gaze catches up with the cursor.
const GAZE_EASE_MS = 140;
// A touch screen has no cursor to watch: the crowd looks at a touch for this long
// after it, then goes back to the scene's own drift.
const TOUCH_HOLD_MS = 2500;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// `cover` is the element laid over the bottom of the stage (the hero copy), if any.
function fitFrame(stage, frame, cover) {
  const stageWidth = stage.clientWidth;
  const stageHeight = stage.clientHeight;

  if (!stageWidth || !stageHeight) {
    return;
  }

  const clearHeight = cover
    ? clamp(
        cover.getBoundingClientRect().top - stage.getBoundingClientRect().top,
        0,
        stageHeight
      )
    : stageHeight;

  // As big as the width allows, unless that would push the kept rows under the copy.
  const scale = Math.max(
    0.2,
    Math.min(
      stageWidth / clamp(stageWidth, SCENE_MIN_WIDTH, CROWD.right - CROWD.left),
      (clearHeight - CROWD_GAP_PX) / (CROWD.keep - CROWD.top)
    )
  );

  // The crowd hangs from just under the top edge. When all of it fits above the
  // copy, it drops down to stand on the copy instead of floating above it.
  const top =
    CROWD_GAP_PX +
    Math.max(
      0,
      clearHeight - CROWD_GAP_PX - (CROWD.bottom - CROWD.top) * scale
    );

  // The part of the scene the stage shows, in scene pixels. The scene draws around
  // the canvas centre, so the canvas reaches equally far either side of it.
  const viewLeft = (CROWD.left + CROWD.right) / 2 - stageWidth / (2 * scale);
  const viewTop = CROWD.top - top / scale;
  const halfWidth = Math.ceil(
    Math.max(Math.abs(viewLeft), Math.abs(viewLeft + stageWidth / scale))
  );
  const halfHeight = Math.ceil(
    Math.max(Math.abs(viewTop), Math.abs(viewTop + stageHeight / scale))
  );

  frame.style.width = `${halfWidth * 2}px`;
  frame.style.height = `${halfHeight * 2}px`;
  frame.style.transform = `translate(${-scale * (viewLeft + halfWidth)}px, ${
    -scale * (viewTop + halfHeight)
  }px) scale(${scale})`;
  // The poster is held back until this is set, so it never paints at the wrong size.
  frame.dataset.fitted = "true";
}

function isConstrainedDevice() {
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    (navigator.deviceMemory ?? 8) <= 4 ||
    (navigator.hardwareConcurrency ?? 8) <= 4
  );
}

// The poster stands in when the scene would cost more than it gives: data saver,
// very little memory, or WebGL that is missing or software-rendered.
function canRenderScene() {
  if (navigator.connection?.saveData || (navigator.deviceMemory ?? 8) <= 2) {
    return false;
  }

  try {
    const probe = document.createElement("canvas");
    const options = { failIfMajorPerformanceCaveat: true };
    const context =
      probe.getContext("webgl2", options) ?? probe.getContext("webgl", options);

    context?.getExtension("WEBGL_lose_context")?.loseContext();

    return Boolean(context);
  } catch {
    return false;
  }
}

// The scene is published at the full device pixel ratio, which is millions of
// wasted pixels on phones and 4K monitors. Cap it by ratio and by total pixels.
// The desktop budget keeps a retina laptop near 1.65x, where the crowd still looks
// crisp; a device that cannot hold it is stepped down by bindQuality.
function pickPixelRatio(width, height, constrained) {
  const cap = constrained ? 1.5 : 2;
  const budget = constrained ? 0.9e6 : 4.2e6;
  const withinBudget = Math.sqrt(budget / Math.max(width * height, 1));

  return clamp(
    Math.min(window.devicePixelRatio || 1, cap, withinBudget),
    MIN_PIXEL_RATIO,
    cap
  );
}

async function fetchScene(url, signal) {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Scene request failed with ${response.status}`);
  }

  return response.arrayBuffer();
}

function mountScene({ canvas, stage, sceneUrl, onLiveChange }) {
  const controller = new AbortController();
  const cleanups = [];
  let app = null;
  let isDisposed = false;
  let isSuspended = false;
  let syncPlayback = () => {};

  // Where on the page the crowd should look, in viewport coordinates. Tracked from
  // the very start, so the crowd finds the cursor the moment the scene appears.
  // While it is null the scene drifts the crowd's gaze around by itself.
  let aim = null;
  let lastInputAt = 0;
  let steer = () => {};

  const aimAt = (x, y) => {
    aim = { x, y };
    lastInputAt = performance.now();
  };

  const handlePointer = (event) => aimAt(event.clientX, event.clientY);

  // Keyboard users steer the crowd too: it looks at whatever they tab to.
  const handleFocus = (event) => {
    if (event.target instanceof Element && event.target.matches(":focus-visible")) {
      const rect = event.target.getBoundingClientRect();

      aimAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  };

  // A finger "leaves" the moment it lifts, so only a mouse leaving the page (or
  // the window losing focus) stops the crowd looking at where it last was.
  const handleLeave = (event) => {
    if (event.pointerType !== "touch") {
      aim = null;
    }
  };

  window.addEventListener("pointermove", handlePointer, { passive: true });
  window.addEventListener("pointerdown", handlePointer, { passive: true });
  window.addEventListener("blur", handleLeave);
  document.addEventListener("focusin", handleFocus);
  document.documentElement.addEventListener("pointerleave", handleLeave);
  cleanups.push(() => {
    window.removeEventListener("pointermove", handlePointer);
    window.removeEventListener("pointerdown", handlePointer);
    window.removeEventListener("blur", handleLeave);
    document.removeEventListener("focusin", handleFocus);
    document.documentElement.removeEventListener("pointerleave", handleLeave);
  });

  const showPoster = () => {
    if (!isDisposed) {
      onLiveChange(false);
    }
  };

  const bindScene = () => {
    const constrained = isConstrainedDevice();
    let qualityScale = 1;

    // The canvas is laid out in scene pixels and then scaled, so the resolution is
    // chosen for the size it is shown at and converted back.
    const pickShownRatio = () => {
      const shown = canvas.getBoundingClientRect();

      return pickPixelRatio(shown.width, shown.height, constrained) * qualityScale;
    };

    const pickRatio = () =>
      (Math.max(MIN_PIXEL_RATIO, pickShownRatio()) *
        canvas.getBoundingClientRect().width) /
      Math.max(canvas.clientWidth, 1);

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    let pixelRatio = pickRatio();

    // The runtime has no public resolution control; it asks this hook once when it
    // builds the renderer. If the hook ever goes away the scene just renders at full ratio.
    app._getPixelRatio = () => pixelRatio;
    app.setSize(width, height);

    // Likewise there is no frame-rate option, so the render callback is wrapped
    // before start() hands it to the animation loop. This caps 144Hz+ monitors
    // at roughly 60fps, and lets a struggling device drop to 30.
    const render = app.render;
    let frameInterval = FULL_FRAME_MS;
    let lastFrameAt = 0;

    if (typeof render === "function") {
      app.render = (time) => {
        // The slack keeps a frame that arrives slightly early from being dropped.
        if (time - lastFrameAt < frameInterval - 4) {
          return;
        }

        steer(time - lastFrameAt);
        lastFrameAt = time;
        render(time);
      };
    }

    const redraw = () => {
      if (!isDisposed && typeof render === "function") {
        render(performance.now());
      }
    };

    const syncSize = () => {
      const nextWidth = canvas.clientWidth;
      const nextHeight = canvas.clientHeight;

      if (nextWidth <= 0 || nextHeight <= 0) {
        return;
      }

      const nextRatio = pickRatio();
      const sizeChanged = nextWidth !== width || nextHeight !== height;

      width = nextWidth;
      height = nextHeight;

      if (nextRatio !== pixelRatio) {
        pixelRatio = nextRatio;
        app._renderer?.setPixelRatio?.(pixelRatio);
        // The render pipeline only takes a new ratio on a size change, and a single
        // change leaves some of its buffers at the old one (the scene then draws into
        // a corner of the canvas). Stepping off the size and back updates them all.
        app.setSize(width - 1, height - 1);
      } else if (!sizeChanged) {
        return;
      }

      // Once sized by hand, the runtime keeps showing the part of the scene it showed
      // at start and stretches it over the canvas. Giving its frame the new size keeps
      // the scene at its own pixel scale instead, which is what fitFrame is built on.
      if (app._frameView) {
        app._frameView.frameSize = { x: width, y: height };
      }

      app.setSize(width, height);

      // Resizing clears the canvas. Draw again before the frame is shown, so the
      // cleared canvas never reaches the screen. Queued, not called: this can run
      // inside the runtime's own render (bindQuality steps down from its "rendered"
      // event), and that has to finish first.
      queueMicrotask(redraw);
    };

    // Every resize reallocates the render targets, so wait for a drag to settle.
    let resizeTimer = 0;
    const resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(syncSize, RESIZE_SETTLE_MS);
    });

    resizeObserver.observe(canvas);
    cleanups.push(() => {
      window.clearTimeout(resizeTimer);
      resizeObserver.disconnect();
    });

    // Fewer pixels relieves the GPU; fewer frames relieves the main thread, which
    // is what a phone runs out of first.
    const steps = constrained
      ? ["frames", "pixels", "pixels"]
      : ["pixels", "frames", "pixels"];

    return {
      getFrameInterval: () => frameInterval,
      // `overload` is how many times longer than its target a frame is taking.
      degrade(overload) {
        while (steps.length) {
          const step = steps.shift();

          if (step === "frames") {
            frameInterval = HALF_FRAME_MS;
            return true;
          }

          if (pickShownRatio() > MIN_PIXEL_RATIO) {
            // Frame time roughly tracks pixel count, so aim straight for the target.
            qualityScale *= clamp(1 / Math.sqrt(overload), 0.5, 0.85);
            syncSize();
            return true;
          }
        }

        // Out of options and still far behind: a still image beats a page that stutters.
        if (overload > 2 && !isSuspended) {
          isSuspended = true;
          syncPlayback();
          onLiveChange(false);
        }

        return false;
      },
    };
  };

  // Render only while the hero is on screen, the tab is visible, and the page is not scrolling.
  const bindPlayback = () => {
    let isInView = true;
    let isScrolling = false;
    let isRunning = true;
    let resumeTimer = 0;

    const sync = () => {
      const shouldRun =
        isInView && !isScrolling && !document.hidden && !isSuspended;

      if (shouldRun === isRunning) {
        return;
      }

      isRunning = shouldRun;

      if (shouldRun) {
        app.play();
      } else {
        app.stop();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting;
      sync();
    });

    const handleScroll = () => {
      if (!isInView) {
        return;
      }

      isScrolling = true;
      sync();
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        isScrolling = false;
        sync();
      }, SCROLL_RESUME_MS);
    };

    syncPlayback = sync;
    observer.observe(stage);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("scroll", handleScroll, { passive: true });
    cleanups.push(() => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("scroll", handleScroll);
      window.clearTimeout(resumeTimer);
    });

  };

  // Puts the object every head looks at under whatever the crowd should watch.
  const bindGaze = () => {
    const eventContext = app.eventManager?.eventContext;
    const target = app.eventManager?.handlers?.LookAt?.events?.find(
      (event) => event.target
    )?.target;

    // These are runtime internals. Without them the scene just keeps its own drift.
    if (
      !target ||
      !eventContext?.raycaster?.ray ||
      typeof eventContext.updateRaycaster !== "function"
    ) {
      return;
    }

    const drift = target.getWorldPosition;
    const scratch = target.position.clone();
    const point = drift.call(target, scratch).clone();

    // The heads ask this object where it is; answer with the steered position.
    target.getWorldPosition = (out) => out.copy(point);
    cleanups.push(() => {
      delete target.getWorldPosition;
    });

    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    steer = (elapsed) => {
      // With a mouse the cursor is the only thing the crowd ever watches.
      const focus =
        isTouch && performance.now() - lastInputAt > TOUCH_HOLD_MS ? null : aim;
      const goal = drift.call(target, scratch);

      if (focus) {
        // The runtime aims from a cached copy of the canvas's position, which goes
        // stale whenever the page scrolls or the scene is re-framed.
        eventContext.domRect = canvas.getBoundingClientRect();
        eventContext.updateRaycaster({
          pageX: focus.x + window.scrollX,
          pageY: focus.y + window.scrollY,
        });

        const { origin, direction } = eventContext.raycaster.ray;

        if (Math.abs(direction.z) > 1e-4) {
          goal
            .copy(direction)
            .multiplyScalar((FOCUS_DEPTH - origin.z) / direction.z)
            .add(origin);
        }
      }

      if (point.distanceToSquared(goal) < 0.01) {
        return;
      }

      point.lerp(goal, 1 - Math.exp(-clamp(elapsed, 0, 100) / GAZE_EASE_MS));
      // The heads only re-aim when the object they watch reports a change.
      target.dispatchEvent({ type: "requestRender" });
    };

    cleanups.push(() => {
      steer = () => {};
    });
  };

  // Step the quality down when the device keeps missing its frame target. It takes
  // two slow windows in a row, so one busy moment on the page does not cost quality.
  const bindQuality = ({ getFrameInterval, degrade }) => {
    let samples = [];
    let slowWindows = 0;
    let lastRenderAt = 0;
    let windowStart = performance.now() + QUALITY_GRACE_MS;

    const handleRendered = () => {
      const now = performance.now();
      const delta = now - lastRenderAt;

      lastRenderAt = now;

      // Gaps this long are pauses between bursts of rendering, not slow frames.
      if (now < windowStart || delta > 500) {
        return;
      }

      samples.push(delta);

      if (now - windowStart < QUALITY_WINDOW_MS || samples.length < 4) {
        return;
      }

      const median = samples.sort((a, b) => a - b)[samples.length >> 1];
      const overload = median / getFrameInterval();

      samples = [];
      windowStart = now;
      slowWindows = overload > 1.35 ? slowWindows + 1 : 0;

      if (slowWindows >= 2 && degrade(overload)) {
        slowWindows = 0;
        // Let the new settings take hold before judging them.
        windowStart = now + QUALITY_WINDOW_MS;
      }
    };

    canvas.addEventListener("rendered", handleRendered);
    cleanups.push(() => canvas.removeEventListener("rendered", handleRendered));
  };

  const bindContextLoss = () => {
    const handleLost = () => onLiveChange(false);
    const handleRestored = () => onLiveChange(!isSuspended);

    canvas.addEventListener("webglcontextlost", handleLost);
    canvas.addEventListener("webglcontextrestored", handleRestored);
    cleanups.push(() => {
      canvas.removeEventListener("webglcontextlost", handleLost);
      canvas.removeEventListener("webglcontextrestored", handleRestored);
    });
  };

  const load = async () => {
    const [{ Application }, buffer] = await Promise.all([
      import("@splinetool/runtime"),
      fetchScene(sceneUrl, controller.signal),
    ]);

    if (isDisposed) {
      return;
    }

    app = new Application(canvas, { wasmPath: WASM_PATH });

    const quality = bindScene();
    const firstFrame = new Promise((resolve) => {
      canvas.addEventListener("rendered", resolve, { once: true });
    });

    // Typed as void, but start() returns a promise that resolves once the scene is built.
    await app.start(buffer);

    if (isDisposed) {
      return;
    }

    app.setGlobalEvents?.(false);

    // Shaders compile on the first draw, so only reveal the canvas once a frame is out.
    await Promise.race([
      firstFrame,
      new Promise((resolve) => window.setTimeout(resolve, FIRST_FRAME_TIMEOUT_MS)),
    ]);

    if (isDisposed) {
      return;
    }

    bindPlayback();
    bindGaze();
    bindQuality(quality);
    bindContextLoss();
    onLiveChange(true);
  };

  load().catch(showPoster);

  return () => {
    isDisposed = true;
    controller.abort();
    cleanups.forEach((cleanup) => cleanup());
    app?.dispose();
  };
}

// coverSelector: the element laid over the bottom of the scene, which the crowd's
// upper rows are kept clear of.
// posterUrl2x: the same still at twice the size, for high-density screens.
export default function SplineContainer({
  sceneUrl,
  posterUrl,
  posterUrl2x,
  coverSelector,
  className = "",
}) {
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLive, setIsLive] = useState(false);

  // Runs for the poster too, so the still and the live scene are framed alike.
  useEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;

    if (!stage || !frame) {
      return undefined;
    }

    const cover = coverSelector ? document.querySelector(coverSelector) : null;
    const observer = new ResizeObserver(() => fitFrame(stage, frame, cover));

    fitFrame(stage, frame, cover);
    observer.observe(stage);

    if (cover) {
      observer.observe(cover);
    }

    return () => {
      observer.disconnect();
    };
  }, [coverSelector]);

  // The scene is loaded once and kept for the life of the page; scrolling away
  // only pauses it. Tearing it down and reloading it is what froze the page.
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;

    if (!stage || !canvas || !sceneUrl) {
      return undefined;
    }

    if (!canRenderScene()) {
      return undefined;
    }

    return mountScene({
      canvas,
      stage,
      sceneUrl,
      onLiveChange: setIsLive,
    });
  }, [sceneUrl]);

  return (
    <div
      ref={stageRef}
      className={["spline-stage", isLive ? "is-live" : "", className]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <div ref={frameRef} className="spline-frame">
        {posterUrl ? (
          <img
            className="spline-poster"
            src={posterUrl}
            srcSet={posterUrl2x ? `${posterUrl} 1x, ${posterUrl2x} 2x` : undefined}
            alt=""
            decoding="async"
            fetchPriority="high"
          />
        ) : null}

        <canvas ref={canvasRef} className="spline-canvas" />
      </div>
    </div>
  );
}
