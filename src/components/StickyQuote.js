"use client";

import { useEffect, useState } from "react";

// Phone-only shortcut to the quote form. It steps aside wherever a quote
// button is already on screen: the hero at the top, the form at the bottom.
export default function StickyQuote() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const sections = ["hero", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const inView = new Set();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          inView.add(entry.target);
        } else {
          inView.delete(entry.target);
        }
      });

      setIsVisible(inView.size === 0);
    });

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <a
      className={`sticky-quote-cta${isVisible ? " is-visible" : ""}`}
      href="#contact"
    >
      Get a quote
    </a>
  );
}
