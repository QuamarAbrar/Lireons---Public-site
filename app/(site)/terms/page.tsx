import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/pages/PageHeader";
import { LegalDoc, type LegalSection } from "@/components/pages/LegalDoc";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms that govern how institutions and their users use Lireons, including fees, refunds, AI features and data.",
};

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: (
      <>
        <p>These Terms of Service (the <strong>Terms</strong>) govern access to and use of the Lireons platform, websites, mobile apps and related services (the <strong>Services</strong>), operated by [Lireons Technologies Private Limited], a company incorporated in India with its registered office at [registered address] (<strong>Lireons</strong>, <strong>we</strong>, <strong>us</strong>).</p>
        <p>The Services are sold to institutions such as schools, coaching centres and online academies. When an institution signs an order form or accepts these Terms online, it agrees to them on its own behalf. People who use the Services through an institution, such as staff, teachers, students and guardians, also agree to the parts of these Terms that apply to them.</p>
        <p>If an order form signed with us conflicts with these Terms, the order form applies for that point only.</p>
      </>
    ),
  },
  {
    id: "definitions",
    title: "Definitions",
    body: (
      <ul>
        <li><strong>Institution</strong> means the school, coaching centre, academy or other organisation that subscribes to the Services.</li>
        <li><strong>Authorised User</strong> means a person the Institution allows to use the Services, including administrators, staff, teachers, students and guardians.</li>
        <li><strong>Student</strong> means a learner enrolled with the Institution. A Student may be a child, meaning a person under 18 years of age.</li>
        <li><strong>Guardian</strong> means a parent or lawful guardian of a Student.</li>
        <li><strong>Customer Data</strong> means data that the Institution or its Authorised Users submit to, or generate within, the Services.</li>
        <li><strong>Order Form</strong> means the quote or order that the Institution accepts, listing products, student count, term and fees.</li>
        <li><strong>DPDP Act</strong> means the Digital Personal Data Protection Act, 2023 and the rules made under it.</li>
      </ul>
    ),
  },
  {
    id: "accounts",
    title: "Accounts and access",
    body: (
      <>
        <p>Each Institution gets its own tenant on a dedicated address, such as <strong>yourschool.lireons.com</strong>, or on its own domain where the Academy product is used. The Institution appoints at least one administrator, who controls which Authorised Users get access and which roles and permissions they hold.</p>
        <ul>
          <li>Keep sign-in credentials and one-time passwords confidential. Do not share accounts between people.</li>
          <li>Tell us promptly at <a href="mailto:security@lireons.com">security@lireons.com</a> if you suspect unauthorised access.</li>
          <li>The Institution is responsible for activity carried out by its Authorised Users under their accounts.</li>
        </ul>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>You agree to use the Services lawfully and only for the educational and administrative purposes of the Institution. You must not:</p>
        <ul>
          <li>upload content that is unlawful, infringing, defamatory, obscene, or harmful to children, or that is prohibited under the Information Technology Act, 2000 and the rules made under it;</li>
          <li>attempt to access another tenant’s data, probe or bypass security controls, or interfere with the Services;</li>
          <li>send unsolicited commercial messages through the messaging features, or message people who have not agreed to receive them;</li>
          <li>resell or sublicense the Services, or use them to build a competing product;</li>
          <li>use the AI features to make decisions about a Student without the human review described in these Terms.</li>
        </ul>
        <p>We may remove content or suspend access that breaches this section, and will tell the Institution’s administrator when we do, unless the law prevents us.</p>
      </>
    ),
  },
  {
    id: "students",
    title: "Students, minors and guardian consent",
    body: (
      <>
        <p>Many Students are children. The Institution is responsible for obtaining verifiable consent from a Guardian before processing a child’s personal data, as required by section 9 of the DPDP Act, unless an exemption notified under the DPDP Act applies to the Institution for that purpose.</p>
        <ul>
          <li>The Services are configured so that children’s data is used for education, administration and safety, such as courses, live classes, tests and doubt solving.</li>
          <li>We do not use children’s data for tracking or behavioural monitoring unrelated to these purposes, and we do not show targeted advertising to children.</li>
          <li>Where a Student account is created for a child, the Institution should give the Guardian a way to see and manage it, such as the parent app.</li>
        </ul>
      </>
    ),
  },
  {
    id: "data",
    title: "Customer data and privacy",
    body: (
      <>
        <p>The Institution owns its Customer Data. For personal data in Customer Data, the Institution acts as the <strong>Data Fiduciary</strong> and Lireons acts as its <strong>Data Processor</strong> under the DPDP Act. We process that data only on the Institution’s instructions, as set out in these Terms, the Order Form and our data processing terms.</p>
        <p>For data we collect for our own purposes, such as website visits, demo requests and billing contacts, Lireons is the Data Fiduciary. Our <Link href="/privacy">Privacy Policy</Link> explains both cases in more detail.</p>
        <p>The Institution may export its Customer Data at any time while its subscription is active and for 30 days after it ends.</p>
      </>
    ),
  },
  {
    id: "ai",
    title: "AI features",
    body: (
      <>
        <p>Some products include features that use machine learning, including the AI proctor in Assessments and the AI Doubt Solver. These features support decisions that people at the Institution make.</p>
        <ul>
          <li><strong>Proctoring.</strong> The AI proctor flags signals such as a second face, tab switching or voices, and links each flag to the recorded evidence. A reviewer appointed by the Institution must clear or uphold every flag before a result that depends on it is final.</li>
          <li><strong>Doubt solving.</strong> Answers are generated from the Institution’s own material and show their source. Answers can be wrong. Low-confidence questions are handed to a teacher.</li>
          <li><strong>Your responsibility.</strong> The Institution must not rely on AI output as the sole basis for a decision that significantly affects a Student, such as failing an exam, without human review.</li>
          <li><strong>Training.</strong> We do not use Customer Data to train general-purpose AI models without the Institution’s written permission.</li>
        </ul>
      </>
    ),
  },
  {
    id: "messaging",
    title: "WhatsApp, SMS and email messages",
    body: (
      <>
        <p>The Services can send messages to Guardians, Students and staff through WhatsApp, SMS and email, such as live class reminders, test schedules and results.</p>
        <ul>
          <li>The Institution is responsible for having the consent of each recipient and for the content of messages it sends.</li>
          <li>WhatsApp messages are sent through the WhatsApp Business Platform and are subject to WhatsApp’s business and commerce policies. SMS is subject to the Telecom Commercial Communications Customer Preference Regulations issued by TRAI.</li>
          <li>Recipients can opt out of non-essential messages. Messages that the law requires, or that are needed for a Student’s safety, may continue.</li>
        </ul>
      </>
    ),
  },
  {
    id: "fees",
    title: "Subscription fees and payment",
    body: (
      <>
        <p>Fees are charged per active student, per year, for each product listed on the Order Form. An active student is a Student enrolled with access to the Services during the subscription term. The Order Form states the price, the term and the billing schedule.</p>
        <ul>
          <li>Invoices include applicable Goods and Services Tax. Fees exclude taxes unless the Order Form says otherwise.</li>
          <li>You can pay by NEFT, RTGS, UPI, or by card and netbanking through Razorpay. Invoices are due within [15] days unless the Order Form states otherwise.</li>
          <li>If the number of active students rises above the number on the Order Form, we may invoice the difference for the rest of the term. We will tell you before we do.</li>
          <li>If an invoice remains unpaid [30] days after it is due, we may suspend access after giving the administrator at least [7] days’ written notice. Data is not deleted during a suspension.</li>
        </ul>
      </>
    ),
  },
  {
    id: "payments",
    title: "Payments collected through Lireons",
    body: (
      <>
        <p>Institutions can collect course and test payments from Guardians and Students through the Services. These payments are processed by Razorpay Software Private Limited, a payment aggregator, and are settled to the Institution’s own account.</p>
        <ul>
          <li>Lireons is not a party to the payment between the Institution and the payer, and does not hold those funds.</li>
          <li>Card, UPI and netbanking details are entered on Razorpay’s pages. We receive the payment status, amount and reference, not full card numbers.</li>
          <li>Questions about the price of a course or test, or about discounts, should go to the Institution.</li>
        </ul>
      </>
    ),
  },
  {
    id: "refunds",
    title: "Refunds and cancellations",
    body: (
      <>
        <h3>Subscription fees paid to Lireons</h3>
        <ul>
          <li>An Institution may cancel a new subscription within [30] days of its first invoice for a full refund of subscription fees paid for that term, less the cost of any migration work listed separately on the Order Form.</li>
          <li>After that period, the Institution may cancel at any time, effective at the end of the current billing period. Fees already paid for that period are not refunded unless we have materially breached these Terms and not fixed the breach within [30] days of notice.</li>
          <li>If we end the Services for reasons other than the Institution’s breach, we refund prepaid fees for the unused part of the term.</li>
          <li>Approved refunds are paid to the original payment method or bank account within [14] working days.</li>
        </ul>
        <h3>Fees paid by Guardians or Students to an Institution</h3>
        <ul>
          <li>Refunds of course fees or test fees follow the Institution’s own refund policy. Please contact the Institution first.</li>
          <li>When an Institution approves a refund, it is issued through Razorpay to the original payment method. Banks usually credit it within 5 to 7 working days.</li>
          <li>If money left your account but the payment failed, it is reversed automatically by Razorpay or your bank. If it has not arrived after 7 working days, write to the Institution with the payment reference, and we will help them trace it.</li>
        </ul>
      </>
    ),
  },
  {
    id: "availability",
    title: "Availability and support",
    body: (
      <>
        <p>We work to keep the Services available at all times, and publish the current state of each component on our <Link href="/status">status page</Link>. We schedule maintenance outside school hours where we can and announce it in advance.</p>
        <p>Support is available by email to administrators. Specific response times or service levels apply only if they are written into the Order Form.</p>
      </>
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: (
      <>
        <p>Lireons owns the Services, including the software, design and documentation. We grant the Institution a non-exclusive, non-transferable right to use the Services during the subscription term for its own educational and administrative purposes.</p>
        <p>The Institution keeps all rights in its content, such as lessons, question banks and branding, and grants us a licence to host, copy and display it only as needed to provide the Services. If you send us feedback, we may use it without obligation.</p>
      </>
    ),
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    body: <p>Each party will keep the other’s non-public information confidential, use it only to perform under these Terms, and share it only with people who need to know it and are bound by similar obligations. This does not apply to information that is public, already known, independently developed, or required to be disclosed by law.</p>,
  },
  {
    id: "termination",
    title: "Term, suspension and termination",
    body: (
      <>
        <p>The subscription runs for the term on the Order Form and renews only if both parties agree. Either party may terminate for material breach that is not fixed within [30] days of written notice.</p>
        <p>After termination, the Institution has 30 days to export its Customer Data. We then delete it from live systems within [60] days, and from backups as they expire, unless the law requires us to keep part of it.</p>
      </>
    ),
  },
  {
    id: "warranties",
    title: "Warranties and disclaimers",
    body: <p>We will provide the Services with reasonable skill and care, and in line with the documentation. Apart from that, the Services are provided as they are and as available. We do not promise that they will be uninterrupted or error-free, or that AI output will always be correct.</p>,
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <>
        <p>Neither party is liable for indirect or consequential loss, or for loss of profit, revenue or goodwill. Each party’s total liability arising out of these Terms in any 12-month period is limited to the fees paid or payable by the Institution in that period.</p>
        <p>These limits do not apply to an Institution’s obligation to pay fees, to breaches of confidentiality, or to liability that cannot be limited under Indian law.</p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnity",
    body: <p>The Institution will defend Lireons against third-party claims arising from content it uploads, messages it sends, or its failure to obtain consent required by law, and will cover resulting losses that a court awards. Lireons will defend the Institution against third-party claims that the Services infringe intellectual property rights in India.</p>,
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: <p>We may update these Terms. If a change materially affects your rights, we will tell administrators at least 30 days before it takes effect. Changes do not apply to an Order Form already signed until it renews, unless the law requires otherwise.</p>,
  },
  {
    id: "law",
    title: "Governing law and disputes",
    body: (
      <>
        <p>These Terms are governed by the laws of India. The parties will first try to resolve any dispute through good-faith discussion for 30 days.</p>
        <p>Disputes that remain unresolved will be referred to arbitration by a sole arbitrator under the Arbitration and Conciliation Act, 1996. The seat of arbitration is [city], the language is English, and courts at [city] have exclusive jurisdiction for related matters.</p>
      </>
    ),
  },
  {
    id: "grievance",
    title: "Grievance officer and contact",
    body: (
      <>
        <p>In line with the Information Technology Act, 2000, the rules made under it, and the DPDP Act, you can raise a complaint with our Grievance Officer:</p>
        <ul>
          <li>Name: [Grievance Officer name]</li>
          <li>Email: <a href="mailto:grievance@lireons.com">grievance@lireons.com</a></li>
          <li>Address: [registered address]</li>
        </ul>
        <p>We acknowledge complaints within 24 hours and aim to resolve them within 15 days. For anything else, write to <a href="mailto:hello@lireons.com">hello@lireons.com</a>.</p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader label="Legal" title="Terms of service" lead="The agreement between Lireons and the institutions that use it, written to be read. Placeholders in square brackets are filled in per contract."
        backdrop={false}
        facts={[
          { k: "Last updated", v: "20 October 2026" },
          { k: "Sections", v: `${sections.length}` },
          { k: "Law", v: "India, DPDP Act 2023" },
          { k: "Questions", v: <a href="mailto:hello@lireons.com" className="underline decoration-line-2 underline-offset-4 hover:decoration-ink">hello@lireons.com</a> },
        ]}
      />
      <LegalDoc
        layoutKey="terms"
        sections={sections}
        updated="20 October 2026"
        note={<><strong className="font-medium">This is a template.</strong> It reflects how Lireons intends to operate and must be reviewed by qualified Indian counsel before it is relied on.</>}
      />
    </>
  );
}
