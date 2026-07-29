import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@/components/analytics";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://sillians.github.io"),
  title: { default: "Basil Ihuoma — ML Engineer", template: "%s — Basil Ihuoma" },
  description: "Senior ML engineer designing, building, and deploying production AI systems.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Basil Ihuoma — Production-Grade ML and AI Systems",
    description: "Research-minded engineering. Production-grade execution.",
    url: "https://sillians.github.io",
    siteName: "Basil Ihuoma",
    type: "website",
  },
  twitter: { card: "summary" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
