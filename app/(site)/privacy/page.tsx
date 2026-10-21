import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/pages/PageHeader";
import { LegalDoc, type LegalSection } from "@/components/pages/LegalDoc";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Lireons processes personal data of institutions, staff, students and guardians under the Digital Personal Data Protection Act, 2023.",
};

const sections: LegalSection[] = [
  {
    id: "scope",
    title: "Who we are and what this covers",
    body: (
      <>
        <p>This policy explains how [Lireons Technologies Private Limited] (<strong>Lireons</strong>, <strong>we</strong>) processes personal data when institutions and their users use the Lireons platform, apps and websites, and when you visit lireons.com or request a demo.</p>
        <p>It is written to meet the Digital Personal Data Protection Act, 2023 and its rules (the <strong>DPDP Act</strong>), and the Information Technology Act, 2000 with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</p>
      </>
    ),
  },
  {
    id: "roles",
    title: "Institutions decide, we process",
    body: (
      <>
        <p>Most personal data on Lireons belongs to the records of a school, coaching centre or academy. For that data:</p>
        <ul>
          <li>the <strong>Institution is the Data Fiduciary</strong>. It decides why and how student, guardian and staff data is processed, and is responsible for giving notice and obtaining consent;</li>
          <li><strong>Lireons is a Data Processor</strong> acting on the Institution’s behalf under a written contract, and processes that data only on its instructions.</li>
        </ul>
        <p>Lireons is the Data Fiduciary for a smaller set of data it collects for its own purposes: website visits, demo requests, newsletter sign-ups, and billing contacts at institutions.</p>
        <p>If you are a student, guardian or staff member and want to use your rights, contact your Institution first. We will help it respond.</p>
      </>
    ),
  },
  {
    id: "data",
    title: "Personal data we process",
    body: (
      <>
        <h3>On behalf of Institutions</h3>
        <ul>
          <li><strong>Student records:</strong> name, date of birth, class or batch, roll number, photograph, enrolments, marks and results.</li>
          <li><strong>Guardian details:</strong> name, relationship, mobile number, email and address, used for communication and course purchases.</li>
          <li><strong>Payments:</strong> course and test purchases, invoices and payment status.</li>
          <li><strong>Learning:</strong> course enrolments, lesson progress, quiz and assignment submissions, certificates and community posts.</li>
          <li><strong>Assessments and proctoring:</strong> answers and scores, and during proctored tests only, webcam images or video, microphone audio, screen and browser events, and device information.</li>
          <li><strong>Doubts:</strong> questions typed or photographed by students, the answers given, and any teacher hand-off.</li>
          <li><strong>Staff:</strong> name, role, contact details and activity in the audit log.</li>
        </ul>
        <h3>For our own purposes</h3>
        <ul>
          <li>Demo requests: name, work email, mobile number, institution details and your message.</li>
          <li>Billing contacts: name, email, phone, GST details and invoices.</li>
          <li>Website and app usage: IP address, browser, device, pages viewed and error logs.</li>
        </ul>
      </>
    ),
  },
  {
    id: "children",
    title: "Children’s data and guardian consent",
    body: (
      <>
        <p>Many students are under 18. Under section 9 of the DPDP Act, the Institution must obtain verifiable consent from a parent or lawful guardian before processing a child’s personal data, except where an exemption notified for educational institutions applies to the purpose.</p>
        <ul>
          <li>Lireons provides tools that help, such as guardian accounts in the parent app and consent records attached to the student profile.</li>
          <li>We process children’s data only to provide education, administration and safety services the Institution has switched on.</li>
          <li>We do not carry out tracking or behavioural monitoring of children for any other purpose, and we do not direct advertising at children.</li>
          <li>A guardian can ask the Institution to correct or erase a child’s data, or to withdraw consent, at any time.</li>
        </ul>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use personal data",
    body: (
      <ul>
        <li>To provide the products an Institution subscribes to, and keep one record per student across them.</li>
        <li>To send messages the Institution configures, such as live class reminders and test results.</li>
        <li>To secure the Services, prevent misuse, and keep an audit log of changes.</li>
        <li>To provide support and fix problems an Institution reports.</li>
        <li>To arrange demos, send quotes and invoices, and meet tax and legal obligations.</li>
        <li>To improve the Services using aggregated or de-identified usage data that does not identify a person.</li>
      </ul>
    ),
  },
  {
    id: "ai",
    title: "AI features and human review",
    body: (
      <>
        <p>The AI proctor and the AI Doubt Solver process personal data to produce flags or answers. We have designed them so that a person stays in charge:</p>
        <ul>
          <li>Every proctoring flag links to its evidence, and a reviewer at the Institution clears or upholds it before any result is final. No result is decided by the AI alone.</li>
          <li>Doubt answers cite the lesson or note they came from. When the assistant is unsure, it hands the question to a teacher.</li>
          <li>Proctoring media is used only for the test it was captured in, and is visible only to the Institution’s reviewers and to Lireons support when the Institution asks for help.</li>
          <li>We do not use Customer Data to train general-purpose AI models without the Institution’s written permission.</li>
        </ul>
        <p>If you think an AI decision about you was wrong, ask your Institution for a review. It can see the evidence and change the outcome.</p>
      </>
    ),
  },
  {
    id: "messaging",
    title: "WhatsApp, SMS and email",
    body: (
      <>
        <p>Messages to guardians, students and staff are sent through the WhatsApp Business Platform, SMS gateways and email providers. The provider receives the recipient’s number or address and the message content in order to deliver it.</p>
        <p>WhatsApp messages are subject to Meta’s policies as well as this one. You can stop non-essential messages by replying with the opt-out word in the message, or by asking your Institution.</p>
      </>
    ),
  },
  {
    id: "payments",
    title: "Payments",
    body: <p>Payments are processed by Razorpay Software Private Limited. Card, UPI and netbanking details are entered on Razorpay’s pages and are handled under Razorpay’s own privacy policy. Lireons receives the payment status, amount, method type and transaction reference, which we store with the receipt. We do not store full card numbers or UPI PINs.</p>,
  },
  {
    id: "sharing",
    title: "Sharing and sub-processors",
    body: (
      <>
        <p>We do not sell personal data. We share it only:</p>
        <ul>
          <li>with sub-processors that help us run the Services, such as cloud hosting, Razorpay, WhatsApp and SMS providers, email delivery and, where an Institution enables them, video tools like Zoom or YouTube Live. Each is bound by a contract that limits its use of the data;</li>
          <li>with the Institution, and with people the Institution authorises;</li>
          <li>when required by law, a court order, or a lawful request from a government authority.</li>
        </ul>
        <p>A current list of sub-processors is available to Institutions on request.</p>
      </>
    ),
  },
  {
    id: "storage",
    title: "Where data is stored",
    body: <p>Customer Data is stored on cloud infrastructure located in India [confirm region]. If any personal data is transferred outside India, for example to a messaging provider, we do so only to countries not restricted by the Central Government under section 16 of the DPDP Act, and under a contract that protects the data.</p>,
  },
  {
    id: "security",
    title: "Security",
    body: <p>We take reasonable security safeguards to prevent personal data breaches, as section 8(5) of the DPDP Act requires. These include tenant isolation, role-based access, encryption in transit, an audit log of sensitive actions, and regular backups. Our <Link href="/security">security page</Link> describes them in more detail.</p>,
  },
  {
    id: "retention",
    title: "How long we keep data",
    body: (
      <ul>
        <li><strong>Customer Data:</strong> for as long as the Institution’s subscription is active, then 30 days for export. We delete it from live systems within [60] days after that, and backups expire within [35] days of deletion.</li>
        <li><strong>Proctoring media:</strong> [90] days after a test’s results are final by default. Institutions can set a shorter period.</li>
        <li><strong>Data a guardian or student asks to erase:</strong> erased once the Institution approves, unless the Institution must keep it by law, such as exam results and payment records.</li>
        <li><strong>Demo requests:</strong> up to [12] months after our last contact, unless you become a customer.</li>
        <li><strong>Invoices and tax records:</strong> for as long as tax law requires.</li>
      </ul>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>Under the DPDP Act you have the right to:</p>
        <ul>
          <li>get a summary of the personal data processed about you and of the processing;</li>
          <li>have inaccurate or incomplete data corrected or updated;</li>
          <li>have data erased when it is no longer needed for the purpose it was collected for, unless the law requires it to be kept;</li>
          <li>withdraw consent, as easily as you gave it;</li>
          <li>nominate another person to exercise your rights if you die or become incapable;</li>
          <li>have your grievance addressed, and if you are not satisfied, complain to the Data Protection Board of India.</li>
        </ul>
        <p>For data held for an Institution, send your request to the Institution. For data Lireons holds for itself, write to <a href="mailto:privacy@lireons.com">privacy@lireons.com</a>.</p>
      </>
    ),
  },
  {
    id: "breaches",
    title: "Personal data breaches",
    body: <p>If we become aware of a breach affecting Customer Data, we inform the affected Institution without delay, with what we know and what we are doing about it, so it can notify the Data Protection Board and affected people. Where Lireons is the Data Fiduciary, we notify them ourselves as the DPDP Act requires.</p>,
  },
  {
    id: "cookies",
    title: "Cookies",
    body: <p>lireons.com uses a small number of cookies and local storage items that are needed to keep you signed in, remember preferences such as light or dark theme, and protect forms from abuse. If we add analytics that are not strictly necessary, we will ask first.</p>,
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: <p>We will post any change here and update the date at the top. If a change materially affects how we process personal data, we will tell Institutions’ administrators at least 30 days in advance.</p>,
  },
  {
    id: "grievance",
    title: "Grievance officer and contact",
    body: (
      <>
        <p>You can reach our Grievance Officer about any privacy concern:</p>
        <ul>
          <li>Name: [Grievance Officer name]</li>
          <li>Email: <a href="mailto:grievance@lireons.com">grievance@lireons.com</a></li>
          <li>Address: [registered address]</li>
        </ul>
        <p>We acknowledge complaints within 24 hours and aim to resolve them within 15 days. General privacy questions can go to <a href="mailto:privacy@lireons.com">privacy@lireons.com</a>.</p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader label="Legal" title="Privacy policy" lead="What personal data Lireons processes for schools, coaching centres and academies, who decides how it is used, and how students and guardians can use their rights."
        backdrop={false}
        facts={[
          { k: "Last updated", v: "20 October 2026" },
          { k: "Sections", v: `${sections.length}` },
          { k: "Law", v: "India, DPDP Act 2023" },
          { k: "Privacy contact", v: <a href="mailto:privacy@lireons.com" className="underline decoration-line-2 underline-offset-4 hover:decoration-ink">privacy@lireons.com</a> },
        ]}
      />
      <LegalDoc
        layoutKey="privacy"
        sections={sections}
        updated="20 October 2026"
        note={<><strong className="font-medium">This is a template.</strong> It reflects how Lireons intends to handle data and must be reviewed by qualified Indian counsel, alongside our data processing terms, before it is relied on.</>}
      />
    </>
  );
}
