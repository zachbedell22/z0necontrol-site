import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Z0neControl — Local-first grow control & truthful logging",
  description:
    "Modular, local-first grow control that keeps logging and automation running even when Wi‑Fi or cloud fails. Real sensor truth, safety guardrails, manual override, and clean exports.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}