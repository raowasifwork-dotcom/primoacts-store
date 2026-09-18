import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  FileDown,
  Library,
  MessageCircle,
  MessageSquare,
  Package,
  Phone,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLiveMessages, useLiveOrders, type Order } from "@/lib/admin-store";
import { formatPrice } from "@/lib/books";
import { readLibrary, unlockPurchases, type LibraryEntry } from "@/lib/library";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/downloads")({
  validateSearch: (search: Record<string, unknown>): { ref?: string } => {
    return {
      ref: typeof search.ref === "string" ? search.ref : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Client Portal & Live Order Hub — Primo Acts" },
      {
        name: "description",
        content:
          "Track your live order status, communicate directly with Rao Wasif, and download your DRM-free Shadowrealm PDF books.",
      },
      { property: "og:title", content: "Client Portal & Live Order Hub — Primo Acts" },
      {
        property: "og:description",
        content: "Track order status and access purchased DRM-free PDF editions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ClientPortalPage,
});

function ClientPortalPage() {
  const searchParams = Route.useSearch();
  const { orders, syncFromCloud, isSyncing } = useLiveOrders();
  const { messages, sendMessage } = useLiveMessages();

  const [entries, setEntries] = useState<LibraryEntry[]>([]);
  const [lookupQuery, setLookupQuery] = useState(searchParams.ref || "");
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Client to Admin Chat state
  const [chatMessage, setChatMessage] = useState("");
  const [chatSenderName, setChatSenderName] = useState("");
  const [chatSenderEmail, setChatSenderEmail] = useState("");

  useEffect(() => {
    setEntries(readLibrary());
  }, []);

  // Auto-select order if query ref is in URL
  useEffect(() => {
    if (searchParams.ref && orders.length > 0) {
      const q = searchParams.ref.trim().toLowerCase();
      const found = orders.find(
        (o) =>
          o.reference.toLowerCase() === q ||
          o.customerEmail.toLowerCase() === q ||
          o.id.toLowerCase() === q,
      );
      if (found) {
        setActiveOrder(found);
        setChatSenderName(found.customerName);
        setChatSenderEmail(found.customerEmail);
        // Automatically unlock downloads if order is verified or found
        const slugs = found.items.map((i) => i.slug);
        const updated = unlockPurchases(slugs, found.reference);
        setEntries(updated);
      }
    }
  }, [searchParams.ref, orders]);

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
      setActiveOrder(foundOrder);
      setChatSenderName(foundOrder.customerName);
      setChatSenderEmail(foundOrder.customerEmail);
      const slugs = foundOrder.items.map((i) => i.slug);
      const updated = unlockPurchases(slugs, foundOrder.reference);
      setEntries(updated);
      toast.success(`Found Order ${foundOrder.reference}! Status: ${foundOrder.status.toUpperCase()}`);
    } else {
      toast.error("Order reference or email not found in cloud records. Check spelling or message support below.");
    }
  };

  const handleSendClientMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const senderEmail = (chatSenderEmail || activeOrder?.customerEmail || "").trim();
    const senderName = (chatSenderName || activeOrder?.customerName || "Customer").trim();

    if (!senderEmail) {
      toast.error("Please enter your email so Rao Wasif can reply to you.");
      return;
    }

    sendMessage(
      senderName,
      senderEmail,
      chatMessage.trim(),
      activeOrder?.reference || lookupQuery || undefined,
    );
    toast.success("Message transmitted directly to Rao Wasif's Admin Portal!");
    setChatMessage("");
  };

  // Filter messages relevant to this client (by email or order reference)
  const clientEmail = chatSenderEmail || activeOrder?.customerEmail || "";
  const clientMessages = useMemo(() => {
    if (!clientEmail && !activeOrder?.reference) return [];
    return messages.filter(
      (m) =>
        (clientEmail && m.senderEmail.toLowerCase() === clientEmail.toLowerCase()) ||
        (activeOrder?.reference && m.orderReference === activeOrder.reference),
    );
  }, [messages, clientEmail, activeOrder?.reference]);

  const copyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    toast.success(`Order reference ${ref} copied!`);
  };

  return (
    <div className="section-pad">
      <div className="mx-auto max-w-4xl px-4 md:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xs uppercase tracking-[0.35em] text-blue-400 font-bold">
                Customer Space
              </span>
              <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                Live Connectivity
              </span>
            </div>
            <h1 className="mt-2 text-3xl md:text-5xl font-display text-white uppercase tracking-wide">
              Client Portal & Order Hub
            </h1>
            <p className="mt-2 text-xs md:text-sm text-slate-400 max-w-2xl">
              Track your real-time order status, communicate directly with Rao Wasif, and access your DRM-free PDF downloads at any time.
            </p>
          </div>

          <Button
            onClick={() => {
              syncFromCloud();
              toast.info("Cloud orders refreshed.");
            }}
            variant="outline"
            size="sm"
            disabled={isSyncing}
            className="border-blue-500/30 text-blue-400 hover:bg-blue-600/10 rounded-xl text-xs shrink-0 self-start sm:self-center"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync Live Status"}</span>
          </Button>
        </div>

        {/* 1. Universal Order Search / Lookup Card */}
        <div className="rounded-2xl border border-blue-500/30 bg-[#0c1018]/90 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Search className="h-4 w-4" />
            <span>Track Order & Unlock Downloads on Any Device</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enter your <strong>Order Reference ID (e.g. PA-XXXXX)</strong> or <strong>billing email</strong> to track your order in real time and unlock your high-resolution DRM-free PDFs.
          </p>

          <form onSubmit={handleLookup} className="mt-3 flex flex-col sm:flex-row gap-2.5">
            <Input
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="e.g. PA-B7Q2K or reader@example.com"
              className="bg-surface/80 border-border/60 text-xs font-mono"
            />
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-6 rounded-xl shrink-0 shadow-lg shadow-blue-900/40"
            >
              <Search className="h-3.5 w-3.5 mr-1.5" /> Track & Restore
            </Button>
          </form>
        </div>

        {/* 2. Active Order Live Status Display */}
        {activeOrder && (
          <div className="rounded-3xl border border-border/60 bg-[#0c1018]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-5">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                  Order Details
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <h2 className="font-mono text-xl font-bold text-white tracking-wider">
                    {activeOrder.reference}
                  </h2>
                  <button
                    onClick={() => copyRef(activeOrder.reference)}
                    className="p-1 rounded-lg hover:bg-surface text-slate-400 hover:text-white transition-colors"
                    title="Copy Order Reference"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ordered by <strong>{activeOrder.customerName}</strong> ({activeOrder.customerEmail}) on{" "}
                  {new Date(activeOrder.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {activeOrder.status === "verified" ? (
                  <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 px-4 py-2 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">Confirmed & Verified</p>
                      <p className="text-[10px] text-emerald-300/80">Downloads Fully Unlocked</p>
                    </div>
                  </div>
                ) : activeOrder.status === "cancelled" ? (
                  <div className="flex items-center gap-2 rounded-2xl bg-rose-500/15 border border-rose-500/40 px-4 py-2 text-rose-400">
                    <XCircle className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">Order Cancelled</p>
                      <p className="text-[10px] text-rose-300/80">Please contact support</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-2xl bg-amber-500/15 border border-amber-500/40 px-4 py-2 text-amber-400">
                    <Clock className="h-5 w-5 shrink-0 animate-pulse" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">Payment Review</p>
                      <p className="text-[10px] text-amber-300/80">Awaiting Rao Wasif Verification</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Progress Pipeline (3-step indicator) */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Order Progress Pipeline</p>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                {/* Step 1 */}
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-1">
                  <div className="h-6 w-6 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <p className="text-xs font-bold text-white">1. Order Placed</p>
                  <p className="text-[10px] text-slate-400">Recorded in Cloud</p>
                </div>

                {/* Step 2 */}
                <div
                  className={`p-3 rounded-2xl border space-y-1 ${
                    activeOrder.status === "verified"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : activeOrder.status === "cancelled"
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      : "bg-amber-500/10 border-amber-500/40 text-amber-300 animate-pulse"
                  }`}
                >
                  <div
                    className={`h-6 w-6 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                      activeOrder.status === "verified"
                        ? "bg-emerald-600 text-white"
                        : activeOrder.status === "cancelled"
                        ? "bg-rose-600 text-white"
                        : "bg-amber-600 text-white"
                    }`}
                  >
                    {activeOrder.status === "verified" ? "✓" : activeOrder.status === "cancelled" ? "✕" : "2"}
                  </div>
                  <p className="text-xs font-bold text-white">2. Admin Review</p>
                  <p className="text-[10px] text-slate-400">
                    {activeOrder.status === "verified"
                      ? "Payment Verified"
                      : activeOrder.status === "cancelled"
                      ? "Review Rejected"
                      : "Rao Wasif Reviewing"}
                  </p>
                </div>

                {/* Step 3 */}
                <div
                  className={`p-3 rounded-2xl border space-y-1 ${
                    activeOrder.status === "verified"
                      ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400"
                      : "bg-surface/40 border-border/40 text-slate-500 opacity-60"
                  }`}
                >
                  <div
                    className={`h-6 w-6 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                      activeOrder.status === "verified" ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {activeOrder.status === "verified" ? "✓" : "3"}
                  </div>
                  <p className="text-xs font-bold text-white">3. PDF Access</p>
                  <p className="text-[10px] text-slate-400">
                    {activeOrder.status === "verified" ? "Unlocked & Ready" : "Pending Approval"}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items Purchased */}
            <div className="border-t border-border/40 pt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 uppercase tracking-wider">Purchased Items:</span>
                <span className="font-bold text-blue-400 font-display text-sm">{formatPrice(activeOrder.total)}</span>
              </div>
              <ul className="divide-y divide-border/30">
                {activeOrder.items.map((item, idx) => (
                  <li key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Package className="h-3.5 w-3.5 text-blue-400" />
                      <span className="text-white font-medium">{item.title}</span>
                    </div>
                    <span className="font-semibold text-slate-300">{formatPrice(item.price)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* If pending bank transfer, show quick WhatsApp action */}
            {activeOrder.status === "pending" && (
              <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-300">
                  <p className="font-bold text-blue-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" /> Want instant verification?
                  </p>
                  <p className="text-slate-400 mt-0.5">
                    Send your payment receipt screenshot to Rao Wasif directly on WhatsApp with reference{" "}
                    <strong className="text-white font-mono">{activeOrder.reference}</strong>.
                  </p>
                </div>
                <a
                  href={`https://wa.me/92309296743?text=${encodeURIComponent(
                    `Hi Rao Wasif, here is my payment receipt for Primo Acts order ${activeOrder.reference}. Please verify and confirm.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-black font-bold px-4 py-2.5 text-xs shrink-0 shadow-lg transition-all"
                >
                  <MessageCircle className="h-3.5 w-3.5 fill-black" />
                  <span>Send on WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* 3. Direct Real-Time Communication with Rao Wasif */}
        <div className="rounded-3xl border border-border/50 bg-[#0c1018]/90 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <MessageSquare className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Direct Desk — Communicate with Rao Wasif</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                </h2>
                <p className="text-xs text-muted-foreground">
                  Send a live message regarding your order, book queries, or custom web projects.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              Ultra Connectivity
            </span>
          </div>

          {/* Chat thread history */}
          {clientMessages.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto p-4 rounded-2xl bg-surface/40 border border-border/40">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Your Conversation History:
              </p>
              {clientMessages.map((msg) => (
                <div key={msg.id} className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-slate-200">
                    <div className="flex items-center justify-between text-[10px] text-blue-300 font-medium mb-1">
                      <span>You ({msg.senderName})</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <p className="leading-relaxed">{msg.message}</p>
                  </div>

                  {msg.status === "replied" && msg.replyText && (
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-100 ml-4">
                      <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold mb-1">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> {msg.agentName || "Rao Wasif (Founder)"}
                        </span>
                        {msg.repliedAt && (
                          <span>{new Date(msg.repliedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        )}
                      </div>
                      <p className="leading-relaxed">{msg.replyText}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* New message compose form */}
          <form onSubmit={handleSendClientMessage} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 text-xs font-medium block mb-1">Your Name *</label>
                <Input
                  value={chatSenderName}
                  onChange={(e) => setChatSenderName(e.target.value)}
                  placeholder="e.g. Rao Wasif"
                  required
                  className="bg-surface/80 border-border/60 text-xs"
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs font-medium block mb-1">Your Email (for notification) *</label>
                <Input
                  type="email"
                  value={chatSenderEmail}
                  onChange={(e) => setChatSenderEmail(e.target.value)}
                  placeholder="e.g. client@example.com"
                  required
                  className="bg-surface/80 border-border/60 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-xs font-medium block mb-1">Your Message to Admin *</label>
              <Textarea
                rows={2}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your question or payment confirmation note here..."
                required
                className="bg-surface/80 border-border/60 text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-slate-400">
                Pushes directly to Rao Wasif's Admin Support Desk.
              </p>
              <Button
                type="submit"
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 rounded-xl shadow-lg shadow-blue-900/40"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" /> Send Message
              </Button>
            </div>
          </form>
        </div>

        {/* 4. Unlocked DRM-Free PDF Library */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display uppercase tracking-wider text-white flex items-center gap-2">
              <Library className="h-5 w-5 text-blue-400" />
              <span>Your Unlocked PDF Editions</span>
            </h2>
            <span className="text-xs text-slate-400">{entries.length} unlocked</span>
          </div>

          {entries.length === 0 ? (
            <div className="glass-panel rounded-3xl p-8 text-center border border-slate-800">
              <Library className="mx-auto h-10 w-10 text-blue-400" />
              <p className="mt-4 text-sm text-slate-400">
                No downloads active on this device yet. Enter your order reference above or place an order to unlock.
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
            <ul className="grid gap-4">
              {entries.map((entry) => (
                <li
                  key={entry.slug}
                  className="glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl p-5 border border-slate-800 transition-all hover:border-blue-500/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{entry.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      DRM-Free High-Res PDF · Order Ref:{" "}
                      <strong className="text-blue-400 font-mono">{entry.reference}</strong>
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
    </div>
  );
}

