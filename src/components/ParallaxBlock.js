"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import useHydrated from "@/components/useHydrated";

export default function ParallaxBlock({
  children,
  className = "",
  offset = 72,
  mobileOffset = 20,
  scaleRange = [1, 1],
  ...props
}) {
  const ref = useRef(null);
  const isHydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 820px)");

    const syncMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    syncMobile();
    mediaQuery.addEventListener("change", syncMobile);

    return () => {
      mediaQuery.removeEventListener("change", syncMobile);
    };
  }, []);

  useEffect(() => {
    const memory = navigator.deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const frameId = window.requestAnimationFrame(() => {
      setIsLowPower(coarsePointer || memory <= 4 || cores <= 4);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const travel =
    prefersReducedMotion || isLowPower ? 0 : isMobile ? mobileOffset : offset;
  const resolvedScaleRange =
    prefersReducedMotion || isLowPower ? [1, 1, 1] : scaleRange;
  const y = useTransform(scrollYProgress, [0, 1], [-travel, travel]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], resolvedScaleRange);
  const Wrapper = isHydrated ? motion.div : "div";

  return (
    <Wrapper
      ref={ref}
      className={className}
      {...props}
      {...(isHydrated
        ? {
            style: { y, scale },
            transition: { ease: [0.16, 1, 0.3, 1] },
          }
        : {})}
    >
      {children}
    </Wrapper>
  );
}
