import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, CheckCircle2, Copy, FileDown, Mail, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLiveOrders } from "@/lib/admin-store";
import { formatPrice } from "@/lib/books";
import { useCart } from "@/lib/cart";
import { unlockPurchases } from "@/lib/library";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Primo Acts" },
      {
        name: "description",
        content: "Complete your Primo Acts digital book order.",
      },
      { property: "og:title", content: "Checkout — Primo Acts" },
      { property: "og:description", content: "Complete your Primo Acts digital book order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { createOrder } = useLiveOrders();
  const purchasedSlugs = items.map((i) => i.slug);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [placed, setPlaced] = useState<string | null>(null);

  const reference = useMemo(
    () => `PA-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    [],
  );

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in your name and email.");
      return;
    }

    // Save order in Admin live orders hub
    createOrder({
      reference,
      customerName: name,
      customerEmail: email,
      items: items.map((i) => ({ slug: i.slug, title: i.title, price: i.price })),
      total,
    });

    unlockPurchases(purchasedSlugs, reference);
    setPlaced(reference);
    clear();
    toast.success(`Order ${reference} confirmed!`);
  };

  if (placed) {
    return (
      <div className="section-pad">
        <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
          <BadgeCheck className="mx-auto h-16 w-16 text-gold animate-bounce" />
          <h1 className="mt-6 text-3xl md:text-4xl font-display uppercase tracking-wide text-white">
            Order Confirmed
          </h1>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Thank you, <strong className="text-white">{name || "Reader"}</strong>! Your order reference is{" "}
            <span className="font-display font-bold text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
              {placed}
            </span>
            . Your digital book PDFs are unlocked on this device right now.
          </p>

          <div className="mt-8 rounded-2xl border border-border/60 bg-surface/50 p-6 text-left space-y-3">
            <p className="text-xs uppercase font-semibold tracking-wider text-gold flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Instant Digital Delivery
            </p>
            <p className="text-xs text-muted-foreground">
              A copy of your order details has been forwarded to the author ({SITE.founder}). For questions, contact{" "}
              <a href={`mailto:${SITE.email}`} className="text-gold hover:underline">
                {SITE.email}
              </a>
              .
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-gold hover:bg-gold-light text-black font-semibold rounded-xl">
              <Link to="/downloads">
                <FileDown className="h-4 w-4 mr-1.5" /> Download Your PDFs Now
              </Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-xl">
              <Link to="/store">Back to Store</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="section-pad">
        <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
          <h1 className="text-3xl font-display uppercase">Nothing to check out</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Add a book to your cart to continue.
          </p>
          <Button asChild className="mt-8 bg-gold hover:bg-gold-light text-black font-semibold rounded-xl">
            <Link to="/store">Browse the store</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl font-display uppercase tracking-wide text-white">Checkout</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Complete your order to instantly receive DRM-free high resolution PDF editions of the Shadowrealm universe.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
          <form
            className="glass-panel grid gap-5 rounded-3xl p-6 md:p-8"
            onSubmit={handleSubmitOrder}
          >
            <div className="grid gap-2">
              <Label htmlFor="co-name">Your Full Name *</Label>
              <Input
                id="co-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rao Wasif"
                className="bg-surface/80 border-border/60"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="co-email">Delivery Email *</Label>
              <Input
                id="co-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reader@example.com"
                className="bg-surface/80 border-border/60"
              />
              <p className="text-xs text-muted-foreground">
                Your order confirmation and digital library access link will be associated with this address.
              </p>
            </div>

            <div className="rounded-2xl border border-gold/30 bg-gold/5 p-4 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-gold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Instant Digital Access
              </p>
              <p>Your books unlock immediately upon submitting your order.</p>
            </div>

            <Button type="submit" size="lg" className="justify-self-start bg-gold hover:bg-gold-light text-black font-semibold rounded-xl mt-2">
              Place Order · {formatPrice(total)}
            </Button>
          </form>

          <aside className="glass-panel h-fit rounded-3xl p-6">
            <p className="font-display text-lg uppercase tracking-wider text-white">Order Summary</p>
            <ul className="mt-5 grid gap-4">
              {items.map((item) => (
                <li key={item.slug} className="grid grid-cols-[40px_minmax(0,1fr)_auto] gap-3">
                  <img
                    src={item.cover}
                    alt=""
                    className="aspect-2/3 w-10 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.format || "PDF Edition"}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-gold">{formatPrice(item.price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-display text-2xl text-gold font-bold">{formatPrice(total)}</span>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Reference: <span className="text-gold font-mono font-bold">{reference}</span>
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

