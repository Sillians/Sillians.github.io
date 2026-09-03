import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleContents } from "@/components/article-contents";
import { Comments } from "@/components/comments";
import { SiteHeader } from "@/components/site-header";
import { ContentType, getAllContent, getContent, getTableOfContents, renderMarkdown } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return (["projects", "research", "writing"] as ContentType[]).flatMap((type) =>
    getAllContent(type).map((item) => ({ type, slug: item.slug }))
  );
}

export default async function DetailPage({ params }: { params: Promise<{ type: string; slug: string }> }) {
  const { type, slug } = await params;
  if (!["projects", "research", "writing"].includes(type)) notFound();
  const item = getContent(type as ContentType, slug);
  if (!item) notFound();
  const contentSupportsContents = type === "research" || type === "writing";
  const contents = contentSupportsContents ? getTableOfContents(item.body) : [];
  const hasContents = contents.length > 0;
  return (
    <>
      <SiteHeader />
      <main className={hasContents ? "article-page shell" : "article shell"}>
        {hasContents && <ArticleContents items={contents} />}
        <div className={hasContents ? "article article-main" : "article-main"}>
          <a className="back" href={`/${type}`}>← Back to {type}</a>
          <header className="article-header">
            <span className="section-index">{type} / {item.date}</span>
            <h1>{item.title}</h1>
            <p>{item.description}</p>
            <div className="tags">{item.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
          </header>
          {item.cover && (
            <Image
              className="article-cover"
              src={item.cover}
              alt={item.coverAlt || ""}
              width={1520}
              height={900}
              priority
            />
          )}
          <article className="article-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(item.body) }} />
          <Comments />
        </div>
      </main>
    </>
  );
}
