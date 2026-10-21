/**
 * Product screenshot catalogue, shared by the Shot component and the capture route.
 * Images live at /shots/<id>-light.webp and /shots/<id>-dark.webp, captured by scripts/shots.mjs
 * (desktop 1600x1000 at 2x, phone 390x844 at 3x). Names and figures in every screen are illustrative.
 */
export const shotMeta = {
  "home-app": { w: 1600, h: 1000, alt: "Lireons app: Academy, Assessments and AI Doubt Solver in one sidebar, with Aarav Mehta's learner record showing course progress, live classes, mock results and a live activity rail" },
  "platform-record": { w: 1600, h: 1000, alt: "A learner record on the Academy tab with enrolled courses, live class history, certificates and an audit rail of who touched the record" },
  "security-admin": { w: 1600, h: 1000, alt: "Security console: append-only audit log, roles for Academy and Assessments, backup health, active sessions and a typed confirmation to delete a learner's data" },
  "academy-storefront": { w: 1600, h: 1000, alt: "BrightPath Academy's own storefront on academy.brightpath.in with a course grid and a live batch" },
  "academy-builder": { w: 1600, h: 1000, alt: "Academy course builder: curriculum, a video lesson with chapter markers, lesson notes and a live class with a masked stream key" },
  "academy-player": { w: 1600, h: 1000, alt: "BrightPath Academy lesson player on its own domain with chapters, timestamped notes and a live class starting soon" },
  "academy-live": { w: 1600, h: 1000, alt: "Academy live class host view: the teacher's stream, a raised-hand queue, a live poll and the class chat for JEE Physics Batch A" },
  "assess-review": { w: 1600, h: 1000, alt: "Assessments proctor review: candidate webcam grid, an AI flag with its evidence clip, session signal lanes and the reviewer's decision with an audit note" },
  "assess-builder": { w: 1600, h: 1000, alt: "Assessments test builder with MCQ, written and coding sections, test cases hidden from candidates and proctoring settings" },
  "ai-student": { w: 1600, h: 1000, alt: "AI Doubt Solver preview: a student's photographed quadratic answered step by step with a cited lesson timestamp and a confidence meter" },
  "ai-teacher": { w: 1600, h: 1000, alt: "AI Doubt Solver preview, teacher view: the week's doubts by chapter, doubts handed to the teacher and AI answers to spot-check" },
  "phone-parent-home": { w: 390, h: 844, alt: "Learner app home for Aarav: course progress, the next live class, an upcoming mock test and a recently answered doubt" },
  "phone-student-results": { w: 390, h: 844, alt: "Mock test result on a phone: total score, section scores for Physics, Chemistry and Maths, and rank in the batch" },
  "phone-live-class": { w: 390, h: 844, alt: "Live class reminder on a phone: JEE Physics Batch A starts in 10 minutes, with a Join class button and the teacher's name" },
  "phone-course-purchase": { w: 390, h: 844, alt: "Buying a BrightPath Academy course on a phone: course summary, UPI payment confirmed and the receipt" },
  "phone-student-lesson": { w: 390, h: 844, alt: "Student lesson player on the BrightPath Academy app: Friction on an incline, course 58% complete" },
  "phone-candidate-check": { w: 390, h: 844, alt: "Candidate device check before a proctored test: camera, microphone, screen share and connection all ticked" },
  "phone-student-doubt": { w: 390, h: 844, alt: "AI Doubt Solver preview on a phone: a photographed quadratic, a cited answer with confidence, a teacher hand-off and a follow-up being answered" },
} as const;

export type ShotId = keyof typeof shotMeta;
export const isPhone = (id: ShotId) => shotMeta[id].w < 600;
