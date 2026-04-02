import { notFound } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import MotionReveal from "@/components/MotionReveal";
import { siteConfig } from "@/lib/site";
import { servicesData, getServiceBySlug } from "@/lib/services";

export async function generateStaticParams() {
  return servicesData.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: `${service.name} | ${siteConfig.name}`,
    description: service.description,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: `${service.name} | ${siteConfig.name}`,
      description: service.description,
      url: `${siteConfig.url}/services/${slug}`,
    },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const currentIndex = servicesData.findIndex((s) => s.slug === slug);
  const prevService = currentIndex > 0 ? servicesData[currentIndex - 1] : null;
  const nextService =
    currentIndex < servicesData.length - 1
      ? servicesData[currentIndex + 1]
      : null;

  return (
    <>
      <Navigation backHref="/#services" />

      <main className="service-detail-main">
        {/* Hero */}
        <section className="service-detail-hero">
          <div className="service-detail-hero-bg" aria-hidden="true" />
          <div className="service-detail-hero-inner">
            <MotionReveal>
              <div className="service-detail-breadcrumb">
                <Link href="/#services" className="breadcrumb-link">
                  ← All Services
                </Link>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-current">{service.name}</span>
              </div>
              <p className="service-detail-number">{service.number}</p>
              <h1 className="service-detail-title">{service.name}</h1>
              <p className="service-detail-tagline">{service.tagline}</p>
            </MotionReveal>

            <MotionReveal delay={0.1} className="service-detail-hero-cta">
              <a href={`/#contact`} className="primary-button">
                {service.cta}
              </a>
              <a href={`/#contact`} className="secondary-button">
                Request a proposal
              </a>
            </MotionReveal>
          </div>
        </section>

        {/* Overview */}
        <section className="service-detail-section service-overview-section">
          <div className="service-detail-container">
            <MotionReveal className="service-overview-grid">
              <div className="service-overview-left">
                <p className="section-eyebrow">Overview</p>
                <h2 className="service-section-title">What this service is really about.</h2>
              </div>
              <p className="service-overview-text">{service.overview}</p>
            </MotionReveal>
          </div>
        </section>

        {/* What We Deliver */}
        <section className="service-detail-section">
          <div className="service-detail-container">
            <MotionReveal className="section-heading">
              <div>
                <p className="section-eyebrow">Deliverables</p>
                <h2 className="service-section-title">What you get.</h2>
              </div>
              <p className="section-copy">
                Specific, concrete outputs — not vague categories. Every engagement is scoped to deliverables your team can act on.
              </p>
            </MotionReveal>

            <div className="service-deliverables-grid">
              {service.whatWeDeliver.map((item, index) => (
                <MotionReveal
                  key={item.title}
                  className="service-deliverable-card"
                  delay={0.05 * index}
                >
                  <span className="deliverable-number">0{index + 1}</span>
                  <h3 className="deliverable-title">{item.title}</h3>
                  <p className="deliverable-detail">{item.detail}</p>
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="service-metrics-section">
          <div className="service-detail-container">
            <MotionReveal className="service-metrics-inner">
              {service.metrics.map((metric, index) => (
                <div className="service-metric" key={index}>
                  <span className="service-metric-value">{metric.value}</span>
                  <span className="service-metric-label">{metric.label}</span>
                </div>
              ))}
            </MotionReveal>
          </div>
        </section>

        {/* Process */}
        <section className="service-detail-section">
          <div className="service-detail-container">
            <MotionReveal className="section-heading">
              <div>
                <p className="section-eyebrow">How We Work</p>
                <h2 className="service-section-title">The process, step by step.</h2>
              </div>
              <p className="section-copy">
                No vague &ldquo;discovery phases.&rdquo; Each step has a clear purpose, clear output, and a handoff point you can audit.
              </p>
            </MotionReveal>

            <div className="service-process-list">
              {service.process.map((step, index) => (
                <MotionReveal
                  key={step.step}
                  className="service-process-row"
                  delay={0.05 * index}
                  distance={36}
                >
                  <p className="service-process-index">0{index + 1}</p>
                  <h3 className="service-process-title">{step.step}</h3>
                  <p className="service-process-detail">{step.detail}</p>
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Band */}
        <section className="service-cta-section">
          <div className="service-detail-container">
            <MotionReveal className="service-cta-inner">
              <div className="service-cta-text">
                <p className="section-eyebrow">Ready to Start?</p>
                <h2 className="service-cta-title">
                  Let&rsquo;s talk about your {service.name.toLowerCase()} project.
                </h2>
                <p className="service-cta-copy">
                  We respond to every inquiry within 48 hours with a scoped proposal, not a generic sales deck.
                </p>
              </div>
              <div className="service-cta-actions">
                <a href="/#contact" className="primary-button">
                  {service.cta}
                </a>
                <a href={`mailto:${siteConfig.email}`} className="secondary-button">
                  Email directly
                </a>
              </div>
            </MotionReveal>
          </div>
        </section>

        {/* Other Services Navigation */}
        <section className="service-nav-section">
          <div className="service-detail-container">
            <MotionReveal>
              <p className="section-eyebrow">More Services</p>
            </MotionReveal>
            <div className="service-nav-grid">
              {prevService && (
                <MotionReveal className="service-nav-card service-nav-prev" delay={0.04}>
                  <p className="service-nav-direction">← Previous</p>
                  <p className="service-nav-number">{prevService.number}</p>
                  <h3 className="service-nav-name">{prevService.name}</h3>
                  <p className="service-nav-desc">{prevService.description}</p>
                  <Link
                    href={`/services/${prevService.slug}`}
                    className="service-nav-link"
                    aria-label={`View ${prevService.name} service page`}
                  >
                    View service →
                  </Link>
                </MotionReveal>
              )}
              {nextService && (
                <MotionReveal
                  className="service-nav-card service-nav-next"
                  delay={0.08}
                  style={{ marginLeft: prevService ? "auto" : undefined }}
                >
                  <p className="service-nav-direction">Next →</p>
                  <p className="service-nav-number">{nextService.number}</p>
                  <h3 className="service-nav-name">{nextService.name}</h3>
                  <p className="service-nav-desc">{nextService.description}</p>
                  <Link
                    href={`/services/${nextService.slug}`}
                    className="service-nav-link"
                    aria-label={`View ${nextService.name} service page`}
                  >
                    View service →
                  </Link>
                </MotionReveal>
              )}
            </div>

            <MotionReveal delay={0.1} className="service-all-link-wrap">
              <Link href="/#services" className="text-link">
                View all services
              </Link>
            </MotionReveal>
          </div>
        </section>
      </main>

      <footer className="footer" style={{ width: "var(--site-width)", margin: "0 auto" }}>
        <MotionReveal className="footer-brand">
          <p className="footer-logo">{siteConfig.name}</p>
          <p className="footer-copy">
            Highly technical, creative, and professional digital services for ambitious businesses that require exceptional execution.
          </p>
        </MotionReveal>

        <MotionReveal className="footer-links" delay={0.08}>
          <Link href="/#services">Services</Link>
          <Link href="/#work">Work</Link>
          <Link href="/#process">Process</Link>
          <Link href="/#contact">Contact</Link>
        </MotionReveal>

        <MotionReveal className="footer-bottom" delay={0.12}>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <p>© 2026 {siteConfig.name}. All rights reserved.</p>
        </MotionReveal>
      </footer>
    </>
  );
}
