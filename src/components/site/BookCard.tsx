import { Link } from "@tanstack/react-router";
import { Check, Clock, Plus, Sparkles, Star, Zap } from "lucide-react";
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
    <article className="float-card glass-panel group overflow-hidden rounded-2xl flex flex-col justify-between max-w-[320px] mx-auto w-full border border-slate-800/80 bg-[#0c121e]/90 shadow-xl transition-all duration-300 hover:border-blue-500/40">
      <Link
        to="/store/$slug"
        params={{ slug: book.slug }}
        className="relative block overflow-hidden bg-slate-950 aspect-[3/4]"
      >
        <img
          src={book.cover}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Status Badges Overlay - Match Screenshot 1 */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none gap-1.5">
          {isPreorder ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-md shadow-blue-900/50">
              <Zap className="h-3 w-3 fill-white" /> PRE-ORDER
            </span>
          ) : isUpcoming ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/90 text-slate-200 border border-slate-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              <Clock className="h-3 w-3" /> COMING SOON
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              INSTANT PDF
            </span>
          )}

          {book.releaseDate ? (
            <span className="rounded-full bg-black/80 border border-white/20 text-[10px] text-slate-200 font-medium px-2 py-0.5 backdrop-blur-md">
              {book.releaseDate}
            </span>
          ) : isUpcoming ? (
            <span className="rounded-full bg-black/80 border border-white/20 text-[10px] text-slate-200 font-medium px-2 py-0.5 backdrop-blur-md">
              Coming Soon 2026
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-col gap-2.5 p-4 flex-1 justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full border border-slate-800 bg-slate-900/80 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              {book.genre}
            </span>
            <span className="font-display text-base text-white font-bold">{formatPrice(book.price)}</span>
          </div>

          {/* Star Rating Badge */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-3 w-3 ${
                    s <= Math.round(Number(averageRating || 5))
                      ? "fill-amber-400 text-amber-400"
                      : "text-zinc-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-white">
              {totalReviews > 0 && typeof averageRating === "number" ? averageRating.toFixed(1) : "5.0"}
            </span>
            <span className="text-[10px] text-slate-400">
              ({totalReviews || 0})
            </span>
          </div>

          <Link to="/store/$slug" params={{ slug: book.slug }}>
            <h3 className="text-sm font-display font-bold leading-snug hover:text-blue-400 transition-colors text-white line-clamp-1">
              {book.title}
            </h3>
          </Link>
          <p className="line-clamp-2 text-[11px] text-slate-400 leading-relaxed">{book.tagline}</p>
        </div>

        <div className="pt-2">
          <Button
            variant={inCart ? "secondary" : isPreorder ? "default" : isUpcoming ? "outline" : "default"}
            className={`w-full rounded-xl text-xs font-semibold h-9 ${
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
                <Check className="h-3.5 w-3.5 mr-1" /> In Cart
              </>
            ) : isPreorder ? (
              <>
                <Zap className="h-3.5 w-3.5 mr-1 fill-white" /> Pre-Order Now
              </>
            ) : isUpcoming ? (
              <>
                <Clock className="h-3.5 w-3.5 mr-1" /> Upcoming
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
