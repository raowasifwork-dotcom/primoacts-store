import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/books";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Primo Acts" },
      {
        name: "description",
        content: "Review the digital books in your Primo Acts cart before checkout.",
      },
      { property: "og:title", content: "Your Cart — Primo Acts" },
      { property: "og:description", content: "Review your Primo Acts digital book order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, total } = useCart();

  return (
    <div className="section-pad">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl">Your cart</h1>

        {items.length === 0 ? (
          <div className="glass-panel mt-10 grid place-items-center gap-4 rounded-3xl px-6 py-20 text-center border border-slate-800">
            <ShoppingBag className="h-8 w-8 text-blue-400" />
            <p className="text-sm text-slate-400">
              Your cart is empty. The library is one click away.
            </p>
            <Button asChild className="btn-gold rounded-xl">
              <Link to="/store">Browse the store</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="mt-10 grid gap-4">
              {items.map((item) => (
                <li
                  key={item.slug}
                  className="glass-panel grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl p-4 border border-slate-800"
                >
                  <img
                    src={item.cover}
                    alt={`Cover of ${item.title}`}
                    className="aspect-2/3 w-16 rounded-lg object-cover border border-slate-700"
                  />
                  <div className="min-w-0">
                    <Link
                      to="/store/$slug"
                      params={{ slug: item.slug }}
                      className="block truncate text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                      {item.format} · digital download
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-display font-bold text-white">{formatPrice(item.price)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${item.title}`}
                      onClick={() => remove(item.slug)}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="glass-panel mt-8 rounded-3xl p-6 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">
                  {items.length} {items.length === 1 ? "title" : "titles"}
                </span>
                <span className="font-display text-3xl font-bold text-white">{formatPrice(total)}</span>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="btn-gold flex-1 rounded-xl">
                  <Link to="/checkout">
                    Continue to checkout <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>

                <a
                  href={`https://wa.me/92309296743?text=${encodeURIComponent(
                    `Hi Rao Wasif, I want to order from Primo Acts:\n${items.map((i) => `• ${i.title} (${formatPrice(i.price)})`).join("\n")}\nTotal: ${formatPrice(total)}\nPlease share payment details for instant delivery.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25d366]/20 hover:bg-[#25d366]/30 border border-[#25d366]/40 text-[#25d366] font-semibold px-5 py-3 text-xs sm:text-sm transition-all"
                >
                  <MessageCircle className="h-4 w-4 fill-emerald-500" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
