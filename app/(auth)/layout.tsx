import { MinimalShell } from "@/components/pages/MinimalShell";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <MinimalShell>{children}</MinimalShell>;
}
