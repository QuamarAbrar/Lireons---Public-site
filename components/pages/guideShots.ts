import type { ShotId } from "@/components/shots/meta";
import type { Region } from "@/components/pages/ShotCrop";

/**
 * The screen each guide teaches, as a crop of the matching product render.
 * Guides with no matching render (spreadsheet import, certificates, roles) are left
 * out and keep their drawn glimpse.
 */
export const guideShots: Record<string, { id: ShotId; region: Region }> = {
  "publish-your-first-course": { id: "academy-builder", region: [0.16, 0.04, 0.56, 0.6] },
  "go-live-from-obs-or-the-browser": { id: "academy-live", region: [0.16, 0.06, 0.6, 0.6] },
  "connect-your-own-domain-to-your-academy": { id: "academy-storefront", region: [0, 0, 0.62, 0.5] },
  "build-a-test-from-your-question-bank": { id: "assess-builder", region: [0.16, 0.06, 0.56, 0.6] },
  "review-and-clear-proctor-flags": { id: "assess-review", region: [0.5, 0.06, 0.5, 0.62] },
  "check-your-device-before-a-proctored-test": { id: "phone-candidate-check", region: [0, 0.03, 1, 0.55] },
  "sell-a-course-with-upi-checkout": { id: "phone-course-purchase", region: [0, 0.03, 1, 0.55] },
  "join-a-live-class-from-your-phone": { id: "phone-live-class", region: [0, 0.03, 1, 0.55] },
  "see-your-childs-test-results": { id: "phone-student-results", region: [0, 0.03, 1, 0.55] },
  "read-and-export-the-audit-log": { id: "security-admin", region: [0.16, 0.08, 0.56, 0.6] },
};
