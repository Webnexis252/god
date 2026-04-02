"use client";

import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

const mobilePoints = [
  { x: 0.32, y: 0.36 },
  { x: 0.68, y: 0.32 },
  { x: 0.58, y: 0.55 },
  { x: 0.41, y: 0.48 },
];

const TARGET_NAME_PATTERNS = [/^target$/i, /^lookat$/i, /look.?at/i, /cursor/i];
const HEAD_NAME_PATTERNS = [/^heads?$/i, /head/i];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function snapshotVector(vector) {
  return {
    x: vector?.x ?? 0,
    y: vector?.y ?? 0,
    z: vector?.z ?? 0,
  };
}

function matchesName(patterns, name) {
  return patterns.some((pattern) => pattern.test(name));
}

function resolveFollowRig(app) {
  const objects = app.getAllObjects?.() ?? [];
  const targets = [];
  const heads = [];

  objects.forEach((object) => {
    const name = object?.name?.trim();

    if (!name) {
      return;
    }

    if (matchesName(TARGET_NAME_PATTERNS, name)) {
      targets.push({
        object,
        restPosition: snapshotVector(object.position),
      });
      return;
    }

    if (matchesName(HEAD_NAME_PATTERNS, name)) {
      heads.push({
        object,
        restRotation: snapshotVector(object.rotation),
      });
    }
  });

  return {
    targets: targets.slice(0, 3),
    heads: heads.slice(0, 6),
  };
}

function dispatchCanvasPointer(canvas, clientX, clientY) {
  const mouseOptions = {
    bubbles: true,
    cancelable: true,
    clientX,
    clientY,
    view: window,
  };

  if (typeof PointerEvent === "function") {
    canvas.dispatchEvent(
      new PointerEvent("pointermove", {
        ...mouseOptions,
        pointerId: 1,
        pointerType: "mouse",
        isPrimary: true,
      })
    );
  }

  canvas.dispatchEvent(new MouseEvent("mousemove", mouseOptions));
}

function dispatchSyntheticPointer(canvas, point) {
  const rect = canvas.getBoundingClientRect();
  const clientX = rect.left + rect.width * point.x;
  const clientY = rect.top + rect.height * point.y;

  dispatchCanvasPointer(canvas, clientX, clientY);
}

