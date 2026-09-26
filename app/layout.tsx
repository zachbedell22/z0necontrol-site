import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://zonecontrol.io"),
  title: "Z0neControl — Grow Room OS",
  description:
    "Local-first, vendor-neutral cultivation software that coordinates sensing, decisions, equipment commands, verification, room history and cultivation intelligence.",
  openGraph: {
    title: "Z0neControl — Grow Room OS",
    description:
      "Prove. Steer. Protect. A local-first operating layer for cultivation facilities and equipment manufacturers.",
    url: "https://zonecontrol.io",
    siteName: "Z0neControl",
    type: "website",
  },
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
