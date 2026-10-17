import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { legal } from "@/data/legal";

export const metadata: Metadata = {
  title: "Returns Policy",
  description: "How to return or replace Neo Lash® Pro products: tell us within 14 days of delivery and send items back in good condition.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return <LegalPage doc={legal.returns} path="/returns" />;
}
