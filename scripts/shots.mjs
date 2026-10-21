// Captures the product screenshots rendered at /shot-src/<id> into public/shots/<id>-<theme>.webp.
// usage: node scripts/shots.mjs [id ...]   (dev server on :3100, or BASE=http://host:port)
// Desktop screens render at deviceScaleFactor 2, phones at 3, in light and dark; WebP via sharp.
import { chromium } from "/home/user/lireons-site/node_modules/playwright/index.mjs";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public/shots");
const BASE = process.env.BASE || "http://localhost:3100";

// sizes come from components/shots/meta.ts: desktop 1600x1000, phones 390x844
const desktop = [
  "home-app", "platform-record", "security-admin",
  "academy-storefront", "academy-builder", "academy-player", "academy-live",
  "assess-review", "assess-builder",
  "ai-student", "ai-teacher",
];
const phone = [
  "phone-parent-home", "phone-student-results", "phone-live-class", "phone-course-purchase",
  "phone-student-lesson", "phone-candidate-check", "phone-student-doubt",
];
const all = Object.fromEntries([...desktop.map((id) => [id, { w: 1600, h: 1000, dsf: 2 }]), ...phone.map((id) => [id, { w: 390, h: 844, dsf: 3 }])]);

const args = process.argv.slice(2);
const ids = args.length ? args : Object.keys(all);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });

for (const theme of ["light", "dark"]) {
  const pages = {};
  const pageFor = async (dsf) => {
    if (pages[dsf]) return pages[dsf];
    const ctx = await browser.newContext({ deviceScaleFactor: dsf, colorScheme: theme, reducedMotion: "reduce", viewport: { width: 1600, height: 1000 } });
    const p = await ctx.newPage();
    p.on("pageerror", (e) => console.log("  pageerror", e.message));
    return (pages[dsf] = p);
  };
  for (const id of ids) {
    const s = all[id];
    if (!s) { console.log("unknown id", id); continue; }
    const page = await pageFor(s.dsf);
    await page.setViewportSize({ width: s.w, height: s.h });
    await page.goto(`${BASE}/shot-src/${id}?theme=${theme}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const png = await page.locator("#shot").screenshot({ type: "png", animations: "disabled" });
    const webp = await sharp(png).webp({ quality: s.dsf === 3 ? 82 : 80, effort: 6, smartSubsample: true }).toBuffer();
    await writeFile(path.join(out, `${id}-${theme}.webp`), webp);
    console.log(`${id}-${theme}.webp  ${s.w * s.dsf}x${s.h * s.dsf}  ${(webp.length / 1024).toFixed(0)} KB`);
  }
  for (const p of Object.values(pages)) await p.context().close();
}
await browser.close();
