import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="nav shell" aria-label="Main navigation">
        <Link className="brand" href="/">Basil Ihuoma</Link>
        <div className="nav-links">
          <Link href="/projects">Projects</Link>
          <Link href="/research">Research</Link>
          <Link href="/writing">Writing</Link>
          <a className="nav-cta" href="mailto:hello@basillians.github.io">Let&apos;s talk ↗</a>
        </div>
      </nav>
    </header>
  );
}
