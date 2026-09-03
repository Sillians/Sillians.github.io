import type { Metadata } from "next";
import { Analytics } from "@/components/analytics";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

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
      <body>
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
