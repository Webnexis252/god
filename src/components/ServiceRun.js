"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import useHydrated from "@/components/useHydrated";
import useScrollGeometry from "@/components/useScrollGeometry";

/* ─────────────────────────────────────────────────
   ServiceRun — A Focus List
   • The steps of a service, set as large names with
     their detail underneath. On desktop the heading
     beside them stays pinned and the steps scroll
     past a reading line: the step on the line is at
     full ink, the others wait dimmer (never below
     AA contrast for the detail)
   • Each step gets --on (0 to 1) and the stylesheet
     turns that into opacity. The first step holds
     the ink until the line reaches it, and the last
     keeps it once the line has gone by
   • The values are motion values worked out from
     measurements cached on resize, so a scroll frame
     reads no layout and renders no React
   • Phones, tablets, reduced motion and the page
     before hydration set no value, and the
     stylesheet's fallback shows every step at full
     ink
   ───────────────────────────────────────────────── */

// Must match the media query that sets the heading beside the list in the stylesheet
const FOCUS_QUERY = "(min-width: 1101px)";
const READ = 0.44; // how far down the viewport the reading line sits
const NEAR = 0.35; // within this share of a step's spacing, a step is at full ink
const FAR = 0.95;  // beyond this share, it is at rest

const IDLE = { live: false, viewport: 0, gap: 1, centres: [] };

const clamp = (value) => Math.min(Math.max(value, 0), 1);

// Where the middle of each step sits in the page, and how far apart they are.
const measureRun = (list) => {
  const centres = Array.from(list.children).map((step) => {
    const box = step.getBoundingClientRect();

    return box.top + window.scrollY + box.height / 2;
  });
  const last = centres.length - 1;

  return {
    live: window.matchMedia(FOCUS_QUERY).matches && last > 0,
    viewport: window.innerHeight,
    gap: last > 0 ? (centres[last] - centres[0]) / last : 1,
    centres,
  };
};

// How much ink one step has.
const focusAt = (geometry, index, scrollY) => {
  if (!geometry.live) return 1;

  const { centres, gap, viewport } = geometry;
  const last = centres.length - 1;
  const line = scrollY + viewport * READ;

  if (index === 0 && line <= centres[0]) return 1;
  if (index === last && line >= centres[last]) return 1;

  const distance = Math.abs(centres[index] - line) / gap;

  return clamp((FAR - distance) / (FAR - NEAR));
};

function Step({ step, index, scrollY, geometry, live }) {
  const on = useTransform([scrollY, geometry], ([y, current]) => focusAt(current, index, y));

  return (
    <motion.li className="service-run-step" style={live ? { "--on": on } : undefined}>
      {/* The list is ordered already; the numeral is only its mark on the page */}
      <p className="service-run-index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="service-run-name">{step.step}</h3>
      <p className="service-run-detail">{step.detail}</p>
    </motion.li>
  );
}

export default function ServiceRun({ steps }) {
  const listRef = useRef(null);
  const { scrollY } = useScroll();
  const isHydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion();
  const live = isHydrated && !prefersReducedMotion;
  const geometry = useScrollGeometry(listRef, measureRun, IDLE, live);

  return (
    <ol className="service-run-list" ref={listRef}>
      {steps.map((step, index) => (
        <Step
          key={step.step}
          step={step}
          index={index}
          scrollY={scrollY}
          geometry={geometry}
          live={live}
        />
      ))}
    </ol>
  );
}
