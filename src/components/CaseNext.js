"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import useHydrated from "@/components/useHydrated";
import useCaseGeometry from "@/components/useCaseGeometry";

/* ─────────────────────────────────────────────────
   CaseNext — The Plate At The Bottom
   • The page ends on the next project: its colour,
     its name set as large as the field allows, and
     the top strip of its screenshot coming up from
     the bottom edge, like the head of the next page
   • The whole field is one link. Hovering or focusing
     it fills the arrow button and lifts the
     screenshot a little further into view
   • As it scrolls into view the field rises the last
     stretch and settles. The rise is a motion value
     worked out from a measurement cached on resize,
     so a scroll frame reads no layout and renders no
     React
   • Before hydration and under reduced motion the
     field is simply in place
   ───────────────────────────────────────────────── */

const RISE = 72;       // how far below its place the field starts (px)
const SETTLE = 0.52;   // how far down the viewport its top edge is when it settles

const IDLE = { live: false, from: 0, to: 1 };

const clamp = (value) => Math.min(Math.max(value, 0), 1);

// The rise runs from the field's top edge reaching the fold to it reaching SETTLE,
// or to the end of the page if that comes first.
const measureNext = (wrap) => {
  const viewport = window.innerHeight;
  const top = wrap.getBoundingClientRect().top + window.scrollY;
  const from = top - viewport;
  const end = document.documentElement.scrollHeight - viewport;
  const to = Math.max(Math.min(top - viewport * SETTLE, end), from + 1);

  return { live: true, from, to };
};

// 1 while the field is still at the fold, 0 once it has settled. Eased, so it
// arrives quickly and slows into place.
const awayAt = (geometry, scrollY) => {
  if (!geometry.live) return 0;

  const away = 1 - clamp((scrollY - geometry.from) / (geometry.to - geometry.from));

  return away * away;
};

export default function CaseNext({ slug, name, image, imageSize, tone }) {
  const wrapRef = useRef(null);
  const { scrollY } = useScroll();

  const isHydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion();
  const live = isHydrated && !prefersReducedMotion;

  const geometry = useCaseGeometry(wrapRef, measureNext, IDLE, live);
  const y = useTransform([scrollY, geometry], ([sy, current]) => awayAt(current, sy) * RISE);

  const [width, height] = imageSize ?? [1280, 680];

  return (
    // Measured here: this wrapper never moves, the field inside it does
    <div className="case-next-wrap" ref={wrapRef}>
      <motion.div className="case-next-mover" style={{ y }}>
        <Link
          className="case-field case-next-plate"
          href={`/work/${slug}`}
          aria-label={`Next project: ${name}`}
          style={{ "--tone": tone }}
        >
          <span className="case-next-label">Next project</span>
          <span className="case-arrow" aria-hidden="true">
            <span>→</span>
            <span>→</span>
          </span>

          <span className="case-next-name">{name}</span>

          {image ? (
            <span className="case-next-peek">
              <span className="case-frame case-next-frame">
                {/* Decorative: the link is already named after the project */}
                <Image src={image} alt="" width={width} height={height} unoptimized loading="lazy" />
              </span>
            </span>
          ) : null}
        </Link>
      </motion.div>
    </div>
  );
}
