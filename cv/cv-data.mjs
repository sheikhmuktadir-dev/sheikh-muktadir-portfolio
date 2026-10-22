// ---------------------------------------------------------------------------
// THE CV. Every fact on the PDF comes from this file — edit here, then run
//
//     npm run cv
//
// which rebuilds public/cv.pdf (served by the site's "Download CV") and
// cv/Sheikh-Muktadir-CV.tex (same content in the original LaTeX template,
// for Overleaf). Style = Sheikh's own LaTeX CV — don't restyle it.
//
// SOURCE OF TRUTH = THE PORTFOLIO (data/site.js): same title, companies,
// dates and real projects. The earlier LaTeX CV was only a DEMO template —
// nothing from it (Pencap, Naresh i mentorship, its dates) is a real fact.
// Only list what you can defend in an interview — no TypeScript/GraphQL/Sass,
// no invented numbers. Aim for ONE page; two is the hard limit.
// Use "--" for date ranges.
// ---------------------------------------------------------------------------

export const cv = {
  name: "Sheikh Muktadir",
  headline: "Front-End Developer & Team Lead | React.js | Next.js | React Native | 4+ Years",

  contact: {
    email: "sheikhmuktadir.dev@gmail.com",
    phone: "+91 8093668843",
    location: "Hyderabad, India",
    availability: "Open to full-time roles",
  },

  links: [
    { label: "Portfolio", href: "https://sheikh-muktadir-portfolio-nu.vercel.app/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sheikhmuktadir-dev/" },
    { label: "GitHub", href: "https://github.com/sheikhmuktadir-dev" },
  ],

  summary:
    "Front-End Developer with 4+ years shipping fast, pixel-perfect React.js, Next.js and React Native applications straight from Figma. Team Lead at SMCloudMyle, leading the front end of ChessCurve, a live chess-coaching platform with real-time boards, video and chat. Strong in reusable component architecture, Redux Toolkit, REST API integration and performance; Claude Code and MCP in the daily workflow. Based in Hyderabad, open to full-time front-end roles.",

  skills: [
    ["Frontend", "React.js, Next.js, React Native, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Bootstrap"],
    ["State & Routing", "Redux Toolkit, Context API, Custom Hooks, React Hook Form, React Router (Dynamic, Nested, Protected)"],
    ["API Integration", "REST APIs, Axios, Fetch API, CRUD Operations, JWT Authentication, Socket.IO (Real-time)"],
    ["Tools", "Git, GitHub, Vercel, Postman, Vite, Chrome DevTools, Figma, WordPress, Claude Code, Codex, MCP"],
    ["Concepts", "Reusable Component Architecture, Performance Optimization, Code Splitting, Lazy Loading, Responsive Design"],
  ],

  // Same three roles, titles and dates as the portfolio's About & Experience.
  experience: [
    {
      role: "Front-End Developer & Team Lead",
      company: "SMCloudMyle LLP",
      location: "Hyderabad, India",
      dates: "May 2026 -- Present",
      bullets: [
        "Lead the front end across web (Next.js, React.js) and mobile (React Native); own the component architecture and UI standards.",
        "Set the UI standards and release pace so the team ships from Figma hand-off to production without breaking quality.",
        "ChessCurve: live chess-coaching platform with coach, student and admin portals, built from Figma (see Key Projects).",
        "Built for speed: in-browser Stockfish 18, live board sync over Socket.IO, smooth screens with video and chat open.",
      ],
    },
    {
      role: "Front-End Developer",
      company: "Bizionic Technologies",
      location: "Hyderabad, India",
      dates: "Jul 2024 -- Jan 2026",
      bullets: [
        "Shipped customer-facing web apps in React.js and Next.js, taking new features and full pages from Figma to production.",
        "Built the shared component library the team worked from, so every page looked and behaved the same.",
        "Managed application state with Redux Toolkit and integrated REST APIs with consistent loading, error and empty states.",
        "Owned the front end from first commit to release: fast loads, solid layouts at every size, bugs caught before clients did.",
      ],
    },
    {
      role: "Front-End Developer",
      company: "ZAPS Group",
      location: "Hyderabad, India",
      dates: "Sep 2022 -- May 2024",
      bullets: [
        "Turned Figma designs into clean, responsive websites and web apps in React and JavaScript, on fixed client deadlines.",
        "Built custom WordPress themes and Bootstrap layouts the content team could run and update without a developer.",
        "Rebuilt the storefront, product and checkout pages of the ActivPower IRx online store on WordPress (see Key Projects).",
        "Joined as a fresher and within months was trusted with whole pages, from first tickets to owning features end to end.",
      ],
    },
  ],

  // The portfolio's REAL projects. ChessCurve = SMCloudMyle; ActivPower IRx = ZAPS Group. The portfolio's other two cards are demo
  // placeholders (owner replacing them ~late Nov 2026) — when a real project replaces one, add it here too.
  projects: [
    {
      name: "ChessCurve -- Live Chess-Coaching Platform",
      tech: "Next.js, React.js, Socket.IO, chess.js, Stockfish (in-browser)",
      live: "https://classroom.chesscurve.com/",
      bullets: [
        "Production coaching platform with coach, student, and admin portals, built in Next.js from Figma designs.",
        "Built the real-time shared chessboard: moves sync instantly over Socket.IO, alongside live video and chat.",
        "Integrated the Stockfish 18 chess engine in the browser for live evaluation and best-move analysis.",
        "Built the homework module: puzzles, game analysis and theory, with submissions, coach review and feedback.",
      ],
    },
    {
      name: "ActivPower IRx -- Online Store (WordPress)",
      tech: "WordPress, Bootstrap, JavaScript, HTML5, CSS3",
      live: "https://activpowerirx.com/",
      bullets: [
        "Rebuilt the storefront, product pages, and checkout of a live store from static designs, mobile-first and pixel-perfect.",
        "Kept every cart, pricing, and subscription flow working across two sister brand sites: 14 pages and 8 products.",
      ],
    },
  ],

  // Not on the portfolio, so not on the CV. Add an entry here only if real.
  mentorship: [],

  education: {
    degree: "Bachelor of Technology -- Computer Science and Engineering",
    school: "Gandhi Institute for Education and Technology (GIET), Bhubaneswar",
    dates: "2016 -- 2020",
  },
};
