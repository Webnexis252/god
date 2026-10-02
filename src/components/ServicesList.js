"use client";

import { useRef, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useInView, useReducedMotion } from "framer-motion";
import ServiceVisual from "@/components/ServiceVisual";
import useHydrated from "@/components/useHydrated";

const PULL_X = 8;        // max horizontal pull (px)
const PULL_Y = 4;        // max vertical pull (px)
const ARROW_RANGE = 28;  // max arrow rotation (deg)
const DRAIN_MS = 420;    // a little longer than the ink takes to leave a name
const ARRIVAL_MS = 620;  // the names rise first, then the first one is inked

// The preloader covers the page while <html data-entrance="loading">.
const subscribeToEntrance = (notify) => {
  const observer = new MutationObserver(notify);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-entrance"],
  });

  return () => observer.disconnect();
};

const readEntranceOver = () =>
  document.documentElement.dataset.entrance !== "loading";

const readEntranceOverOnServer = () => true;

/* ─────────────────────────────────────────────────
   Magnetic Service Row
   • Tracks cursor position relative to row center
   • Applies a subtle translate in the direction of
     the mouse for a "pull" effect
   • Arrow button rotates toward the cursor
   • Resets smoothly on mouse leave
   • Hovering or focusing a row makes it the one
     the specimen describes
   • On desktop the name waits in outline and is
     inked solid while its row is active; a row that
     has just lost the ink is "leaving" until it has
     drained out the far side
   ───────────────────────────────────────────────── */

function MagneticServiceRow({ service, index, isActive, isMagnetic, onActivate }) {
  const rowRef = useRef(null);
  const arrowRef = useRef(null);
  const rafRef = useRef(0);

  // Derived from the prop as it changes, so the drain starts in the same paint
  const [wasActive, setWasActive] = useState(isActive);
  const [isLeaving, setIsLeaving] = useState(false);

  if (wasActive !== isActive) {
    setWasActive(isActive);
    setIsLeaving(wasActive);
  }

  // Back to rest once the ink is gone, so the next wipe starts from the left again
  useEffect(() => {
    if (!isLeaving) return undefined;

    const timer = window.setTimeout(() => setIsLeaving(false), DRAIN_MS);

    return () => window.clearTimeout(timer);
  }, [isLeaving]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const handlePointerEnter = (e) => {
    if (e.pointerType !== "touch") onActivate(index);
  };

  const handlePointerMove = useCallback(
    (e) => {
      if (!isMagnetic || e.pointerType === "touch") return;

      const { clientX, clientY } = e;

      cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const row = rowRef.current;
        const arrow = arrowRef.current;
        if (!row) return;

        const rect = row.getBoundingClientRect();
        // Normalised position: -1 to 1 from center
        const nx = ((clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((clientY - rect.top) / rect.height - 0.5) * 2;

        row.style.transform = `translate3d(${nx * PULL_X}px, ${ny * PULL_Y}px, 0)`;

        if (arrow) {
          // Arrow tips slightly upward/downward based on cursor Y
          arrow.style.transform = `rotate(${ny * ARROW_RANGE}deg)`;
        }
      });
    },
    [isMagnetic]
  );

  const handlePointerLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);

    if (rowRef.current) rowRef.current.style.transform = "";
    if (arrowRef.current) arrowRef.current.style.transform = "";
  }, []);

  return (
    <li className="service-item" style={{ "--row": index }}>
      <Link
        href={`/services/${service.slug}`}
        className={`service-row magnetic-row${isActive ? " is-active" : ""}${
          isLeaving ? " is-leaving" : ""
        }`}
        ref={rowRef}
        onPointerEnter={handlePointerEnter}
        onFocus={() => onActivate(index)}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <p className="service-number">{service.number}</p>
        <div className="service-body">
          <h3 className="service-title">
            <span className="service-title-rise">
              <span className="service-title-text">{service.name}</span>
              {/* The same word in solid ink, wiped across the outline */}
              <span className="service-title-ink" aria-hidden="true">
                {service.name}
              </span>
            </span>
          </h3>
          <p className="service-tagline">{service.tagline}</p>
        </div>
        <span className="service-leader" aria-hidden="true" />
        <span className="service-row-arrow" aria-hidden="true" ref={arrowRef}>
          <span>→</span>
          <span>→</span>
        </span>
      </Link>
    </li>
  );
}

/* ─────────────────────────────────────────────────
   Service Specimen
   • Desktop-only: the active service set out beside
     the index (drawing, pitch, deliverables, numbers)
   • Decorative: everything in it is on the service
     page the row links to, so it is hidden from
     assistive tech
   ───────────────────────────────────────────────── */

function ServiceSpecimen({ service, isLive }) {
  return (
    <div className="service-specimen" aria-hidden="true">
      {/* Keyed so each service replays the entrance and redraws its visual,
          and so the first one plays when the section arrives, not on page load */}
      <div
        className="service-specimen-inner"
        key={`${service.slug}:${isLive ? "live" : "waiting"}`}
      >
        <ServiceVisual slug={service.slug} />

        <p className="service-specimen-tagline">{service.tagline}</p>

        <ul className="service-specimen-list">
          {service.whatWeDeliver.map((item) => (
            <li key={item.title}>{item.title}</li>
          ))}
        </ul>

        <div className="service-specimen-metrics">
          {service.metrics.map((metric) => (
            <p key={metric.label} className="service-specimen-metric">
              <span className="service-specimen-value">{metric.value}</span>
              <span className="service-specimen-label">{metric.label}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Services List
   • An index of the eight services, set straight on
     the page
   • Nothing here is wrapped in MotionReveal: that
     swaps its wrapper after hydration and would
     leave the in-view hook watching a dead node
   • The arrival waits for the section to scroll in
     (and for the preloader to clear), then plays
     once: names rise, the first is inked, its
     drawing sketches in
   ───────────────────────────────────────────────── */

export default function ServicesList({ services }) {
  const indexRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasArrived, setHasArrived] = useState(false);

  const isHydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion();
  // Counted from the top edge, not a share of the height: on a phone the index
  // is far taller than the screen
  const isInView = useInView(indexRef, { once: true, margin: "0px 0px -18% 0px" });
  const isEntranceOver = useSyncExternalStore(
    subscribeToEntrance,
    readEntranceOver,
    readEntranceOverOnServer
  );

  // Without scripts, or with reduced motion, nothing is held back
  const isArmed = isHydrated && !prefersReducedMotion;
  const hasEntered = isInView && isEntranceOver;
  const isLive = !isArmed || hasArrived;

  useEffect(() => {
    if (!hasEntered) return undefined;

    const timer = window.setTimeout(() => setHasArrived(true), ARRIVAL_MS);

    return () => window.clearTimeout(timer);
  }, [hasEntered]);

  return (
    <div
      className={`services-index${isArmed ? " is-armed" : ""}${
        hasEntered ? " is-in-view" : ""
      }${isLive ? "" : " is-waiting"}`}
      ref={indexRef}
      // Tells the marker on the specimen's rule which row to sit beside
      style={{ "--active": activeIndex }}
    >
      <ul className="services-list">
        {services.map((service, index) => (
          <MagneticServiceRow
            key={service.slug}
            service={service}
            index={index}
            isActive={isLive && index === activeIndex}
            isMagnetic={!prefersReducedMotion}
            onActivate={setActiveIndex}
          />
        ))}
      </ul>

      <ServiceSpecimen service={services[activeIndex]} isLive={isLive} />
    </div>
  );
}
