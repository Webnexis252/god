"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeToScene } from "@/lib/sceneSignal";

const MIN_VISIBLE_MS = 1000;
// Past this the page opens anyway and the scene fades in over its poster.
const MAX_WAIT_MS = 6000;
const EXIT_MS = 1000;

export default function EntranceReveal() {
  const [isDone, setIsDone] = useState(false);
  const overlayRef = useRef(null);
  const fillRef = useRef(null);
  const countRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const overlay = overlayRef.current;
    const fill = fillRef.current;
    const count = countRef.current;
    const status = statusRef.current;

    if (!overlay || !fill || !count || !status) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const waitsForScene = Boolean(document.querySelector(".spline-stage"));
    let scene = { progress: 0, settled: !waitsForScene };
    const unsubscribe = waitsForScene
      ? subscribeToScene((next) => {
          scene = next;
        })
      : () => {};

    const startedAt = performance.now();
    let shown = 0;
    let shownCount = -1;
    let shownStatus = "";
    let frameId = 0;
    let exitTimer = 0;

    // Locks scroll and holds the hero copy back until the panels part.
    root.dataset.entrance = "loading";

    const exit = () => {
      overlay.dataset.phase = "exit";
      root.dataset.entrance = "done";
      exitTimer = window.setTimeout(
        () => setIsDone(true),
        prefersReducedMotion ? 0 : EXIT_MS
      );
    };

    // Written straight to the DOM: re-rendering every frame would compete with
    // the scene for the main thread.
    const tick = (now) => {
      const elapsed = now - startedAt;
      const isReady =
        elapsed >= MIN_VISIBLE_MS && (scene.settled || elapsed >= MAX_WAIT_MS);
      const creep = 1 - Math.exp(-elapsed / 1200);
      const target = isReady
        ? 1
        : waitsForScene
          ? 0.22 * creep + 0.72 * scene.progress
          : 0.94 * creep;

      shown += (target - shown) * (isReady ? 0.2 : 0.08);

      const isComplete = isReady && shown > 0.995;
      const nextCount = isComplete ? 100 : Math.round(shown * 100);
      const nextStatus = isComplete
        ? "Ready"
        : !waitsForScene || scene.settled
          ? "Loading"
          : scene.progress < 0.7
            ? "Loading assets"
            : "Building 3D scene";

      fill.style.transform = `scaleX(${isComplete ? 1 : shown})`;

      if (nextCount !== shownCount) {
        shownCount = nextCount;
        count.textContent = String(nextCount).padStart(2, "0");
      }

      if (nextStatus !== shownStatus) {
        shownStatus = nextStatus;
        status.textContent = nextStatus;
      }

      if (isComplete) {
        exit();
        return;
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(exitTimer);
      unsubscribe();
      delete root.dataset.entrance;
    };
  }, []);

  if (isDone) {
    return null;
  }

  return (
    <div ref={overlayRef} className="entrance" aria-hidden="true">
      <div className="entrance-panel entrance-panel-top">
        <div className="entrance-grid" />
        <div className="entrance-glow" />
        <img
          src="/logo-wide.webp"
          alt=""
          className="entrance-logo"
          draggable={false}
        />
      </div>

      <div className="entrance-panel entrance-panel-bottom">
        <div className="entrance-grid" />
        <div className="entrance-glow" />
        <div className="entrance-meter">
          <span ref={statusRef} className="entrance-status">
            Loading
          </span>
          <span className="entrance-count">
            <span ref={countRef}>00</span>%
          </span>
        </div>
      </div>

      <div className="entrance-seam">
        <span ref={fillRef} className="entrance-seam-fill" />
        <span className="entrance-seam-glint" />
      </div>
    </div>
  );
}
