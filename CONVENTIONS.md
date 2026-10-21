# lireons.com redesign: conventions

The Lireons company site (the SaaS page), not a tenant academy. Next.js 16 App Router, Tailwind v4, `motion/react`, lucide-react. Dev: `npx next dev -p 3100`.

## Products (Oct 2026)
Lireons sells three products only: **Academy** (LMS, courses, live classes, course sales), **Assessments** (proctored online tests with the AI proctor) and **AI Doubt Solver** (Coming soon). School ERP was dropped (Sarthak, 21 Oct 2026): no fees, attendance, admissions, transport or bus content, no School ERP links, renders or clips. K-12 schools stay an audience because they use Academy and Assessments. The shared record is the learner record.

## Direction
Swiss, functional minimalism with opinionated precision. Minimal cognitive load: one idea per section, left-aligned type on a 12-column grid, numbers only where they encode something real (product index 01–03). Continuous but quiet motion: every section has something alive (live product demos, marquee, audit log, footer wordmark) and it pauses off screen and stops under reduced motion.

## Tokens (app/globals.css)
- Colours: `paper` (page), `surface`, `surface-2`, `inset`, `ink`, `ink-2`, `ink-3`, `line`, `line-2`, `inverse`/`on-inverse`, `signal` (the one accent: primary CTA and "live" only), `ok`, `warn`. Never raw hex in components.
- Product hues, only inside product visuals and product markers: `academy`, `assess`, `ai` (+ `-soft`). `productColor[id]` / `productSoft[id]` in components/visuals/Frame.tsx.
- Type: Archivo (variable wght 100-900, wdth 62-125) for everything, JetBrains Mono only for data in diagrams. Contrast comes from size, weight and width, never a second family.
  - Scale tokens: `text-meta` 13, `text-ui` 15, `text-body` 17, `text-lead` 18-21, `text-h4` 20, `text-d3`, `text-d2`, `text-d1`, `text-mega`. Display tokens carry weight 560; don't add `font-semibold`.
  - Marketing copy never goes below 13px. 11-12px only inside product UI mock-ups.
  - `.marker` is the section marker (ink, small square, sentence case). `.label` is the small grey caption for field names inside product UI and data. `.figure` is the wide light tabular style for big numbers used as focal points. `.num` for tabular figures.
- Visuals over text: each section has one focal point (a big figure, a live visual or the heading), one lead line, and items as icon + short title. Longer explanations are disclosed on hover, focus or tap, not printed as paragraphs.
- Layout: `.wrap` container (82rem). Section rhythm `py-20 md:py-28`. Section intro pattern: `grid md:grid-cols-12` with `.marker` in `md:col-span-3` and the heading in `md:col-span-9`.
- Radii: see "Premium pass rules" below (10px controls, full pills, 16px panels, 28px frames).

## Components
- `ButtonLink` / `Button` (components/ui/Button.tsx): variants `signal | ink | outline | ghost`, sizes `sm | md | lg`. Labels roll as one block on hover. `media="/clips/<id>.mp4"` opens a looping product clip in a preview card above the button on hover (clips: academy, assess, ai). `icon` slides through on hover. `children` must be a plain string.
- `UnderlineLink` for text links.
- Product visuals (components/visuals/*Visual.tsx): live, looping demos with `compact` prop for interactive widgets. Since Oct 2026 the site also uses real imagery (Sarthak): high-fidelity Lireons UI renders from `app/shot-src` via `components/ui/Shot.tsx` (public/shots, light and dark), and licensed Unsplash photos of Indian institutions in public/photos (credited in public/photos/CREDITS.md). No generic stock clichés, no implied customers or endorsements.
- `Frame` for any product window. `LiveDot`, `Initials`, `inr()`.
- `useLoop(count, interval)` drives loops and pauses off screen; `useTick` for live counters.
- Data in lib/products.ts (`products`, `audiences`, `integrations`, `faqs`).

## Rules
- Anti-slop: no em dashes in copy, no "It's not X, it's Y", no emojis, no sparkle icons, no glow orbs, no gradients beyond functional fades, no fake testimonials or customer logos, no ALL-CAPS eyebrows, no `→` on every link, no 3-identical-card rows.
- Copy: specific, outcome-led, Indian context (₹, UPI, WhatsApp, Class 10 B, JEE batches). Hidden tests and answer keys (`isCorrect`) are never shown to learners. Names and figures in demos are illustrative and say so where it matters.
- Every interactive element has hover, focus-visible and active states; hit targets ≥ 40px; skeletons for anything that loads.
- Motion: ease-out `[0.23,1,0.32,1]`, 150–500ms, transform/opacity only, `AnimatePresence` for swaps, `layoutId` for moving highlights.

## Premium pass rules (Oct 2026)
- Buttons: only `Button` / `ButtonLink` from components/ui/Button.tsx. Filled and outline buttons carry the neo-brutalist edge (1.5px `border-edge` + hard offset shadow that lifts on hover, presses flat on click). Ghost buttons for low-emphasis actions only.
- Segmented controls and pill toggles: selected item uses `.seg-on` (surface + hard edge), `rounded-full`, h-10 minimum. Animate the selected fill with a `layoutId`.
- Radius scale: controls 10px (`rounded-[10px]`), pills `rounded-full`, cards and panels 16px (`rounded-2xl`), showcase frames 28px (`.frame`). Nothing else.
- Showcase frame: every product demo sits in `.frame` (hard edge, 6px offset shadow) on its product's soft colour with the 32px grid, like the home product story.
- Glass (`.glass`) only for things that float over colour: the hero stage, menus, the scrolled header.
- Dark band: `bg-slab text-on-slab` (stays dark in both themes). Never `bg-inverse` for a section.
- Section rhythm: `py-20 md:py-28` per section; page heroes `pt-28 md:pt-32`.
- Closing CTA: `frame bg-signal text-on-signal`, same on every page.
- AI Doubt Solver status label is "Coming soon" everywhere; "Join the waitlist" is only an action.
- Tap targets 44px on touch where possible, never under 40px.

## Shaders and button hover (Oct 2026, Sarthak's request)
- Premium backgrounds come from Paper Shaders (`@paper-design/shaders-react`, Apache-2.0) through `components/ui/Shader.tsx` only: `MeshField` (hero and product frames, `follow` leans toward the cursor), `SignalField` (red CTA band), `DitherField` (slab band), `ThinkingOrb` (AI working state, non-compact visuals only). Each follows the theme, pauses off screen and holds still under reduced motion. Keep to about four WebGL canvases per page.
- Button hover: the label rolls as one block (never letter by letter), outline buttons invert solid, and `media` clips open in an edged preview card above the button (`mediaSide="below"` near the top edge). Nothing animates inside the label box.
