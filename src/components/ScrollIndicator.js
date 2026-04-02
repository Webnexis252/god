"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "hero", label: "Hero" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];

export default function ScrollIndicator() {
  const [activeId, setActiveId] = useState("hero");

  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -30% 0px",
        threshold: [0.2, 0.45, 0.7],
      }
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <nav className="scroll-indicator" aria-label="Section progress">
      {sections.map((section) => {
        const isActive = activeId === section.id;

        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`scroll-link ${isActive ? "is-active" : ""}`}
            aria-current={isActive ? "true" : undefined}
          >
            <span className="scroll-dot" aria-hidden="true" />
            <span className="scroll-label">{section.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
