export const servicesData = [
  {
    slug: "ui-ux-design",
    number: "01",
    name: "UI / UX Design",
    tagline: "Design that earns trust before a single word is read.",
    description:
      "User experience strategy, wireframes, flows, and interface design built to make products easier to use and easier to trust.",
    overview:
      "Great UI/UX is invisible. It removes friction, guides decisions, and makes the product feel inevitable. We approach interface design not as decoration, but as a persuasion system — every layout decision, spacing choice, and interaction pattern is engineered to reduce cognitive load and move users toward the right outcome.",
    whatWeDeliver: [
      {
        title: "UX Research & Strategy",
        detail:
          "User interviews, competitive audits, journey mapping, and information architecture to ground every design decision in real behaviour.",
      },
      {
        title: "Wireframes & Prototypes",
        detail:
          "Low-fidelity layouts through high-fidelity interactive prototypes in Figma, validated before a single line of code is written.",
      },
      {
        title: "Visual Interface Design",
        detail:
          "Pixel-precise UI with a cohesive design system: colour tokens, typography scale, component library, and dark/light mode support.",
      },
      {
        title: "Interaction & Motion Design",
        detail:
          "Micro-interactions, transitions, and motion choreography that communicate state without explanation.",
      },
      {
        title: "Accessibility Audits",
        detail:
          "WCAG 2.2 AA compliance review, contrast checking, focus management, and screen reader compatibility testing.",
      },
      {
        title: "Usability Testing",
        detail:
          "Structured testing sessions with target users, heat maps, and iterative refinement cycles tied to conversion metrics.",
      },
    ],
    process: [
      { step: "Discovery", detail: "Stakeholder workshops, user research, heuristic audit of existing product." },
      { step: "Information Architecture", detail: "Sitemap design, user flows, task analysis, and content hierarchy." },
      { step: "Wireframing", detail: "Lo-fi layouts covering all core user journeys across device breakpoints." },
      { step: "Visual Design", detail: "Full design system, component library, and hi-fi mockups in Figma." },
      { step: "Prototype & Test", detail: "Interactive prototype, usability sessions, iterate on findings." },
      { step: "Developer Handoff", detail: "Annotated specs, exported assets, design tokens, and implementation support." },
    ],
    metrics: [
      { value: "48h", label: "Proposal turnaround" },
      { value: "AA", label: "Accessibility baseline" },
      { value: "100%", label: "Figma handoff ready" },
    ],
    cta: "Start a UI/UX project",
  },
  {
    slug: "web-development",
    number: "02",
    name: "Web Development",
    tagline: "Production-grade web systems that actually perform.",
    description:
      "Modern websites and web apps engineered for speed, responsiveness, maintainability, and a polished production-ready finish.",
    overview:
      "We build websites and web applications that hold up under real conditions — fast at cold load, resilient on mobile, correct in SEO, and maintainable for teams picking up the codebase after launch. Our stack is opinionated by quality standards, not trend cycles. We default to Next.js for production web work because of its rendering flexibility, but we'll meet the project where the right architecture is.",
    whatWeDeliver: [
      {
        title: "Next.js / React Applications",
        detail:
          "Server-side rendering, static generation, and hybrid modes configured correctly for performance, SEO, and data freshness.",
      },
      {
        title: "Performance Optimisation",
        detail:
          "Core Web Vitals tuning: LCP, CLS, INP, image optimisation, font loading strategy, and bundle analysis.",
      },
      {
        title: "Responsive & Cross-Browser",
        detail:
          "Mobile-first layouts tested across viewport sizes, browsers, and operating systems with no layout drift.",
      },
      {
        title: "CMS Integration",
        detail:
          "Sanity, Contentful, or headless WordPress connected to your front end so content teams can publish independently.",
      },
      {
        title: "API & Backend Integration",
        detail:
          "REST and GraphQL API consumption, webhook pipelines, third-party service integration, and auth flows.",
      },
      {
        title: "Deployment & Hosting",
        detail:
          "CI/CD pipelines, Vercel / Railway / custom VPS deployments, environment configuration, and monitoring setup.",
      },
    ],
    process: [
      { step: "Technical Scoping", detail: "Architecture review, stack recommendation, dependency audit, and timeline scoping." },
      { step: "Foundation", detail: "Project scaffolding, design system implementation, routing structure, and environment setup." },
      { step: "Feature Development", detail: "Component-driven development with version control, code review, and daily check-ins." },
      { step: "QA & Testing", detail: "Cross-browser QA, accessibility testing, performance profiling, and load testing." },
      { step: "Launch", detail: "Deployment, domain configuration, DNS setup, and post-launch monitoring window." },
      { step: "Handoff", detail: "Documentation, admin access, training session, and 30-day post-launch support." },
    ],
    metrics: [
      { value: "100", label: "Lighthouse target score" },
      { value: "Sub-2s", label: "LCP target on 4G" },
      { value: "0", label: "Third-party bloat policy" },
    ],
    cta: "Start a web project",
  },
  {
    slug: "android-app-development",
    number: "03",
    name: "Android App Development",
    tagline: "Android apps built for the full spectrum of real devices.",
    description:
      "Android applications designed and developed for real-world usability, clean performance, and dependable release quality.",
    overview:
      "Android development at quality means understanding fragmentation — thousands of device configurations, varying screen densities, memory constraints across low-end to flagship. We build with Kotlin-first architecture, Material Design 3 principles, and a QA process that includes real device testing across form factors to make sure the app doesn't just pass the emulator.",
    whatWeDeliver: [
      {
        title: "Native Kotlin Development",
        detail:
          "Jetpack Compose UI or XML views depending on project maturity, with coroutines, ViewModel, and clean architecture.",
      },
      {
        title: "Cross-Platform (Flutter)",
        detail:
          "For projects targeting both Android and iOS, Flutter with a shared codebase delivering near-native performance.",
      },
      {
        title: "Play Store Publishing",
        detail:
          "App signing, AAB build preparation, Play Store listing creation, screenshot design, and launch management.",
      },
      {
        title: "Push Notifications & Analytics",
        detail:
          "Firebase Cloud Messaging, Crashlytics, Google Analytics for Firebase, and custom event tracking configured from day one.",
      },
      {
        title: "Offline & Performance",
        detail:
          "Local database (Room), caching strategies, background sync, and battery-efficient task scheduling.",
      },
      {
        title: "API Integration",
        detail:
          "Retrofit / OkHttp for REST, WebSocket support, auth token management, and certificate pinning for security.",
      },
    ],
    process: [
      { step: "Scoping", detail: "Feature list, platform targets, OS version floor, third-party SDK audit." },
      { step: "Architecture", detail: "MVVM or MVI structure, navigation graph, module setup, dependency injection." },
      { step: "Development Sprints", detail: "Two-week sprints with demo builds delivered to TestFlight equivalent (Firebase App Distribution)." },
      { step: "Device Testing", detail: "Real device QA across budget, mid-range, and flagship tiers plus emulator matrix." },
      { step: "Store Submission", detail: "Play Store listing, review management, and staged rollout strategy." },
      { step: "Post-Launch", detail: "Crash monitoring, user feedback triage, OS update compatibility checks." },
    ],
    metrics: [
      { value: "API 26+", label: "Android version floor" },
      { value: "Real", label: "Device testing (not emulator)" },
      { value: "Staged", label: "Play Store rollout" },
    ],
    cta: "Start an Android project",
  },
  {
    slug: "ios-app-development",
    number: "04",
    name: "iOS App Development",
    tagline: "iPhone and iPad apps that feel exactly like they should.",
    description:
      "Native-feeling iPhone and iPad experiences with careful interface detail, smooth flows, and launch-focused implementation.",
    overview:
      "iOS users have a calibrated sense of quality. Transitions feel wrong if they're 10ms off. Scrolling feels heavy if momentum isn't tuned. We build iOS applications with SwiftUI-first development, Human Interface Guidelines adherence, and careful attention to the small details that separate apps users trust from apps they delete. Every project goes through TestFlight before the App Store.",
    whatWeDeliver: [
      {
        title: "SwiftUI Development",
        detail:
          "Modern declarative UI with proper state management, navigation stack, and lifecycle handling for iOS 16+.",
      },
      {
        title: "UIKit Integration",
        detail:
          "Legacy UIKit components wrapped or bridged correctly for projects requiring UIKit compatibility or older OS support.",
      },
      {
        title: "App Store Publishing",
        detail:
          "Provisioning profiles, entitlements, App Store Connect listing, screenshot design, and review process management.",
      },
      {
        title: "Sign in with Apple & Auth",
        detail:
          "Apple-compliant authentication flows, Keychain storage, biometric auth (Face ID / Touch ID), and OAuth integrations.",
      },
      {
        title: "Push Notifications",
        detail:
          "APNs integration, notification categories, actionable notifications, and rich media push content.",
      },
      {
        title: "Performance & Memory",
        detail:
          "Instruments profiling, memory leak detection, background task management, and battery impact analysis.",
      },
    ],
    process: [
      { step: "Scoping", detail: "Feature definition, iOS version floor, device targets, App Store guideline review." },
      { step: "Design Alignment", detail: "HIG review, navigation pattern selection, gestural interaction mapping." },
      { step: "Development", detail: "SwiftUI component build, data layer, API integration, and local persistence." },
      { step: "TestFlight", detail: "Beta distribution, internal testing, external beta with target users." },
      { step: "App Store Submission", detail: "Metadata, screenshots, privacy labels, review process management." },
      { step: "Post-Launch", detail: "Crash reporting, review monitoring, OS update compatibility, iterative updates." },
    ],
    metrics: [
      { value: "iOS 16+", label: "Version target" },
      { value: "HIG", label: "Compliant by default" },
      { value: "TestFlight", label: "Before every App Store build" },
    ],
    cta: "Start an iOS project",
  },
  {
    slug: "debugging-management",
    number: "05",
    name: "Debugging / Management",
    tagline: "Technical clarity when things stop making sense.",
    description:
      "Bug fixing, technical troubleshooting, workflow cleanup, and project coordination to keep delivery moving without chaos.",
    overview:
      "Messy codebases, broken pipelines, stalled projects, and teams shipping without structure — we've seen all of it and we know what to do. Whether you need a senior pair of eyes on a persistent bug, a technical audit before a handoff, or someone to own project coordination between design, dev, and stakeholders, we step in where the work needs steadiness and precision.",
    whatWeDeliver: [
      {
        title: "Bug Investigation & Fixing",
        detail:
          "Systematic reproduction, root cause analysis, and a fix that addresses the cause — not just the symptom.",
      },
      {
        title: "Performance Debugging",
        detail:
          "Profiling, bottleneck identification, memory leak hunting, and render performance analysis across web and mobile.",
      },
      {
        title: "Technical Debt Reduction",
        detail:
          "Codebase audit, refactoring roadmap, dependency updates, and incremental cleanup without breaking existing behaviour.",
      },
      {
        title: "CI/CD Pipeline Repair",
        detail:
          "Build failures, flaky test analysis, environment configuration issues, and deployment pipeline stabilisation.",
      },
      {
        title: "Project Coordination",
        detail:
          "Sprint planning, backlog management, stakeholder communication, and cross-functional coordination to keep delivery on track.",
      },
      {
        title: "Vendor / Handoff Audits",
        detail:
          "Review of code, documentation, and architecture delivered by a previous team before you trust it in production.",
      },
    ],
    process: [
      { step: "Intake", detail: "Reproduce the issue, gather logs, context from team, and scope the investigation." },
      { step: "Root Cause Analysis", detail: "Systematic elimination, bisect strategy, and hypothesis testing." },
      { step: "Fix & Test", detail: "Implement the fix, write regression coverage, validate across environments." },
      { step: "Documentation", detail: "Clear write-up of the issue, root cause, fix applied, and prevention guidance." },
      { step: "Review", detail: "Code review, QA sign-off, and deployment to production with monitoring window." },
    ],
    metrics: [
      { value: "48h", label: "Initial response SLA" },
      { value: "0", label: "Band-aid fixes policy" },
      { value: "Full", label: "Root cause documentation" },
    ],
    cta: "Get debugging help",
  },
  {
    slug: "seo",
    number: "06",
    name: "SEO",
    tagline: "Search performance built into the structure, not bolted on after.",
    description:
      "Search optimisation across structure, performance, metadata, content direction, and discoverability so good work gets found.",
    overview:
      "SEO is not keyword stuffing and it is not gaming algorithms. It is making sure your site is technically clean, structurally sound, content-relevant, and fast enough to rank. We build SEO into the architecture from the start — proper semantic HTML, metadata systems, schema markup, Core Web Vitals, and a content strategy that builds domain authority over time rather than chasing short-term spikes.",
    whatWeDeliver: [
      {
        title: "Technical SEO Audit",
        detail:
          "Crawlability, indexing, canonical URLs, redirect chains, hreflang, structured data validity, and Core Web Vitals analysis.",
      },
      {
        title: "On-Page Optimisation",
        detail:
          "Title tags, meta descriptions, heading hierarchy, image alt text, internal linking architecture, and URL structure.",
      },
      {
        title: "Structured Data (Schema)",
        detail:
          "JSON-LD implementation for Organisation, WebSite, Service, Product, FAQ, BreadcrumbList, and custom schema types.",
      },
      {
        title: "Performance for SEO",
        detail:
          "LCP, INP, CLS resolution — Core Web Vitals improvements directly tied to ranking signal improvement.",
      },
      {
        title: "Content Strategy",
        detail:
          "Keyword research, topic clustering, content calendar, and brief writing to build topical authority progressively.",
      },
      {
        title: "Reporting & Monitoring",
        detail:
          "Google Search Console integration, rank tracking, traffic analysis, and monthly performance reporting.",
      },
    ],
    process: [
      { step: "Audit", detail: "Full technical audit, competitor gap analysis, and keyword opportunity mapping." },
      { step: "Prioritisation", detail: "Issue triage by impact and effort — quick wins first, structural fixes planned." },
      { step: "Technical Fixes", detail: "In-codebase SEO implementation: metadata, schema, sitemaps, robots, redirects." },
      { step: "Content Alignment", detail: "On-page optimisation and content brief delivery for the editorial team." },
      { step: "Monitoring", detail: "GSC tracking, rank monitoring, Core Web Vitals review, monthly reporting." },
    ],
    metrics: [
      { value: "100", label: "Lighthouse SEO target" },
      { value: "Schema", label: "Structured data by default" },
      { value: "GSC", label: "Verified and monitored" },
    ],
    cta: "Start an SEO project",
  },
  {
    slug: "branding",
    number: "07",
    name: "Branding",
    tagline: "A brand that people remember without being told to.",
    description:
      "Brand direction, visual identity systems, and positioning work that gives the business a clearer and more memorable presence.",
    overview:
      "Branding is what happens when design meets intention. A strong brand isn't just a logo — it's a system of decisions about how the business looks, sounds, and behaves across every touchpoint. We work from the inside out: clarify the positioning, define the personality, then build the visual system that expresses it consistently across digital and physical contexts.",
    whatWeDeliver: [
      {
        title: "Brand Strategy & Positioning",
        detail:
          "Market positioning, value proposition clarity, audience definition, and competitive differentiation.",
      },
      {
        title: "Logo & Mark Design",
        detail:
          "Primary logo, wordmark, icon mark, and responsive logo variants with clear-space rules and misuse guidelines.",
      },
      {
        title: "Visual Identity System",
        detail:
          "Colour palette, typography system, iconography style, photography direction, and illustration guidelines.",
      },
      {
        title: "Brand Guidelines Document",
        detail:
          "Comprehensive brand standards document covering all identity elements, usage rules, and application examples.",
      },
      {
        title: "Digital Design System",
        detail:
          "Design tokens, Figma component library, and a front-end implementation guide connected to the brand system.",
      },
      {
        title: "Brand Collateral",
        detail:
          "Business cards, email signatures, social media templates, presentation decks, and other brand touchpoints as needed.",
      },
    ],
    process: [
      { step: "Discovery", detail: "Brand audit, stakeholder interviews, competitor landscape, and positioning workshop." },
      { step: "Strategy", detail: "Value proposition, brand personality, tone of voice, and positioning statement." },
      { step: "Concept Development", detail: "2–3 distinct visual directions with rationale and moodboards." },
      { step: "Refinement", detail: "Selected direction developed to completion across all identity elements." },
      { step: "System Build", detail: "Figma design system, brand guidelines document, and asset export package." },
      { step: "Handoff", detail: "All source files, fonts, brand guidelines PDF, and implementation support." },
    ],
    metrics: [
      { value: "3", label: "Concepts presented" },
      { value: "Full", label: "Figma file handoff" },
      { value: "PDF", label: "Brand guidelines included" },
    ],
    cta: "Start a branding project",
  },
  {
    slug: "social-media-marketing",
    number: "08",
    name: "Social Media Marketing",
    tagline: "Content that builds attention, not just impressions.",
    description:
      "Content support, campaign thinking, and social media execution built to strengthen reach, consistency, and audience engagement.",
    overview:
      "Social media marketing done badly is just noise. Done well, it builds compounding awareness, earns trust through consistency, and gives the sales team warm leads instead of cold calls. We approach social not as a content factory but as a strategic communication layer — understanding what your audience actually responds to, what posting patterns work on each platform, and how to measure what matters beyond vanity metrics.",
    whatWeDeliver: [
      {
        title: "Social Media Strategy",
        detail:
          "Platform selection, content pillars, posting cadence, audience personas, and competitive content analysis.",
      },
      {
        title: "Content Creation",
        detail:
          "Copywriting, short-form video scripts, carousel frameworks, graphic design, and visual content production.",
      },
      {
        title: "Content Calendar",
        detail:
          "Monthly content calendar with post copy, visual direction, hashtag strategy, and scheduled publishing.",
      },
      {
        title: "Community Management",
        detail:
          "Comment and DM response management, follower engagement, and community growth tactics.",
      },
      {
        title: "Paid Social Campaigns",
        detail:
          "Meta Ads, LinkedIn Ads, and Instagram promotion strategy with audience targeting, creative testing, and budget management.",
      },
      {
        title: "Analytics & Reporting",
        detail:
          "Monthly performance reports covering reach, engagement, follower growth, click-throughs, and campaign ROI.",
      },
    ],
    process: [
      { step: "Audit", detail: "Existing social audit, competitor analysis, audience research, and platform performance review." },
      { step: "Strategy", detail: "Content pillars, platform focus, tone of voice, and monthly content goals." },
      { step: "Production", detail: "Content batch creation, graphic design, copy, and scheduling for the month ahead." },
      { step: "Publishing", detail: "Scheduled posting, community management, and real-time engagement monitoring." },
      { step: "Review", detail: "Monthly performance review, strategy refinement, and next month planning." },
    ],
    metrics: [
      { value: "3×", label: "Weekly posting cadence (min)" },
      { value: "Monthly", label: "Performance reporting cadence" },
      { value: "ROI", label: "Tied to business outcomes" },
    ],
    cta: "Start a social media project",
  },
];

export function getServiceBySlug(slug) {
  return servicesData.find((s) => s.slug === slug) || null;
}
