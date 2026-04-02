"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navItems = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Process", href: "/#process" },
  { label: "Contact", href: "/#contact" },
];

export default function Navigation({ backHref }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    const handleResize = () => {
      if (window.innerWidth > 920) {
        setMenuOpen(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav-inner">
        <Link href="/" className="nav-brand" aria-label="Go to homepage">
          <img src="/logo.png" alt="Webnexis Logo" className="nav-brand-logo" />
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
        </button>

        <div className={`nav-menu ${menuOpen ? "is-open" : ""}`} id="main-menu">
          <nav className="nav-links" aria-label="Primary">
            {backHref && (
              <Link
                href={backHref}
                className="nav-link nav-back-link"
                onClick={closeMenu}
                aria-label="Back to homepage services"
              >
                ← All Services
              </Link>
            )}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a href="/#contact" className="nav-cta" onClick={closeMenu}>
            Get a Quote
          </a>
        </div>
      </div>
    </header>
  );
}
