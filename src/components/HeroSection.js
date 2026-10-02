import SplineContainer from "@/components/SplineContainer";

// The copy's entrance is a CSS transition keyed off the preloader (see
// html[data-entrance] in globals.css), so it stays smooth while the scene boots.
export default function HeroSection() {
  return (
    <section className="hero-section" data-section="hero" id="hero">
      <div className="hero-scene" aria-hidden="true">
        <SplineContainer
          sceneUrl="/spline/webnexis-hero.scene.splinecode"
          posterUrl="/spline/webnexis-hero-poster.webp"
          coverSelector=".hero-shell"
        />
      </div>

      <div className="hero-shell">
        <h1 className="hero-title">
          All eyes on <span>your website.</span>
        </h1>

        <div className="hero-foot">
          <p className="hero-description">
            We design and build websites, apps and AI tools for startups, online stores and local businesses.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#contact">
              Get a quote
            </a>
            <a className="secondary-button" href="#work">
              See our work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
