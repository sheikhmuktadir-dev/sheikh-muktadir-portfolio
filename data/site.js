// ---------------------------------------------------------------------------
// EDIT THIS FILE. Everything on the site reads from here.
// Replace the placeholder copy with your own — nothing else needs to change.
// ---------------------------------------------------------------------------

// Set your full name here — the banner wordmark and the preloader both derive
// their text from the FIRST name, so there is one place to change it.
const fullName = "Sheikh Muktadir";

export const site = {
  name: fullName,
  role: "Front-End Developer",
  location: "Hyderabad, IN",
  timezone: "Asia/Kolkata",
  email: "sheikhmuktadir.dev@gmail.com",

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

  // Short paragraph under the headline — the "why hire me" line. No filler
  // adjectives: years, stack, and the cities a recruiter filters on. Keep it
  // near ~106 characters so it holds three lines in the narrow column.
  intro:
    "4+ years turning Figma into fast, pixel-perfect React, Next.js and React Native apps — based in Hyderabad.",

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
    "4+ Yrs Front-End",
    "Pixel-Perfect UI",
    "Immediate Joiner",
    "React & Next.js",
  ],

  // Primary action in the header. Drop your PDF at public/cv.pdf, or point
  // href anywhere. Setting download:true adds the download attribute so the
  // browser saves the file instead of opening it in a tab.
  // `download` is the filename the browser saves it as. The PDF itself is
  // generated from these same facts — regenerate it whenever the copy here
  // changes so the site and the CV never disagree.
  cta: {
    label: "Download CV",
    href: "/cv.pdf",
    download: "Sheikh-Muktadir-Front-End-Developer-CV.pdf",
  },

  // Big statement block below the hero. First person, creative-developer
  // voice — motion and craft up front, performance as the ground note, closing
  // on the job hunt so it matches the banner. Keep near ~160 characters
  // (td-noise's is 163). The `.statement__text` max-width is a `ch` cap that
  // locks this to FOUR lines on every laptop and the big monitor alike, so the
  // length just needs to stay in that ballpark — much shorter and a line goes
  // thin, much longer and it spills to a fifth line.
  statement:
    "Give me a Figma file and a deadline — I'll ship a pixel-exact, fast front end in React, Next.js or React Native, on time. 4+ years of proof. Ready for my next team.",

  // About & Experience — a pinned numeral that rolls as each entry takes the
  // view. Step 01 is about me; 02–04 are previous roles.
  // NOTE: the company names, dates and bullet copy below are placeholders —
  // replace them with your real employers, dates and responsibilities.
  process: {
    label: "About me",
    heading: "A bit about me and where I've worked",
    intro:
      "4+ years building fast, pixel-exact front ends in React, Next.js and React Native. Here's who I am and the teams I've done it with.",
    steps: [
      {
        title: "About me",
        duration: "Front-End Developer & Team Lead",
        items: [
          {
            label: "Who I am",
            body: "A B.Tech CSE graduate (2020) and front-end developer who takes products from Figma to production — web in React and Next.js, mobile in React Native.",
          },
          {
            label: "My stack",
            body: "React, Next.js and React Native at the core — Redux Toolkit for state, Tailwind and Bootstrap for layout, WordPress for content sites. Figma in, pixel-exact UI out.",
          },
          {
            label: "Right now",
            body: "Leading web and mobile at SMCloudMyle and ready for my next full-time front-end role in Hyderabad — immediate joiner, no notice period to serve.",
          },
        ],
      },
      {
        title: "SMCloudMyle LLP",
        duration: "May 2026 — Present · Front-End Developer & Team Lead",
        items: [
          {
            label: "Lead",
            body: "Lead the front end across web and mobile — I own the component architecture, set the UI standards, and keep the team shipping fast without breaking quality.",
          },
          {
            label: "Build",
            body: "Leading ChessCurve's front end — a live chess-coaching platform with real-time boards, video, chat, homework and Stockfish analysis, built in Next.js from Figma.",
          },
          {
            label: "Performance",
            body: "Engineer for speed — Stockfish 18 running in the browser, board moves synced live over Socket.IO, and screens that stay smooth with video and chat open.",
          },
        ],
      },
      {
        title: "Bizionic Technologies",
        duration: "Jul 2024 — Jan 2026 · Front-End Developer",
        items: [
          {
            label: "Built",
            body: "Shipped customer-facing web apps in React and Next.js for a year and a half — new features and full pages taken from Figma to production, on time.",
          },
          {
            label: "Components",
            body: "Built the shared component library the team worked from — one set of buttons, forms and layouts, so every page looked and behaved the same.",
          },
          {
            label: "Quality",
            body: "Owned the front end end to end — fast loads, layouts that held at every screen size, and problems caught before clients ever saw them.",
          },
        ],
      },
      {
        title: "ZAPS Group",
        duration: "Sep 2022 — May 2024 · Front-End Developer",
        items: [
          {
            label: "Built",
            body: "Turned Figma designs into clean, responsive websites and web apps in React and JavaScript — shipped straight to production for real clients on real deadlines.",
          },
          {
            label: "WordPress",
            body: "Built custom WordPress themes and Bootstrap layouts the content team could run and update on their own — no developer needed for a new page.",
          },
          {
            label: "Growth",
            body: "Joined as a fresher and within months was trusted with whole pages unsupervised — from first tickets to owning features end to end.",
          },
        ],
      },
    ],
  },

  // Tech grid. `icon` is the filename slug of a real logo in /public/icons/
  // (official brand SVGs), rendered as a 3D sticker tile in components/Brands.jsx.
  // 12 tiles = 6x2. Row 1 is the front-end framework stack a recruiter screens
  // for, row 2 is the foundation + styling/motion/CMS tools. FRONT-END ONLY —
  // no Node/Express/MongoDB: this is a front-end portfolio and every tile must
  // survive an interview question. No TypeScript/GraphQL/Sass either.
  brandsLabel: "Tech I work with",
  brands: [
    { name: "React", icon: "react" },
    { name: "Next.js", icon: "nextjs" },
    { name: "React Native", icon: "react-native" },
    { name: "JavaScript", icon: "javascript" },
    { name: "Redux Toolkit", icon: "redux" },
    { name: "Tailwind", icon: "tailwind" },
    { name: "HTML5", icon: "html5" },
    { name: "CSS3", icon: "css3" },
    { name: "Bootstrap", icon: "bootstrap" },
    { name: "Figma", icon: "figma" },
    { name: "WordPress", icon: "wordpress" },
    { name: "Git", icon: "git" },
  ],

  // ---------------------------------------------------------------------------
  // Projects. ChessCurve and ActivPower IRx are real (and are the CV's Key
  // Projects in cv/cv-data.mjs). Fitness Tracking App and E-commerce
  // Storefront are DEMO placeholders the owner will replace with real projects
  // — keep them, and add each real one to the CV too when it lands.
  // ---------------------------------------------------------------------------
  // The sticky phone swaps its media as each one scrolls in.
  // Clicking the phone, the cover or "View project" opens the preview modal
  // (components/ProjectModal.jsx): `gallery` screens + a "Visit live site"
  // button for http(s) `href`s. `categories` is the stack you used.
  work: [
    {
      title: "ChessCurve",
      year: "2026",
      description:
        "A live chess-coaching platform. Coach and students share a real-time board with video, chat, homework and Stockfish 18 analysis running in the browser. I lead the front end — every screen built in Next.js from Figma, synced live over Socket.IO.",
      // 3x captures of the local coach app at iPhone size (390x844 → 1170x2532
      // webp, 2026-10-22), with an iPhone status bar baked in: a real puzzle
      // submission review (hw 390 "Double Check", replay at the last move;
      // scrollbar painted out) and the Board Editor on a dark spotlight.
      image: "/media/chesscurve-review.webp",
      // Screens shown in the preview modal (phone-shaped, ~0.46 ratio). First
      // one should match `image`. Add more real screens here as you get them.
      gallery: [
        { src: "/media/chesscurve-review.webp", label: "Puzzle review", statusBar: true },
        { src: "/media/chesscurve-board-cinematic.webp", label: "Board editor", statusBar: true },
      ],
      href: "https://classroom.chesscurve.com/",
      tint: "#ededed",
      stats: [
        { value: "Live", label: "In production" },
        { value: "Real-time", label: "Board sync" },
        { value: "3", label: "Portals" },
        { value: "SF18", label: "Engine in-browser" },
      ],
      categories: ["Next.js", "React", "Socket.IO"],
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
      title: "ActivPower IRx",
      // Built at ZAPS Group (Sep 2022 – May 2024).
      year: "2024",
      description:
        "An online supplements store on WordPress. I rebuilt the storefront, product pages and checkout from static designs into the live theme — mobile-first, pixel-exact, every cart and subscription hook still working. Shipped for IRx and its sister brand, Canis.",
      // Cinematic capture of the live home hero at iPhone size (390x844 @3x →
      // 1170x2532 webp, 2026-10-22): iPhone status bar on top (so the device
      // notch clears the header), hero stretched to full screen, intro
      // paragraph + shipping bar hidden, darker grade.
      image: "/media/activpower-irx-cinematic.webp",
      gallery: [
        { src: "/media/activpower-irx-cinematic.webp", label: "Home", statusBar: true },
        // Same cinematic treatment on /shop/human/ (status bar, darker banner,
        // shop section on a dark spotlight).
        { src: "/media/gallery/activpower-shop-cinematic.webp", label: "Shop · Human products", statusBar: true },
      ],
      href: "https://activpowerirx.com/",
      tint: "#ededed",
      // Facts only: page count and product count are from the site build.
      stats: [
        { value: "Live", label: "Online store" },
        { value: "14", label: "Pages built" },
        { value: "8", label: "Products" },
        { value: "2", label: "Brand sites" },
      ],
      categories: ["WordPress", "JavaScript", "CSS3"],
    },
  ],

  // Footer "Get in touch" blurb — the last thing a recruiter reads before the
  // email link. Must agree with the hero: same role (front-end), same
  // availability. Same length as the original so the column wraps the same.
  footerLead:
    "Hiring a front-end developer in Hyderabad? I can join immediately — React, Next.js and React Native. Let's talk.",

  socials: [
    { label: "Email", href: "mailto:sheikhmuktadir.dev@gmail.com" },
    { label: "GitHub", href: "https://github.com/sheikhmuktadir-dev/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sheikhmuktadir-dev/" },
    // WhatsApp removed 2026-10-21 (no number supplied). To add it back:
    // { label: "WhatsApp", href: "https://wa.me/91XXXXXXXXXX" } — international
    // format, no + or spaces.
  ],

  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
};
