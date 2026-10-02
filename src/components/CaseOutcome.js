"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import useHydrated from "@/components/useHydrated";

/* ─────────────────────────────────────────────────
   CaseOutcome — What Changed
   • The project's colour comes back once, mid-page,
     for the outcome: three short lines set very large
     and stacked, with a hairline between them
   • As the field comes into view each rule is drawn
     and its line rises from behind a mask, one after
     another, so the three land as a sequence
   • The stylesheet does the moving; this only says
     when the field has arrived
   • Before hydration and under reduced motion the
     lines are simply there
   ───────────────────────────────────────────────── */

export default function CaseOutcome({ results, tone }) {
  const fieldRef = useRef(null);
  const isHydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion();
  const isArmed = isHydrated && !prefersReducedMotion;
  const hasArrived = useInView(fieldRef, { once: true, margin: "0px 0px -22% 0px" });

  return (
    <section
      className={`case-field case-outcome${isArmed ? " is-armed" : ""}${
        isArmed && hasArrived ? " is-in" : ""
      }`}
      style={{ "--tone": tone }}
      ref={fieldRef}
    >
      <h2 className="case-heading">What changed.</h2>

      <ul className="case-outcome-lines">
        {results.map((line, index) => (
          <li className="case-outcome-line" key={line} style={{ "--i": index }}>
            <span className="case-outcome-mask">
              <span className="case-outcome-rise">{line}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
