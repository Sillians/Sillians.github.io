"use client";

import { useMemo, useState } from "react";
import { ContentCard, type ContentCardItem } from "@/components/content-card";

export function WritingIndex({ items }: { items: ContentCardItem[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const tags = useMemo(
    () => [...new Set(items.flatMap((item) => item.tags))].sort((a, b) => a.localeCompare(b)),
    [items],
  );
  const filteredItems = activeTag ? items.filter((item) => item.tags.includes(activeTag)) : items;

  return (
    <section className="writing-library" aria-label="Writing library">
      <div className="writing-filters" aria-label="Filter writing by topic">
        <button
          className="writing-filter"
          type="button"
          aria-pressed={activeTag === null}
          onClick={() => setActiveTag(null)}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            className="writing-filter"
            type="button"
            aria-pressed={activeTag === tag}
            key={tag}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      {filteredItems.length ? (
        <div className="index-list">
          {filteredItems.map((item, index) => <ContentCard item={item} index={index} featured key={item.slug} />)}
        </div>
      ) : (
        <p className="writing-empty">No notes match this topic yet.</p>
      )}
    </section>
  );
}
