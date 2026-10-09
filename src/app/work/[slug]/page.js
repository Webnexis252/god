import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MotionReveal from "@/components/MotionReveal";
import CaseHero from "@/components/CaseHero";
import CaseInk from "@/components/CaseInk";
import CaseOutcome from "@/components/CaseOutcome";
import CaseNext from "@/components/CaseNext";
import { siteConfig } from "@/lib/site";
import { projects } from "@/lib/projects";

/* ─────────────────────────────────────────────────
   Case Study Page — The Opened Plate
   • On the homepage each project is a closed plate.
     This page is that plate opened: the project's
     colour at the size of the screen, its name larger
     still, and the screenshot shown whole
   • The story is told beneath it on the dark ground,
     the colour returns once for the outcome, and the
     page ends on the next project's plate
   • Each section has its own layout: the opened
     plate, two stepped columns of reading text, three
     stacked lines, an uneven set of frames (only when
     a project has gallery images; a stepped row when
     they are phone screens), a closing line,
     and the next plate
   • This file stays a server component. Whatever
     moves with the scroll lives in a small client
     component of its own
   ───────────────────────────────────────────────── */

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return { title: "Project not found" };
  }

  // The root layout adds the site name to `title`; Open Graph titles get no template
  const title = `${project.name} case study`;
  const [width, height] = project.imageSize ?? [1280, 680];

  return {
    title,
    description: project.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description: project.summary,
      url: `/work/${slug}`,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "article",
      images: project.image
        ? [
            {
              url: project.image,
              width,
              height,
              alt: `Homepage of the ${project.name} website`,
            },
          ]
        : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // The projects run in a loop: after the last comes the first
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  const results = project.results ?? [];
  const gallery = project.gallery ?? [];
  // Phone screens are set as one stepped row instead of the uneven set of wide frames
  const isTallGallery =
    gallery.length > 0 && gallery.every(({ size }) => size && size[1] > size[0]);

  return (
    <>
      <Navigation />

      <main className="case-page">
        <CaseHero
          name={project.name}
          category={project.category}
          summary={project.summary}
          deliverables={project.deliverables}
          image={project.image}
          imageSize={project.imageSize}
          tone={project.tone}
        />

        {/* The story: two parts, the second a step down and across from the first */}
        <section className="case-story">
          <div className="case-story-part">
            <h2 className="case-heading">The challenge</h2>
            <CaseInk text={project.challenge} />
          </div>

          <div className="case-story-part">
            <h2 className="case-heading">The solution</h2>
            <CaseInk text={project.solution} />
          </div>
        </section>

        {results.length > 0 ? <CaseOutcome results={results} tone={project.tone} /> : null}

        {/* Details: only for projects that have gallery images */}
        {gallery.length > 0 ? (
          <section className="case-details">
            <h2 className="case-heading">Details</h2>

            <ul className={`case-details-set${isTallGallery ? " is-tall" : ""}`}>
              {gallery.map((shot, index) => {
                const [width, height] = shot.size ?? [1280, 680];

                return (
                  <li className="case-details-item" key={shot.src + index}>
                    <MotionReveal distance={40}>
                      <div className="case-frame">
                        <Image
                          src={shot.src}
                          alt={shot.alt ?? ""}
                          width={width}
                          height={height}
                          unoptimized
                          loading="lazy"
                        />
                      </div>
                    </MotionReveal>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {/* Close */}
        <section className="case-close">
          <MotionReveal>
            <h2 className="case-close-title">Planning something like this?</h2>
          </MotionReveal>

          <MotionReveal delay={0.08}>
            <Link className="case-link" href="/#contact">
              Get a quote
              <span className="case-arrow" aria-hidden="true">
                <span>→</span>
                <span>→</span>
              </span>
            </Link>
          </MotionReveal>
        </section>

        {/* Next project */}
        <nav className="case-next" aria-label="More work">
          <CaseNext
            slug={nextProject.slug}
            name={nextProject.name}
            image={nextProject.image}
            imageSize={nextProject.imageSize}
            tone={nextProject.tone}
          />

          <Link className="case-text-link" href="/#work">
            All work
          </Link>
        </nav>
      </main>

      <Footer />
    </>
  );
}
