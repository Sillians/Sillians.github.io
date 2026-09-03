import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <div className="shell footer-inner">
        <div className="footer-signature">
          <strong><Link className="footer-brand" href="/">Basil Ihuoma</Link></strong>
          <p>Building AI systems that survive contact with production.</p>
        </div>
        <div className="footer-links">
          <a href="https://github.com/Sillians">
            GitHub <ArrowUpRight aria-hidden="true" size={13} />
          </a>
          <a href="mailto:ihuomacbasil@gmail.com">
            Email <ArrowUpRight aria-hidden="true" size={13} />
          </a>
          <a href="https://x.com/silbux120824" target="_blank" rel="noreferrer">
            X <ArrowUpRight aria-hidden="true" size={13} />
          </a>
          <a
            href="https://www.linkedin.com/in/basil-ihuoma-004356ab/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <ArrowUpRight aria-hidden="true" size={13} />
          </a>
        </div>
        <span>© {new Date().getFullYear()} Basil Ihuoma</span>
      </div>
    </footer>
  );
}
