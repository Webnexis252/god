"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import useHydrated from "@/components/useHydrated";

/* ─────────────────────────────────────────────────
   ProcessLine — One Line, Four Stations
   • The steps are stations on a single rule. On
     desktop the rule is a staircase that runs across
     the page and steps down to each name; on phones
     and tablets it runs down the side instead
   • The rule waits as a hairline. Scrolling draws a
     gold line along it, and scrolling back undoes it
   • A station is quiet until the gold arrives at its
     tick, then comes up to full strength
   • The rule is cut into segments, two per station.
     Each one gets --draw (0 to 1) and each station
     gets --on (0 or 1); the stylesheet turns those
     into transforms and opacity
   • Both are motion values worked out from
     measurements cached on resize, so a scroll frame
     reads no layout and renders no React
   • Before hydration and under reduced motion no
     values are set, and the stylesheet's fallbacks
     show the finished state: line drawn, all four on
   ───────────────────────────────────────────────── */

const MIN_SPAN = 0.2; // the least scroll the drawing is spread over, in viewport heights

const IDLE = { live: false, from: 0, to: 0, length: 0, segments: [] };

const clamp = (value) => Math.min(Math.max(value, 0), 1);

// How far the gold has travelled along the rule, in px.
const travelAt = (geometry, scrollY) =>
  clamp((scrollY - geometry.from) / (geometry.to - geometry.from)) * geometry.length;

// How much of one segment is drawn.
const drawAt = (geometry, slot, scrollY) => {
  const segment = geometry.live ? geometry.segments[slot] : null;
  if (!segment || !segment.length) return 1;

  return clamp((travelAt(geometry, scrollY) - segment.start) / segment.length);
};

// A station is reached once the segment that leads to it is drawn to the end.
const reachedAt = (geometry, slot, scrollY) => {
  const segment = geometry.live ? geometry.segments[slot] : null;
  if (!segment) return 1;

  return travelAt(geometry, scrollY) >= segment.start + segment.length - 0.5 ? 1 : 0;
};

function Segment({ kind, slot, scrollY, geometry, live }) {
  const draw = useTransform([scrollY, geometry], ([y, current]) => drawAt(current, slot, y));

  return (
    <motion.span
      className={`process-seg process-${kind}`}
      style={live ? { "--draw": draw } : undefined}
      aria-hidden="true"
    />
  );
}

function Station({ step, index, scrollY, geometry, live }) {
  // Segments are numbered along the rule: the link into a station, then its own span
  const on = useTransform([scrollY, geometry], ([y, current]) => reachedAt(current, index * 2, y));

  return (
    <motion.li
      className="process-station"
      style={live ? { "--i": index, "--on": on } : { "--i": index }}
    >
      <Segment kind="link" slot={index * 2} scrollY={scrollY} geometry={geometry} live={live} />
      <Segment kind="span" slot={index * 2 + 1} scrollY={scrollY} geometry={geometry} live={live} />

      <h3 className="process-name">{step.step}</h3>
      {/* The list is ordered already; the numeral is only the mark on the rule */}
      <p className="process-index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </p>
      <p className="process-detail">{step.detail}</p>
    </motion.li>
  );
}

export default function ProcessLine({ steps }) {
  const runRef = useRef(null);
  const { scrollY } = useScroll();
  const geometry = useMotionValue(IDLE);
  const isHydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion();
  const live = isHydrated && !prefersReducedMotion;

  useEffect(() => {
    const run = runRef.current;
    if (!run || !live) return undefined;

    const lines = Array.from(run.querySelectorAll(".process-seg"));

    // Where in the page the drawing starts and ends, and how long each segment is.
    // The stylesheet says how far down the viewport the run is when the line
    // starts (--draw-from) and when it finishes (--draw-to).
    const measure = () => {
      const styles = getComputedStyle(run);
      const viewport = window.innerHeight;
      const top = run.getBoundingClientRect().top + window.scrollY;
      const from = top - viewport * (parseFloat(styles.getPropertyValue("--draw-from")) || 0.6);
      const to = Math.max(
        top + run.offsetHeight - viewport * (parseFloat(styles.getPropertyValue("--draw-to")) || 0.6),
        from + viewport * MIN_SPAN
      );

      let length = 0;

      // A segment is a pixel or two thick, so its longer side is its length
      const segments = lines.map((line) => {
        const segment = { start: length, length: Math.max(line.offsetWidth, line.offsetHeight) };

        length += segment.length;

        return segment;
      });

      geometry.set({ live: true, from, to, length, segments });
    };

    // Anything that changes height above the run moves it down the page
    const resize = new ResizeObserver(measure);
    // A last look as the run comes into view, in case something moved it unseen
    const arrival = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) measure();
      },
      { rootMargin: "50% 0px" }
    );

    measure();
    resize.observe(document.body);
    resize.observe(run);
    arrival.observe(run);
    window.addEventListener("resize", measure);

    return () => {
      resize.disconnect();
      arrival.disconnect();
      window.removeEventListener("resize", measure);
      geometry.set(IDLE);
    };
  }, [geometry, live]);

  return (
    <ol className="process-run" ref={runRef}>
      {steps.map((step, index) => (
        <Station
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
