// `tone` and `imageSize` are presentation only. A tone is the deep colour field a
// project sits on in Selected Work, taken from that project's own screenshot.
// `results` is the outcome as three short lines, set large on the case study page
// (`outcome` is the same thing as one sentence, used on the homepage).
// `gallery` is optional: a list of `{ src, size: [width, height], alt }` images
// shown as the Details section of the case study. Leave it out when there are none.
export const projects = [
  {
    name: "DivergentClasses",
    slug: "divergent-classes",
    category: "LMS Platform",
    summary:
      "A comprehensive Learning Management System for a coaching institute, designed to prepare students for UCEED, NIFT, and NAT exams.",
    deliverables: ["Course Management", "Student Dashboard", "Exam Prep Modules"],
    outcome: "Outcome: streamlined learning experience, higher student engagement, and structured preparation.",
    results: ["Streamlined learning experience", "Higher student engagement", "Structured preparation"],
    image: "/DivergentClassesNew.jpeg",
    imageSize: [1280, 697],
    tone: "#11294a",
    challenge: "The coaching institute needed a robust online platform that could handle complex course structures for highly competitive design exams, all while keeping the student experience intuitive and engaging.",
    solution: "We designed and developed a custom LMS tailored to their curriculum, featuring modular course delivery, an integrated dashboard for progress tracking, and interactive exam prep modules that simulate the real test environment."
  },
  {
    name: "Cake it easy",
    slug: "cake-it-easy",
    category: "Bakery E-commerce",
    summary:
      "An inviting online storefront for a cake shop located at 500 Terry Francine St, San Francisco, focusing on easy ordering and a delightful brand presence.",
    deliverables: ["Online Ordering System", "Menu Showcase", "Local SEO"],
    outcome: "Outcome: simplified customer orders, wider local reach, and improved online aesthetic.",
    results: ["Simplified customer orders", "Wider local reach", "Improved online aesthetic"],
    image: "/CakeItEasy.jpeg",
    imageSize: [1280, 674],
    tone: "#4a2210",
    challenge: "The bakery had a strong local presence but struggled with online visibility and an outdated ordering system that caused friction for customers trying to place custom cake orders.",
    solution: "We built a modern, appetizing e-commerce platform that showcases their menu through beautiful imagery, streamlined the custom ordering flow, and optimized the site for local search in San Francisco."
  },
  {
    name: "Bound & Beyond",
    slug: "bound-and-beyond",
    category: "Library Website",
    summary:
      "A digital gateway for a community library situated at Liberty St, Ashville, PA 16613, USA, focused on catalog exploration and community event discovery.",
    deliverables: ["Digital Catalog", "Event Management", "Community Hub"],
    outcome: "Outcome: improved access to resources, easier event registration, and stronger community engagement.",
    results: ["Improved access to resources", "Easier event registration", "Stronger community engagement"],
    image: "/BoundAndBeyond.jpeg",
    imageSize: [1280, 672],
    tone: "#322a2c",
    challenge: "The community library needed a digital hub that not only made their extensive catalog easily searchable online but also served as a central place to discover and register for local community events.",
    solution: "We created a warm and accessible website featuring a fully integrated digital catalog, a dynamic event calendar with easy registration, and dedicated spaces to highlight community initiatives and reading groups."
  },
  {
    name: "Mymatchr",
    slug: "mymatchr",
    category: "Creator Marketplace App",
    summary:
      "A matchmaking app for the creator economy: brands find the micro-influencers who fit their campaigns, and micro-influencers find the brands worth working with.",
    deliverables: ["Swipe-to-match Discovery", "Creator & Brand Analytics", "In-app Messaging"],
    outcome: "Outcome: faster brand-creator matches, campaign fit backed by real numbers, and collaborations that start in the app.",
    results: ["Faster brand-creator matches", "Campaign fit backed by numbers", "Collaborations that start in-app"],
    image: "/mymatchr/cover.jpeg",
    imageSize: [1920, 1020],
    tone: "#6b200c",
    challenge: "Micro-influencers are hard for brands to find, and brands are hard for small creators to reach. Outreach ran through cold DMs and spreadsheets, and neither side could judge whether the other was a good fit before the conversation started.",
    solution: "We designed a two-sided app built around a swipe: brands browse creators, creators browse brands, and every card carries the numbers that matter. A mutual match opens a chat, detailed profiles show reach, engagement and packages, and a social feed keeps both sides active between campaigns.",
    gallery: [
      {
        src: "/mymatchr/match.webp",
        size: [900, 1956],
        alt: "Mymatchr app screen showing a creator card over a brand card, under the line Where Brands and Creators Create Impact",
      },
      {
        src: "/mymatchr/swipe.webp",
        size: [900, 1956],
        alt: "Swipe screen with creator profile cards fanned out either side of the phone",
      },
      {
        src: "/mymatchr/analytics.webp",
        size: [900, 1956],
        alt: "Analytics screens for a creator profile and a brand profile, with reach, engagement and packages",
      },
      {
        src: "/mymatchr/chat.webp",
        size: [900, 1956],
        alt: "In-app chat in which a brand invites a creator to collaborate on a campaign",
      },
      {
        src: "/mymatchr/feed.webp",
        size: [900, 1956],
        alt: "Social feed with stories and posts from brands and creators",
      },
    ],
  },
];
