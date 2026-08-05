import MotionReveal from "./MotionReveal";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <MotionReveal className="footer-brand">
        <p className="footer-logo">{siteConfig.name}</p>
        <p className="footer-copy">
          Highly technical, creative, and professional digital services for ambitious businesses that require exceptional execution.
        </p>
      </MotionReveal>

      <MotionReveal className="footer-links" delay={0.08}>
        <a href="/#services">Services</a>
        <a href="/#work">Work</a>
        <a href="/#process">Process</a>
        <a href="/#contact">Contact</a>
      </MotionReveal>

      <MotionReveal className="footer-bottom" delay={0.12}>
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
      </MotionReveal>
    </footer>
  );
}
