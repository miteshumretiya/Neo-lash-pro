import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { legal } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Neo Lash® Pro handles your data: no accounts, no tracking cookies — orders and messages happen on WhatsApp.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPage doc={legal.privacy} path="/privacy" />;
}
