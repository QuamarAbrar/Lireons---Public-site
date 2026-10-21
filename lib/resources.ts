import type { ProductId } from "./products";

/**
 * Help-centre guides and blog posts for /resources. Body copy is stored as
 * blocks so the article page can build its contents list from the headings.
 * Inline `**text**` renders as strong (used for screen and button names).
 */
export type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "steps"; items: string[] }
  | { type: "note"; text: string };

export type Audience = "Admins" | "Teachers" | "Parents" | "Students";
export type GuideProduct = ProductId | "platform";

export type Guide = {
  slug: string;
  title: string;
  product: GuideProduct;
  audience: Audience;
  summary: string;
  body: Block[];
};

export type Post = {
  slug: string;
  title: string;
  topic: string;
  date: string;
  iso: string;
  summary: string;
  /** guide slugs shown under the post */
  related: string[];
  body: Block[];
};

const h = (text: string): Block => ({ type: "heading", text });
const p = (text: string): Block => ({ type: "paragraph", text });
const steps = (...items: string[]): Block => ({ type: "steps", items });
const note = (text: string): Block => ({ type: "note", text });

export const byline = "Lireons team";

export const guides: Guide[] = [
  {
    slug: "import-students-from-a-spreadsheet",
    title: "Import students from a spreadsheet",
    product: "platform",
    audience: "Admins",
    summary: "Bring every student into Lireons from an .xlsx or .csv file, place them in batches, and fix problems before anything is saved.",
    body: [
      p("Most institutions start with a spreadsheet, either exported from an old platform or kept by the office for years. Lireons reads .xlsx and .csv files, matches your columns to student fields and shows every problem row before anything is saved. Plan for a quiet half hour the first time."),
      h("Before you start"),
      p("The import places each student into a batch or class that already exists. It will not create JEE 2027, Batch A or Class 10 B for you, so set them up first under **Settings > Batches and classes**."),
      p("Then tidy the file:"),
      steps(
        "Keep one row per student and one header row at the top. Delete merged cells, totals and blank rows between batches.",
        "Make sure every student has a roll or enrolment number and that no two rows share one. This is how Lireons tells students apart.",
        "Write mobile numbers as ten digits. A leading +91 or 0 is fine; spaces and dashes are removed automatically.",
        "Add an email column if students will sign in with Google Workspace or Microsoft 365.",
      ),
      h("Upload and match columns"),
      steps(
        "Open **Students > Import** and choose **Upload file**.",
        "Select your file. If the workbook has several sheets, pick the one with student rows.",
        "Lireons suggests a field for each column, such as Mobile to Student mobile. Check each suggestion and change any that are wrong.",
        "Set columns you do not need, such as an old registration code, to **Ignore**.",
        "Tick **Save this mapping** if you will import more files in the same layout. Next time the columns match on their own.",
      ),
      h("Fix errors before saving"),
      p("The preview gives every row a status. **Error** rows will not import: a missing roll number, a batch that does not exist, or a duplicate of a student already in Lireons. **Warning** rows import but stay flagged, for example a missing photo or email, so the office can complete them later."),
      steps(
        "Filter the preview to **Errors**.",
        "Fix each one inline, or correct the spreadsheet and upload it again.",
        "Choose **Check again**. When the error count is zero, choose **Import students**.",
      ),
      note("Each import is listed under **Students > Import history** with who ran it and when. If a file went into the wrong batch, undo that import from there instead of deleting students one by one."),
      h("After the import"),
      p("Students are not contacted during an import. Enrol each batch into its courses and schedule its first test, then send invitations from **Students > Invite** so students see their lessons and upcoming tests on their first visit rather than an empty screen."),
    ],
  },
  {
    slug: "publish-your-first-course",
    title: "Publish your first course",
    product: "academy",
    audience: "Admins",
    summary: "Set up a course page, add sections and lessons, set a price, preview it as a student and publish it on your storefront.",
    body: [
      p("A course in Academy is a page on your storefront plus the lessons behind it. You can start with a small course of a few recorded lessons and add live classes, quizzes and a certificate later without republishing anything."),
      h("Create the course"),
      steps(
        "Go to **Courses** and choose **New course**.",
        "Enter a title and a one-line promise of what students will be able to do at the end. This line appears on the storefront card, so make it specific: Solve JEE Main rotational motion problems is clearer than Physics masterclass.",
        "Upload a cover image in the 16:9 shape, at least 1280 pixels wide.",
        "Pick the instructors who will appear on the page.",
      ),
      h("Add sections and lessons"),
      p("A section is a chapter and a lesson is one item inside it. Lesson types include video, PDF or notes, quiz, coding problem and live class."),
      steps(
        "Choose **Add section** and name it.",
        "Inside the section, choose **Add lesson** and pick the type.",
        "For video, upload the file. Lireons encodes it for slow connections and adds it to the lesson when processing finishes; you can keep working meanwhile.",
        "Mark one or two lessons as **Free preview** so visitors can try before paying.",
        "Drag lessons and sections to reorder them.",
      ),
      h("Set the price"),
      p("Under **Pricing**, choose free, a one-time price or instalments, and set the access period, for example twelve months from purchase. Prices are in rupees and include GST settings from your academy’s tax profile. You can add coupon codes later from **Marketing > Coupons**."),
      note("If your academy has a GST number, check **Settings > Tax** before your first sale. Invoices are generated from those details, and changing them afterwards does not alter invoices already issued."),
      h("Preview and publish"),
      steps(
        "Choose **Preview as student** and click through the first lessons on a phone as well as a laptop.",
        "Fill in the course page sections: what is included, who it is for, and the syllabus, which is built from your section names.",
        "Choose **Publish**. The course appears on your storefront and can be bought straight away.",
      ),
      p("A published course can still be edited. New lessons appear for enrolled students as soon as you save them, and students see a small New label next to anything added since their last visit."),
    ],
  },
  {
    slug: "go-live-from-obs-or-the-browser",
    title: "Go live from OBS or the browser",
    product: "academy",
    audience: "Teachers",
    summary: "Schedule a live class, then stream from your browser for a simple setup or from OBS for screen layouts and multiple cameras.",
    body: [
      p("Live classes in Academy run inside a classroom with chat, polls and raised hands, and the recording is added to the course lesson automatically when you end the class. You can broadcast from the browser with no setup, or from OBS Studio when you need more control over what students see."),
      h("Schedule the class"),
      steps(
        "Open the course and choose **Add lesson > Live class**.",
        "Set the date, start time and expected length. Enrolled students are notified and see it in their calendar.",
        "Choose who can speak: chat only, or chat plus raised hands that you approve one at a time.",
      ),
      h("Stream from the browser"),
      p("This is the quickest option and works in Chrome or Edge on a laptop."),
      steps(
        "Open the live lesson a few minutes early and choose **Enter as host**.",
        "Allow camera and microphone access when the browser asks.",
        "Choose **Share screen** if you are teaching from slides or a digital whiteboard.",
        "Choose **Go live** when you are ready. Students waiting in the lobby join automatically.",
      ),
      h("Stream from OBS"),
      p("OBS lets you combine a camera, a writing tablet and slides in one layout, and is the better choice for long classes on a desktop computer."),
      steps(
        "In the live lesson, choose **Stream settings** and copy the **Server URL** and **Stream key**.",
        "In OBS, open **Settings > Stream**, choose **Custom** and paste both values.",
        "Under **Settings > Output**, set the video bitrate between 2500 and 4000 Kbps and the keyframe interval to 2 seconds.",
        "Choose **Start streaming** in OBS. The Lireons host screen shows a preview within a few seconds.",
        "Choose **Go live** on the host screen to let students in.",
      ),
      note("Treat the stream key like a password. Anyone with it can broadcast into your classroom. If it has been shared by mistake, choose **Reset key** in stream settings and paste the new one into OBS."),
      h("During and after the class"),
      p("Keep the host screen open in a second window to read chat and run polls. When you end the class, the recording is processed and placed in the same lesson with chat removed, so students who missed it can watch from the same spot in the course."),
    ],
  },
  {
    slug: "connect-your-own-domain-to-your-academy",
    title: "Connect your own domain to your academy",
    product: "academy",
    audience: "Admins",
    summary: "Point a domain or subdomain you own at your Academy storefront with one DNS record. The security certificate is set up for you.",
    body: [
      p("Every academy starts on a Lireons address. Connecting a domain you own, such as learn.youracademy.in, puts your storefront, checkout and student login under your own name. You keep the domain with whichever registrar you bought it from."),
      h("Choose the address"),
      p("Most academies use a subdomain like learn. or courses. so their main website can stay where it is. If you want the academy on the root domain, for example youracademy.in, your registrar must support a flattened CNAME or ALIAS record. Most large registrars do; check before you begin."),
      h("Add the domain in Lireons"),
      steps(
        "Go to **Settings > Domain** and choose **Connect a domain**.",
        "Type the full address you want, for example learn.youracademy.in.",
        "Lireons shows the DNS record to add. For a subdomain this is a CNAME record pointing to the target shown on screen.",
      ),
      h("Add the DNS record"),
      steps(
        "Sign in to the place that manages your domain’s DNS. This is usually your registrar, such as GoDaddy or Hostinger, or a DNS provider like Cloudflare.",
        "Open DNS settings for your domain and add a new record.",
        "Choose type **CNAME**. In the name or host field, enter only the subdomain part, for example learn.",
        "In the value or target field, paste the target from Lireons exactly.",
        "Save the record. If you use Cloudflare, set the record to **DNS only** while it is being verified.",
      ),
      h("Verify and go live"),
      p("Return to **Settings > Domain** and choose **Verify**. DNS changes can take from a few minutes to several hours to spread. Once the record is found, Lireons issues a security certificate so the address works over https. The status changes to **Connected** when both steps are done."),
      note("Your old Lireons address keeps working and redirects to the new domain, so links already shared with students do not break."),
      h("If verification fails"),
      p("The most common mistake is entering the full domain in the name field, which creates learn.youracademy.in.youracademy.in. Check the record with your provider’s preview. The second most common is an existing record with the same name; delete it before adding the CNAME. If it still fails after a few hours, write to support from the Domain screen and include a screenshot of the record."),
    ],
  },
  {
    slug: "download-and-verify-a-certificate",
    title: "Download and verify a certificate",
    product: "academy",
    audience: "Students",
    summary: "Get your certificate when you complete a course, share its verification link and check one someone else has shown you.",
    body: [
      p("When a course includes a certificate, it is issued automatically once you meet the completion rules set by your academy. Each certificate has its own public verification page, so anyone you share it with can confirm it is genuine in one click."),
      h("When it is issued"),
      p("Your academy decides what completing a course means. It can be watching every lesson, passing the final quiz, scoring above a mark on graded assignments, or a mix. Open the course and look at **Progress** to see each requirement and how much is left."),
      h("Download your certificate"),
      steps(
        "Open the course after completing it. A **Certificate** card appears at the top of the course page.",
        "Check that your name is spelt correctly. If it is not, choose **Edit name** before downloading; the change applies to the certificate and its verification page.",
        "Choose **Download PDF** for a printable copy, or **Download image** for a version that suits social media.",
      ),
      note("You can correct the spelling of your name, but not replace it with a different name. If you need a bigger change, contact the academy from the course page."),
      h("Share it"),
      steps(
        "On the certificate card, choose **Copy verification link**.",
        "Paste the link into your CV, a job application or your LinkedIn profile under Licenses and certifications.",
        "The certificate ID printed on the PDF is the same as the one in the link, so a printed copy can be checked too.",
      ),
      h("Verify a certificate"),
      p("If someone shows you a Lireons certificate, open the verification link or go to the academy’s site and choose **Verify a certificate**, then type the certificate ID. The page shows the learner’s name, course, academy and issue date. If the details do not match the document you were shown, or the page says the certificate was revoked, treat the document as not valid."),
      h("Lost access to your account"),
      p("Certificates stay attached to your account even after course access ends. If you can no longer sign in, use **Forgot password** on the academy’s login page with the email you enrolled with. The verification link keeps working whether or not you are signed in."),
    ],
  },
  {
    slug: "build-a-test-from-your-question-bank",
    title: "Build a test from your question bank",
    product: "assess",
    audience: "Teachers",
    summary: "Pick questions by topic and difficulty, set sections and marking, shuffle for each candidate and schedule the test.",
    body: [
      p("A test in Assessments is a set of sections drawn from your question bank, with timing, marking and proctoring settings on top. Building from the bank, rather than typing questions into each test, means questions are reviewed once and reused cleanly."),
      h("Prepare the bank"),
      p("Tag every question with a subject, chapter, topic and difficulty when you add it. Tags are what let you build a balanced test quickly. You can import questions in bulk from a Word or spreadsheet template under **Question bank > Import**, including images and equations."),
      h("Create the test"),
      steps(
        "Go to **Tests** and choose **New test**. Give it a name students will recognise, for example Class 12 Physics Unit Test 3.",
        "Add a section for each part of the paper, such as Physics MCQ and Physics numerical.",
        "In each section, choose **Add from bank**. Filter by chapter, topic, difficulty and question type.",
        "Select questions one by one, or choose **Pick at random** with a count per difficulty, for example 10 easy, 8 medium, 4 hard.",
        "Set marks per question and negative marking if you use it.",
      ),
      h("Timing and order"),
      steps(
        "Set the total duration, and section time limits if candidates must not move back to an earlier section.",
        "Turn on **Shuffle questions** and **Shuffle options** so neighbours do not see the same order.",
        "Choose whether candidates can review and change answers before submitting.",
      ),
      note("Random picking is done once per candidate when the test opens, so each person can receive a different set of the same difficulty. Use this for practice tests. For a ranked exam, keep everyone on the same questions and shuffle the order only."),
      h("Proctoring"),
      p("Under **Proctoring**, choose what the AI proctor watches: face presence, more than one face, tab switching, voices and devices. Every signal you enable produces flags with evidence for a reviewer, and nothing is decided automatically. Tell candidates which signals are on in the instructions page."),
      h("Schedule and publish"),
      p("Set the window when candidates can start, assign the test to batches or sections, and preview it as a candidate. Publish when you are happy. Candidates receive a link and a reminder to run the device check before the day."),
    ],
  },
  {
    slug: "review-and-clear-proctor-flags",
    title: "Review and clear proctor flags",
    product: "assess",
    audience: "Teachers",
    summary: "Work through the review queue, look at the evidence behind each AI flag and record a decision a person can stand behind.",
    body: [
      p("The AI proctor never decides that a candidate cheated. It raises flags with the evidence attached, and a reviewer clears or upholds each one. Results stay provisional until every flag on a candidate has a human decision."),
      h("Open the review queue"),
      steps(
        "Go to **Tests**, open the test and choose **Review**.",
        "The queue lists candidates with open flags, the number of flags and their types. Sort by flag count to start with the cases that need the most attention.",
        "Choose a candidate to open their timeline.",
      ),
      h("Read the evidence"),
      p("The timeline shows the whole attempt from start to submission. Each flag sits at the moment it happened, with a short clip or snapshot and a description such as Second face in frame, 12 seconds, or Left the test tab, 40 seconds."),
      steps(
        "Play the evidence for each flag. Look at the few seconds before and after, not only the flagged frame.",
        "Check context on the timeline: was the candidate answering questions at the time, or had activity stopped?",
        "Look for patterns rather than single events. One glance away is normal; repeated tab switches during the hardest section are not.",
      ),
      h("Record a decision"),
      steps(
        "Choose **Clear** if the evidence shows nothing wrong, for example a family member walking past in the background.",
        "Choose **Uphold** if it shows a breach of the test rules.",
        "Add a reason. Reasons are required for upholds and recommended for clears, because they are what you will rely on if a candidate appeals.",
      ),
      p("When many flags have the same innocent cause, such as a brief network drop that affected a whole batch, select them across candidates and clear them together. Each decision is still logged separately with your name."),
      note("Upholding a flag does not change a score by itself. Decide what follows, such as a zero for a section or a retest, under your institution’s own rules, and record it on the candidate’s result."),
      h("Finish the review"),
      p("When the queue is empty, choose **Finalise results**. Candidates then see their score, and any upheld flags with the reason you gave. Decisions remain in the audit log so a second reviewer can check them later."),
    ],
  },
  {
    slug: "check-your-device-before-a-proctored-test",
    title: "Check your device before a proctored test",
    product: "assess",
    audience: "Students",
    summary: "Run the device check a day early, fix camera, microphone and connection problems, and know what to expect on test day.",
    body: [
      p("A proctored test uses your camera, microphone and screen to make sure everyone is tested fairly. Running the device check a day before means you can fix any problem calmly instead of in the first minutes of the exam."),
      h("Run the check"),
      steps(
        "Open the test link you received and choose **Check my device**. Use the same computer, browser and internet connection you will use on the day.",
        "Allow camera and microphone access when the browser asks.",
        "Follow the screen: it checks your camera, microphone, connection speed, browser version and screen sharing.",
        "Each item shows a tick when it passes. If something fails, the screen explains what to change.",
      ),
      h("Common fixes"),
      steps(
        "**Camera not found**: close other apps that use the camera, such as Zoom or WhatsApp desktop, then reload the page.",
        "**Permission blocked**: click the camera icon in the browser’s address bar and choose Allow.",
        "**Slow connection**: move closer to your Wi-Fi router, or use a phone hotspot as a backup. Ask others at home not to stream video during your test.",
        "**Browser not supported**: use the latest Chrome or Edge on a laptop or desktop. Phones and tablets are only allowed if your institution says so.",
      ),
      h("Set up your space"),
      p("Sit in a well-lit room facing the light, not with a window behind you, so your face is clearly visible. Clear your desk of books and phones unless the test allows them. Keep your face in the frame for the whole test."),
      note("A flag is not an accusation. If something unusual happens, like a family member entering the room or the power going out, carry on if you can. A teacher reviews every flag and its evidence before anything is decided."),
      h("On test day"),
      steps(
        "Join ten minutes early. You will take a quick photo for identity and, if required, show your ID card.",
        "The test opens in full screen. Leaving full screen or switching tabs is recorded, so close everything else first.",
        "If your connection drops, reopen the link. Your answers are saved as you go and the timer continues from where it was.",
      ),
    ],
  },
  {
    slug: "sell-a-course-with-upi-checkout",
    title: "Sell a course with UPI checkout",
    product: "academy",
    audience: "Admins",
    summary: "Connect Razorpay, set a price or instalments, add a coupon and check the receipt a student gets after paying by UPI.",
    body: [
      p("Every course on your storefront can be sold on its own or in a bundle. Payments go through your own Razorpay account, so the money settles to you, and each purchase unlocks the course straight away."),
      h("Connect payments once"),
      steps(
        "Go to **Settings > Payments** and choose **Connect Razorpay**.",
        "Sign in to your Razorpay account and approve the connection.",
        "Check your legal name and GST number under **Settings > Tax**. Invoices are built from these details.",
      ),
      h("Price the course"),
      steps(
        "Open the course and go to **Pricing**.",
        "Choose a one-time price or instalments, and set how long access lasts, for example twelve months from purchase.",
        "Optionally add a launch coupon under **Marketing > Coupons**, with a limit on uses and an end date.",
        "Save. The price appears on the storefront card and the course page at once.",
      ),
      h("What the student sees"),
      p("The student chooses **Buy now**, signs in or creates an account, and pays by UPI, card or netbanking on your domain. When the payment is confirmed the course opens, an invoice is emailed, and a receipt can go out on WhatsApp if you have connected it."),
      note("Buy a course yourself with a 100% coupon before launch. It is the quickest way to see the checkout, the invoice and the first lesson exactly as a student will."),
      h("Refunds"),
      p("Open the purchase under **Sales > Orders** and choose **Refund**. Only the Owner role can refund by default. Access ends when the refund is issued, and the action is recorded in the audit log."),
    ],
  },
  {
    slug: "join-a-live-class-from-your-phone",
    title: "Join a live class from your phone",
    product: "academy",
    audience: "Students",
    summary: "Get the reminder, join on time, raise your hand and find the recording afterwards.",
    body: [
      p("Live classes run inside your course, so there is no separate meeting link to find. You can join from the app, a phone browser or a laptop."),
      h("Before the class"),
      steps(
        "Turn on notifications for the app, or keep WhatsApp reminders on under **Profile > Notifications**.",
        "Fifteen minutes before the class you get a reminder with a **Join class** button.",
        "Use earphones if you can. Your microphone stays off until the teacher lets you speak.",
      ),
      h("During the class"),
      steps(
        "Tap **Join class** from the reminder or from the course page.",
        "Use **Raise hand** to ask a question out loud, or type in the chat.",
        "Answer polls when they appear. Your answers are only seen by the teacher.",
      ),
      note("If the video freezes on a slow connection, tap **Audio only**. You will still hear the teacher and can switch the video back on at any time."),
      h("After the class"),
      p("The recording is added to the same lesson once the class ends, usually within the hour. Notes or slides the teacher shares appear under it."),
    ],
  },
  {
    slug: "see-your-childs-test-results",
    title: "See your child’s test results",
    product: "assess",
    audience: "Parents",
    summary: "Find each test’s score, section-wise marks and batch rank, and know when written answers are still being marked.",
    body: [
      p("When your child’s institution shares results with parents, you can see them from the same account you use to follow their courses. You only ever see your own children."),
      h("Find a result"),
      steps(
        "Sign in and choose your child if you have more than one.",
        "Open **Tests**. Upcoming tests are listed first, then results, newest at the top.",
        "Tap a result to see the score, marks by section and, where the institution publishes it, the rank in the batch.",
      ),
      h("What the statuses mean"),
      p("**Scored** means every section is marked. **Marking** means auto-graded sections are done and written answers are with a teacher. **Under review** means a reviewer is checking the test before results are final."),
      note("You see the marks and the teacher’s feedback, not the answer key. Questions and correct answers stay with the institution so tests can be reused fairly."),
      h("Questions about a mark"),
      p("Use **Ask the teacher** on the result page. Your message goes to the subject teacher with the test attached, and the reply comes back in the same thread."),
    ],
  },
  {
    slug: "create-roles-and-invite-staff",
    title: "Create roles and invite staff",
    product: "platform",
    audience: "Admins",
    summary: "Give each person exactly the access their job needs, using built-in roles or ones you create, then invite them by email or phone.",
    body: [
      p("Access in Lireons is controlled by roles. A role is a named set of permissions across every product you use, such as course prices in Academy or results in Assessments. You assign roles to people, never permissions directly, so access stays easy to review."),
      h("Start with the built-in roles"),
      p("Every institution starts with roles that cover most teams: **Owner**, **Admin**, **Teacher**, **Reviewer**, **Parent** and **Student**. Open each under **Settings > Roles** to see exactly what it can do. Many institutions never need more than these."),
      h("Create a custom role"),
      steps(
        "Go to **Settings > Roles** and choose **New role**, or duplicate a built-in role that is close to what you need.",
        "Name the role after the job, for example Exam coordinator.",
        "For each product, set access to each area as **None**, **View** or **Edit**. Some areas also have **Approve**, such as refunds and publishing results.",
        "Limit the role by scope where it matters, for example to certain classes, batches or branches.",
        "Save the role.",
      ),
      note("Give the fewest people Edit access to prices and refunds, and the Owner role. Two owners is a sensible number: enough that someone can always act, few enough that responsibility is clear."),
      h("Invite staff"),
      steps(
        "Go to **Settings > People** and choose **Invite**.",
        "Enter the person’s name and their work email or mobile number. If your institution uses Google Workspace or Microsoft 365, use their work email so they can sign in with it.",
        "Choose one or more roles.",
        "Choose **Send invite**. They receive a link valid for seven days.",
      ),
      p("You can invite many people at once by uploading a spreadsheet with name, contact and role columns. Teachers are usually added this way at the start of a session."),
      h("When someone leaves"),
      p("Open the person under **Settings > People** and choose **Deactivate**. They are signed out of every device straight away. Their past actions stay in the audit log under their name, and records they created, such as lessons, tests or marks, are kept."),
    ],
  },
  {
    slug: "read-and-export-the-audit-log",
    title: "Read and export the audit log",
    product: "platform",
    audience: "Admins",
    summary: "Find out who changed what and when across every product, filter to the events that matter and export them as CSV.",
    body: [
      p("The audit log records every action that changes data or access in Lireons: a course price changed, a mark edited, a proctor flag cleared, a role changed. Entries cannot be edited or deleted by anyone at your institution, including owners."),
      h("Who can see it"),
      p("By default only the **Owner** role can open the audit log. You can grant view access to another role, such as Admin, under **Settings > Roles > Audit log**. Consider carefully before doing so, because the log shows activity across the whole institution."),
      h("Read an entry"),
      p("Open **Settings > Audit log**. Each row shows:"),
      steps(
        "**When** the action happened, to the second, in Indian Standard Time.",
        "**Who** did it, with their role at the time, or System for automatic actions such as scheduled reminders.",
        "**What** happened, in plain words, for example Refunded ₹4,999 to Kabir Singh.",
        "**Where**: the product and the record affected, which you can open directly.",
      ),
      p("Choose a row to see the full detail, including the value before and after the change and the reason given, if one was required."),
      h("Filter to what you need"),
      steps(
        "Use **Person** to see everything one member of staff did.",
        "Use **Product** to narrow to Academy, Assessments, AI Doubt Solver or platform settings.",
        "Use **Action** for specific events, such as Refund issued or Role changed.",
        "Set a **Date range**. The log keeps entries for the life of your account.",
      ),
      note("A useful monthly habit: filter to Refund issued, Price changed and Marks edited for the past month and read through them with a second owner or admin. It takes a few minutes and catches mistakes early."),
      h("Export as CSV"),
      p("With your filters set, choose **Export CSV**. The file includes the same columns as the screen plus the before and after values. Large exports are prepared in the background and you receive an email with a download link that works for a limited time. Each export is itself recorded in the audit log."),
    ],
  },
];

