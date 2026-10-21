import type { NextConfig } from "next";

// allowedDevOrigins lets phones on the same Wi-Fi load the dev server (npm run lan:dev).
const config: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  agentRules: false,
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", ...Array.from({ length: 16 }, (_, i) => `172.${16 + i}.*.*`), "*.local"],
};
export default config;
