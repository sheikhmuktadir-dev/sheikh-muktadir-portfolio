// ---------------------------------------------------------------------------
// EDIT THIS FILE. Everything on the site reads from here.
// Replace the placeholder copy with your own — nothing else needs to change.
// ---------------------------------------------------------------------------

// Set your full name here — the banner wordmark and the preloader both derive
// their text from the FIRST name, so there is one place to change it.
const fullName = "Sheikh Muktadir";

export const site = {
  name: fullName,
  role: "Full-Stack Developer",
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
  headline: ["Full-stack developer", "open to full-time work"],

  // Short paragraph under the headline — the "why hire me" line. No filler
  // adjectives: years, stack, and the cities a recruiter filters on. Keep it
  // near ~106 characters so it holds three lines in the narrow column.
  intro:
    "4 years shipping React, Next.js, React Native and Node.js apps end to end — Hyderabad, Bangalore or remote.",

  // Image shown inside the sticky phone. Put a file in /public and point here,
  // e.g. "/hero.jpg". Leave empty for the placeholder.
  heroVisual: "/media/portavia-portrait.jpg",

  // Floating pills layered over the hero visual.
  // These are the recruiter 3-second scan, not a tech list (the intro and the
  // tech grid already cover the stack). Each one answers "why hire me":
  // seniority, breadth, ownership, craft. Pills 1 and 3 are the only two that
  // survive on phones, so they carry the two strongest signals.
  // Keep each one at or under ~16 characters so the pills stay the same
  // compact size as the reference ("React & Next.js" was the longest before).
  heroTags: [
    "4 Yrs Experience",
    "React & Next.js",
    "Full-Stack Lead",
    "Pixel-Perfect UI",
  ],

  // Primary action in the header. Drop your PDF at public/cv.pdf, or point
  // href anywhere. Setting download:true adds the download attribute so the
  // browser saves the file instead of opening it in a tab.
  cta: { label: "Download CV", href: "/cv.pdf", download: true },

  // Big statement block below the hero. First person, creative-developer
  // voice — motion and craft up front, performance as the ground note, closing
  // on the job hunt so it matches the banner. Keep near ~160 characters
  // (td-noise's is 163). The `.statement__text` max-width is a `ch` cap that
  // locks this to FOUR lines on every laptop and the big monitor alike, so the
  // length just needs to stay in that ballpark — much shorter and a line goes
  // thin, much longer and it spills to a fifth line.
  statement:
    "Give me a Figma file and a deadline — you get a pixel-exact web or mobile app that loads fast and ships on time. Four years in, and ready for the next team.",

  about: {
    heading: "Studio",
    body: [
      "I'm a full-stack developer with a front-end heart — the layer where design decisions become something you can actually touch.",
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
      "Four years building full-stack apps in React, Next.js, React Native and Node.js. Here's who I am and the teams I've done it with.",
    steps: [
      {
        title: "About me",
        duration: "Full-Stack Developer & Team Lead",
        items: [
          {
            label: "Who I am",
            body: "A full-stack developer who takes products from Figma to production — web and mobile, for ed-tech, healthcare and e-commerce — and keeps them fast once they are live.",
          },
          {
            label: "My stack",
            body: "React, Next.js and React Native on the front, Node.js, Express and MongoDB on the back — Redux Toolkit for state, Tailwind, Framer Motion and WordPress to finish.",
          },
          {
            label: "Right now",
            body: "Leading web and mobile at SMCloudMyle and looking for my next full-time role — a product team that treats speed, quality and ownership as non-negotiable.",
          },
        ],
      },
      {
        title: "SMCloudMyle LLP",
        duration: "May 2026 — Present · Full-Stack Developer & Team Lead",
        items: [
          {
            label: "Lead",
            body: "Lead development across web and mobile — I own the architecture, set the standards, and push the team to ship fast without breaking quality.",
          },
          {
            label: "Build",
            body: "Leading the build of ChessCurve — a live chess-coaching platform with real-time boards, video, chat, homework and in-browser Stockfish analysis in Next.js and Node.js.",
          },
          {
            label: "Performance",
            body: "Engineer for speed — high-90s Lighthouse on the web and steady 60fps interactions in React Native, measured, not guessed.",
          },
        ],
      },
      {
        title: "Bizionic Technologies",
        duration: "Jul 2024 — Jan 2026 · Front-end Developer",
        items: [
          {
            label: "Built",
            body: "Shipped customer-facing web apps in React and Next.js — new features and full pages taken from design to production, on time.",
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
  // 12 tiles = 6x2. Row 1 is the front-end a recruiter screens for, row 2 is
  // the MERN back end plus the motion/CSS tools that set the work apart.
  // No baseline tools (HTML, Git): nobody hires for them and they dilute the
  // grid. Only list what you can defend in an interview.
  brandsLabel: "Tech I work with",
  brands: [
    { name: "React", icon: "react" },
    { name: "Next.js", icon: "nextjs" },
    { name: "React Native", icon: "react-native" },
    { name: "JavaScript", icon: "javascript" },
    { name: "Redux Toolkit", icon: "redux" },
    { name: "Tailwind", icon: "tailwind" },
    { name: "Node.js", icon: "nodejs" },
    { name: "Express", icon: "express" },
    { name: "MongoDB", icon: "mongodb" },
    { name: "Framer Motion", icon: "framer" },
    { name: "Bootstrap", icon: "bootstrap" },
    { name: "WordPress", icon: "wordpress" },
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
      title: "ChessCurve",
      year: "2026",
      description:
        "A live chess-coaching platform. Coach and students share a real-time board with video, chat, homework and Stockfish 18 analysis running in the browser. I built the whole front end in Next.js on a Node.js and Socket.IO backend — from Figma to production.",
      image: "/media/portavia-project-1.jpeg",
      href: "#",
      tint: "#ededed",
      stats: [
        { value: "Live", label: "In production" },
        { value: "Real-time", label: "Board sync" },
        { value: "3", label: "User roles" },
        { value: "SF18", label: "Engine in-browser" },
      ],
      categories: ["Next.js", "Socket.IO", "Node.js"],
    },
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
  // Testimonials carousel (td-noise style). RULE: every quote must be words the
  // named person actually said or approved — these are real people a recruiter
  // may call. No invented percentages in stats; only facts (tenure, scope).
  // `image` is optional — leave it empty and a tinted initials card stands in.
  // ---------------------------------------------------------------------------
  testimonialsLabel: "Testimonials",
  testimonials: [
    {
      quote:
        "Sheikh ran our front-end for a year and a half. He asked the questions others missed, caught problems before clients did, and his pages just worked. I'd hire him again.",
      name: "Mohd Hussaini",
      role: "CEO · Bizionic Technologies",
      // Photo file kept at /media/mohd-hussaini-ceo.webp — restore this path
      // once he has said yes to it being on the site.
      image: "",
      rating: 5,
      stats: [
        { value: "18 mo", label: "Worked together" },
        { value: "Front-end", label: "Owned end to end" },
      ],
    },
    {
      quote:
        "He joined as a fresher, and within months I was handing him whole pages without checking behind him. Quick learner, and he cared that the work was right, not just done.",
      name: "Md Usman",
      role: "Manager · ZAPS Marketing",
      // Photo file kept at /media/mdusman.jpg — restore this path once he has
      // said yes to it being on the site.
      image: "",
      rating: 5,
      stats: [
        { value: "20 mo", label: "Worked together" },
        { value: "WordPress", label: "and React sites" },
      ],
    },
    {
      quote:
        "We gave Sheikh rough ideas and got back a working product. The live board, video, chat — he kept at the hard real-time parts until they actually felt right.",
      name: "Mr. Chandra",
      role: "Client · ChessCurve",
      image: "",
      rating: 5,
      stats: [
        { value: "Live", label: "In production" },
        { value: "Real-time", label: "Board, video, chat" },
      ],
    },
  ],

  // Footer "Get in touch" blurb — the last thing a recruiter reads before the
  // email link. Must agree with the hero: same role (full-stack), same
  // availability. Same length as the original so the column wraps the same.
  footerLead:
    "Available now for full-time full-stack roles across web and mobile. If you're hiring, let's talk.",

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
