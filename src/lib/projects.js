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
];
