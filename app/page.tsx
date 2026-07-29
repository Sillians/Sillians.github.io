import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/content-card";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { getAllContent } from "@/lib/content";

export default function Home() {
  const content = getAllContent();
  const featured = content.filter((item) => item.featured);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero shell">
          <Reveal>
            <div className="eyebrow">
              Senior ML Engineer · AI Research Engineer
            </div>
            <h1>
              I design, build, and deploy
              <span> production-grade ML and AI systems.</span>
            </h1>
            <p className="hero-copy">
              End-to-end machine learning, from research and evaluation to reliable,
              observable systems in production.
            </p>
            <div className="hero-actions">
              <Button asChild>
                <Link href="#projects">
                  View selected work <ArrowDownRight aria-hidden="true" size={17} strokeWidth={1.8} />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <a href="https://github.com/Sillians" target="_blank" rel="noreferrer">
                  GitHub <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.8} />
                </a>
              </Button>
            </div>
          </Reveal>
          <div className="capability-strip" aria-label="Core capabilities">
            <div><strong>01</strong><span>Model systems</span></div>
            <div><strong>02</strong><span>ML platforms</span></div>
            <div><strong>03</strong><span>Research → production</span></div>
            <div><strong>04</strong><span>Evaluation & reliability</span></div>
          </div>
        </section>

        <section className="work shell" id="projects">
          <div className="section-heading">
            <div>
              <span className="section-index">01 / PROJECTS</span>
              <h2>Selected systems</h2>
            </div>
            <Link href="/projects">View all projects <ArrowRight aria-hidden="true" size={14} /></Link>
          </div>
          <div className="project-grid">
            {featured.filter((item) => item.type === "projects").map((item, index) => (
              <ContentCard item={item} key={item.slug} index={index} featured />
            ))}
          </div>
        </section>

        <section className="proof">
          <div className="shell proof-grid">
            <div>
              <span className="section-index light">HOW I WORK</span>
              <h2>From ambiguous problem to dependable system.</h2>
            </div>
            <div className="principles">
              <div><strong>Frame</strong><p>Turn a fuzzy product need into a measurable ML objective.</p></div>
              <div><strong>Prove</strong><p>Build the smallest rigorous experiment that can change a decision.</p></div>
              <div><strong>Ship</strong><p>Design for latency, cost, observability, and graceful failure from day one.</p></div>
            </div>
          </div>
        </section>

        <section className="library shell">
          <div className="library-column">
            <div className="section-heading compact">
              <div><span className="section-index">02 / RESEARCH</span><h2>Learning in public</h2></div>
              <Link href="/research">All <ArrowRight aria-hidden="true" size={14} /></Link>
            </div>
            <div className="list">
              {featured.filter((item) => item.type === "research").map((item) => (
                <ContentCard item={item} key={item.slug} compact />
              ))}
            </div>
          </div>
          <div className="library-column">
            <div className="section-heading compact">
              <div><span className="section-index">03 / WRITING</span><h2>Technical notes</h2></div>
              <Link href="/writing">All <ArrowRight aria-hidden="true" size={14} /></Link>
            </div>
            <div className="list">
              {featured.filter((item) => item.type === "writing").map((item) => (
                <ContentCard item={item} key={item.slug} compact />
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div className="shell footer-inner">
          <div className="footer-signature">
            <strong>Basil Ihuoma</strong>
            <p>Building AI systems that survive contact with production.</p>
          </div>
          <div className="footer-links">
            <a href="https://github.com/Sillians">GitHub <ArrowUpRight aria-hidden="true" size={13} /></a>
            <a href="mailto:ihuomacbasil@gmail.com">Email <ArrowUpRight aria-hidden="true" size={13} /></a>
            <a href="https://x.com/silbux120824" target="_blank" rel="noreferrer">X <ArrowUpRight aria-hidden="true" size={13} /></a>
            <a href="https://www.linkedin.com/in/basil-ihuoma-004356ab/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight aria-hidden="true" size={13} /></a>
          </div>
          <span>© {new Date().getFullYear()} Basil Ihuoma</span>
        </div>
      </footer>
    </>
  );
}
