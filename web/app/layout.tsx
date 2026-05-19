import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conformly — Design-to-Certificate AI for medical devices",
  description:
    "Conformly continuously analyses your device design against IVDR, ISO 13485, ISO 14971, IEC 62366 and IEC 62304. Get gap analyses, draft regulatory reports, and simulate a Notified Body review — all with every claim traceable to its source.",
  metadataBase: new URL("https://conformly.gopromp.com"),
  openGraph: {
    title: "Conformly — Design-to-Certificate AI for medical devices",
    description:
      "Upload your design. Conformly reads it against IVDR, ISO, IEC, and CLSI standards in real time — flagging gaps, generating reports, and simulating a Notified Body review.",
    url: "https://conformly.gopromp.com",
    siteName: "Conformly",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // The root layout is intentionally minimal. Each route group ((marketing)
  // or (app)) brings its own chrome — sidebar for the product, marketing
  // header + footer for the landing page.
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
