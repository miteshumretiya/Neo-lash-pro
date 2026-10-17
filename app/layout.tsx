import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neo Lash® Pro",
  description: "Lash & brow salon, pro products and academy in Malta.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
