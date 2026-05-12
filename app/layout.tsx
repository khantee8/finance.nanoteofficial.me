import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NaNote Finance — Client Portfolio Analytics & Planning",
  description: "Member-only platform for portfolio analytics, risk evaluation, and financial planning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
