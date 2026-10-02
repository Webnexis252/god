"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import useHydrated from "@/components/useHydrated";
import useCaseEntrance from "@/components/useCaseEntrance";
import useCaseGeometry from "@/components/useCaseGeometry";

/* ─────────────────────────────────────────────────
   CaseHero — The Opened Plate
   • The plate the visitor clicked, opened: the same
     colour field at the size of the screen, the name
     set larger still, and under it the screenshot
     shown whole instead of cropped at a corner
   • The arrival plays once the preloader has cleared
     (or straight away when arriving from a plate):
     the name rises from behind a mask, the summary
     and the list follow, then the screenshot's top
     edge comes up at the fold
   • The screenshot starts a little small and grows to
     full size as it is scrolled into the middle of
     the screen, so it reads as opening. Scrolling
     back closes it again
   • The scale is a motion value worked out from a
     measurement cached on resize, so a scroll frame
     reads no layout and renders no React
   • Before hydration and under reduced motion nothing
     is held back and the screenshot is full size
   ───────────────────────────────────────────────── */

const CLOSED = 0.9;    // scale the screenshot starts at
const MIN_SPAN = 0.3;  // the least scroll the opening is spread over, in viewport heights

const IDLE = { live: false, from: 0, to: 1 };

const clamp = (value) => Math.min(Math.max(value, 0), 1);

// The opening runs from the screenshot's top edge reaching the fold (or the top
// of the page, if it starts above the fold) to its middle reaching mid-screen.
const measureHero = (field) => {
  const shot = field.querySelector(".case-hero-shot");
  const viewport = window.innerHeight;
  // offsetTop, because the arrival moves the screenshot and that must not count
  const top = field.getBoundingClientRect().top + window.scrollY + shot.offsetTop;
  const from = Math.max(top - viewport, 0);
  const to = Math.max(top + shot.offsetHeight / 2 - viewport / 2, from + viewport * MIN_SPAN);

  return { live: true, from, to };
};

// 0 while closed, 1 once fully open. Eased, so it slows as it settles.
const openAt = (geometry, scrollY) => {
  if (!geometry.live) return 1;

  const closed = 1 - clamp((scrollY - geometry.from) / (geometry.to - geometry.from));

  return 1 - closed * closed;
};

export default function CaseHero({ name, category, summary, deliverables, image, imageSize, tone }) {
  const fieldRef = useRef(null);
  const { scrollY } = useScroll();

  const isHydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion();
  const isEntranceOver = useCaseEntrance();

  // Without scripts, or with reduced motion, nothing is held back
  const isArmed = isHydrated && !prefersReducedMotion;
  const isLive = isArmed && isEntranceOver;

  // After the preloader the arrival waits a beat longer, until its panels have parted
  const [wasHeld, setWasHeld] = useState(false);
  if (isArmed && !isEntranceOver && !wasHeld) setWasHeld(true);

  const geometry = useCaseGeometry(fieldRef, measureHero, IDLE, isArmed);
  const scale = useTransform(
    [scrollY, geometry],
    ([y, current]) => CLOSED + (1 - CLOSED) * openAt(current, y)
  );

  const [width, height] = imageSize ?? [1280, 680];

  return (
    <header
      className={`case-field case-hero${isArmed ? " is-armed" : ""}${isLive ? " is-live" : ""}${
        wasHeld ? " is-late" : ""
      }`}
      style={{ "--tone": tone }}
      ref={fieldRef}
    >
      <p className="case-hero-label">{category}</p>

      <h1 className="case-hero-name">
        <span className="case-hero-mask">
          <span className="case-hero-rise">{name}</span>
        </span>
      </h1>

      <div className="case-hero-copy">
        <p className="case-hero-summary">{summary}</p>
        <ul className="case-hero-list" aria-label={`${name} deliverables`}>
          {deliverables.map((item, index) => (
            <li key={item} style={{ "--i": index + 1 }}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {image ? (
        <div className="case-hero-shot">
          {/* The arrival moves this one; the scroll scales the frame inside it */}
          <div className="case-hero-stage">
            <motion.div className="case-frame case-hero-frame" style={{ scale }}>
              <Image
                src={image}
                alt={`Homepage of the ${name} website`}
                width={width}
                height={height}
                // The same file the plate on the homepage shows, so it is already cached on arrival
                unoptimized
                loading="eager"
                fetchPriority="high"
              />
            </motion.div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
