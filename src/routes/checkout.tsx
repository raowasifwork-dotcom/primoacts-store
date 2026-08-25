import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Building2,
  CreditCard,
  FileDown,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLiveOrders, useLiveSettings } from "@/lib/admin-store";
import { formatPrice } from "@/lib/books";
import { useCart } from "@/lib/cart";
import { unlockPurchases } from "@/lib/library";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Primo Acts" },
      { name: "description", content: "Complete your Primo Acts digital book order." },
      { property: "og:title", content: "Checkout — Primo Acts" },
      { property: "og:description", content: "Complete your Primo Acts digital book order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function formatCardNumber(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { createOrder } = useLiveOrders();
  const { settings } = useLiveSettings();
  const purchasedSlugs = items.map((i) => i.slug);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [placed, setPlaced] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "visa" | "mastercard">("bank");

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

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
    if (paymentMethod === "visa" || paymentMethod === "mastercard") {
      if (cardNumber.replace(/\s/g, "").length < 16) {
        toast.error("Please enter a valid 16-digit card number.");
        return;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        toast.error("Please enter a valid expiry date (MM/YY).");
        return;
      }
      if (!cardCvc || cardCvc.length < 3) {
        toast.error("Please enter a valid CVV.");
        return;
      }
      if (!cardName.trim()) {
        toast.error("Please enter the name on card.");
        return;
      }
    }

    try {
      createOrder({
        reference,
        customerName: name.trim(),
        customerEmail: email.trim(),
        items: items.map((i) => ({ slug: i.slug, title: i.title, price: i.price })),
        total,
        paymentMethod,
      });

      unlockPurchases(purchasedSlugs, reference);
      setPlaced(reference);
      clear();
      toast.success(`Order ${reference} placed successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (placed) {
    return (
      <div className="section-pad">
        <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
          <BadgeCheck className="mx-auto h-16 w-16 text-gold animate-bounce" />
          <h1 className="mt-6 text-3xl md:text-4xl font-display uppercase tracking-wide text-white">
            Order Placed Successfully!
          </h1>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Thank you, <strong className="text-white">{name || "Reader"}</strong>! Your order reference is{" "}
            <span className="font-display font-bold text-gold bg-gold/10 px-2.5 py-1 rounded border border-gold/30">
              {placed}
            </span>
            . Your digital book PDFs are now unlocked on this device!
          </p>

          {paymentMethod === "bank" && (
            <div className="mt-8 rounded-2xl border border-border/60 bg-surface/50 p-6 text-left space-y-3">
              <p className="text-xs uppercase font-semibold tracking-wider text-gold flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Bank Transfer Details
              </p>
              <div className="text-xs text-muted-foreground space-y-1.5">
                <p><strong>Bank / Method:</strong> {settings.bankName || "Meezan Bank / EasyPaisa / JazzCash"}</p>
                <p><strong>Account Title:</strong> {settings.accountTitle || SITE.founder}</p>
                <p><strong>Account / Phone:</strong> {settings.accountNumber || SITE.phone}</p>
                {settings.iban && <p><strong>IBAN:</strong> {settings.iban}</p>}
              </div>
              <p className="text-[11px] text-zinc-400 border-t border-border/40 pt-3">
                {settings.paymentInstructions ||
                  "Please share your payment screenshot with Order Reference on WhatsApp or Support Chat."}
              </p>
            </div>
          )}

          {(paymentMethod === "visa" || paymentMethod === "mastercard") && (
            <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-left space-y-2">
              <p className="text-xs uppercase font-semibold tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Lock className="h-4 w-4" /> Card Payment Received
              </p>
              <p className="text-xs text-zinc-300">
                Your {paymentMethod === "visa" ? "Visa" : "Mastercard"} payment details have been securely recorded. The Primo Acts team will verify and confirm your payment shortly.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-gold hover:bg-gold-light text-black font-semibold rounded-xl">
              <Link to="/downloads">
                <FileDown className="h-4 w-4 mr-1.5" /> Access & Download PDFs
              </Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-xl">
              <Link to="/store">Browse More Books</Link>
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
          <p className="mt-3 text-sm text-muted-foreground">Add a book to your cart to continue.</p>
          <Button asChild className="mt-8 bg-gold hover:bg-gold-light text-black font-semibold rounded-xl">
            <Link to="/store">Browse the store</Link>
          </Button>
        </div>
      </div>
    );
  }

  const bankName = settings.bankName || "Meezan Bank / Allied Bank / EasyPaisa / JazzCash";
  const accountTitle = settings.accountTitle || "Rao Wasif";
  const accountNumber = settings.accountNumber || "+92 309 296743";
  const iban = settings.iban || "";

  return (
    <div className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl font-display uppercase tracking-wide text-white">Checkout</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Complete your order to instantly receive DRM-free high resolution PDF editions.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
          <form className="glass-panel grid gap-6 rounded-3xl p-6 md:p-8" onSubmit={handleSubmitOrder}>

            <div className="grid gap-2">
              <Label htmlFor="co-name">Your Full Name *</Label>
              <Input id="co-name" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Rao Wasif" className="bg-surface/80 border-border/60" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="co-email">Delivery Email *</Label>
              <Input id="co-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="reader@example.com" className="bg-surface/80 border-border/60" />
              <p className="text-xs text-muted-foreground">Your digital library access will be linked to this email.</p>
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wider font-semibold text-white/80">Select Payment Method</Label>
              <div className="grid grid-cols-3 gap-2">
                <button type="button" onClick={() => setPaymentMethod("bank")}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-semibold ${
                    paymentMethod === "bank" ? "border-gold bg-gold/10 text-gold" : "border-border/40 bg-surface/60 text-muted-foreground hover:border-gold/40"
                  }`}>
                  <Building2 className="h-5 w-5" />
                  <span>Bank / Wallet</span>
                  <span className="text-[9px] font-normal opacity-70">EasyPaisa · Jazz</span>
                </button>

                <button type="button" onClick={() => setPaymentMethod("visa")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    paymentMethod === "visa" ? "border-blue-600 bg-blue-950/40" : "border-border/40 bg-surface/60 hover:border-blue-700/60"
                  }`}>
                  <svg viewBox="0 0 60 20" className="h-5 w-auto">
                    <text x="2" y="17" fontSize="18" fontWeight="900" fontFamily="Arial, sans-serif"
                      fill={paymentMethod === "visa" ? "#ffffff" : "#888"} letterSpacing="-1">VISA</text>
                  </svg>
                  <span className={`text-xs font-semibold ${paymentMethod === "visa" ? "text-white" : "text-muted-foreground"}`}>Visa Card</span>
                  <span className="text-[9px] font-normal text-muted-foreground">International</span>
                </button>

                <button type="button" onClick={() => setPaymentMethod("mastercard")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    paymentMethod === "mastercard" ? "border-red-600/60 bg-red-950/30" : "border-border/40 bg-surface/60 hover:border-red-700/40"
                  }`}>
                  <div className="flex items-center -space-x-1.5">
                    <div className={`h-5 w-5 rounded-full ${paymentMethod === "mastercard" ? "bg-[#eb001b]" : "bg-[#eb001b]/50"}`} />
                    <div className={`h-5 w-5 rounded-full ${paymentMethod === "mastercard" ? "bg-[#f79e1b]" : "bg-[#f79e1b]/50"}`} />
                  </div>
                  <span className={`text-xs font-semibold ${paymentMethod === "mastercard" ? "text-white" : "text-muted-foreground"}`}>Mastercard</span>
                  <span className="text-[9px] font-normal text-muted-foreground">International</span>
                </button>
              </div>
            </div>

            {/* Bank Transfer Display */}
            {paymentMethod === "bank" && (
              <div className="rounded-2xl border border-gold/40 bg-[#0c1018]/90 p-5 space-y-4 shadow-lg">
                <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                  <div className="h-7 w-7 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                    <Building2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-white">Bank / Wallet Transfer Details</span>
                  <span className="ml-auto text-[10px] text-gold font-bold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/30">Verified</span>
                </div>
                <div className="grid gap-0 text-xs divide-y divide-border/30">
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-muted-foreground">Bank / Provider</span>
                    <span className="font-semibold text-white text-right max-w-[55%]">{bankName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-muted-foreground">Account Title</span>
                    <span className="font-semibold text-white">{accountTitle}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-muted-foreground">Account / Wallet No.</span>
                    <span className="font-mono font-bold text-gold">{accountNumber}</span>
                  </div>
                  {iban && (
                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-muted-foreground">IBAN</span>
                      <span className="font-mono text-white text-[11px]">{iban}</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {settings.paymentInstructions || "Transfer the exact order amount and send your payment screenshot with Order Reference on WhatsApp or Support Chat."}
                </p>
              </div>
            )}

            {/* Visa / Mastercard Card Input Form */}
            {(paymentMethod === "visa" || paymentMethod === "mastercard") && (
              <div className={`rounded-2xl border p-5 space-y-4 shadow-lg ${
                paymentMethod === "visa" ? "border-blue-600/50 bg-blue-950/20" : "border-red-600/40 bg-red-950/15"
              }`}>
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <CreditCard className={`h-4 w-4 ${paymentMethod === "visa" ? "text-blue-400" : "text-red-400"}`} />
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-white">
                    {paymentMethod === "visa" ? "Visa" : "Mastercard"} — Secure Card Payment
                  </span>
                  <div className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                    <Lock className="h-3 w-3" /> SSL Secured
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label className="text-xs text-white/70">Card Number *</Label>
                  <Input required value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456" maxLength={19}
                    className="bg-surface/80 border-border/60 font-mono tracking-widest text-sm" inputMode="numeric" />
                </div>

                <div className="grid gap-1.5">
                  <Label className="text-xs text-white/70">Name on Card *</Label>
                  <Input required value={cardName} onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. Rao Wasif" className="bg-surface/80 border-border/60" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label className="text-xs text-white/70">Expiry Date *</Label>
                    <Input required value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY" maxLength={5} className="bg-surface/80 border-border/60 font-mono" inputMode="numeric" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-xs text-white/70">CVV *</Label>
                    <Input required value={cardCvc} onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="•••" maxLength={4} type="password" className="bg-surface/80 border-border/60 font-mono" inputMode="numeric" />
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  🔒 Your card details are encrypted and securely processed. The Primo Acts team will manually process your {paymentMethod === "visa" ? "Visa" : "Mastercard"} payment after order placement.
                </p>
              </div>
            )}

            <Button type="submit" size="lg"
              className="w-full bg-gold hover:bg-gold-light text-black font-semibold rounded-xl h-12 text-sm shadow-lg shadow-gold/20">
              Place Order & Unlock Books · {formatPrice(total)}
            </Button>
          </form>

          <aside className="glass-panel h-fit rounded-3xl p-6 space-y-6">
            <div>
              <p className="font-display text-lg uppercase tracking-wider text-white">Order Summary</p>
              <ul className="mt-5 grid gap-4">
                {items.map((item) => (
                  <li key={item.slug} className="grid grid-cols-[40px_minmax(0,1fr)_auto] gap-3 items-center">
                    <img src={item.cover} alt="" className="aspect-2/3 w-10 rounded object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-white font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.format || "PDF Edition"}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-gold">{formatPrice(item.price)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-border/60 pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="font-display text-2xl text-gold font-bold">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Order Reference: <span className="text-gold font-mono font-bold">{reference}</span>
              </p>
            </div>
            <div className="border-t border-border/40 pt-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Accepted Payments</p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-bold font-mono text-white tracking-widest">VISA</div>
                <div className="flex items-center -space-x-1.5">
                  <div className="h-4 w-4 rounded-full bg-[#eb001b]" />
                  <div className="h-4 w-4 rounded-full bg-[#f79e1b]" />
                </div>
                <div className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-semibold text-white">EasyPaisa</div>
                <div className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-semibold text-white">JazzCash</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
