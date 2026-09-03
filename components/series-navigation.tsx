import Link from "next/link";
import type { ContentItem } from "@/lib/content";

export function SeriesNavigation({ item, items }: { item: ContentItem; items: ContentItem[] }) {
  if (items.length < 2 || !item.series) return null;
  const currentIndex = items.findIndex((candidate) => candidate.slug === item.slug);
  const previous = currentIndex > 0 ? items[currentIndex - 1] : undefined;
  const next = currentIndex < items.length - 1 ? items[currentIndex + 1] : undefined;

  return (
    <nav className="series-navigation" aria-label={`${item.series} series navigation`}>
      <p>Series · {item.series}{item.part ? ` · Part ${item.part}` : ""}</p>
      <div>
        {previous ? <Link href={`/${previous.type}/${previous.slug}`}>← {previous.title}</Link> : <span />}
        {next ? <Link href={`/${next.type}/${next.slug}`}>{next.title} →</Link> : <span />}
      </div>
    </nav>
  );
}
