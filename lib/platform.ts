import type { ProductId } from "./products";

/** Sections of the shared learner record, and which product writes each. */
export const recordSections: { k: string; v: string; p: ProductId }[] = [
  { k: "Batch and enrolments", v: "Aarav Mehta · JEE 2027, Batch A", p: "academy" },
  { k: "Courses and progress", v: "Physics, Unit 3 · 62%", p: "academy" },
  { k: "Live classes", v: "11 of 12 attended · next Thu 17:00", p: "academy" },
  { k: "Purchases", v: "Physics crash course · ₹4,999 · invoice #4471", p: "academy" },
  { k: "Tests and proctor decisions", v: "Mock 7 · 78 / 100 · no flags", p: "assess" },
  { k: "Results and rank", v: "Batch rank 9 of 64", p: "assess" },
  { k: "Doubts", v: "3 this week · quadratics", p: "ai" },
];

export const recordWrites: Record<ProductId, { what: string; time: string }> = {
  academy: { what: "Finished “Friction on an incline”", time: "16:10" },
  assess: { what: "Scored 78 / 100 on Mock 7, no flags", time: "20:17" },
  ai: { what: "Asked a doubt on quadratics, answered", time: "22:48" },
};

export type Access = "full" | "own" | "none";
export const roles = [
  { id: "owner", name: "Owner", scope: "Everything, including deletes" },
  { id: "admin", name: "Admin", scope: "Day-to-day setup across products" },
  { id: "teacher", name: "Teacher", scope: "Their own batches and courses" },
  { id: "reviewer", name: "Reviewer", scope: "Proctor flags for assigned tests" },
  { id: "parent", name: "Parent", scope: "Their own children only" },
  { id: "student", name: "Student", scope: "Their own record only" },
] as const;
export type RoleId = (typeof roles)[number]["id"];

const row = (f: Partial<Record<RoleId, Access>>): Record<RoleId, Access> => ({ owner: "none", admin: "none", teacher: "none", reviewer: "none", parent: "none", student: "none", ...f });

export const permissions: { t: string; p: ProductId; own?: string; access: Record<RoleId, Access> }[] = [
  { t: "View learner profiles", p: "academy", own: "Scoped to their batches, candidates or children", access: row({ owner: "full", admin: "full", teacher: "own", reviewer: "own", parent: "own", student: "own" }) },
  { t: "Set course prices", p: "academy", access: row({ owner: "full", admin: "full" }) },
  { t: "Issue a refund", p: "academy", access: row({ owner: "full" }) },
  { t: "Buy a course", p: "academy", own: "For themselves or their own children", access: row({ owner: "full", parent: "own", student: "own" }) },
  { t: "Publish lessons", p: "academy", own: "In courses they teach", access: row({ owner: "full", admin: "full", teacher: "own" }) },
  { t: "Host a live class", p: "academy", own: "For their own batches", access: row({ owner: "full", admin: "full", teacher: "own" }) },
  { t: "Build and schedule tests", p: "assess", own: "For their own batches", access: row({ owner: "full", admin: "full", teacher: "own" }) },
  { t: "Enter marks", p: "assess", own: "For their own batches", access: row({ owner: "full", admin: "full", teacher: "own" }) },
  { t: "Clear or uphold proctor flags", p: "assess", own: "For tests assigned to them", access: row({ owner: "full", reviewer: "own" }) },
  { t: "See test results", p: "assess", own: "Their own batches, children or attempts", access: row({ owner: "full", admin: "full", teacher: "own", parent: "own", student: "own" }) },
  { t: "Read doubt conversations", p: "ai", own: "Teachers: their batches. Students: their own", access: row({ owner: "full", teacher: "own", student: "own" }) },
  { t: "Delete records", p: "academy", access: row({ owner: "full" }) },
  { t: "Read the audit log", p: "academy", access: row({ owner: "full", admin: "full" }) },
];

export const auditLog: { who: string; role: string; what: string; p: ProductId }[] = [
  { who: "P. Kaur", role: "Admin", what: "Changed Physics crash course price to ₹4,999", p: "academy" },
  { who: "M. Verma", role: "Reviewer", what: "Cleared proctor flag on Aisha Khan, Mock 7", p: "assess" },
  { who: "N. Kulkarni", role: "Teacher", what: "Published lesson “Friction on an incline”", p: "academy" },
  { who: "AI assistant", role: "System", what: "Handed a doubt to N. Kulkarni, confidence 0.41", p: "ai" },
  { who: "S. Iyer", role: "Teacher", what: "Scheduled live class Lecture 15 for Thu 17:00", p: "academy" },
  { who: "N. Rao", role: "Teacher", what: "Edited Unit test 3 marks for roll 14", p: "assess" },
  { who: "Admin", role: "Owner", what: "Typed DELETE to remove batch 2023-B", p: "academy" },
  { who: "P. Kaur", role: "Admin", what: "Enrolled Batch A into Physics, Unit 3", p: "academy" },
  { who: "Admin", role: "Owner", what: "Refunded ₹4,999 to Kabir Singh", p: "academy" },
  { who: "AI assistant", role: "System", what: "Answered 14 doubts, cited 11 lessons", p: "ai" },
];

export const integrationDetails: Record<string, { cat: string; use: string; p: ProductId[] }> = {
  Razorpay: { cat: "Payments", use: "Course payments by UPI, cards and netbanking, matched to the learner with an invoice.", p: ["academy"] },
  UPI: { cat: "Payments", use: "Payment links and QR codes at checkout.", p: ["academy"] },
  "WhatsApp Business": { cat: "Messaging", use: "Class reminders, purchase receipts, test schedules and results.", p: ["academy", "assess"] },
  "Google Workspace": { cat: "Sign-in", use: "Teacher and student sign-in with existing accounts.", p: ["academy", "assess", "ai"] },
  "Microsoft 365": { cat: "Sign-in", use: "Teacher and student sign-in with existing accounts.", p: ["academy", "assess", "ai"] },
  Zoom: { cat: "Live classes", use: "Run a class on Zoom and keep the recording in the course.", p: ["academy"] },
  "YouTube Live": { cat: "Live classes", use: "Stream a class and keep it inside the course.", p: ["academy"] },
  "OBS Studio": { cat: "Live classes", use: "Stream with scenes, a second camera or a pen tablet.", p: ["academy"] },
  "SMS gateways": { cat: "Messaging", use: "Reminders and one-time passwords for learners not on WhatsApp.", p: ["academy", "assess"] },
};
