"use client";

import { Fragment, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import useHydrated from "@/components/useHydrated";
import useCaseGeometry from "@/components/useCaseGeometry";

/* ─────────────────────────────────────────────────
   CaseInk — Text Inked By Reading
   • The challenge and the solution are set as large
     reading text. Their words wait in a dim ink and
     come up to full ink one after another as the
     reader scrolls through them; scrolling back takes
     the ink off again
   • The paragraph itself stays one plain run of text,
     which is what a screen reader gets. The words
     that take the ink are a copy laid exactly over
     it, hidden from assistive tech
   • Each word gets --ink (0 to 1) and the stylesheet
     turns that into opacity
   • The values are motion values worked out from
     measurements cached on resize, so a scroll frame
     reads no layout and renders no React
   • Before hydration and under reduced motion there
     is no copy at all, just the paragraph at full ink
   ───────────────────────────────────────────────── */

const SPREAD = 4;       // how many words are part-inked at any moment
const FROM = 0.84;      // how far down the viewport the text's top is when the ink starts
const TO = 0.46;        // and its foot when the last word is done
const MIN_SPAN = 0.25;  // the least scroll the inking is spread over, in viewport heights

const IDLE = { live: false, from: 0, to: 1 };

const clamp = (value) => Math.min(Math.max(value, 0), 1);

const measureInk = (text) => {
  const viewport = window.innerHeight;
  const top = text.getBoundingClientRect().top + window.scrollY;
  const from = top - viewport * FROM;
  const to = Math.max(top + text.offsetHeight - viewport * TO, from + viewport * MIN_SPAN);

  return { live: true, from, to };
};

// How much ink one word has taken.
const inkAt = (geometry, index, count, scrollY) => {
  if (!geometry.live) return 1;

  const progress = clamp((scrollY - geometry.from) / (geometry.to - geometry.from));

  return clamp((progress * (count - 1 + SPREAD) - index) / SPREAD);
};

function Word({ word, index, count, scrollY, geometry }) {
  const ink = useTransform([scrollY, geometry], ([y, current]) => inkAt(current, index, count, y));

  return (
    <motion.span className="case-ink-word" style={{ "--ink": ink }}>
      {word}
    </motion.span>
  );
}

export default function CaseInk({ text }) {
  const textRef = useRef(null);
  const { scrollY } = useScroll();
  const isHydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion();
  const live = isHydrated && !prefersReducedMotion;
  const geometry = useCaseGeometry(textRef, measureInk, IDLE, live);

  const words = text.split(" ");

  return (
    <p className={`case-ink${live ? " is-live" : ""}`} ref={textRef}>
      <span className="case-ink-text">{text}</span>

      {live ? (
        <span className="case-ink-words" aria-hidden="true">
          {words.map((word, index) => (
            <Fragment key={index}>
              {index > 0 ? " " : null}
              <Word
                word={word}
                index={index}
                count={words.length}
                scrollY={scrollY}
                geometry={geometry}
              />
            </Fragment>
          ))}
        </span>
      ) : null}
    </p>
  );
}
