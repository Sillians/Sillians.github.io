import { notFound } from "next/navigation";
import { ContentCard } from "@/components/content-card";
import { SiteHeader } from "@/components/site-header";
import { ResearchIndex } from "@/components/research-index";
import { ContentType, getAllContent } from "@/lib/content";

const labels: Record<ContentType, { title: string; intro: string; index: string }> = {
  projects: { title: "Projects", index: "01", intro: "Production-minded AI systems: the architecture, decisions, tradeoffs, and measurable outcomes behind what I build." },
  research: { title: "Research", index: "02", intro: "Paper notes, experiments, and technical investigations that turn new ideas into engineering judgment." },
  writing: { title: "Writing", index: "03", intro: "Clear explanations of machine learning systems, evaluation, reliability, and the craft of shipping AI." },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(labels).map((type) => ({ type }));
}

export default async function IndexPage({ params }: { params: Promise<{ type: string }> }) {
  const { type: rawType } = await params;
  if (!(rawType in labels)) notFound();
  const type = rawType as ContentType;
  const label = labels[type];
  const items = getAllContent(type);
  return (
    <>
      <SiteHeader />
      <main className="index-page shell">
        <span className="section-index">{label.index} / ARCHIVE</span>
        <h1>{label.title}</h1>
        <p className="index-intro">{label.intro}</p>
        {type === "research" ? (
          <ResearchIndex items={items} />
        ) : (
          <div className="index-list">
            {items.map((item, index) => <ContentCard item={item} index={index} featured key={item.slug} />)}
          </div>
        )}
      </main>
    </>
  );
}
