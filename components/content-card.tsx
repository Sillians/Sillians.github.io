import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ContentItem } from "@/lib/content";

export type ContentCardItem = Pick<ContentItem, "type" | "slug" | "title" | "description" | "date" | "year" | "tags">;

export function ContentCard({ item, index = 0, compact = false }: {
  item: ContentCardItem; index?: number; featured?: boolean; compact?: boolean;
}) {
  const href = `/${item.type}/${item.slug}`;
  if (compact) {
    return (
      <Link className="content-row" href={href}>
        <span className="meta">{item.date}</span>
        <div><h3>{item.title}</h3><p>{item.description}</p></div>
        <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.7} />
      </Link>
    );
  }
  return (
    <Link className="project-card" href={href}>
      <div className="card-top"><span className="card-number">0{index + 1} / {item.year}</span><ArrowUpRight className="card-arrow" aria-hidden="true" size={22} strokeWidth={1.6} /></div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <div className="tags">{item.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
    </Link>
  );
}