export const posts: Post[] = [
  {
    slug: "live-classes-students-stay-for",
    title: "Live classes students stay for",
    topic: "Live classes",
    date: "8 October 2026",
    iso: "2026-10-08",
    summary: "Why the room empties after the first ten minutes, and the small changes that keep a batch in the room until the end.",
    related: ["go-live-from-obs-or-the-browser", "join-a-live-class-from-your-phone", "publish-your-first-course"],
    body: [
      p("Most teachers who move online notice the same pattern. The class starts full, the chat is busy for a few minutes, and then the count starts to slide. By the end, a third of the batch has drifted away to the recording, another tab or nothing at all. The teaching has not got worse. The format simply asks less of students than a classroom does, so they give less."),
      h("Students leave when nothing is asked of them"),
      p("In a room, a teacher can look at a student. Online, a student who has said nothing for twenty minutes is invisible, and they know it. The fix is not more slides or a louder voice. It is giving every student a reason to act every few minutes."),
      steps(
        "Open with a question everyone answers in the chat, such as the first step of yesterday’s problem.",
        "Run a one-question poll every ten to fifteen minutes. Show the results and talk about the wrong answers.",
        "Call on raised hands by name. Students stay for a class where people like them are heard.",
      ),
      h("Start on time, end on time"),
      p("A class that starts five minutes late teaches students to join five minutes late. A class that overruns teaches them to leave before the end. Start at the minute on the reminder, even with half the batch, and finish when you said you would. Put anything left over into a short recorded lesson."),
      h("Make the recording a reason to attend, not a substitute"),
      p("If the recording is the full class, many students will reasonably choose it. Keep polls, raised hands and live problem solving for the people in the room, and tell the batch that doubts asked live get answered first. The recording is there for revision and for students who genuinely could not attend."),
      note("Join and drop-off figures in examples here are illustrative. Look at your own class history: the drop-off point is usually the same minute every week, which tells you where to put the next poll."),
      h("Mind the slow connections"),
      p("Students on patchy mobile data drop out when the video stutters, and many do not rejoin. Tell them on day one that **Audio only** exists, keep slides readable at phone size, and write key numbers in the chat so nobody depends on a frozen frame."),
      h("Follow the class with practice"),
      p("Attach a short quiz to the lesson the recording lands in, and mention it before you end. Students who know there is a quiz on today’s topic tend to stay for the part that will be on it."),
    ],
  },
  {
    slug: "running-a-fair-online-mock-test-for-500-students",
    title: "Running a fair online mock test for 500 students",
    topic: "Exams",
    date: "24 September 2026",
    iso: "2026-09-24",
    summary: "Practical setup for proctored tests: device checks, review queues and how to explain flags to students.",
    related: ["check-your-device-before-a-proctored-test", "build-a-test-from-your-question-bank", "review-and-clear-proctor-flags"],
    body: [
      p("A mock test is only useful if students believe the ranking. When a few candidates are suspected of copying, the whole batch stops trusting the results, and the test becomes noise. Online proctoring can protect that trust, but only if it is run in a way students see as fair. This post covers the practical setup for a large batch, from the week before to the day results go out."),
      h("Decide the rules before you build the test"),
      p("Write down, in plain language, what is allowed and what is not. Can students use a rough sheet? A calculator? Can they leave the room for a minute? What happens if their internet drops? These answers decide which proctoring signals you switch on, and students should read them well before the test, not on the instructions page in the final minute."),
      p("Keep the list short. Five clear rules are followed more closely than twenty that nobody reads. Publish them where students will find them, such as the batch’s notice board and the test’s own instructions."),
      h("The week before: device checks"),
      p("Technical failures cause more unfair outcomes than cheating does. A student whose camera does not work, or whose browser blocks screen sharing, ends up with a pile of flags they did nothing to earn. The fix is a device check run several days early, on the same device and connection they will use on the day."),
      steps(
        "Send the device check link at least three days before the test, and again the day before to anyone who has not completed it.",
        "Ask class teachers to follow up with students whose checks failed. Most problems are permissions or an outdated browser and take minutes to fix.",
        "Decide in advance what students without a suitable device should do, such as taking the test in a computer lab at the centre.",
      ),
      h("On the day: reduce noise"),
      p("With a large batch, a handful of avoidable issues becomes a long review queue. Start the test window ten minutes after students are asked to join, so identity checks and late arrivals do not eat into their time. Keep one staff member watching the live dashboard for students stuck at the start, and one available on a phone line for connection problems."),
      p("Shuffle question order and options for every candidate. It is the cheapest anti-copying measure there is, and it does not produce a single flag."),
      h("After the test: review with care"),
      p("Every flag is a question, not a verdict. A good review process treats it that way."),
      steps(
        "Split the queue between two or three reviewers so no one is rushing through a long list late at night.",
        "Clear obvious batch-wide issues together, such as a brief power cut in one area, before reviewing individual candidates.",
        "Watch the evidence before and after each flag, and look for patterns rather than single moments.",
        "Write a reason for every uphold. If a student appeals, the reason is what you will both look at.",
        "Have a second reviewer look at any case where the consequence is serious, such as a zero on the paper.",
      ),
      note("The AI proctor surfaces moments worth a look. It does not know your rules, your students or their homes. The decision belongs to a teacher, and students should hear that clearly."),
      h("Explaining flags to students"),
      p("Students worry about flags more than they need to, and that worry is itself a distraction during the test. Tell them before the first test that flags are routine, that most are cleared, and that a teacher reviews every one with the evidence. Show them what a flag looks like from the reviewer’s side if you can."),
      p("When a flag is upheld, explain the reason in a sentence and offer a route to appeal. When a student’s flags are all cleared, they do not need to hear about them at all. Students who are treated this way tend to accept proctoring as part of a fair test rather than as surveillance."),
      h("After the results"),
      p("Look back at the review queue once results are out. Which flag types were mostly cleared? Those signals may be too sensitive for your students' setups, or need clearer instructions. Which were upheld? Those tell you where the rules need repeating. Adjust before the next mock, and the queue gets shorter each time while the results stay trustworthy."),
    ],
  },
  {
    slug: "owning-your-course-storefront",
    title: "Owning your course storefront",
    topic: "Academies",
    date: "10 September 2026",
    iso: "2026-09-10",
    summary: "The difference between selling on a marketplace and selling under your own name, for small academies.",
    related: ["connect-your-own-domain-to-your-academy", "publish-your-first-course", "download-and-verify-a-certificate"],
    body: [
      p("Small academies usually start selling wherever students already are: a large course marketplace, a messaging group with a payment link, or a video platform with paid memberships. These are sensible first steps. They cost little and bring early students. But as an academy grows, the question of who owns the storefront starts to matter more than any single sale."),
      p("This post looks at what you gain and give up on each side, so you can decide when to move and how."),
      h("What a marketplace gives you"),
      p("Marketplaces bring traffic. A student searching for a topic may find your course without ever having heard of you. They also handle payments, refunds and video hosting, so a teacher can focus on teaching. For a new academy without an audience, that is valuable."),
      h("What it costs"),
      p("The costs are less obvious and grow over time."),
      steps(
        "**The student relationship belongs to the marketplace.** You often cannot see a buyer’s contact details or message them outside the platform. When you launch a new course, you cannot tell your past students directly.",
        "**Your brand is secondary.** Students remember the marketplace where they bought the course more often than the teacher who made it.",
        "**Pricing is not fully yours.** Frequent site-wide discounts set what students expect to pay, and your course sits next to many cheaper alternatives.",
        "**Rules can change.** Revenue shares, ranking and policies are set by the platform and can shift without your agreement.",
      ),
      h("What owning the storefront means"),
      p("Selling under your own name means students visit your address, see your brand, pay you, and sign in to your academy. You hold their contact details, with their consent, and you decide how to price, bundle and discount. When a student finishes one course, you can offer the next one directly."),
      p("It also means you are responsible for bringing people to the door. No marketplace will send traffic to your own site. For most academies, though, the bulk of serious students already arrive through the teacher’s own reputation: a YouTube channel, a social media following, word of mouth from past batches. Those students are better served by your own storefront than by a marketplace listing."),
      h("A practical path"),
      p("You do not have to choose one side overnight. Many academies move in stages."),
      steps(
        "Keep one or two introductory courses on a marketplace for discovery, if they are bringing new students.",
        "Put your full courses, cohorts and live classes on your own storefront, where you control the experience.",
        "In the introductory courses, point students to your own site for deeper material, within the marketplace’s rules.",
        "Connect your own domain early, so every link you share builds your own address.",
        "Collect permission to stay in touch at checkout, and use it sparingly: new course launches and genuinely useful updates.",
      ),
      h("What students notice"),
      p("Students rarely care about the platform behind a course. They care that it loads on their phone, that payment by UPI works first time, that lessons resume where they left off, and that the certificate can be verified by an employer. A storefront that does those things well, under your name, earns more trust than a marketplace page, because the quality is clearly yours."),
      note("If you are moving students from another platform, tell them before you switch, explain where their access will live, and keep the old course available until everyone has moved. A rushed migration costs more goodwill than it saves."),
      h("The long view"),
      p("An academy’s most valuable asset is its relationship with past and current students. Every course sold on your own storefront adds to it. Every course sold elsewhere adds, at least partly, to someone else’s. That does not make marketplaces wrong, but it is worth deciding deliberately which relationship you are building."),
    ],
  },
  {
    slug: "moving-a-coaching-centre-off-spreadsheets-in-one-week",
    title: "Moving a coaching centre off spreadsheets in one week",
    topic: "Operations",
    date: "27 August 2026",
    iso: "2026-08-27",
    summary: "The order to set things up in, what to leave for later, and the questions to settle before day one.",
    related: ["import-students-from-a-spreadsheet", "build-a-test-from-your-question-bank", "create-roles-and-invite-staff"],
    body: [
      p("Moving a coaching centre from spreadsheets, shared drives and meeting links to one platform sounds like a term-long project. It does not have to be. Batches, students, courses and the weekly test can be live in a week if you do things in the right order and leave the rest for later. This post sets out that order, based on what tends to go wrong when centres try to do everything at once."),
      h("Before day one: settle four questions"),
      p("Most delays come from decisions nobody made in advance. Settle these with the centre head before importing anything."),
      steps(
        "**Which spreadsheet is the source of truth?** There is usually more than one list of students. Pick one, and reconcile the others against it.",
        "**How are students identified?** Roll or enrolment numbers should be unique and permanent. If yours are not, fix that first.",
        "**Which batches and courses run this session?** Agree the names on paper before anyone types them in.",
        "**Who needs access, and to what?** List each teacher and staff member and what they should be able to see or change.",
      ),
      h("Days one and two: batches and students"),
      p("Start with the structure: the session and its batches. Everything else hangs off it. Then import students. Expect the first import to surface problems in the spreadsheet, such as duplicate roll numbers, missing mobile numbers or students in batches that no longer run. Fixing these is the real work of day two, and it improves your records whatever system you use."),
      h("Day three: courses"),
      p("Create one course per batch and subject, and upload the lectures you already have. Do not try to record anything new this week. A course with last month’s recordings in the right order is already more useful to students than a folder of links."),
      h("Day four: the question bank and the first test"),
      p("Bring in one past mock paper, tag the questions by chapter, and build next Sunday’s test from it. Run the device check with the batch midweek so the first proctored test is not also everyone’s first attempt at switching on a webcam."),
      note("Do not import years of old question papers on day four. One clean, tagged paper is enough for the first test. Older papers can come in a chapter at a time over the following weeks."),
      h("Day five: staff and access"),
      p("Invite teachers with the roles you agreed. Keep access narrow at first; it is easier to grant more later than to take it away. Run a short session on the three things teachers will do daily: publishing a lesson, going live and checking a batch’s results."),
      h("Days six and seven: students"),
      p("Only now invite students. By this point their batch, courses and first test are in place, so their first look is complete and correct. Send a short message explaining how to sign in and who to contact with questions. Expect a day or two of sign-in questions; it is worth having one person ready to help."),
      h("What to leave for later"),
      p("Certificates, coupons, a public storefront and the full question bank can follow over the next few weeks, one at a time. Each depends on clean student records and courses, which you now have."),
      h("Keep the old sheets, but stop using them"),
      p("Archive your spreadsheets in a folder the office can read but not edit. Agree that from a given date, the new platform is where changes are made. The most common reason a move fails is not technical: it is two systems running side by side because nobody said when the old one stopped."),
    ],
  },
];

/* ---------- helpers ---------- */

export const guideBySlug = (slug: string) => guides.find((g) => g.slug === slug);
export const postBySlug = (slug: string) => posts.find((x) => x.slug === slug);

export const headingId = (text: string) =>
  text.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const blockText = (b: Block) => (b.type === "steps" ? b.items.join(" ") : b.text);

export const wordCount = (body: Block[]) => body.map(blockText).join(" ").split(/\s+/).filter(Boolean).length;

/** Minutes at roughly 220 words a minute, never less than one. */
export const readMinutes = (body: Block[]) => Math.max(1, Math.round(wordCount(body) / 220));

/** Three guides most like this one: same product first, then same audience, then the rest in order. */
export function relatedGuides(slug: string, n = 3): Guide[] {
  const g = guideBySlug(slug);
  if (!g) return guides.slice(0, n);
  const score = (x: Guide) => (x.product === g.product ? 2 : 0) + (x.audience === g.audience ? 1 : 0);
  return guides
    .filter((x) => x.slug !== slug)
    .map((x, i) => ({ x, i, s: score(x) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, n)
    .map((r) => r.x);
}
