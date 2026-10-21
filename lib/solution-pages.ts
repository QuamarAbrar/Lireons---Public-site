import { audiences, type ProductId } from "./products";

export type DayIcon = "check" | "message" | "shield" | "grade" | "doubt" | "video" | "live" | "cart" | "code" | "award" | "calendar" | "users";

export type DayEvent = { time: string; p: ProductId; icon: DayIcon; text: string; patch?: Record<string, string> };

export type SolutionPage = {
  id: string;
  title: string;
  description: string;
  headline: string;
  sub: string;
  /** the subject of the day-in-the-life stage */
  subject: { name: string; mono: string; line: string; label: string };
  fields: { k: string; v: string }[];
  day: { start: number; end: number; ticks: string[] };
  events: DayEvent[];
  /** what this institution needs, and which product covers it */
  needs: { t: string; b: string; p: ProductId[] }[];
  closing: { title: string; body: string };
};

const m = (t: string) => {
  const [h, mm] = t.split(":").map(Number);
  return h * 60 + mm;
};
export const minutes = m;

export const solutionPages: Record<string, SolutionPage> = {
  schools: {
    id: "schools",
    title: "For K-12 schools",
    description: "Lireons for K-12 schools: unit tests and term exams online with an AI proctor, recorded lessons and remedial live classes, results the same day and doubt solving after school.",
    headline: "Lessons, tests and results on one record for every class.",
    sub: "Teachers publish lessons and run remedial classes online, unit tests run proctored in the computer lab or at home, results reach students the same day, and doubts get answered after school.",
    subject: { name: "Class 10 B", line: "Brightpath School · 38 students · Class teacher N. Rao", mono: "10B", label: "A school day for Class 10 B" },
    fields: [
      { k: "Right now", v: "Before school" },
      { k: "Lesson 6", v: "Draft" },
      { k: "Unit test 3", v: "Scheduled" },
      { k: "Live class", v: "Scheduled 16:00" },
      { k: "Doubts", v: "0 today" },
    ],
    day: { start: m("06:30"), end: m("22:30"), ticks: ["06:30", "10:30", "14:30", "18:30", "22:30"] },
    events: [
      { time: "07:30", p: "academy", icon: "video", text: "Lesson 6, “Light: reflection”, published to Class 10 B", patch: { "Right now": "Before school", "Lesson 6": "Published" } },
      { time: "07:35", p: "assess", icon: "message", text: "Unit test 3 reminder sent to 38 students on WhatsApp" },
      { time: "09:10", p: "academy", icon: "check", text: "31 of 38 students finished Lesson 6", patch: { "Right now": "Period 2", "Lesson 6": "31/38 done" } },
      { time: "11:40", p: "assess", icon: "shield", text: "Unit test 3 started in the computer lab, proctored", patch: { "Right now": "Unit test", "Unit test 3": "In progress" } },
      { time: "12:25", p: "assess", icon: "grade", text: "Unit test 3 graded, class average 71%", patch: { "Unit test 3": "Avg 71%" } },
      { time: "16:00", p: "academy", icon: "live", text: "Remedial live class on mirrors, 22 students joined", patch: { "Right now": "After school", "Live class": "Live now" } },
      { time: "17:05", p: "academy", icon: "video", text: "Remedial class recording added to Lesson 6", patch: { "Live class": "Recorded" } },
      { time: "21:40", p: "ai", icon: "doubt", text: "14 doubts answered, 2 handed to teachers", patch: { "Right now": "Evening study", Doubts: "14 answered" } },
    ],
    needs: [
      { t: "Lessons and remedial classes", b: "Teachers publish recorded lessons and run live catch-up classes. Recordings land in the course.", p: ["academy"] },
      { t: "Unit tests and term exams online", b: "MCQ, written and coding questions, proctored in the lab or at home, with a reviewer on every flag.", p: ["assess"] },
      { t: "Results the same day", b: "Auto-graded sections score instantly, written answers are marked against a rubric, and students see section scores.", p: ["assess"] },
      { t: "Practice that counts", b: "Quizzes and assignments inside each lesson, drawn from the same question bank as the tests.", p: ["academy", "assess"] },
      { t: "Help after school hours", b: "Students ask doubts at night and get answers from your own notes. Coming soon.", p: ["ai"] },
    ],
    closing: { title: "See your school on Lireons.", body: "Bring a class list and one unit test paper. We will load them in and walk through a school day with you." },
  },
  coaching: {
    id: "coaching",
    title: "For coaching centres",
    description: "Lireons for coaching centres: recorded and live lectures, course sales over UPI, weekly proctored mock tests with batch ranks and doubt solving after hours.",
    headline: "Lectures, Sunday mocks and ranks without the spreadsheets.",
    sub: "Teach live and keep the recording, sell crash courses on your own storefront, run proctored mocks every week with batch ranks, and let students clear doubts after the centre closes.",
    subject: { name: "JEE 2027 · Batch A", line: "Kota Road centre · 64 students · Physics, Chemistry, Maths", mono: "JA", label: "A weekday for Batch A" },
    fields: [
      { k: "Right now", v: "Centre closed" },
      { k: "Lecture 14", v: "Scheduled 17:00" },
      { k: "Mock 6 results", v: "Grading" },
      { k: "Sunday mock", v: "Not set" },
      { k: "Doubts", v: "0 today" },
    ],
    day: { start: m("08:00"), end: m("23:30"), ticks: ["08:00", "12:00", "16:00", "20:00", "23:30"] },
    events: [
      { time: "09:00", p: "assess", icon: "grade", text: "Mock 6 results out, batch ranks published", patch: { "Right now": "Office hours", "Mock 6 results": "Published" } },
      { time: "11:40", p: "academy", icon: "cart", text: "5 students bought the Physics crash course via UPI" },
      { time: "15:30", p: "academy", icon: "video", text: "Yesterday’s lecture added to Unit 6 recordings" },
      { time: "16:50", p: "academy", icon: "message", text: "Lecture 14 reminder sent to 64 students", patch: { "Right now": "In class" } },
      { time: "17:00", p: "academy", icon: "live", text: "Lecture 14 live, 3 students joining from home", patch: { "Lecture 14": "Live now" } },
      { time: "19:10", p: "academy", icon: "video", text: "Lecture 14 recording published", patch: { "Right now": "Self-study", "Lecture 14": "Recorded" } },
      { time: "19:30", p: "assess", icon: "calendar", text: "Sunday mock set for 64 candidates, proctored", patch: { "Sunday mock": "Sun 09:00, proctored" } },
      { time: "22:15", p: "ai", icon: "doubt", text: "Doubt on torque answered from Lecture 14", patch: { "Right now": "Late study", Doubts: "9 answered" } },
    ],
    needs: [
      { t: "Recorded and live lectures", b: "Teach live in the centre and online at once. The recording lands in the course afterwards.", p: ["academy"] },
      { t: "Crash courses and test series for sale", b: "Sell courses and test series on your own storefront with UPI checkout and an invoice for every purchase.", p: ["academy"] },
      { t: "Weekly proctored mock tests", b: "Build a mock once, run it every Sunday, and review every AI flag before results go out.", p: ["assess"] },
      { t: "Batch ranks and section scores", b: "Every mock ends in section scores, a batch rank and the questions most students got wrong.", p: ["assess"] },
      { t: "Doubt solving after hours", b: "Students ask at night and get answers from your own lectures and notes. Coming soon.", p: ["ai"] },
    ],
    closing: { title: "Run your next batch on Lireons.", body: "Bring one batch’s timetable and a past mock paper. We will set it up live during the demo, including a sample Sunday mock." },
  },
  academies: {
    id: "academies",
    title: "For online academies",
    description: "Lireons for online academies: a branded storefront on your domain, cohorts and live classes, coding practice, proctored assessments, verifiable certificates and payments.",
    headline: "Run a course business under your own name.",
    sub: "A storefront on your domain, cohorts with live classes, graded coding practice, proctored final assessments and certificates anyone can verify. Payments settle through Razorpay.",
    subject: { name: "Full-stack web · Cohort 4", line: "learn.codecraft.in · 142 learners · 24 weeks", mono: "C4", label: "A day for Cohort 4" },
    fields: [
      { k: "Right now", v: "Morning" },
      { k: "Enrolled", v: "142" },
      { k: "Sales today", v: "₹0" },
      { k: "Week 18 live class", v: "Scheduled 18:00" },
      { k: "Certificates", v: "0 issued" },
    ],
    day: { start: m("08:00"), end: m("23:30"), ticks: ["08:00", "12:00", "16:00", "20:00", "23:30"] },
    events: [
      { time: "08:10", p: "academy", icon: "cart", text: "New enrolment on learn.codecraft.in, paid via UPI", patch: { Enrolled: "143", "Sales today": "₹24,999" } },
      { time: "10:00", p: "academy", icon: "calendar", text: "Week 18 lessons released to Cohort 4" },
      { time: "13:30", p: "academy", icon: "code", text: "42 coding submissions run against hidden tests", patch: { "Right now": "Practice" } },
      { time: "18:00", p: "academy", icon: "live", text: "Live class with 118 learners, recording saved", patch: { "Right now": "Live class", "Week 18 live class": "Recorded" } },
      { time: "19:45", p: "assess", icon: "shield", text: "Final assessment proctored, 2 flags for review", patch: { "Right now": "Final assessment" } },
      { time: "20:30", p: "assess", icon: "users", text: "Reviewer cleared both flags with notes" },
      { time: "21:00", p: "academy", icon: "award", text: "17 certificates issued with verification links", patch: { Certificates: "17 issued" } },
      { time: "23:05", p: "ai", icon: "doubt", text: "Doubt on async functions answered from Lesson 22", patch: { "Right now": "Late study", "Sales today": "₹49,998" } },
    ],
    needs: [
      { t: "A storefront on your own domain", b: "Your logo, colours and checkout. Lireons stays in the footer.", p: ["academy"] },
      { t: "Cohorts and live classes", b: "Release lessons on a schedule, teach live and keep every recording in the course.", p: ["academy"] },
      { t: "Coding practice and certificates", b: "Problems with hidden tests, proctored final assessments and certificates with a public verification page.", p: ["academy", "assess"] },
      { t: "Payments and invoices", b: "UPI, cards and netbanking through Razorpay, with an invoice for every purchase.", p: ["academy"] },
      { t: "Answers between live classes", b: "Learners ask doubts any time and get answers cited from your lessons. Coming soon.", p: ["ai"] },
    ],
    closing: { title: "Launch your storefront on Lireons.", body: "We will set up a sample storefront in your colours during the demo, with one of your courses loaded in." },
  },
};

export const solutionIds = audiences.map((a) => a.id);
