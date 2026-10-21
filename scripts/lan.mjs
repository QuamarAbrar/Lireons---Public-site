// Serves the site to every device on the same Wi-Fi.
//   npm run lan        production build, then serve (smooth on phones)
//   npm run lan:dev    dev server with live reload
//   npm run lan -- rebuild | --port 4000
import { networkInterfaces } from "node:os";
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const arg = process.argv.indexOf("--port");
const port = String(arg > -1 ? process.argv[arg + 1] : process.env.PORT || "3100").trim();
const dev = process.argv.includes("dev");
const bin = process.platform === "win32" ? "npx.cmd" : "npx";
const opts = { stdio: "inherit", shell: process.platform === "win32" };

const isPrivate = (ip) => /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip);
const ips = Object.values(networkInterfaces())
  .flat()
  .filter((a) => a && a.family === "IPv4" && !a.internal)
  .map((a) => a.address)
  .sort((a, b) => isPrivate(b) - isPrivate(a));

// Rebuild whenever the source differs from what was last built (a content
// hash, not timestamps), so unzipping a new version over an old folder never
// serves the old site.
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]));
}
const hash = createHash("sha1");
for (const f of [...["app", "components", "lib", "public"].filter(existsSync).flatMap(files), "package.json", "next.config.ts"].filter(existsSync).sort()) {
  hash.update(f).update(readFileSync(f));
}
const digest = hash.digest("hex");
const stamp = ".next/lireons-source";
const stale = !existsSync(".next/BUILD_ID") || !existsSync(stamp) || readFileSync(stamp, "utf8") !== digest;

if (!dev && (stale || process.argv.includes("rebuild"))) {
  console.log("\nBuilding the site once. This takes a minute.\n");
  const b = spawnSync(bin, ["next", "build"], opts);
  if (b.status !== 0) process.exit(b.status ?? 1);
  writeFileSync(stamp, digest);
}

console.log("\n  Lireons is running.\n");
console.log(`  On this computer:   http://localhost:${port}`);
for (const ip of ips) console.log(`  On your Wi-Fi:      http://${ip}:${port}`);
if (!ips.length) console.log("  No network address found. Is Wi-Fi connected?");
console.log("\n  Open the Wi-Fi address on a phone or laptop connected to the same network.");
console.log("  Press Ctrl+C to stop.\n");

const child = spawn(bin, ["next", dev ? "dev" : "start", "-H", "0.0.0.0", "-p", port], opts);
child.on("exit", (code) => process.exit(code ?? 0));
for (const s of ["SIGINT", "SIGTERM"]) process.on(s, () => child.kill(s));
