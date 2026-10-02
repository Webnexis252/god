"use client";

import { useEffect } from "react";
import { useMotionValue } from "framer-motion";

/* ─────────────────────────────────────────────────
   useScrollGeometry — Measure Once, Scroll Free
   • The service page's scroll-linked pieces each need
     to know where they sit in the page. This keeps
     that in a motion value, measured when the layout
     changes and never while scrolling, so a scroll
     frame reads no layout and renders no React
   • `measure(node)` returns the geometry; `idle` is
     what stands in before hydration, under reduced
     motion and after unmount. Both must be stable
     (declare them outside the component)
   ───────────────────────────────────────────────── */

export default function useScrollGeometry(ref, measure, idle, live) {
  const geometry = useMotionValue(idle);

  useEffect(() => {
    const node = ref.current;
    if (!node || !live) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

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
