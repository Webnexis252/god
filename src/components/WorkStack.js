"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import MotionReveal from "@/components/MotionReveal";

/* ─────────────────────────────────────────────────
   WorkStack — Case Study Plates
   • One plate per project: a colour field taken from
     the project's own site, its name set very large,
     and the screenshot cropped off the plate's edge
   • On desktop each plate pins under the nav and the
     next one slides over it, so the work piles up
   • A covered plate sinks back: it shrinks a little
     and dims, driven by how far the next has come
   • Scroll-linked values are motion values worked out
     from measurements cached on resize, so a scroll
     frame reads no layout and renders no React
   • Phones and tablets get the same plates in a
     plain column, with no pinning
   ───────────────────────────────────────────────── */

const STACK_QUERY = "(min-width: 1101px)";
const PEEK = 14;    // how much of each covered plate shows above the next (px)
const MARGIN = 16;  // breathing room under the nav and above the fold (px)
const SINK = 0.04;  // scale a plate loses for each plate on top of it
const DIM = 0.42;   // shade a plate gains for each plate on top of it
const DRIFT = 40;   // how far the screenshot rises as its plate arrives (px)

const IDLE = { live: false, viewport: 0, cards: [] };

const clamp = (value) => Math.min(Math.max(value, 0), 1);

const cleanOutcome = (outcome) => {
  const text = outcome.replace(/^Outcome:\s*/i, "");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Depth is how many plates have slid over this one, counted in fractions.
const depthAt = (layout, index, scrollY) => {
  if (!layout.live) return 0;

  let depth = 0;

  for (let next = index + 1; next < layout.cards.length; next += 1) {
    const { natural, top, height } = layout.cards[next];
    depth += clamp(1 - (natural - scrollY - top) / (height - PEEK));
  }

  return depth;
};

// 1 while a plate is still at the fold, 0 once it has reached its pin.
const awayAt = (layout, index, scrollY) => {
  const card = layout.live ? layout.cards[index] : null;
  if (!card) return 0;

  return clamp((card.natural - scrollY - card.top) / (layout.viewport - card.top));
};

function WorkCard({ project, index, scrollY, layout, onFocus }) {
  const depth = useTransform([scrollY, layout], ([y, current]) => depthAt(current, index, y));
  const scale = useTransform(depth, (value) => 1 - value * SINK);
  const shade = useTransform(depth, (value) => Math.min(value * DIM, 0.7));
  const drift = useTransform(
    [scrollY, layout],
    ([y, current]) => awayAt(current, index, y) * DRIFT
  );
  const [width, height] = project.imageSize ?? [1280, 680];

  return (
    <li className="work-card" onFocus={() => onFocus(index)}>
      <MotionReveal distance={64}>
        <motion.article
          className="work-card-inner"
          style={{ "--tone": project.tone, scale }}
        >
          <p className="work-card-category">{project.category}</p>
          <h3 className="work-card-name">{project.name}</h3>

          <div className="work-card-copy">
            <p className="work-card-summary">{project.summary}</p>
            <ul
              className="work-card-list"
              aria-label={`${project.name} deliverables`}
            >
              {project.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="work-card-outcome">{cleanOutcome(project.outcome)}</p>
          </div>

          {/* Stretched over the whole plate, so the plate itself is the link */}
          <Link
            className="work-card-cta"
            href={`/work/${project.slug}`}
            aria-label={`View case study: ${project.name}`}
          >
            View case study
            <span className="work-card-cta-arrow" aria-hidden="true">
              <span>→</span>
              <span>→</span>
            </span>
          </Link>

          {project.image ? (
            <motion.div className="work-card-plate" style={{ y: drift }}>
              <img
                className="work-card-shot"
                src={project.image}
                alt=""
                width={width}
                height={height}
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          ) : null}

          <motion.div
            className="work-card-shade"
            style={{ opacity: shade }}
            aria-hidden="true"
          />
        </motion.article>
      </MotionReveal>
    </li>
  );
}

export default function WorkStack({ projects }) {
  const stackRef = useRef(null);
  const { scrollY } = useScroll();
  const layout = useMotionValue(IDLE);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return undefined;

    const cards = Array.from(stack.children);
    const stackQuery = window.matchMedia(STACK_QUERY);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Where each plate pins and where it sits in the page. A plate taller than the
    // space under the nav pins by its bottom edge instead, so its last line can
    // always be scrolled into view.
    const measure = () => {
      const root = getComputedStyle(document.documentElement);
      // --nav-height is in rem
      const navHeight = parseFloat(root.getPropertyValue("--nav-height")) * parseFloat(root.fontSize);
      const gap = parseFloat(getComputedStyle(stack).rowGap) || 0;
      const stackTop = stack.getBoundingClientRect().top + window.scrollY;
      const viewport = window.innerHeight;

      const measured = cards.map((card, index) => {
        const height = card.offsetHeight;
        const top = Math.min(navHeight + MARGIN + index * PEEK, viewport - height - MARGIN);

        card.style.setProperty("--stick-top", `${top}px`);

        // A pinned plate reports where it is stuck, so its place in the page is
        // worked out from the stack (every row is the same height on desktop).
        return { top, height, natural: stackTop + index * (height + gap) };
      });

      layout.set({
        live: stackQuery.matches && !motionQuery.matches,
        viewport,
        cards: measured,
      });
    };

    // Anything that changes height above the stack moves it down the page
    const resize = new ResizeObserver(measure);
    // A last look as the stack comes into view, in case something moved it unseen
    const arrival = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) measure();
      },
      { rootMargin: "50% 0px" }
    );

    measure();
    resize.observe(document.body);
    cards.forEach((card) => resize.observe(card));
    arrival.observe(stack);
    window.addEventListener("resize", measure);
    stackQuery.addEventListener("change", measure);
    motionQuery.addEventListener("change", measure);

    return () => {
      resize.disconnect();
      arrival.disconnect();
      window.removeEventListener("resize", measure);
      stackQuery.removeEventListener("change", measure);
      motionQuery.removeEventListener("change", measure);
      cards.forEach((card) => card.style.removeProperty("--stick-top"));
      layout.set(IDLE);
    };
  }, [layout]);

  // A link focused while its plate is buried would be invisible, so bring that plate to the top
  const handleFocus = (index) => {
    const current = layout.get();

    if (depthAt(current, index, window.scrollY) < 0.05) return;

    const { natural, top } = current.cards[index];

    window.scrollTo({ top: natural - top });
  };

  return (
    <ol className="work-stack" ref={stackRef}>
      {projects.map((project, index) => (
        <WorkCard
          key={project.slug}
          project={project}
          index={index}
          scrollY={scrollY}
          layout={layout}
          onFocus={handleFocus}
        />
      ))}
    </ol>
  );
}
