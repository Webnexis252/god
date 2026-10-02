"use client";

import { useEffect } from "react";
import { useMotionValue } from "framer-motion";

/* ─────────────────────────────────────────────────
   useCaseGeometry — Where A Piece Sits In The Page
   • The case study's scroll-linked pieces (the
     opening screenshot, the inked text, the next
     plate) each need to know where they are in the
     page. This holds that in a motion value
   • It is measured when the layout changes and never
     while scrolling, so a scroll frame reads no
     layout and renders no React
   • `measure(node)` returns the geometry. `idle` is
     what stands in before hydration, under reduced
     motion and after unmount. Both must be stable,
     so declare them outside the component
   ───────────────────────────────────────────────── */

export default function useCaseGeometry(ref, measure, idle, live) {
  const geometry = useMotionValue(idle);

  useEffect(() => {
    const node = ref.current;
    if (!node || !live) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // A preference switched on mid-visit puts everything back in its finished state
    const update = () => {
      geometry.set(motionQuery.matches ? idle : measure(node));
    };

    // Anything that changes height above the node moves it down the page
    const resize = new ResizeObserver(update);
    // A last look as it comes into view, in case something moved it unseen
    const arrival = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) update();
      },
      { rootMargin: "50% 0px" }
    );

    update();
    resize.observe(document.body);
    resize.observe(node);
    arrival.observe(node);
    window.addEventListener("resize", update);
    motionQuery.addEventListener("change", update);

    return () => {
      resize.disconnect();
      arrival.disconnect();
      window.removeEventListener("resize", update);
      motionQuery.removeEventListener("change", update);
      geometry.set(idle);
    };
  }, [geometry, ref, measure, idle, live]);

  return geometry;
}
