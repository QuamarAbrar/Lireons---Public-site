import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const sans = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap", axes: ["wdth"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lireons.com"),
  title: { default: "Lireons: teach, test and answer on one record", template: "%s | Lireons" },
  description:
    "Courses, live classes, proctored online tests and an AI doubt solver on one record per learner. Built in India for K-12 schools, coaching centres and online academies.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#16181c" },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh">
        <Script id="theme" strategy="beforeInteractive">{themeScript}</Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
