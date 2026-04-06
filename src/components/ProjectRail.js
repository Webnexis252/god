"use client";

import { useState, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────
   ProjectRail — Row Expand + Image Peek
   • On hover the row smoothly expands in height
   • Deliverables + CTA slide into view
   • The thumbnail image expands with a clip-path
     reveal, growing from small to a cinematic peek
   • Everything snaps back on mouse leave
   ───────────────────────────────────────────────── */

export default function ProjectRail({ project }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef(null);

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsExpanded(true);
  }, []);

  const handleLeave = useCallback(() => {
    // Tiny delay prevents flicker when moving between child elements
    timeoutRef.current = setTimeout(() => setIsExpanded(false), 60);
  }, []);

  return (
    <div
      className={`project-rail${isExpanded ? " is-expanded" : ""}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* ── Top row: meta  |  summary  |  image ── */}
      <div className="project-rail-meta">
        <p className="project-category">{project.category}</p>
        <h3 className="project-name">{project.name}</h3>
      </div>

      <p className="project-summary">{project.summary}</p>

      <div className="project-rail-visual" aria-hidden="true">
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="project-rail-img"
          />
        ) : (
          <div className="project-rail-img-empty" />
        )}
      </div>

      {/* ── Expand row: deliverables + CTA ── */}
      <div className="project-rail-expand">
        <div className="project-rail-expand-inner">
          <ul className="project-rail-tags">
            {project.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="project-rail-expand-actions">
            <p className="project-rail-outcome">{project.outcome}</p>
            <a className="project-rail-cta" href="#contact">
              View case study
              <span className="project-rail-cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
