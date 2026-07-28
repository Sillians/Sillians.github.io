import Link from "next/link";
import type { ContentItem } from "@/lib/content";

export function ContentCard({ item, index = 0, featured = false, compact = false }: {
  item: ContentItem; index?: number; featured?: boolean; compact?: boolean;
}) {
  const href = `/${item.type}/${item.slug}`;
  if (compact) {
    return (
      <Link className="content-row" href={href}>
        <span className="meta">{item.date}</span>
        <div><h3>{item.title}</h3><p>{item.description}</p></div>
        <span>↗</span>
      </Link>
    );
  }
  return (
    <Link className="project-card" href={href}>
      <div className="card-top"><span className="card-number">0{index + 1} / {item.year}</span><span className="card-arrow">↗</span></div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <div className="tags">{item.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
    </Link>
  );
}
