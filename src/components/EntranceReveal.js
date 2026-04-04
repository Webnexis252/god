"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function EntranceReveal() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading"); // "loading" | "split" | "done"
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Lock scroll while overlay is active
    document.body.style.overflow = "hidden";

    if (prefersReducedMotion) {
      document.body.style.overflow = "";
      setIsVisible(false);
      return;
    }

    // Fake progress counter (0 to 100 over ~1.2s)
    let startTime = null;
    const duration = 1200;
    
    const animateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawProgress = Math.min((elapsed / duration) * 100, 100);
      
      // Easing function for progress (easeOutExpo-ish)
      const easedProgress = rawProgress === 100 ? 100 : 100 * (1 - Math.pow(2, -10 * (rawProgress / 100)));
      
      setProgress(Math.round(easedProgress));

      if (elapsed < duration) {
        requestAnimationFrame(animateProgress);
      } else {
        // Trigger the split reveal
        setTimeout(() => setPhase("split"), 100);
        
        // Remove from DOM eventually
        setTimeout(() => {
          setPhase("done");
          document.body.style.overflow = "";
          setIsVisible(false);
        }, 1200); // 1.2s for split animation to finish
      }
    };

    requestAnimationFrame(animateProgress);

    return () => {
      document.body.style.overflow = "";
    };
  }, [prefersReducedMotion]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="entrance-overlay-spectacular" aria-hidden="true" role="presentation">
        
        {/* Top Half Panel */}
        <motion.div
          className="entrance-panel entrance-panel-top"
          initial={{ y: "0%" }}
          animate={phase === "split" ? { y: "-100%" } : { y: "0%" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="entrance-grid" />
          <div className="entrance-glow entrance-glow-top" />
        </motion.div>

        {/* Bottom Half Panel */}
        <motion.div
          className="entrance-panel entrance-panel-bottom"
          initial={{ y: "0%" }}
          animate={phase === "split" ? { y: "100%" } : { y: "0%" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="entrance-grid entrance-grid-bottom" />
          <div className="entrance-glow entrance-glow-bottom" />
        </motion.div>

        {/* Center Content (Logo & Progress) */}
        <motion.div
          className="entrance-center-content"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={
            phase === "split"
              ? { opacity: 0, scale: 1.1 }
              : { opacity: 1, scale: 1 }
          }
          transition={
            phase === "split"
              ? { duration: 0.5, ease: [0.4, 0, 1, 1] }
              : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }
        >
          <img
            src="/logo.png"
            alt="Webnexis"
            className="entrance-logo"
            draggable={false}
          />
          
          <div className="entrance-loading-wrapper">
            <span className="entrance-progress-text">{progress}%</span>
            <div className="entrance-progress-track">
              <motion.div 
                className="entrance-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="entrance-status-text">
              {progress === 100 ? "READY" : "LOADING"}
            </span>
          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  );
}
