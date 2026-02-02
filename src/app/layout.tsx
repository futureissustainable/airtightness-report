import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Air Tightness Test Report",
  description: "Advanced Air Tightness Test Report in accordance with ISO 9972:2015 & Passive House Requirements",
  keywords: ["air tightness", "blower door", "ISO 9972", "Passive House", "n50", "airtightness test"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[var(--color-background)]">
        {children}
      </body>
    </html>
  );
}
