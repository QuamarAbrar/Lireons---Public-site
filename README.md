<div align="center">

# Lireons — Public Web Platform

**The modern learning, assessment, and intelligence operating system for education.**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.1-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Motion](https://img.shields.io/badge/Motion-14.4.0-f0047f?style=for-the-badge)](https://motion.dev/)

[Explore the Platform](https://lireons.com) · [Design Conventions](CONVENTIONS.md) · [Report Issue](https://github.com/QuamarAbrar/Lireons---Public-site/issues)

</div>

---

## ✦ About Lireons

**Lireons** is a high-performance, design-first SaaS platform engineered to modernize learning academies, K-12 institutions, and competitive test-prep organizations. Built on a unified learner record, Lireons brings learning management, high-stakes proctored evaluations, and real-time AI academic support into a coherent, responsive ecosystem.

This repository hosts the official marketing and public web platform for **[lireons.com](https://lireons.com)**, crafted with Swiss-inspired functional minimalism, low cognitive load, tactile micro-interactions, and real-time interactive product previews.

---

## ✦ Core Products

| # | Product | Description | Status |
|---|---------|-------------|--------|
| **01** | **Academy** | Next-generation LMS for running modern institutions: modular curriculum design, interactive assignments, live batch scheduling, video delivery, and integrated checkout (INR / UPI / Cards). | Live |
| **02** | **Assessments** | Resilient online examination engine with automated AI proctoring, face verification, active tab-switch detection, audio anomaly tracking, and deep candidate analytics. | Live |
| **03** | **AI Doubt Solver** | 24/7 intelligent academic assistant providing curriculum-aligned, step-by-step doubt resolution and conceptual breakdowns. | Coming Soon |

---

## ✦ Architecture & Technology Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, React Server Components, standalone output)
- **UI Runtime:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with custom design token system (`globals.css`)
- **Animation & Transitions:** [Motion 14](https://motion.dev/) (`motion/react`) with spring physics, hardware-accelerated transforms, and `prefers-reduced-motion` compliance
- **Shaders & Visuals:** WebGL background fields via `@paper-design/shaders-react` (MeshField, DitherField, SignalField)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Typography:** Archivo (Variable 100–900, Width 62–125) and JetBrains Mono for tabular and code data
- **Type Safety:** TypeScript 5.9 with strict mode

---

## ✦ Design & Engineering Principles

Detailed design system rules and copy standards are documented in [CONVENTIONS.md](CONVENTIONS.md).

- **Swiss Functional Minimalism:** 12-column responsive grid, left-aligned typography, high contrast hierarchies, and purposeful color accents.
- **Strict Token Architecture:** Pure semantic color tokens (`paper`, `surface`, `signal`, `ink`, `line`, etc.) with zero arbitrary hex values in components.
- **Tactile Neo-Brutalist Affordances:** Defined control borders with offset elevation shadows that lift on hover and flatten on press.
- **Continuous Subtle Motion:** Ambient looping product visuals, interactive widgets, marquee elements, and button video clip previews that automatically pause off-screen.
- **Localized Context:** Built-in support for Indian institutional workflows (₹ INR, UPI checkout, Class 10/12 batches, JEE/NEET exam formats).

---

## ✦ Project Structure

```text
lireons-com/
├── app/
│   ├── (auth)/             # Authentication entry routes
│   ├── (site)/             # Main marketing routes
│   │   ├── demo/           # Interactive product walkthroughs
│   │   ├── platform/       # Architecture & infrastructure details
│   │   ├── pricing/        # Transparent tier pricing & calculators
│   │   ├── products/       # Academy, Assessments, and AI product pages
│   │   ├── solutions/      # Audience-focused solutions (Institutes, Schools)
│   │   ├── layout.tsx      # Root site shell (Nav, Banner, Footer)
│   │   └── page.tsx        # Homepage
│   ├── clip-src/           # Loop clips and video sources
│   ├── shot-src/           # High-resolution platform render sources
│   ├── globals.css         # Design tokens, theme variables & utilities
│   └── layout.tsx          # Root HTML layout and font loading
├── components/
│   ├── home/               # Hero, product story, audience, and proof sections
│   ├── product/            # Product-specific features & capability grids
│   ├── site/               # Header, Footer, MobileNav, AnnouncementBar
│   ├── ui/                 # Buttons, Badges, Modals, SegmentedControls, Shaders
│   └── visuals/            # Interactive live product UI preview components
├── lib/
│   ├── products.ts         # Central product catalog, FAQs, and integrations
│   └── utils.ts            # Formatting utilities (INR currency, classnames)
├── public/
│   ├── clips/              # Looping product preview clips (MP4)
│   ├── photos/             # Licensed campus photography (Unsplash)
│   └── shots/              # High-fidelity UI renders (light/dark)
├── scripts/
│   └── lan.mjs             # Zero-config multi-device LAN testing runner
└── CONVENTIONS.md          # Architectural rules & design specifications
```

---

## ✦ Getting Started

### Prerequisites

- **Node.js**: Version `20.9.0` or newer (`node -v` to verify)
- **Package Manager**: `npm` (bundled with Node)

### Installation

Clone the repository and install dependencies using clean install:

```bash
git clone https://github.com/QuamarAbrar/Lireons---Public-site.git
cd Lireons---Public-site
npm ci
```

### Development Server

Run the development server locally on port 3100:

```bash
npm run dev
```

Open [http://localhost:3100](http://localhost:3100) in your browser.

---

## ✦ Multi-Device Network Testing (LAN)

The project includes a built-in LAN runner (`scripts/lan.mjs`) to test the website simultaneously on phones, tablets, and laptops connected to your local Wi-Fi:

```bash
# Builds once, then serves to all devices on your Wi-Fi
npm run lan

# Or edit with live reload (Fast Refresh across devices)
npm run lan:dev
```

The terminal will print your network addresses:
```text
On this computer:   http://localhost:3100
On your Wi-Fi:      http://192.168.1.X:3100
```

### LAN Troubleshooting
- **Custom Port:** Run `npm run lan -- --port 4000` to bind to an alternate port.
- **Firewall:** Ensure Node.js is allowed on **Private networks** (Windows Security or macOS Network Firewall).
- **Network Isolation:** Guest and enterprise Wi-Fi networks often enable client isolation. Use a personal home network or a mobile hotspot if devices cannot communicate.

---

## ✦ Available Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `next dev -p 3100` | Starts the local development server |
| `build` | `next build` | Compiles optimized production bundle |
| `start` | `next start -p 3100` | Runs the production build locally |
| `lan` | `node scripts/lan.mjs` | Serves production build over Wi-Fi for multi-device testing |
| `lan:dev` | `node scripts/lan.mjs dev` | Runs development server over Wi-Fi |
| `typecheck` | `tsc --noEmit` | Runs full TypeScript type check |

---

## ✦ License & Credits

- Platform design & engineering by the **Lireons** team.
- Real campus photography credited in [`public/photos/CREDITS.md`](public/photos/CREDITS.md).
- Proprietary software. All rights reserved.
