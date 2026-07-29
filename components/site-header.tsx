import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="nav shell" aria-label="Main navigation">
        <Link className="brand" href="/">Basil Ihuoma</Link>
        <div className="nav-links">
          <Link href="/projects">Projects</Link>
          <Link href="/research">Research</Link>
          <Link href="/writing">Writing</Link>
          <Link href="/cv">CV</Link>
          <a className="nav-cta" href="mailto:ihuomacbasil@gmail.com">
            Let&apos;s talk <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.8} />
          </a>
        </div>
      </nav>
    </header>
  );
}
