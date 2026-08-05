import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MotionReveal from "@/components/MotionReveal";

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Find the next project for the footer link
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <Navigation />
      <main className="cs-main">
        <div className="cs-bg-orb" aria-hidden="true" />
        <header className="case-study-hero">
          <MotionReveal>
            <p className="cs-category">{project.category}</p>
            <h1 className="cs-title">{project.name}</h1>
            <p className="cs-summary">{project.summary}</p>
          </MotionReveal>
          
          <MotionReveal delay={0.1}>
            <div className="cs-meta glass-panel">
              <div className="cs-meta-col">
                <h4>Deliverables</h4>
                <ul>
                  {project.deliverables.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="cs-meta-col">
                <h4>Outcome</h4>
                <ul>
                  <li>{project.outcome.replace("Outcome: ", "")}</li>
                </ul>
              </div>
            </div>
          </MotionReveal>
        </header>

        <section className="cs-content-wrapper" style={{ padding: "0 2rem", maxWidth: "1400px", margin: "0 auto" }}>
          <MotionReveal delay={0.2}>
            <div className="cs-hero-image-container">
              {/* Replace with actual image later */}
              {project.image ? (
                <img
                  src={project.image}
                  alt={`${project.name} main showcase`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span className="cs-placeholder-text">Hero Image Placeholder</span>
              )}
            </div>
          </MotionReveal>

          <MotionReveal>
            <div className="cs-content-section">
              <div className="cs-sticky-heading">
                <h2 className="cs-content-heading">The Challenge</h2>
              </div>
              <p className="cs-content-body">{project.challenge}</p>
            </div>
          </MotionReveal>

          <MotionReveal>
            <div className="cs-content-section">
              <div className="cs-sticky-heading">
                <h2 className="cs-content-heading">The Solution</h2>
              </div>
              <p className="cs-content-body">{project.solution}</p>
            </div>
          </MotionReveal>

          <MotionReveal>
            <div className="cs-image-grid">
              <div className="cs-image-box">
                <span className="cs-placeholder-text">Feature Image</span>
              </div>
              <div className="cs-image-box">
                <span className="cs-placeholder-text">Detail Shot</span>
              </div>
            </div>
          </MotionReveal>
          
          <MotionReveal>
            <div className="cs-hero-image-container">
               <span className="cs-placeholder-text">Full Width Final Showcase</span>
            </div>
          </MotionReveal>
        </section>

        <MotionReveal>
          <div className="cs-next-project">
            <span className="cs-next-label">Next Project</span>
            <a href={`/work/${nextProject.slug}`} className="cs-next-title">
              {nextProject.name}
            </a>
          </div>
        </MotionReveal>
      </main>
      <Footer />
    </>
  );
}
