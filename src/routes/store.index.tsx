import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { BookCard } from "@/components/site/BookCard";
import { useLiveBooks } from "@/lib/admin-store";
import { GENRES } from "@/lib/books";

export const Route = createFileRoute("/store/")({
  head: () => ({
    meta: [
      { title: "Digital Book Store — Primo Acts" },
      {
        name: "description",
        content:
          "Browse the Primo Acts digital library: the Shadowrealm PDF editions, buy and download instantly.",
      },
      { property: "og:title", content: "Digital Book Store — Primo Acts" },
      {
        property: "og:description",
        content: "Every Primo Acts title, delivered instantly as PDF.",
      },
    ],
  }),
  component: StorePage,
});

function StorePage() {
  const { books } = useLiveBooks();
  const [genre, setGenre] = useState<string>("All");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const filtered = books.filter((b) => {
    if (genre === "All") return true;
    if (genre === "Pre-Order / Upcoming") return b.status === "preorder" || b.status === "upcoming";
    return b.genre === genre;
  }).sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  });

  return (
    <div className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-display text-xs uppercase tracking-[0.35em] text-gold">Digital store</p>
        <h1 className="mt-4 text-4xl md:text-5xl">The library</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Every title is a DRM-free PDF you can download right after ordering. Pay by bank
          transfer; the author verifies each order personally.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="flex min-w-0 flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                  genre === g
                    ? "border-gold/60 bg-gold/10 text-gold"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="shrink-0 rounded-full border border-border bg-surface px-4 py-2 text-xs text-muted-foreground"
            aria-label="Sort books"
          >
            <option value="featured">Featured first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-sm text-muted-foreground">
            No titles in this genre yet — more are on the way.
          </p>
        )}
      </div>
    </div>
  );
}
