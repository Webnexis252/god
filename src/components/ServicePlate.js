"use client";

import { Fragment, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import ServiceVisual from "@/components/ServiceVisual";
import useEntranceOver from "@/components/useEntranceOver";
import useHydrated from "@/components/useHydrated";
import useScrollGeometry from "@/components/useScrollGeometry";

/* ─────────────────────────────────────────────────
   ServicePlate — The Opened Plate
   • The top of a service page: one colour field the
     size of the screen in the service's own tone,
     its name set as large as the plate allows, and
     its line drawing running off the corner
   • The arrival waits for the preloader to clear,
     then plays once: the name's lines rise from
     behind a mask, the pitch and the button follow,
     and the drawing is remounted so it sketches in
     front of the reader
   • On desktop the plate stays pinned while the page
     is drawn up over it, and sinks back as it is
     covered: it shrinks a little and dims
   • The sink is a pair of motion values worked out
     from a measurement cached on resize, so a scroll
     frame reads no layout and renders no React
   • Before hydration and under reduced motion nothing
     is held back and nothing moves
   ───────────────────────────────────────────────── */

// Must match the media query that pins the plate in the stylesheet
const PIN_QUERY = "(min-width: 1101px) and (min-height: 640px)";
const SINK = 0.05; // scale the plate loses by the time it is covered
const DIM = 0.55;  // shade it gains by then

const IDLE = { live: false, span: 1 };

const clamp = (value) => Math.min(Math.max(value, 0), 1);

// The plate is covered over one section's height of scroll.
const measurePlate = (section) => ({
  live: window.matchMedia(PIN_QUERY).matches,
  span: section.offsetHeight,
});

// 0 with the page at the top, 1 once the plate is fully covered.
const coveredAt = (geometry, scrollY) =>
  geometry.live ? clamp(scrollY / geometry.span) : 0;

export default function ServicePlate({ slug, number, lines, fit, tone, tagline, cta }) {
  const sectionRef = useRef(null);
  const { scrollY } = useScroll();

  const isHydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion();
  const isEntranceOver = useEntranceOver();

  // Without scripts, or with reduced motion, nothing is held back
  const isArmed = isHydrated && !prefersReducedMotion;
  const isLive = !isArmed || isEntranceOver;

  const geometry = useScrollGeometry(sectionRef, measurePlate, IDLE, isArmed);
  const scale = useTransform(
    [scrollY, geometry],
    ([y, current]) => 1 - coveredAt(current, y) * SINK
  );
  const shade = useTransform(
    [scrollY, geometry],
    ([y, current]) => coveredAt(current, y) * DIM
  );

  // A link focused while the plate is covered would be invisible, so uncover it
  const handleFocus = () => {
    if (geometry.get().live && window.scrollY > 0) {
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <section
      className={`service-plate-section${isArmed ? " is-armed" : ""}${
        isArmed && isLive ? " is-live" : ""
      }`}
      ref={sectionRef}
    >
      <motion.div
        className="service-plate"
        data-lines={lines.length}
        style={{ "--tone": tone, "--fit": fit, scale }}
        onFocus={handleFocus}
      >
        <p className="service-plate-number">{number}</p>

        <h1 className="service-plate-name">
          {lines.map((line, index) => (
            <Fragment key={line}>
              {index > 0 ? " " : null}
              <span className="service-plate-line" style={{ "--line": index }}>
                <span className="service-plate-rise">{line}</span>
              </span>
            </Fragment>
          ))}
        </h1>

        <div className="service-plate-foot">
          <p className="service-plate-tagline">{tagline}</p>
          <Link className="service-cta" href="/#contact">
            {cta}
            <span className="service-arrow" aria-hidden="true">
              <span>→</span>
              <span>→</span>
            </span>
          </Link>
        </div>

        {/* Decorative: the drawing says nothing the name has not */}
        <div className="service-plate-stage" aria-hidden="true">
          {/* Keyed so the drawing is sketched again once the preloader has cleared */}
          <div className="service-plate-visual" key={isLive ? "live" : "waiting"}>
            <ServiceVisual slug={slug} />
          </div>
        </div>

        <motion.div
          className="service-plate-shade"
          style={{ opacity: shade }}
          aria-hidden="true"
        />
      </motion.div>
    </section>
  );
}
