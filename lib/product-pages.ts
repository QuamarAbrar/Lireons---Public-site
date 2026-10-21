import { products, type Product, type ProductId } from "./products";

/**
 * Extra copy for the /products/[slug] pages. Kept apart from lib/products.ts
 * so the shared product data stays small; everything here is page-only.
 */
export type ProductPageData = {
  id: ProductId;
  /** meta description */
  description: string;
  sub: string;
  /** heading for the step-by-step walkthrough */
  walk: string;
  cta: { label: string; href: string };
  modules: Record<string, string>;
  /** what passes between this product and each of the others */
  shares: Partial<Record<ProductId, string>>;
  faqs: { q: string; a: string }[];
  closing: { title: string; body: string };
};

export const slugOf = (p: Product) => p.href.split("/").pop()!;
export const productBySlug = (slug: string) => products.find((p) => slugOf(p) === slug);

export const productPages: Record<ProductId, ProductPageData> = {
  academy: {
    id: "academy",
    description: "Run a branded course platform on your own domain: recorded lessons, live classes, coding practice, quizzes, verifiable certificates and payments.",
    sub: "A course platform on your own domain for coaching centres, teachers and online academies. Recorded lessons, live classes, graded practice, certificates and payments, all under your name.",
    walk: "From the storefront to the certificate.",
    cta: { label: "Book a demo", href: "/demo?products=academy" },
    modules: {
      Courses: "Units, lessons, notes and resources, with scheduled release and progress per student.",
      "Live classes": "Stream from the browser or OBS with chat and polls. Recordings are added to the course when the class ends.",
      "Coding problems": "Problems with hidden test cases, run and graded in the browser with per-language limits.",
      Quizzes: "Timed quizzes with instant scoring and explanations after submission.",
      Certificates: "Issued on completion, each with its own public verification page.",
      Community: "Discussion threads per course, moderated by your teachers.",
      Payments: "Checkout on your domain with UPI, cards and netbanking through Razorpay, and an invoice for every purchase.",
    },
    shares: {
      assess: "Course quizzes and proctored tests use the same question bank and the same candidate list.",
      ai: "The doubt solver answers from the lessons and notes you publish here, and cites the exact lesson.",
    },
    faqs: [
      { q: "Can we use our own domain?", a: "Yes. Point a domain or subdomain such as learn.yourname.in at Lireons. Your logo and colours apply to the storefront, the checkout and the emails students receive." },
      { q: "Do teachers need streaming software?", a: "No. Teachers can go live from the browser. OBS Studio is supported for anyone who wants scenes, a second camera or a pen tablet." },
      { q: "Who owns the students and the content?", a: "You do. Students sign up on your storefront, and you can export your student list and your course content whenever you want." },
      { q: "Which languages do coding problems support?", a: "Each problem sets its own languages and time and memory limits. We will share the current list of supported languages during your demo." },
    ],
    closing: { title: "Put your courses under your own name.", body: "We will set up a sample storefront in your colours during the demo, with one of your courses loaded in." },
  },
  assess: {
    id: "assess",
    description: "Online tests with MCQ, written and coding questions, an AI proctor that records its evidence, and human reviewers who make the final call.",
    sub: "Build tests from MCQs, written answers and coding problems. Candidates sit them in a locked browser, the AI proctor records what it sees, and your reviewers make the final call.",
    walk: "From the question paper to the result.",
    cta: { label: "Book a demo", href: "/demo?products=assess" },
    modules: {
      "Test builder": "Sections, timers, negative marking and randomised question order.",
      "Question bank": "Questions tagged by subject, chapter and difficulty, reusable across tests.",
      "AI proctor": "Face, tab, voice and device signals on a timeline for every candidate.",
      "Review queue": "Each AI flag with its evidence, waiting for a person to clear or uphold it.",
      Results: "Auto-graded sections score instantly. Written answers are marked against a rubric.",
      "Candidate portal": "System check, instructions, the test and the result in one place.",
    },
    shares: {
      academy: "Proctored tests can sit inside a course, and course quizzes draw on the same question bank.",
      ai: "Topics students get wrong in tests sit next to the topics they ask the most doubts about.",
    },
    faqs: [
      { q: "What does the AI proctor check?", a: "Signals such as a second face, the candidate leaving the frame, tab switches, voices in the room and a second device. Each signal sits on the session timeline with the clip or screenshot it came from." },
      { q: "Can the AI fail a candidate on its own?", a: "No. A flag is a suggestion with evidence. A reviewer clears or upholds it, nothing is final until a person signs off, and every decision is recorded in the audit log." },
      { q: "What do candidates need?", a: "A computer with a webcam, a microphone and a current browser. A system check before the test confirms the camera, microphone and connection." },
      { q: "Can we run tests without proctoring?", a: "Yes. Proctoring is switched on per test, so weekly practice can run open while term exams and mocks run proctored." },
    ],
    closing: { title: "Run your next mock test on Lireons.", body: "Bring a question paper to the demo. We will build it as a proctored test and walk you through the review queue." },
  },
  ai: {
    id: "ai",
    description: "The AI Doubt Solver, coming soon: students ask in text or photos and get step-by-step answers from your own lessons and notes, with the source shown and a teacher hand-off.",
    sub: "Coming soon. Students ask in text or send a photo, and the assistant answers step by step from your own lessons and notes, with the source shown. When it is unsure, a teacher takes over.",
    walk: "From the doubt to the teacher’s desk.",
    cta: { label: "Join the waitlist", href: "/demo?products=ai" },
    modules: {
      "Text and photo doubts": "Students type a question or photograph a handwritten problem, on any device.",
      "Cited answers": "Every answer links to the lesson, page or video timestamp it came from.",
      "Teacher hand-off": "Doubts the assistant is unsure about go to the subject teacher with the student's attempt attached.",
      "Topic insights": "Doubt counts by chapter and topic, so teachers can see what to teach again.",
    },
    shares: {
      academy: "Answers are drawn from the courses, lessons and notes you have published in Academy.",
      assess: "Topics with the most doubts sit next to the topics with the lowest test scores.",
    },
    faqs: [
      { q: "Can we use the Doubt Solver now?", a: "Not yet. Join the waitlist and we will tell you when it opens." },
      { q: "Where do the answers come from?", a: "From the material you give it: your lessons, notes and video transcripts. Every answer shows its source. If it cannot find one, it does not answer and passes the doubt to a teacher." },
      { q: "What happens when the assistant is not sure?", a: "The doubt goes to the subject teacher with the question, the photo and the student's attempt attached. The teacher's reply reaches the student in the same thread." },
      { q: "Can teachers see what students ask?", a: "Yes. Teachers see doubts grouped by chapter and topic, and can read any conversation from their own sections." },
    ],
    closing: { title: "Be early for the Doubt Solver.", body: "It is coming soon. Join the waitlist and tell us which classes you would start with." },
  },
};
