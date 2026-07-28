import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://sillians.github.io"),
  title: { default: "Basillians — ML Engineer", template: "%s — Basillians" },
  description: "Senior ML engineer designing, building, and deploying production AI systems.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Basillians — Production AI Systems",
    description: "Research-minded engineering. Production-grade execution.",
    url: "https://sillians.github.io",
    siteName: "Basillians",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Basillians — Production AI Systems" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
