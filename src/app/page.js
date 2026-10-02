import Navigation from "@/components/Navigation";
import Marquee from "@/components/Marquee";
import ContactForm from "@/components/ContactForm";
import HeroSection from "@/components/HeroSection";
import MotionReveal from "@/components/MotionReveal";
import ServicesList from "@/components/ServicesList";
import { siteConfig } from "@/lib/site";
import { servicesData } from "@/lib/services";
import { projects } from "@/lib/projects";
import Footer from "@/components/Footer";
import StickyQuote from "@/components/StickyQuote";
import WorkStack from "@/components/WorkStack";
import ProcessLine from "@/components/ProcessLine";




const processSteps = [
  {
    step: "Discover",
    detail:
      "We tighten the offer, define the conversion path, and map the few decisions the homepage actually needs to support.",
  },
  {
    step: "Direct",
    detail:
      "We design one dominant visual idea per section, align the narrative, and keep the page understandable at a glance.",
  },
  {
    step: "Develop",
    detail:
      "We build the production site in Next.js with performance, accessibility, and mobile behavior handled from the start.",
  },
  {
    step: "Deploy",
    detail:
      "We ship with SEO foundations, contact flow, analytics hooks, and a handoff that keeps future updates straightforward.",
  },
];

export default function Home() {
  return (
    <>
      <Navigation />
      <StickyQuote />

      <main>
        <HeroSection />


        <section className="services-section" data-section="services" id="services">
          <MotionReveal className="section-heading">
            <div>
              <p className="section-eyebrow">What We Do</p>
              <h2 className="section-title">Design&nbsp;it. Build&nbsp;it. Get&nbsp;it&nbsp;found.</h2>
            </div>
            <p className="section-copy">
              One team covers design, development and growth, so nothing gets
              lost in handoffs. Pick a service to see exactly what&apos;s included.
            </p>
          </MotionReveal>

          <ServicesList services={servicesData} />
        </section>

        <Marquee />

        <section className="work-section" data-section="work" id="work">
          <MotionReveal className="section-heading">
            <div>
              <p className="section-eyebrow">Selected Work</p>
              <h2 className="section-title">Built for a&nbsp;classroom, a&nbsp;bakery and a&nbsp;library.</h2>
            </div>
            <p className="section-copy">
              Three recent builds, each shaped around how the business actually
              runs. Open any one for the full case study.
            </p>
          </MotionReveal>

          <WorkStack projects={projects} />
        </section>


        <section className="process-section" data-section="process" id="process">
          <MotionReveal className="section-heading">
            <div>
              <p className="section-eyebrow">How We Work</p>
              <h2 className="section-title">Clear process. Less revision churn.</h2>
            </div>
            <p className="section-copy">
              Strong digital products usually fail from mixed priorities, not missing
              features. Our process keeps technical execution, artistic design, and corporate narrative aligned from the start.
            </p>
          </MotionReveal>

          <ProcessLine steps={processSteps} />
        </section>

        <section className="contact-section" data-section="contact" id="contact">
          <MotionReveal className="contact-sidebar">
            <p className="section-eyebrow">Start the Project</p>
            <h2 className="section-title">Let's architect your next digital advantage.</h2>
            <p className="section-copy">
              Whether you need complex AI integrations, robust iOS and Android applications, or a complete UI/UX and SEO overhaul, we have the technical depth to deliver. Get in touch.
            </p>

            <div className="contact-details">
              <a className="contact-detail-link" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
              {siteConfig.phones?.map((phone) => (
                <a key={phone} className="contact-detail-link" href={`tel:${phone.replace(/\s+/g, "")}`}>
                  {phone}
                </a>
              ))}
              <p className="contact-detail-copy">{siteConfig.location}</p>
            </div>

            <div className="social-links" aria-label="Social media profiles">
              {siteConfig.socialLinks.map((link) => (
                <a
                  key={link.label}
                  className="social-link"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                  <span>{link.note}</span>
                </a>
              ))}
            </div>
          </MotionReveal>

          <MotionReveal delay={0.12}>
            <ContactForm />
          </MotionReveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
