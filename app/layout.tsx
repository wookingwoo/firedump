import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FireDump",
  description:
    "Export Firestore collections into portable JSON files without wiring up a custom script.",
  applicationName: "FireDump",
  keywords: ["Firestore backup", "Firebase export", "GitHub", "JSON export"],
  authors: [{ name: "wookingwoo" }],
  creator: "wookingwoo",
  publisher: "wookingwoo",
  openGraph: {
    title: "FireDump",
    description:
      "Export Firestore collections into portable JSON files without wiring up a custom script.",
    url: "https://github.com/wookingwoo/firedump",
    siteName: "FireDump",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
