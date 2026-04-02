"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import useHydrated from "@/components/useHydrated";

export default function MotionReveal({
  children,
  className = "",
  delay = 0,
  distance = 48,
  scale = 1,
  as: Tag,
  ...props
}) {
  const isHydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

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

  const revealDistance = prefersReducedMotion ? 0 : isMobile ? distance * 0.35 : distance;

  // If an `as` tag is provided (e.g. Link), use it directly; otherwise use motion.div
  const motionProps = isHydrated
    ? {
        initial: prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 0, y: revealDistance, scale },
        whileInView: prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true, amount: 0.22 },
        transition: {
          duration: prefersReducedMotion ? 0.01 : 0.9,
          delay,
          ease: [0.16, 1, 0.3, 1],
        },
      }
    : {};

  if (Tag && isHydrated) {
    const MotionTag = motion.create(Tag);
    return (
      <MotionTag className={className} {...props} {...motionProps}>
        {children}
      </MotionTag>
    );
  }

  if (Tag && !isHydrated) {
    return (
      <Tag className={className} {...props}>
        {children}
      </Tag>
    );
  }

  const Wrapper = isHydrated ? motion.div : "div";

  return (
    <Wrapper
      className={className}
      {...props}
      {...motionProps}
    >
      {children}
    </Wrapper>
  );
}
