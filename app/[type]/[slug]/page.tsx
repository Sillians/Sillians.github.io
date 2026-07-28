import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ContentType, getContent, renderMarkdown } from "@/lib/content";

export default async function DetailPage({ params }: { params: Promise<{ type: string; slug: string }> }) {
  const { type, slug } = await params;
  if (!["projects", "research", "writing"].includes(type)) notFound();
  const item = getContent(type as ContentType, slug);
  if (!item) notFound();
  return (
    <>
      <SiteHeader />
      <main className="article shell">
        <a className="back" href={`/${type}`}>← Back to {type}</a>
        <header className="article-header">
          <span className="section-index">{type} / {item.date}</span>
          <h1>{item.title}</h1>
          <p>{item.description}</p>
          <div className="tags">{item.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
        </header>
        <article className="article-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(item.body) }} />
      </main>
    </>
  );
}
