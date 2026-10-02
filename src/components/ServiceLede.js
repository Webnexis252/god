"use client";

import { Fragment, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import useHydrated from "@/components/useHydrated";
import useScrollGeometry from "@/components/useScrollGeometry";

/* ─────────────────────────────────────────────────
   ServiceLede — A Statement Inked By Reading
   • The opening line of the overview, set large. Its
     words wait in a dim ink and come up to full ink
     one after another as the line is scrolled
     through; scrolling back takes the ink off again
   • Each word gets --ink (0 to 1) and the stylesheet
     turns that into opacity
   • The values are motion values worked out from
     measurements cached on resize, so a scroll frame
     reads no layout and renders no React
   • Before hydration and under reduced motion no
     value is set, and the stylesheet's fallback shows
     the whole line at full ink
   ───────────────────────────────────────────────── */

const SPREAD = 3;       // how many words are part-inked at any moment
const FROM = 0.86;      // how far down the viewport the line's top is when the ink starts
const TO = 0.5;         // and its foot when the last word is done
const MIN_SPAN = 0.25;  // the least scroll the inking is spread over, in viewport heights

const IDLE = { live: false, from: 0, to: 1 };

const clamp = (value) => Math.min(Math.max(value, 0), 1);

const measureLede = (line) => {
  const viewport = window.innerHeight;
  const top = line.getBoundingClientRect().top + window.scrollY;
  const from = top - viewport * FROM;
  const to = Math.max(top + line.offsetHeight - viewport * TO, from + viewport * MIN_SPAN);

  return { live: true, from, to };
};

// How much ink one word has taken.
const inkAt = (geometry, index, count, scrollY) => {
  if (!geometry.live) return 1;

  const progress = clamp((scrollY - geometry.from) / (geometry.to - geometry.from));

  return clamp((progress * (count - 1 + SPREAD) - index) / SPREAD);
};

function Word({ word, index, count, scrollY, geometry, live }) {
  const ink = useTransform([scrollY, geometry], ([y, current]) => inkAt(current, index, count, y));

  return (
    <motion.span className="service-lede-word" style={live ? { "--ink": ink } : undefined}>
      {word}
    </motion.span>
  );
}

export default function ServiceLede({ text }) {
  const lineRef = useRef(null);
  const { scrollY } = useScroll();
  const isHydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion();
  const live = isHydrated && !prefersReducedMotion;
  const geometry = useScrollGeometry(lineRef, measureLede, IDLE, live);

  const words = text.split(" ");

  return (
    <h2 className="service-lede" ref={lineRef}>
      {words.map((word, index) => (
        <Fragment key={index}>
          {index > 0 ? " " : null}
          <Word
            word={word}
            index={index}
            count={words.length}
            scrollY={scrollY}
            geometry={geometry}
            live={live}
          />
        </Fragment>
      ))}
    </h2>
  );
}
