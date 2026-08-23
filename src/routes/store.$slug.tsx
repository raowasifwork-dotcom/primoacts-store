import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, FileDown, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { BookCard } from "@/components/site/BookCard";
import { Button } from "@/components/ui/button";
import { BOOKS, formatPrice, getBook } from "@/lib/books";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/store/$slug")({
  loader: ({ params }) => {
    const book = getBook(params.slug);
    if (!book) throw notFound();
    return { book };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Book not found — Primo Acts" }, { name: "robots", content: "noindex" }],
      };
    }
    const { book } = loaderData;
    return {
      meta: [
        { title: `${book.title} — Primo Acts` },
        { name: "description", content: book.tagline },
        { property: "og:title", content: `${book.title} — Primo Acts` },
        { property: "og:description", content: book.tagline },
      ],
    };
  },
  component: BookDetail,
});

function BookDetail() {
  const { book } = Route.useLoaderData();
  const { add, has } = useCart();
  const [format, setFormat] = useState(book.formats[0] ?? "EPUB");
  const inCart = has(book.slug);

  const related = BOOKS.filter((b) => b.slug !== book.slug && b.genre === book.genre).slice(0, 3);

  return (
    <div className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Link
          to="/store"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to store
        </Link>

        <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <img
            src={book.cover}
            alt={`Cover of ${book.title}`}
            className="animate-drift w-full rounded-2xl object-cover shadow-[var(--shadow-float)]"
          />

          <div>
            {book.series && (
              <p className="font-display text-xs uppercase tracking-[0.3em] text-gold">
                {book.series}
              </p>
            )}
            <h1 className="mt-4 text-3xl md:text-5xl">{book.title}</h1>
            {book.subtitle && (
              <p className="mt-2 font-display text-lg text-muted-foreground">{book.subtitle}</p>
            )}
            <p className="mt-5 text-base italic text-foreground/90">{book.tagline}</p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {book.description}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-muted-foreground text-xs uppercase">Genre</dt>
                <dd className="mt-1 font-medium">{book.genre}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs uppercase">Pages</dt>
                <dd className="mt-1 font-medium">{book.pages}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs uppercase">Formats</dt>
                <dd className="mt-1 font-medium">{book.formats.join(" · ")}</dd>
              </div>
              {book.releaseDate && (
                <div>
                  <dt className="text-gold text-xs uppercase font-semibold">Release Date</dt>
                  <dd className="mt-1 text-gold font-bold">{book.releaseDate}</dd>
                </div>
              )}
            </dl>

            {book.status === "preorder" && (
              <div className="mt-6 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-xs text-gold flex items-center gap-3">
                <span className="text-xl">🔥</span>
                <div>
                  <p className="font-bold uppercase tracking-wider">Official Pre-Order Edition</p>
                  <p className="text-muted-foreground text-[11px]">
                    Expected digital delivery on <strong className="text-white">{book.releaseDate || "Release Date"}</strong>. Pre-order now to secure launch access.
                  </p>
                </div>
              </div>
            )}

            <div className="glass-panel mt-8 rounded-2xl p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Choose your digital format
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {book.formats.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                      format === f
                        ? "border-gold/60 bg-gold/15 text-gold"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <span className="font-display text-3xl text-gold font-bold">
                  {formatPrice(book.price)}
                </span>
                <Button
                  size="lg"
                  variant={inCart ? "secondary" : "default"}
                  className="shrink-0 bg-gold hover:bg-gold-light text-black font-semibold rounded-xl"
                  onClick={() => {
                    if (inCart) return;
                    add({
                      slug: book.slug,
                      title: book.title,
                      price: book.price,
                      cover: book.cover,
                      format,
                    });
                    toast.success(`${book.title} (${format}) added to cart`);
                  }}
                >
                  {inCart ? (
                    <>
                      <Check className="h-4 w-4 mr-1.5" /> In cart
                    </>
                  ) : book.status === "preorder" ? (
                    <>
                      <Plus className="h-4 w-4 mr-1.5" /> Pre-Order Now
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1.5" /> Add to cart
                    </>
                  )}
                </Button>
              </div>
            </div>   
            <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                <FileDown className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                Download links are emailed after your bank transfer is verified — usually within 12
                hours.
              </p>
            </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl">More {book.genre}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((b) => (
                <BookCard key={b.slug} book={b} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
