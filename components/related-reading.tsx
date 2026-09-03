import Link from "next/link";
import type { ContentItem } from "@/lib/content";

export function RelatedReading({ items }: { items: ContentItem[] }) {
  if (!items.length) return null;
  return (
    <aside className="related-reading" aria-label="Related reading">
      <p className="section-index">Related reading</p>
      <div>
        {items.map((item) => (
          <Link href={`/${item.type}/${item.slug}`} key={`${item.type}-${item.slug}`}>
            <span>{item.type}</span>
            <strong>{item.title}</strong>
            <span>→</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
