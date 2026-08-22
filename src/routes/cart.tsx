import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";

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
          <div className="glass-panel mt-10 grid place-items-center gap-4 rounded-3xl px-6 py-20 text-center">
            <ShoppingBag className="h-8 w-8 text-gold" />
            <p className="text-sm text-muted-foreground">
              Your cart is empty. The library is one click away.
            </p>
            <Button asChild>
              <Link to="/store">Browse the store</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="mt-10 grid gap-4">
              {items.map((item) => (
                <li
                  key={item.slug}
                  className="glass-panel grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl p-4"
                >
                  <img
                    src={item.cover}
                    alt={`Cover of ${item.title}`}
                    className="aspect-2/3 w-16 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <Link
                      to="/store/$slug"
                      params={{ slug: item.slug }}
                      className="block truncate text-sm hover:text-gold"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                      {item.format} · digital download
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-display text-gold">{formatPrice(item.price)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${item.title}`}
                      onClick={() => remove(item.slug)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="glass-panel mt-8 rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {items.length} {items.length === 1 ? "title" : "titles"}
                </span>
                <span className="font-display text-3xl text-gold">{formatPrice(total)}</span>
              </div>
              <Button asChild size="lg" className="mt-6 w-full">
                <Link to="/checkout">
                  Continue to checkout <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