export default function SplineContainer({
  interactionScopeRef,
  sceneUrl,
  className = "",
}) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const pointIndexRef = useRef(0);
  const scrollPausedRef = useRef(false);
  const followRigRef = useRef({ targets: [], heads: [] });
  const pointerIntentRef = useRef({ x: 0, y: 0 });
  const pointerCurrentRef = useRef({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isLowPower, setIsLowPower] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 820px)");

    const syncViewport = () => {
      setIsMobile(mediaQuery.matches);
    };

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting || entry.intersectionRatio > 0.18);
      },
      {
        threshold: [0, 0.18, 0.45],
      }
    );

    observer.observe(stage);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const memory = navigator.deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const frameId = window.requestAnimationFrame(() => {
      setIsLowPower(coarsePointer || memory <= 4 || cores <= 4);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    syncMotionPreference();
    mediaQuery.addEventListener("change", syncMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !sceneUrl || !isInView || appRef.current) {
      return undefined;
    }

    let isDisposed = false;
    let resizeFrame = 0;
    let idleCallbackId = 0;
    let timeoutId = 0;
    let resizeObserver;

    const loadScene = async () => {
      const { Application } = await import("@splinetool/runtime");

      if (isDisposed || !canvasRef.current) {
        return;
      }

      const app = new Application(canvasRef.current);
      appRef.current = app;

      const syncSize = () => {
        const rect = canvasRef.current?.getBoundingClientRect();

        if (rect && rect.width > 0 && rect.height > 0) {
          app.setSize(rect.width, rect.height);
        }
      };

      resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(syncSize);
      });

      resizeObserver.observe(canvasRef.current);
      syncSize();

      try {
        await app.load(sceneUrl);

        if (isDisposed) {
          return;
        }

        app.setGlobalEvents?.(false);

        followRigRef.current = resolveFollowRig(app);
        setIsLoaded(true);
        setHasError(false);
      } catch {
        if (!isDisposed) {
          setHasError(true);
        }
      }
    };

    if ("requestIdleCallback" in window) {
      idleCallbackId = window.requestIdleCallback(loadScene, { timeout: 900 });
    } else {
      timeoutId = window.setTimeout(loadScene, 120);
    }

    return () => {
      isDisposed = true;
      if (idleCallbackId) {
        window.cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      cancelAnimationFrame(resizeFrame);
      resizeObserver?.disconnect();
      appRef.current?.dispose();
      appRef.current = null;
      followRigRef.current = { targets: [], heads: [] };
    };
  }, [isInView, sceneUrl]);

  const syncPlayback = useEffectEvent(() => {
    const app = appRef.current;

    if (!app || !isLoaded) {
      return;
    }

    if (document.hidden || !isInView || scrollPausedRef.current) {
      app.stop?.();
    } else {
      app.play?.();
    }
  });

  useEffect(() => {
    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [isInView, isLoaded]);

  const tickMobileMotion = useEffectEvent(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const point = mobilePoints[pointIndexRef.current % mobilePoints.length];
    pointIndexRef.current += 1;
    dispatchSyntheticPointer(canvas, point);
  });

  const syncDesktopPointer = useEffectEvent((clientX, clientY) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    if (scrollPausedRef.current) {
      return;
    }

    dispatchCanvasPointer(canvas, clientX, clientY);
  });

  const updatePointerIntent = useEffectEvent((clientX, clientY) => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const rect = stage.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    pointerIntentRef.current = {
      x: clamp(((clientX - rect.left) / rect.width) * 2 - 1, -1.15, 1.15),
      y: clamp(((clientY - rect.top) / rect.height) * 2 - 1, -1.15, 1.15),
    };
  });

  const resetPointerIntent = useEffectEvent(() => {
    pointerIntentRef.current = { x: 0, y: 0 };
  });

  const syncCharacterFocus = useEffectEvent(() => {
    if (!isLoaded) {
      return;
    }

    const { targets, heads } = followRigRef.current;

    if (!targets.length && !heads.length) {
      return;
    }

    const current = pointerCurrentRef.current;
    const intent = pointerIntentRef.current;

    current.x += (intent.x - current.x) * 0.12;
    current.y += (intent.y - current.y) * 0.12;

    if (!heads.length && targets.length) {
      const offsetX = current.x * 34;
      const offsetY = current.y * -18;

      targets.forEach(({ object, restPosition }) => {
        object.position.x = restPosition.x + offsetX;
        object.position.y = restPosition.y + offsetY;
      });

      return;
    }

    heads.forEach(({ object, restRotation }, index) => {
      const influence = Math.max(0.7, 1 - index * 0.06);
      object.rotation.y = restRotation.y + current.x * 0.42 * influence;
      object.rotation.x = restRotation.x - current.y * 0.16 * influence;
    });
  });

  useEffect(() => {
    const interactionScope = interactionScopeRef?.current ?? stageRef.current;

    if (!isLoaded || isMobile || prefersReducedMotion || !interactionScope) {
      return undefined;
    }

    let frameId = 0;
    let lastClientX = 0;
    let lastClientY = 0;

    const flushPointer = () => {
      frameId = 0;
      syncDesktopPointer(lastClientX, lastClientY);
    };

    const handlePointerMove = (event) => {
      lastClientX = event.clientX;
      lastClientY = event.clientY;

      if (!frameId) {
        frameId = window.requestAnimationFrame(flushPointer);
      }
    };

    interactionScope.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      interactionScope.removeEventListener("pointermove", handlePointerMove);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [interactionScopeRef, isLoaded, isMobile, prefersReducedMotion]);

  useEffect(() => {
    const interactionScope = interactionScopeRef?.current ?? stageRef.current;

    if (!isLoaded || !interactionScope) {
      return undefined;
    }

    const handleWindowPointerMove = (event) => {
      updatePointerIntent(event.clientX, event.clientY);
    };

    const handleTouchMove = (event) => {
      const touch = event.touches[0];

      if (touch) {
        updatePointerIntent(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener("pointermove", handleWindowPointerMove, {
      passive: true,
    });
    window.addEventListener("blur", resetPointerIntent);
    interactionScope.addEventListener("pointerleave", resetPointerIntent);
    interactionScope.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });
    interactionScope.addEventListener("touchend", resetPointerIntent);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("blur", resetPointerIntent);
      interactionScope.removeEventListener("pointerleave", resetPointerIntent);
      interactionScope.removeEventListener("touchmove", handleTouchMove);
      interactionScope.removeEventListener("touchend", resetPointerIntent);
      resetPointerIntent();
    };
  }, [interactionScopeRef, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !isInView) {
      return undefined;
    }

    let resumeTimeoutId = 0;

    const handleScroll = () => {
      scrollPausedRef.current = true;
      syncPlayback();

      if (resumeTimeoutId) {
        window.clearTimeout(resumeTimeoutId);
      }

      resumeTimeoutId = window.setTimeout(() => {
        scrollPausedRef.current = false;
        syncPlayback();
      }, 140);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (resumeTimeoutId) {
        window.clearTimeout(resumeTimeoutId);
      }

      scrollPausedRef.current = false;
      syncPlayback();
    };
  }, [isInView, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !isMobile || prefersReducedMotion) {
      return undefined;
    }

    tickMobileMotion();

    const intervalId = window.setInterval(() => {
      tickMobileMotion();
    }, 1800);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isLoaded, isMobile, prefersReducedMotion]);

  useEffect(() => {
    if (!isLoaded || !isInView) {
      return undefined;
    }

    let frameId = 0;

    const animate = () => {
      syncCharacterFocus();
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isInView, isLoaded]);

  return (
    <div
      ref={stageRef}
      className={[
        "spline-stage",
        isLoaded ? "is-loaded" : "",
        isMobile ? "is-mobile" : "",
        isLowPower ? "is-low-power" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      {!isLoaded && !hasError ? (
        <div className="spline-loader">
          <span className="spline-loader-ring" />
          <span className="spline-loader-text">Loading 3D scene</span>
        </div>
      ) : null}

      {hasError ? (
        <div className="spline-loader">
          <span className="spline-loader-text">3D scene unavailable</span>
        </div>
      ) : null}

      <canvas ref={canvasRef} className="spline-canvas" />
    </div>
  );
}
