"use client";

import { useEffect, useRef, useState } from "react";

const phrases = [
  "Strategy",
  "Design",
  "Build",
  "Animate",
  "Launch",
  "Optimize",
];

export default function Marquee() {
  const ref = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setPaused(document.hidden);
    };

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPaused(document.hidden || !entry.isIntersecting);
      },
      {
        threshold: 0.08,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={ref}
      className="marquee-section"
      aria-labelledby="marquee-heading"
    >
      <h2 className="sr-only" id="marquee-heading">
        Webnexis capabilities
      </h2>
      <p className="sr-only">
        Strategy, design, build, animate, launch, optimize.
      </p>
      <div
        className={`marquee-track ${paused ? "is-paused" : ""}`}
        aria-hidden="true"
      >
        {[...phrases, ...phrases].map((phrase, index) => (
          <span
            key={`${phrase}-${index}`}
            className={`marquee-text ${index % 2 === 1 ? "is-accent" : ""}`}
          >
            {phrase}
          </span>
        ))}
      </div>
    </section>
  );
}
