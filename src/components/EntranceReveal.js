"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeToScene } from "@/lib/sceneSignal";

/* ─────────────────────────────────────────────────
   EntranceReveal — Circular Text Preloader
   • Four rings of type set on concentric circles,
     after Codrops' Circular Text Effect (MIT):
     github.com/codrops/CircularTextEffect
   • The rings scale in around a gold disc. The
     original's disc is an Enter button; here it
     shows the load count and the page opens by
     itself when the hero scene has settled
   • On the way out the rings grow past the screen
     and fade, outermost furthest, as in demo 1
   • The original animates with GSAP. Here every
     movement is a CSS animation or transition (see
     globals.css), so it stays smooth while the 3D
     scene has the main thread
   • Each ring is its own small svg, cropped to that
     ring, so the browser moves four modest layers
     instead of four the size of the whole artboard
   ───────────────────────────────────────────────── */

// Long enough for the rings to finish arriving before they leave.
const MIN_VISIBLE_MS = 1600;
// Past this the page opens anyway and the scene fades in over its poster.
const MAX_WAIT_MS = 6000;
const EXIT_MS = 1500;

const ARTBOARD = 1400; // the original's viewBox, in which the radii and sizes are given
const GAP = "  ";

// Outermost first. `size` is the type size in artboard units, `turn` one full
// drift. The original mixes four typefaces; here one family alternates between
// its heavy condensed cut and its light one.
const RINGS = [
  { radius: 450.5, size: 176, turn: "140s", weight: 800, stretch: "75%", phrases: ["Web Development", "UI / UX Design", "Branding"] },
  { radius: 318.5, size: 148, turn: "110s", weight: 300, stretch: "100%", phrases: ["Mobile Apps", "SEO", "Social"] },
  { radius: 213.5, size: 116, turn: "90s", weight: 800, stretch: "75%", phrases: ["Strategy", "Design", "Build", "Launch"] },
  { radius: 133, size: 90, turn: "70s", weight: 300, stretch: "100%", phrases: ["Webnexis", "Agency"] },
];

// A full circle from nine o'clock, clockwise, so the type reads around the outside.
const circle = (c, r) =>
  `M${c - r},${c}A${r},${r} 0 1 1 ${c + r},${c}A${r},${r} 0 1 1 ${c - r},${c}`;

export default function EntranceReveal() {
  const [isDone, setIsDone] = useState(false);
  const overlayRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const overlay = overlayRef.current;
    const count = countRef.current;

    if (!overlay || !count) {
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
    let frameId = 0;
    let exitTimer = 0;

    // Locks scroll and holds the hero copy back until the rings leave.
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

      if (nextCount !== shownCount) {
        shownCount = nextCount;
        count.textContent = String(nextCount).padStart(2, "0");
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
      <div className="entrance-backdrop" />

      {RINGS.map((ring, index) => {
        // Room for the type, which stands on the outside of its circle
        const half = Math.ceil(ring.radius + ring.size);
        const text = ring.phrases.map((phrase) => phrase + GAP).join("");

        return (
          <div
            key={ring.radius}
            className={`entrance-ring${index % 2 ? " is-counter" : ""}`}
            style={{
              "--i": index,
              "--span": (2 * half) / ARTBOARD,
              "--out": 1.5 + (RINGS.length - index) * 0.3,
              "--turn": ring.turn,
              "--weight": ring.weight,
              "--stretch": ring.stretch,
            }}
          >
            <div className="entrance-ring-out">
              <svg
                className="entrance-ring-spin"
                viewBox={`0 0 ${2 * half} ${2 * half}`}
                focusable="false"
              >
                <defs>
                  <path id={`entrance-circle-${index}`} d={circle(half, ring.radius)} />
                </defs>
                <text className="entrance-ring-text" fontSize={ring.size}>
                  {/* textLength closes the ring: the line is spaced to end where it began */}
                  <textPath
                    href={`#entrance-circle-${index}`}
                    textLength={Math.floor(2 * Math.PI * ring.radius)}
                  >
                    {text}
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        );
      })}

      <div className="entrance-core">
        <div className="entrance-core-disc">
          <span ref={countRef}>00</span>
        </div>
      </div>
    </div>
  );
}
