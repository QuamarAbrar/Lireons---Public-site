import type { Metadata } from "next";
import { SignIn } from "@/components/pages/SignIn";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your institution’s Lireons workspace.",
};

export default function SignInPage() {
  return <SignIn />;
}
