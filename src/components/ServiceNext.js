"use client";

import { Fragment, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import ServiceVisual from "@/components/ServiceVisual";
import useHydrated from "@/components/useHydrated";
import useScrollGeometry from "@/components/useScrollGeometry";

/* ─────────────────────────────────────────────────
   ServiceNext — The Plate At The Bottom
   • The page ends on the next service's plate, still
     closed: its tone, its name on one line across the
     plate, its drawing cropped by the corner. The
     whole plate is one link
   • As it scrolls into view the plate rises the last
     stretch and settles, so the page ends on the next
     plate arriving. The rise is a motion value worked
     out from a measurement cached on resize, so a
     scroll frame reads no layout and renders no React
   • The drawing is remounted when the plate arrives,
     so it is sketched in front of the reader and not
     out of sight when the page loads
   • Before hydration and under reduced motion the
     plate is simply in place, drawing and all
   ───────────────────────────────────────────────── */

const RISE = 88;     // how far below its place the plate starts (px)
const SHRINK = 0.04; // scale it is short of while it rises
const SETTLE = 0.5;  // how far down the viewport its top edge is when it settles

const IDLE = { live: false, from: 0, to: 1 };

const clamp = (value) => Math.min(Math.max(value, 0), 1);

// The rise runs from the plate's top edge reaching the fold to it reaching SETTLE.
const measureNext = (wrap) => {
  const viewport = window.innerHeight;
  const top = wrap.getBoundingClientRect().top + window.scrollY;

  return { live: true, from: top - viewport, to: top - viewport * SETTLE };
};

// 1 while the plate is still at the fold, 0 once it has settled. Eased, so it
// arrives quickly and slows into place.
const awayAt = (geometry, scrollY) => {
  if (!geometry.live) return 0;

  const away = 1 - clamp((scrollY - geometry.from) / (geometry.to - geometry.from));

  return away * away;
};

export default function ServiceNext({ slug, lines, fitStacked, fitSingle, tone }) {
  const wrapRef = useRef(null);
  const { scrollY } = useScroll();

  const isHydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion();
  const isArmed = isHydrated && !prefersReducedMotion;
  const hasArrived = useInView(wrapRef, { once: true, margin: "0px 0px -30% 0px" });
  const isDrawn = !isArmed || hasArrived;

  const geometry = useScrollGeometry(wrapRef, measureNext, IDLE, isArmed);
  const y = useTransform([scrollY, geometry], ([sy, current]) => awayAt(current, sy) * RISE);
  const scale = useTransform(
    [scrollY, geometry],
    ([sy, current]) => 1 - awayAt(current, sy) * SHRINK
  );

  return (
    // Measured here: this wrapper never moves, the plate inside it does
    <div className={`service-next-wrap${isDrawn ? "" : " is-waiting"}`} ref={wrapRef}>
      <motion.div className="service-next-mover" style={{ y, scale }}>
        <Link
          className="service-next-plate"
          href={`/services/${slug}`}
          style={{ "--tone": tone, "--fit": fitStacked, "--fit-single": fitSingle }}
        >
          <div className="service-next-head">
            <p className="service-next-label">Next service</p>
            <span className="service-arrow" aria-hidden="true">
              <span>→</span>
              <span>→</span>
            </span>
          </div>

          <p className="service-next-name">
            {lines.map((line, index) => (
              <Fragment key={line}>
                {index > 0 ? " " : null}
                <span className="service-next-line">{line}</span>
              </Fragment>
            ))}
          </p>

          <div className="service-next-stage" aria-hidden="true">
            {/* Keyed so the drawing is sketched again when the plate arrives */}
            <div className="service-next-visual" key={isDrawn ? "drawn" : "waiting"}>
              <ServiceVisual slug={slug} />
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
