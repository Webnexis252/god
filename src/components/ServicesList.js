"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import MotionReveal from "@/components/MotionReveal";

/* ─────────────────────────────────────────────────
   Magnetic Service Row
   • Tracks cursor position relative to row center
   • Applies a subtle translate + tilt in the
     direction of the mouse for a "pull" effect
   • Arrow icon rotates toward the cursor
   • Resets smoothly on mouse leave
   ───────────────────────────────────────────────── */

function MagneticServiceRow({ service }) {
  const rowRef = useRef(null);
  const arrowRef = useRef(null);
  const rafRef = useRef(null);

  const PULL_X = 8;   // max horizontal pull (px)
  const PULL_Y = 4;   // max vertical pull (px)
  const ARROW_RANGE = 28; // max arrow rotation (deg)

  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const row = rowRef.current;
      const arrow = arrowRef.current;
      if (!row) return;

      const rect = row.getBoundingClientRect();
      // Normalised position: -1 to 1 from center
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      const tx = nx * PULL_X;
      const ty = ny * PULL_Y;

      row.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;

      if (arrow) {
        // Arrow rotates slightly upward/downward based on cursor Y
        const arrowRot = ny * ARROW_RANGE;
        arrow.style.transform = `translateX(0.35rem) rotate(${arrowRot}deg)`;
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const row = rowRef.current;
    const arrow = arrowRef.current;

    if (row) row.style.transform = "";
    if (arrow) arrow.style.transform = "";
  }, []);

  return (
    <Link
      href={`/services/${service.slug}`}
      className="service-row magnetic-row"
      ref={rowRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <p className="service-number">{service.number}</p>
      <div className="service-body">
        <h3 className="service-title">{service.name}</h3>
        <p className="service-description">{service.description}</p>
      </div>
      <span className="service-row-arrow" aria-hidden="true" ref={arrowRef}>
        →
      </span>
    </Link>
  );
}

export default function ServicesList({ services }) {
  return (
    <div className="services-list">
      {services.map((service, index) => (
        <MotionReveal
          key={service.number}
          delay={0.04 * index}
          distance={54}
        >
          <MagneticServiceRow service={service} />
        </MotionReveal>
      ))}
    </div>
  );
}
