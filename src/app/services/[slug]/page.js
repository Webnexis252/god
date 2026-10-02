import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MotionReveal from "@/components/MotionReveal";
import ServicePlate from "@/components/ServicePlate";
import ServiceLede from "@/components/ServiceLede";
import ServiceRun from "@/components/ServiceRun";
import ServiceNext from "@/components/ServiceNext";
import { siteConfig } from "@/lib/site";
import { projects } from "@/lib/projects";
import { servicesData, getServiceBySlug, getTitleFit } from "@/lib/services";

/* ─────────────────────────────────────────────────
   Service Page — The Opened Plate
   • On the homepage the work is shown as closed
     plates. A service page is one of those opened:
     it starts as a single plate the size of the
     screen in the service's own tone, the content
     unfolds beneath it on the dark ground, and it
     ends on the next service's plate
   • Each section has its own layout: a statement over
     two columns, a staggered ledger, a pinned heading
     beside a focus list, a row of work tiles, a
     closing line, and the next plate
   • This file stays a server component. Whatever
     moves with the scroll lives in a small client
     component of its own
   ───────────────────────────────────────────────── */

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

function Arrow() {
  return (
    <span className="service-arrow" aria-hidden="true">
      <span>→</span>
      <span>→</span>
    </span>
  );
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // The services run in a loop: after the last comes the first
  const count = servicesData.length;
  const currentIndex = servicesData.findIndex((s) => s.slug === slug);
  const nextService = servicesData[(currentIndex + 1) % count];
  const prevService = servicesData[(currentIndex - 1 + count) % count];

  const fit = getTitleFit(service);
  const nextFit = getTitleFit(nextService);

  // Only real projects that used this service; most services have none to show
  const relatedWork = (service.relatedWork ?? [])
    .map((workSlug) => projects.find((project) => project.slug === workSlug))
    .filter(Boolean);

  return (
    <>
      <Navigation backHref="/#services" />

      <main className="service-page">
        <ServicePlate
          slug={service.slug}
          number={service.number}
          lines={service.titleLines}
          fit={fit.stacked}
          tone={service.tone}
          tagline={service.tagline}
          cta={service.cta}
        />

        {/* Everything below is one sheet of the page's ground, drawn up over the plate */}
        <div className="service-sheet">
          {/* Overview and standards */}
          <section className="service-about">
            <ServiceLede text={service.lede} />

            <div className="service-about-body">
              <MotionReveal>
                <p className="service-about-text">{service.overview}</p>
              </MotionReveal>

              <MotionReveal delay={0.08}>
                <ul className="service-standards" aria-label="Standards we hold">
                  {service.metrics.map((metric) => (
                    <li className="service-standard" key={metric.label}>
                      <span className="service-standard-value">{metric.value}</span>
                      <span className="service-standard-label">{metric.label}</span>
                    </li>
                  ))}
                </ul>
              </MotionReveal>
            </div>
          </section>

          {/* What you get */}
          <section className="service-gets">
            <MotionReveal>
              <h2 className="service-heading">What you get.</h2>
            </MotionReveal>

            <ul className="service-ledger">
              {service.whatWeDeliver.map((item, index) => (
                <li className="service-ledger-item" key={item.title}>
                  {/* The right-hand column follows the left by a beat */}
                  <MotionReveal delay={index % 2 ? 0.1 : 0} distance={32}>
                    <h3 className="service-ledger-title">{item.title}</h3>
                    <p className="service-ledger-detail">{item.detail}</p>
                  </MotionReveal>
                </li>
              ))}
            </ul>
          </section>

          {/* How it runs */}
          <section className="service-run">
            <h2 className="service-heading service-run-heading">How it runs.</h2>
            <ServiceRun steps={service.process} />
          </section>

          {/* Related work */}
          {relatedWork.length > 0 ? (
            <section className="service-work">
              <MotionReveal>
                <h2 className="service-heading">Work that used this.</h2>
              </MotionReveal>

              <ul className="service-work-row" data-count={relatedWork.length}>
                {relatedWork.map((project, index) => {
                  const [width, height] = project.imageSize ?? [1280, 680];

                  return (
                    <li className="service-work-tile" key={project.slug}>
                      <MotionReveal delay={0.07 * index} distance={40}>
                        <article
                          className="service-work-inner"
                          style={{ "--tone": project.tone }}
                        >
                          <p className="service-work-category">{project.category}</p>
                          <h3 className="service-work-name">{project.name}</h3>

                          {/* Stretched over the whole tile, so the tile itself is the link */}
                          <Link
                            className="service-work-link"
                            href={`/work/${project.slug}`}
                            aria-label={`View case study: ${project.name}`}
                          >
                            <Arrow />
                          </Link>

                          <div className="service-work-shot">
                            <Image
                              src={project.image}
                              alt=""
                              width={width}
                              height={height}
                              sizes="(min-width: 1101px) 42vw, (min-width: 761px) 62vw, 100vw"
                            />
                          </div>
                        </article>
                      </MotionReveal>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {/* Close */}
          <section className="service-close">
            <MotionReveal>
              <h2 className="service-close-title">
                Let&rsquo;s talk about your {service.inSentence} project.
              </h2>
            </MotionReveal>

            <MotionReveal delay={0.08}>
              <p className="service-close-copy">
                We respond to every inquiry within 48 hours with a scoped proposal, not a
                generic sales deck.
              </p>

              <div className="service-close-actions">
                <Link className="service-cta" href="/#contact">
                  {service.cta}
                  <Arrow />
                </Link>
                <a className="service-text-link" href={`mailto:${siteConfig.email}`}>
                  Email directly
                </a>
              </div>
            </MotionReveal>
          </section>

          {/* Next service */}
          <nav className="service-next" aria-label="More services">
            <ServiceNext
              slug={nextService.slug}
              lines={nextService.titleLines}
              fitStacked={nextFit.stacked}
              fitSingle={nextFit.single}
              tone={nextService.tone}
            />

            <div className="service-next-links">
              <Link className="service-text-link" href={`/services/${prevService.slug}`}>
                Previous: {prevService.name}
              </Link>
              <Link className="service-text-link" href="/#services">
                All services
              </Link>
            </div>
          </nav>
        </div>
      </main>

      <Footer />
    </>
  );
}
