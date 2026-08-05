import Navigation from "@/components/Navigation";
import Marquee from "@/components/Marquee";
import ContactForm from "@/components/ContactForm";
import HeroSection from "@/components/HeroSection";
import MotionReveal from "@/components/MotionReveal";
import ParallaxBlock from "@/components/ParallaxBlock";
import ProjectRail from "@/components/ProjectRail";
import ServicesList from "@/components/ServicesList";
import { siteConfig } from "@/lib/site";
import { servicesData } from "@/lib/services";



const projects = [
  {
    name: "DivergentClasses",
    category: "LMS Platform",
    summary:
      "A comprehensive Learning Management System for a coaching institute, designed to prepare students for UCEED, NIFT, and NAT exams.",
    deliverables: ["Course Management", "Student Dashboard", "Exam Prep Modules"],
    outcome: "Outcome: streamlined learning experience, higher student engagement, and structured preparation.",
    image: "/DivergentClassesNew.jpeg", // Replace with your image
  },
  {
    name: "Cake it easy",
    category: "Bakery E-commerce",
    summary:
      "An inviting online storefront for a cake shop located at 500 Terry Francine St, San Francisco, focusing on easy ordering and a delightful brand presence.",
    deliverables: ["Online Ordering System", "Menu Showcase", "Local SEO"],
    outcome: "Outcome: simplified customer orders, wider local reach, and improved online aesthetic.",
    image: "/CakeItEasy.jpeg", // Replace with your image
  },
  {
    name: "Bound & Beyond",
    category: "Library Website",
    summary:
      "A digital gateway for a community library situated at Liberty St, Ashville, PA 16613, USA, focused on catalog exploration and community event discovery.",
    deliverables: ["Digital Catalog", "Event Management", "Community Hub"],
    outcome: "Outcome: improved access to resources, easier event registration, and stronger community engagement.",
    image: "/BoundAndBeyond.jpeg", // Replace with your image
  },
];

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
  const [featuredProject, ...otherProjects] = projects;

  return (
    <>
      <Navigation />
      <a className="sticky-quote-cta" href="#contact">
        Get a Quote
      </a>

      <main>
        <HeroSection />


        <section className="services-section" data-section="services" id="services">
          <MotionReveal className="section-heading">
            <div>
              <p className="section-eyebrow">What We Do</p>
              <h2 className="section-title">Digital product, growth, and brand services.</h2>
            </div>
            <p className="section-copy">
              From UI / UX and development to branding, SEO, and social media
              marketing, every service is aimed at helping the business ship
              better and grow with more clarity.
            </p>
          </MotionReveal>

          <ServicesList services={servicesData} />
        </section>

        <Marquee />

        <section className="work-section" data-section="work" id="work">
          <MotionReveal className="section-heading">
            <div>
              <p className="section-eyebrow">Selected Work</p>
              <h2 className="section-title">Case studies built with intention.</h2>
            </div>
            <p className="section-copy">
              A showcase of recent work focused on strong narrative, clean motion, and conversion-ready interfaces. (Upload your images to public/ to view them here).
            </p>
          </MotionReveal>

          <div className="projects-feature">
            <ParallaxBlock
              className="project-media project-media-feature"
              aria-hidden="true"
              offset={84}
              mobileOffset={18}
              scaleRange={[0.94, 1, 1.03]}
            >
              {featuredProject.image && (
                <img src={featuredProject.image} alt={featuredProject.name} className="project-feature-img" />
              )}
              <div className="project-media-overlay">
                <span className="project-media-label">Featured Project</span>
                <span className="project-media-name">{featuredProject.name}</span>
                <span className="project-media-type">{featuredProject.category}</span>
              </div>
            </ParallaxBlock>

            <MotionReveal className="project-body project-body-feature" delay={0.08}>
              <div className="project-heading">
                <p className="project-category">{featuredProject.category}</p>
                <h3 className="project-name">{featuredProject.name}</h3>
              </div>

              <p className="project-summary">{featuredProject.summary}</p>

              <ul
                className="project-deliverables"
                aria-label={`${featuredProject.name} deliverables`}
              >
                {featuredProject.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="project-outcome">{featuredProject.outcome}</p>

              <div className="project-actions">
                <a className="text-link" href="#contact">
                  View case study outline
                </a>
                <a className="text-link" href="#contact">
                  Build something similar
                </a>
              </div>
            </MotionReveal>
          </div>

          <div className="projects-list">
            {otherProjects.map((project, index) => (
              <MotionReveal
                key={project.name}
                delay={0.06 * index}
                distance={44}
              >
                <ProjectRail project={project} />
              </MotionReveal>
            ))}
          </div>
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

          <div className="process-list">
            {processSteps.map((step, index) => (
              <MotionReveal
                key={step.step}
                className="process-row"
                delay={0.05 * index}
                distance={42}
              >
                <p className="process-index">0{index + 1}</p>
                <h3 className="process-title">{step.step}</h3>
                <p className="process-detail">{step.detail}</p>
              </MotionReveal>
            ))}
          </div>
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

      <footer className="footer">
        <MotionReveal className="footer-brand">
          <p className="footer-logo">{siteConfig.name}</p>
          <p className="footer-copy">
            Highly technical, creative, and professional digital services for ambitious businesses that require exceptional execution.
          </p>
        </MotionReveal>

        <MotionReveal className="footer-links" delay={0.08}>
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </MotionReveal>

        <MotionReveal className="footer-bottom" delay={0.12}>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <p>© 2026 {siteConfig.name}. All rights reserved.</p>
        </MotionReveal>
      </footer>
    </>
  );
}
