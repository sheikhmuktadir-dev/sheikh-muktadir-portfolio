// ---------------------------------------------------------------------------
// EDIT THIS FILE. Everything on the site reads from here.
// Replace the placeholder copy with your own — nothing else needs to change.
// ---------------------------------------------------------------------------

// Set your full name here — the banner wordmark and the preloader both derive
// their text from the FIRST name, so there is one place to change it.
const fullName = "Sheikh Muktadir";

export const site = {
  name: fullName,
  role: "Front-end Developer",
  location: "Hyderabad, IN",
  timezone: "Asia/Kolkata",
  email: "you@example.com",

  // The oversized condensed word bleeding off the bottom of the banner.
  // Derived from your first name; set a string here to override it instead.
  wordmark: fullName.split(" ")[0],

  // Hero headline. Each string is its own line.
  // Each string is its own masked line, so each must FIT the column on one
  // line or it wraps and you get an extra one. Line 1 is the role, line 2 the
  // availability — together they read as a developer openly looking for a job.
  // Widths are kept close (~499 / ~531px at the top breakpoint) so the block
  // still stacks evenly. Keep any replacement near that width, under ~780px.
  headline: ["Front-end developer", "open to full-time work"],

  // Short paragraph under the headline — the "why hire me" line: experience
  // and stack first, then the availability note. Keep it near ~106 characters
  // so it holds three lines in the narrow column, like the reference.
  intro:
    "Four years across three teams — building fast, accessible interfaces in React, Next.js and React Native.",

  // Image shown inside the sticky phone. Put a file in /public and point here,
  // e.g. "/hero.jpg". Leave empty for the placeholder.
  heroVisual: "/media/portavia-portrait.jpg",

  // Floating pills layered over the hero visual.
  // 2-3 word phrases so the pills carry weight like the reference, rather than
  // sparse single words. Still your real stack.
  heroTags: [
    "React & Next.js",
    "React Native",
    "WordPress",
    "Modern JavaScript",
  ],

  // Primary action in the header. Drop your PDF at public/cv.pdf, or point
  // href anywhere. Setting download:true adds the download attribute so the
  // browser saves the file instead of opening it in a tab.
  cta: { label: "Download CV", href: "/cv.pdf", download: true },

  // Big statement block below the hero. First person, creative-developer
  // voice — motion and craft up front, performance as the ground note, closing
  // on the job hunt so it matches the banner. Keep near ~150 characters
  // (td-noise's is 163) so it sets at 72px across the full container in three
  // lines. Much longer and it spills to a ragged fourth line; shorter drops to two.
  statement:
    "Most interfaces just sit there. Mine move, respond, and come alive — engineered frame-perfect to feel fast, fluid, and impossible to ignore on any screen.",

  about: {
    heading: "Studio",
    body: [
      "I'm a front-end developer focused on interface craft — the layer where design decisions become something you can actually touch.",
      "Most of my work lives in the details: how a menu opens, how type settles into place, how a page holds together at every width.",
      "Currently open to selected freelance and collaboration.",
    ],
    facts: [
      { label: "Experience", value: "4 years" },
      { label: "Focus", value: "Interface & motion" },
      { label: "Availability", value: "Open to work" },
      { label: "Based in", value: "Hyderabad" },
    ],
  },

  // About & Experience — a pinned numeral that rolls as each entry takes the
  // view. Step 01 is about me; 02–04 are previous roles.
  // NOTE: the company names, dates and bullet copy below are placeholders —
  // replace them with your real employers, dates and responsibilities.
  process: {
    label: "About me",
    heading: "A bit about me and where I've worked",
    intro:
      "Four years building front-end interfaces in React, Next.js and React Native. Here's who I am and the teams I've done it with.",
    steps: [
      {
        title: "About me",
        duration: "Front-end Developer & Team Lead",
        items: [
          {
            label: "Who I am",
            body: "A front-end developer who leads with craft — I turn designs into fast, accessible interfaces that feel alive on every screen.",
          },
          {
            label: "My stack",
            body: "React, Next.js and React Native, day in day out — Redux Toolkit for state, Framer Motion for motion, Tailwind and WordPress to finish.",
          },
          {
            label: "Right now",
            body: "Four years, three teams, now leading front-end — ready for a team that treats craft, speed, and detail as non-negotiable.",
          },
        ],
      },
      {
        title: "SMCloudMyle LLP",
        duration: "May 2026 — Present · Front-end Developer & Team Lead",
        items: [
          {
            label: "Lead",
            body: "Lead the front-end across web and mobile — I own the architecture, set the standards, and push the team to ship fast without breaking quality.",
          },
          {
            label: "Build",
            body: "Ship production features end to end in Next.js, React and React Native — one component system powering the flows users rely on every day.",
          },
          {
            label: "Performance",
            body: "Engineer for speed — high-90s Lighthouse on the web and buttery-smooth 60fps interactions in the React Native app.",
          },
        ],
      },
      {
        title: "Bizionic Technologies",
        duration: "Jul 2024 — Jan 2026 · Front-end Developer",
        items: [
          {
            label: "Built",
            body: "Shipped responsive web apps in React and Next.js — feature work and customer-facing pages running in production every day.",
          },
          {
            label: "Components",
            body: "Built a shared component library and patterns that cut delivery time and kept the whole product visually consistent.",
          },
          {
            label: "Quality",
            body: "Owned performance and accessibility — fast loads, near-zero layout shift, and interfaces that held up at every screen size.",
          },
        ],
      },
      {
        title: "ZAPS Marketing",
        duration: "Sep 2022 — May 2024 · Front-end Developer",
        items: [
          {
            label: "Built",
            body: "Turned Figma designs into clean, responsive websites and web apps in React and JavaScript — shipped straight to production.",
          },
          {
            label: "WordPress",
            body: "Built custom WordPress themes and Bootstrap layouts the content team could run and update without a developer.",
          },
          {
            label: "Growth",
            body: "Grew fast under real deadlines — from first tickets to owning full pages and features end to end.",
          },
        ],
      },
    ],
  },

  // Tech grid. `icon` is the filename slug of a real logo in /public/icons/
  // (official brand SVGs), rendered as a 3D sticker tile in components/Brands.jsx.
  brandsLabel: "Tech I work with",
  brands: [
    { name: "React", icon: "react" },
    { name: "Next.js", icon: "nextjs" },
    { name: "React Native", icon: "react-native" },
    { name: "Redux Toolkit", icon: "redux" },
    { name: "JavaScript", icon: "javascript" },
    { name: "WordPress", icon: "wordpress" },
    { name: "HTML5", icon: "html5" },
    { name: "CSS3", icon: "css3" },
    { name: "Tailwind", icon: "tailwind" },
    { name: "Bootstrap", icon: "bootstrap" },
    { name: "Framer Motion", icon: "framer" },
    { name: "Git", icon: "git" },
  ],

  services: [
    {
      title: "Interface Design",
      body: "Layout, type systems and component libraries built to scale without losing character.",
    },
    {
      title: "Motion",
      body: "Scroll choreography, page transitions and micro-interactions that carry meaning, not noise.",
    },
    {
      title: "Front-end",
      body: "React and Next.js builds — accessible, responsive, and fast on the devices people actually use.",
    },
  ],

  // ---------------------------------------------------------------------------
  // Case studies. Drop images into /public/work/ and point `image` at them.
  // Leave `image` empty and a tinted card stands in for it.
  // ---------------------------------------------------------------------------
  // Case studies. The sticky phone swaps its media as each one scrolls in.
  // Drop images in /public/work/ and point  at them.
  // Projects. The sticky phone swaps its media as each one scrolls in, and
  // links to href. `categories` is the stack you used, not a service label.
  work: [
    {
      title: "Fitness Tracking App",
      year: "2025",
      description:
        "A React Native app shipped to iOS and Android from one codebase. Offline-first — workouts, streaks and history all keep working with no signal, then reconcile the moment a connection comes back.",
      image: "/media/portavia-project-2.jpg",
      href: "#",
      tint: "#ededed",
      stats: [
        { value: "2", label: "Platforms" },
        { value: "1.4s", label: "Cold start" },
        { value: "4.7", label: "Store rating" },
        { value: "60fps", label: "Animations" },
      ],
      categories: ["React Native", "Expo", "JavaScript"],
    },
    {
      title: "E-commerce Storefront",
      year: "2025",
      description:
        "A fast React storefront with instant search, filtering and a cart that never blocks the UI. Built on a small component system so new pages ship from the same parts, and every interaction stays under a frame.",
      image: "/media/portavia-project-3.jpeg",
      href: "#",
      tint: "#e6e6e6",
      stats: [
        { value: "96", label: "Lighthouse" },
        { value: "0.8s", label: "LCP" },
        { value: "-45%", label: "Bounce rate" },
        { value: "120+", label: "Components" },
      ],
      categories: ["React", "JavaScript ES6", "Tailwind"],
    },
    {
      title: "Custom WordPress Site",
      year: "2024",
      description:
        "A content site on a custom theme with editor blocks the team could actually use. Rebuilt the front end so editors publish pages themselves — no developer needed — and every page loads in under a second.",
      image: "/media/portavia-project-4.jpeg",
      href: "#",
      tint: "#ededed",
      stats: [
        { value: "95", label: "Lighthouse" },
        { value: "-70%", label: "Page weight" },
        { value: "14", label: "Editor blocks" },
        { value: "0.9s", label: "LCP" },
      ],
      categories: ["WordPress", "JavaScript ES6", "Bootstrap"],
    },
  ],

  // ---------------------------------------------------------------------------
  // Testimonials carousel (td-noise style). Replace copy, names and images with
  // real ones. `image` is optional — leave it empty and a tinted initials card
  // stands in. Two short stats each, like the reference.
  // ---------------------------------------------------------------------------
  testimonialsLabel: "Testimonials",
  testimonials: [
    {
      quote:
        "In his time with us I never had to worry about the front-end once it was Sheikh's — he asked the right questions, caught issues early, and shipped clean work on time.",
      name: "Mohd Hussaini",
      role: "CEO · Bizionic Technologies",
      image: "/media/mohd-hussaini-ceo.webp",
      rating: 5,
      stats: [
        { value: "18 mo", label: "On the team" },
        { value: "100%", label: "On-time" },
      ],
    },
    {
      quote:
        "Sheikh joined us with little experience and within months became someone I leaned on. He learned fast and genuinely cared whether the work was good, not just done.",
      name: "Md Usman",
      role: "Manager · ZAPS Marketing",
      image: "/media/mdusman.jpg",
      rating: 5,
      stats: [
        { value: "20 mo", label: "On the team" },
        { value: "100%", label: "Reliable" },
      ],
    },
    {
      quote:
        "Sheikh took our rough ideas for ChessCurve and turned them into a polished, working product — and stayed with the tricky real-time parts until they actually felt right.",
      name: "Mr. Chandra",
      role: "Client · ChessCurve",
      image: "",
      rating: 5,
      stats: [
        { value: "100%", label: "Delivered" },
        { value: "Live", label: "In production" },
      ],
    },
  ],

  socials: [
    { label: "Email", href: "mailto:you@example.com" },
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    // Replace the number with your own (international format, no + or spaces).
    { label: "WhatsApp", href: "https://wa.me/1234567890" },
  ],

  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
};
