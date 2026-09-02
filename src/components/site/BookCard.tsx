import { Link } from "@tanstack/react-router";
import { Check, Clock, Flame, Plus, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useLiveReviews } from "@/lib/admin-store";
import { formatPrice, type Book } from "@/lib/books";
import { useCart } from "@/lib/cart";

export function BookCard({ book }: { book: Book }) {
  const { add, has } = useCart();
  const { totalReviews, averageRating } = useLiveReviews(book.slug);
  const inCart = has(book.slug);

  const isPreorder = book.status === "preorder";
  const isUpcoming = book.status === "upcoming";

  return (
    <article className="float-card glass-panel group overflow-hidden rounded-2xl flex flex-col justify-between">
      <Link
        to="/store/$slug"
        params={{ slug: book.slug }}
        className="relative block overflow-hidden bg-surface"
      >
        <img
          src={book.cover}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          className="aspect-2/3 w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Status Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {isPreorder && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 text-white px-2.5 py-1 text-[11px] font-bold font-display uppercase tracking-wider shadow-lg shadow-blue-900/40">
              <Flame className="h-3.5 w-3.5" /> Pre-Order
            </span>
          )}
          {isUpcoming && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-1 text-[11px] font-bold font-display uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5" /> Coming Soon
            </span>
          )}
          {book.releaseDate && (
            <span className="rounded-full bg-black/75 border border-white/20 text-[10px] text-white font-medium px-2 py-0.5 ml-auto backdrop-blur-md">
              {book.releaseDate}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-col gap-3 p-5 flex-1 justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full border border-slate-700 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              {book.genre}
            </span>
            <span className="font-display text-lg text-white font-bold">{formatPrice(book.price)}</span>
          </div>

          {/* Star Rating Badge on Card */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-3 w-3 ${
                    s <= Math.round(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-zinc-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-white">
              {totalReviews > 0 ? averageRating.toFixed(1) : "5.0"}
            </span>
            <span className="text-[10px] text-slate-400">
              ({totalReviews})
            </span>
          </div>

          <Link to="/store/$slug" params={{ slug: book.slug }}>
            <h3 className="text-base font-display font-bold leading-snug hover:text-blue-400 transition-colors text-white">
              {book.title}
            </h3>
          </Link>
          <p className="line-clamp-2 text-xs text-slate-400">{book.tagline}</p>
        </div>

        <div className="pt-2">
          <Button
            variant={inCart ? "secondary" : isPreorder ? "default" : isUpcoming ? "outline" : "default"}
            className={`w-full rounded-xl text-xs font-semibold ${
              isPreorder
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30"
                : isUpcoming
                ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                : "btn-gold"
            }`}
            onClick={() => {
              if (inCart) return;
              add({
                slug: book.slug,
                title: book.title,
                price: book.price,
                cover: book.cover,
                format: book.formats[0] ?? "PDF",
              });
              toast.success(`${book.title} added to cart`);
            }}
          >
            {inCart ? (
              <>
                <Check className="h-4 w-4" /> In cart
              </>
            ) : isPreorder ? (
              <>
                <Flame className="h-4 w-4 mr-1 text-black" /> Pre-Order ({formatPrice(book.price)})
              </>
            ) : isUpcoming ? (
              <>
                <Plus className="h-4 w-4 mr-1" /> Pre-Order Upcoming
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" /> Add to cart
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
