import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, FileDown, Library, MessageCircle, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLiveOrders } from "@/lib/admin-store";
import { readLibrary, unlockPurchases, type LibraryEntry } from "@/lib/library";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Your PDF Downloads — Primo Acts" },
      {
        name: "description",
        content:
          "Download the Shadowrealm PDF editions you have purchased from Primo Acts, any time on this device.",
      },
      { property: "og:title", content: "Your PDF Downloads — Primo Acts" },
      { property: "og:description", content: "Access your purchased Shadowrealm PDF editions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DownloadsPage,
});

function DownloadsPage() {
  const [entries, setEntries] = useState<LibraryEntry[]>([]);
  const { orders } = useLiveOrders();
  const [lookupQuery, setLookupQuery] = useState("");

  useEffect(() => {
    setEntries(readLibrary());
  }, []);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const q = lookupQuery.trim().toLowerCase();
    if (!q) {
      toast.error("Please enter your Order Reference (e.g. PA-XXXXX) or Email.");
      return;
    }

    const foundOrder = orders.find(
      (o) =>
        o.reference.toLowerCase() === q ||
        o.customerEmail.toLowerCase() === q ||
        o.id.toLowerCase() === q,
    );

    if (foundOrder) {
      const slugs = foundOrder.items.map((i) => i.slug);
      const updated = unlockPurchases(slugs, foundOrder.reference);
      setEntries(updated);
      toast.success(`Found Order ${foundOrder.reference}! Your PDFs are now unlocked.`);
      setLookupQuery("");
    } else {
      toast.error("Order reference or email not found in records. Please check spelling or contact support.");
    }
  };

  return (
    <div className="section-pad">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <p className="font-display text-xs uppercase tracking-[0.35em] text-blue-400 font-bold">Your library</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-display text-white">PDF downloads</h1>
        <p className="mt-3 text-sm text-slate-400">
          Every PDF you have purchased is listed here, DRM-free and unlimited. Bundle orders unlock
          both books plus the combined edition.
        </p>

        {/* Universal Order Lookup Box */}
        <div className="mt-8 rounded-2xl border border-blue-500/30 bg-[#0c1018]/90 p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Search className="h-4 w-4" />
            <span>Restore & Unlock PDFs on Any Device</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
            Switching devices or opened a new browser? Enter your <strong>Order Reference ID (e.g. PA-XXXXX)</strong> or <strong>customer email</strong> to instantly retrieve and unlock your purchased PDF downloads.
          </p>
          <form onSubmit={handleLookup} className="mt-4 flex flex-col sm:flex-row gap-2.5">
            <Input
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="e.g. PA-B7Q2K or your@email.com"
              className="bg-surface/80 border-border/60 text-xs font-mono"
            />
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 rounded-xl shrink-0 shadow-lg shadow-blue-900/40"
            >
              <Search className="h-3.5 w-3.5 mr-1.5" /> Find & Unlock
            </Button>
          </form>
        </div>

        {entries.length === 0 ? (
          <div className="glass-panel mt-8 rounded-3xl p-8 text-center border border-slate-800">
            <Library className="mx-auto h-10 w-10 text-blue-400" />
            <p className="mt-4 text-sm text-slate-400">
              No downloads active on this device yet. Once an order is placed or verified, your PDFs appear here.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild className="btn-gold rounded-xl">
                <Link to="/store">Browse the store</Link>
              </Button>
              <a
                href={`https://wa.me/92309296743?text=Hi%20Rao%20Wasif,%20I%20need%20help%20accessing%20my%20Primo%20Acts%20book%20downloads.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25d366]/20 hover:bg-[#25d366]/30 border border-[#25d366]/40 text-[#25d366] font-semibold px-4 py-2 text-xs transition-all"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Support
              </a>
            </div>
          </div>
        ) : (
          <ul className="mt-8 grid gap-4">
            {entries.map((entry) => (
              <li
                key={entry.slug}
                className="glass-panel flex items-center justify-between gap-4 rounded-2xl p-5 border border-slate-800"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{entry.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    DRM-Free High-Res PDF · Order Ref: <strong className="text-blue-400 font-mono">{entry.reference}</strong>
                  </p>
                </div>
                <Button asChild variant="secondary" className="btn-gold shrink-0 rounded-xl shadow-lg">
                  <a href={entry.pdf} download>
                    <FileDown className="h-4 w-4 mr-1" /> Download PDF
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
