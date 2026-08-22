import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Copy, FileDown, Landmark } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        content:
          "Complete your Primo Acts order by bank transfer and receive your download links after verification.",
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
  const purchasedSlugs = items.map((i) => i.slug);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [placed, setPlaced] = useState<string | null>(null);

  const reference = useMemo(
    () => `PA-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    [],
  );

  if (placed) {
    return (
      <div className="section-pad">
        <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
          <BadgeCheck className="mx-auto h-12 w-12 text-gold" />
          <h1 className="mt-6 text-3xl md:text-4xl">Order received</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Your order reference is{" "}
            <span className="font-display text-gold">{placed}</span>. Transfer the total to the
            account below, then email your payment screenshot with this reference to{" "}
            <a href={`mailto:${SITE.email}`} className="text-gold hover:underline">
              {SITE.email}
            </a>
            . Your PDFs are already unlocked on this device.
          </p>
          <BankDetails />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/downloads">
                <FileDown className="h-4 w-4" /> Download your PDFs
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/store">Back to the store</Link>
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
          <h1 className="text-3xl">Nothing to check out</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Add a book to your cart to continue.
          </p>
          <Button asChild className="mt-8">
            <Link to="/store">Browse the store</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl">Checkout</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Payment is by bank transfer with manual verification. Enter your details, place the order,
          then send the transfer using your order reference.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
          <form
            className="glass-panel grid gap-5 rounded-3xl p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              unlockPurchases(purchasedSlugs, reference);
              setPlaced(reference);
              clear();
              toast.success(`Order ${reference} placed`);
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="co-name">Full name</Label>
              <Input
                id="co-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Reader"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="co-email">Delivery email</Label>
              <Input
                id="co-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <p className="text-xs text-muted-foreground">
                Your download links are sent to this address.
              </p>
            </div>

            <BankDetails />

            <Button type="submit" size="lg" className="justify-self-start">
              Place order · {formatPrice(total)}
            </Button>
          </form>

          <aside className="glass-panel h-fit rounded-3xl p-6">
            <p className="font-display text-lg">Order summary</p>
            <ul className="mt-5 grid gap-4">
              {items.map((item) => (
                <li key={item.slug} className="grid grid-cols-[40px_minmax(0,1fr)_auto] gap-3">
                  <img
                    src={item.cover}
                    alt=""
                    className="aspect-2/3 w-10 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.format}</p>
                  </div>
                  <span className="shrink-0 text-sm">{formatPrice(item.price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-display text-2xl text-gold">{formatPrice(total)}</span>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Reference: <span className="text-gold">{reference}</span>
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function BankDetails() {
  const { bank } = SITE;
  const rows = [
    { label: "Bank", value: bank.bank },
    { label: "Account title", value: bank.accountTitle },
    { label: "Account / IBAN", value: bank.accountNumber },
  ];

  return (
    <div className="rounded-2xl border border-gold/25 bg-surface/60 p-5 text-left">
      <p className="flex items-center gap-2 text-sm font-medium">
        <Landmark className="h-4 w-4 shrink-0 text-gold" /> {bank.label}
      </p>
      <dl className="mt-4 grid gap-3 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                {row.label}
              </dt>
              <dd className="truncate">{row.value}</dd>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Copy ${row.label}`}
              className="shrink-0"
              onClick={() => {
                void navigator.clipboard.writeText(row.value);
                toast.success(`${row.label} copied`);
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{bank.note}</p>
    </div>
  );
}
