"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import SplineContainer from "@/components/SplineContainer";
import useHydrated from "@/components/useHydrated";

export default function HeroSection() {
  const isHydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef(null);
  const CopyWrapper = isHydrated ? motion.div : "div";
  const AsideWrapper = isHydrated ? motion.div : "div";

  return (
    <section
      ref={heroRef}
      className="hero-section"
      data-section="hero"
      id="hero"
    >
      <div className="hero-scene" aria-hidden="true">
        <SplineContainer
          interactionScopeRef={heroRef}
          sceneUrl="/spline/webnexis-hero.scene.splinecode"
        />
      </div>

      <div className="hero-backdrop" aria-hidden="true" />

      <div className="hero-orb hero-orb-left" aria-hidden="true" />
      <div className="hero-orb hero-orb-right" aria-hidden="true" />

      <div className="hero-shell">
        <CopyWrapper
          className="hero-copy"
          {...(isHydrated
            ? {
                initial: prefersReducedMotion ? false : { opacity: 0, y: 42 },
                animate: prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
                transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
              }
            : {})}
        >
          <p className="hero-kicker">Webnexis / Premium Digital Agency</p>
          <h1 className="hero-title">
            Highly technical interfaces and robust digital ecosystems.
          </h1>
          <p className="hero-description">
            Webnexis designs and develops advanced AI integrations, corporate web platforms, mobile applications (iOS & Android), and strategic e-commerce systems engineered for performance and scalability.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#contact">
              Request a quote
            </a>
            <a className="secondary-button" href="#work">
              View selected work
            </a>
          </div>
        </CopyWrapper>

        <AsideWrapper
          className="hero-aside"
          {...(isHydrated
            ? {
                initial: prefersReducedMotion ? false : { opacity: 0, y: 30 },
                animate: prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
                transition: {
                  duration: 0.8,
                  delay: 0.08,
                  ease: [0.16, 1, 0.3, 1],
                },
              }
            : {})}
        >
          <p className="hero-aside-copy">
            We partner with tech startups, e-commerce brands, and ambitious local businesses to architect high-end projects requiring a precise balance of deep technical execution, artistic design, and corporate professionalism.
          </p>
          <div className="hero-aside-list" aria-label="Studio capabilities">
            <span>UI / UX Design</span>
            <span>Mobile & Web Dev</span>
            <span>AI Integrations</span>
          </div>
        </AsideWrapper>
      </div>
    </section>
  );
}
