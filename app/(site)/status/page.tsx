import type { Metadata } from "next";
import { PageHeader } from "@/components/pages/PageHeader";
import { StatusBoard } from "@/components/pages/Status";

export const metadata: Metadata = {
  title: "Status",
  description: "Current status and 90-day history of the Lireons web app, payments, WhatsApp notifications, live classes, proctoring and API.",
};

export default function StatusPage() {
  return (
    <>
      <PageHeader label="Status" title="System status" lead="The current state of every part of Lireons, checked continuously. Times are in IST." backdrop="dots" />
      <StatusBoard />
    </>
  );
}
