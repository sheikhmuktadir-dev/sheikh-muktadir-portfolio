# Sheikh Muktadir — Portfolio

Personal portfolio site built with Next.js (App Router).

**Live:** deployed on Vercel

## Stack

- [Next.js 15](https://nextjs.org) — App Router, React 19
- [Framer Motion](https://www.framer.com/motion/) — animation
- [Lenis](https://lenis.darkroom.engineering/) — smooth scrolling
- Plain CSS (no framework)

## Getting started

```bash
npm install
npm run dev
```

Runs on [http://localhost:3007](http://localhost:3007).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server on port 3007 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build on port 3007 |

## Structure

```
app/          App Router entry (layout, page, styles)
components/   UI sections (Hero, Process, Testimonials, …)
components/fx/  Animation layer (cursor, preloader, counters, sheen)
data/site.js  Single source of truth for all site content
lib/          Helpers
public/       Static assets (icons, media, work)
```

Content is data-driven — edit `data/site.js` to change copy, projects, and links
without touching component code.

## Deployment

Deployed on [Vercel](https://vercel.com). Pushes to `main` deploy automatically;
no environment variables or build configuration are required.
