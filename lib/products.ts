export type ProductId = "academy" | "assess" | "ai";

export type Product = {
  id: ProductId;
  index: string;
  name: string;
  href: string;
  /** one line for menus */
  short: string;
  /** three or four words for compact indexes */
  tag: string;
  /** headline for the product's scroll chapter and page */
  headline: string;
  body: string;
  points: { title: string; body: string }[];
  modules: string[];
  status?: "Coming soon";
  clip: string;
};

export const products: Product[] = [
  {
    id: "academy",
    index: "01",
    name: "Academy",
    tag: "Courses and live classes",
    href: "/products/academy",
    short: "Your own branded course platform with live classes",
    headline: "Sell courses under your own name, not a marketplace's.",
    body: "A complete learning platform on your domain, in your colours. Recorded lessons, live classes, coding practice, quizzes and certificates, with payments and a community built in.",
    points: [
      { title: "Your brand, your domain", body: "Every academy gets its own storefront, logo, colours and checkout. Lireons stays in the footer." },
      { title: "Live and recorded", body: "Stream from OBS or the browser into a classroom with chat and polls. Recordings land in the course automatically." },
      { title: "Graded practice", body: "Quizzes, assignments and coding problems with hidden tests, so practice counts for something." },
      { title: "Certificates that verify", body: "Each certificate has a public verification page, so employers can check it in one click." },
    ],
    modules: ["Courses", "Live classes", "Coding problems", "Quizzes", "Certificates", "Community", "Payments"],
    clip: "/clips/academy.mp4",
  },
  {
    id: "assess",
    index: "02",
    name: "Assessments",
    tag: "Proctored online tests",
    href: "/products/assessments",
    short: "Online tests with an AI proctor you can audit",
    headline: "Run exams online and trust the results.",
    body: "Build a test from MCQs, written answers and coding problems. Candidates take it in a locked browser while the AI proctor watches for the signals that matter, and every flag comes with the evidence.",
    points: [
      { title: "Any question type", body: "MCQ, multi-select, written and coding questions with hidden test cases and per-language limits." },
      { title: "AI proctor with evidence", body: "Face, tab, voice and device signals on a timeline. Every flag links to the moment it happened." },
      { title: "A human makes the call", body: "Reviewers clear or uphold each AI decision. Nothing is final until a person signs off." },
      { title: "Results the same day", body: "Auto-graded sections score instantly. Written answers queue for markers with a rubric." },
    ],
    modules: ["Test builder", "Question bank", "AI proctor", "Review queue", "Results", "Candidate portal"],
    clip: "/clips/assess.mp4",
  },
  {
    id: "ai",
    index: "03",
    name: "AI Doubt Solver",
    tag: "Answers from your notes",
    href: "/products/ai-doubt-solver",
    short: "Answers students' doubts from your own material",
    headline: "A tutor that answers at 11 pm, from your own notes.",
    body: "Students type a question or photograph a problem. The assistant answers step by step using your lessons and notes, shows where the answer came from, and hands off to a teacher when it is unsure.",
    points: [
      { title: "Grounded in your material", body: "Answers cite the lesson, page or video timestamp they came from. No source, no answer." },
      { title: "Photo to solution", body: "Snap a handwritten problem. The assistant reads it and walks through the working, one step at a time." },
      { title: "Knows when to stop", body: "Low-confidence doubts go to the subject teacher with the student's attempt attached." },
      { title: "Shows what is confusing", body: "Teachers see which topics generate the most doubts, chapter by chapter." },
    ],
    modules: ["Text and photo doubts", "Cited answers", "Teacher hand-off", "Topic insights"],
    status: "Coming soon",
    clip: "/clips/ai.mp4",
  },
];

export const audiences = [
  {
    id: "schools",
    name: "K-12 schools",
    preset: "K-12 school",
    line: "Lessons, unit tests and term exams, marked the same day.",
    uses: ["academy", "assess", "ai"] as ProductId[],
    detail: ["Unit tests and term exams online", "Proctored computer-lab tests", "Recorded lessons and remedial classes", "Results the same day"],
  },
  {
    id: "coaching",
    name: "Coaching centres",
    preset: "Coaching centre",
    line: "Batches, lectures and weekly tests without the spreadsheets.",
    uses: ["academy", "assess", "ai"] as ProductId[],
    detail: ["Recorded and live lectures", "Weekly proctored mock tests", "Batch ranks and section scores", "Doubt solving after hours"],
  },
  {
    id: "academies",
    name: "Online academies",
    preset: "Online academy",
    line: "Your own course business, branded end to end.",
    uses: ["academy", "assess", "ai"] as ProductId[],
    detail: ["Storefront on your domain", "Cohorts and live classes", "Coding practice and certificates", "Payments and invoices"],
  },
];

/** The home strip: specific tools only, each with what it syncs to the learner record. */
export const integrationSync: { name: string; cat: "Payments" | "Messaging" | "Accounts" | "Live classes"; sync: string }[] = [
  { name: "Razorpay", cat: "Payments", sync: "Course purchases and invoices sync to the record" },
  { name: "UPI", cat: "Payments", sync: "Checkout payments unlock the course at once" },
  { name: "WhatsApp Business", cat: "Messaging", sync: "Class reminders and test results reach learners" },
  { name: "Google Workspace", cat: "Accounts", sync: "Teachers and students sign in with existing accounts" },
  { name: "Microsoft 365", cat: "Accounts", sync: "Sign-in with the accounts you already manage" },
  { name: "Zoom", cat: "Live classes", sync: "Who joined each class lands on the record" },
  { name: "YouTube Live", cat: "Live classes", sync: "Large classes stream inside the course" },
  { name: "OBS Studio", cat: "Live classes", sync: "Broadcast into a classroom with a stream key" },
];

export const integrations = ["Razorpay", "UPI", "WhatsApp Business", "Google Workspace", "Microsoft 365", "Zoom", "YouTube Live", "OBS Studio", "SMS gateways"];

export const faqs: { q: string; v: string; a: string }[] = [
  { q: "Do we have to buy every product?", v: "No.", a: "Start with the one you need most, such as a course platform or proctored tests, and add the other later. Everything shares the same learner records, so nothing has to be re-entered." },
  { q: "How long does it take to move from our current system?", v: "Usually a week.", a: "Most institutions import students, batches, courses and question banks from spreadsheets or their previous platform in the first week. Our team does the first import with you." },
  { q: "Can students use it on their phones?", v: "Yes.", a: "Students watch lessons, join live classes, buy courses and see their test results on any device. Class reminders and results can arrive on WhatsApp. Proctored tests need a computer with a webcam." },
  { q: "Who sees the AI proctor's decisions?", v: "Only your reviewers.", a: "Each flag shows the evidence it is based on, and a person clears or upholds it before any result is final." },
  { q: "Where is our data stored?", v: "Isolated per institution.", a: "Every tenant is walled off from every other. Ask us for our security overview and data processing terms during your demo." },
  { q: "When is the AI Doubt Solver available?", v: "Coming soon.", a: "It is not generally available yet. Join the waitlist on the demo page and we will tell you when it opens." },
];
