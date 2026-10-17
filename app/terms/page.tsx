import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { legal } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms for using the Neo Lash® Pro website and ordering products through WhatsApp.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalPage doc={legal.terms} path="/terms" />;
}
