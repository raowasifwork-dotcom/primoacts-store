import { Link } from "@tanstack/react-router";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatPrice, type Book } from "@/lib/books";
import { useCart } from "@/lib/cart";

export function BookCard({ book }: { book: Book }) {
  const { add, has } = useCart();
  const inCart = has(book.slug);

  return (
    <article className="float-card glass-panel group overflow-hidden rounded-2xl">
      <Link
        to="/store/$slug"
        params={{ slug: book.slug }}
        className="block overflow-hidden bg-surface"
      >
        <img
          src={book.cover}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          className="aspect-2/3 w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-border px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
            {book.genre}
          </span>
          <span className="font-display text-lg text-gold">{formatPrice(book.price)}</span>
        </div>

        <Link to="/store/$slug" params={{ slug: book.slug }}>
          <h3 className="text-base leading-snug hover:text-gold">{book.title}</h3>
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{book.tagline}</p>

        <Button
          variant={inCart ? "secondary" : "default"}
          className="mt-1 w-full"
          onClick={() => {
            if (inCart) return;
            add({
              slug: book.slug,
              title: book.title,
              price: book.price,
              cover: book.cover,
              format: book.formats[0] ?? "EPUB",
            });
            toast.success(`${book.title} added to cart`);
          }}
        >
          {inCart ? (
            <>
              <Check className="h-4 w-4" /> In cart
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Add to cart
            </>
          )}
        </Button>
      </div>
    </article>
  );
}
