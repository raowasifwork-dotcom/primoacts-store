import { CheckCircle2, MessageCircle, MessageSquare, Phone, Send, Sparkles, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import founderImg from "@/assets/rao-wasif.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLiveMessages } from "@/lib/admin-store";
import { useCustomerAuth } from "@/lib/customer-auth";
import { SITE } from "@/lib/site";

export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn } = useCustomerAuth();
  const { messages, sendMessage } = useLiveMessages();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [activeThreadEmail, setActiveThreadEmail] = useState<string>(user?.email || "");
  const [lastSentText, setLastSentText] = useState<string>("");

  // Find messages from current customer email
  const currentEmail = user?.email || activeThreadEmail;
  const userMessages = currentEmail
    ? messages.filter((m) => m.senderEmail.toLowerCase() === currentEmail.toLowerCase())
    : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const senderEmail = (user?.email || email).trim();
    const senderName = (user?.name || name).trim() || "Reader";

    if (!senderEmail) {
      toast.error("Please provide your email address so we can reply.");
      return;
    }

    const textToSend = message.trim();
    sendMessage(senderName, senderEmail, textToSend);
    setActiveThreadEmail(senderEmail);
    setLastSentText(textToSend);
    setMessage("");
    toast.success("Message sent! Rao Wasif has been notified.");
  };

  const cleanPhone = SITE.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    lastSentText ? `Hi Rao Wasif, I sent a message on Primo Acts: "${lastSentText}"` : "Hi Rao Wasif, I have a question about Primo Acts books.",
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-blue-600 hover:bg-blue-500 px-4 py-3 text-white font-semibold font-display text-xs shadow-xl shadow-blue-950/50 hover:scale-105 transition-all active:scale-95"
          aria-label="Open customer support chat"
        >
          <div className="relative">
            <MessageCircle className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
          </div>
          <span className="hidden sm:inline tracking-wider uppercase font-bold">Live Support</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {open && (
        <div className="flex flex-col w-[92vw] sm:w-96 max-h-[580px] h-[520px] rounded-3xl border border-gold/30 bg-[#0c1018]/98 shadow-2xl shadow-black/90 backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-gold/20 via-[#121622] to-purple-950/30 p-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-gold/50 bg-black/60 shrink-0 p-1">
                <img src="/logo.png" alt="Primo Acts Support" className="h-full w-full object-contain" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-black" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold text-white truncate flex items-center gap-1.5">
                  <span>{SITE.name} Support</span>
                  <Sparkles className="h-3 w-3 text-gold" />
                </p>
                <p className="text-[11px] text-emerald-400 font-medium">
                  Active Helpdesk
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="h-8 px-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 text-[10px] font-bold transition-all"
                title="Direct WhatsApp"
              >
                <Phone className="h-3 w-3" /> WhatsApp
              </a>
              <button
                onClick={() => setOpen(false)}
                className="h-8 w-8 rounded-full bg-surface/60 hover:bg-surface text-muted-foreground hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            <div className="rounded-2xl bg-surface/60 border border-border/40 p-3.5 space-y-2">
              <p className="font-semibold text-gold text-xs">Welcome to {SITE.name} Support! 👋</p>
              <p className="text-muted-foreground leading-relaxed text-[11px]">
                Ask any question regarding <strong>Shadowrealm</strong>, pre-orders, digital PDF downloads, or bank transfer verification.
              </p>
              <div className="pt-1 flex items-center gap-2">
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:underline"
                >
                  <Phone className="h-3 w-3" /> WhatsApp: {SITE.phone}
                </a>
              </div>
            </div>

            {userMessages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                {/* Customer Message */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-gold/15 border border-gold/30 p-3 text-white">
                    <p className="text-xs">{msg.message}</p>
                    <span className="text-[9px] text-gold/70 block text-right mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                {/* Support Agent Reply (if replied) */}
                {msg.replyText && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-[#161c28] border border-purple-500/30 p-3 text-purple-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-gold text-[10px] font-bold uppercase">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        <span>{msg.agentName || "Support Agent (Verified)"}</span>
                      </div>
                      <p className="text-xs leading-relaxed">{msg.replyText}</p>
                      {msg.repliedAt && (
                        <span className="text-[9px] text-muted-foreground block mt-1">
                          {new Date(msg.repliedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat Composer */}
          <form onSubmit={handleSend} className="p-3 border-t border-border/50 bg-[#090c12] space-y-2">
            {!isLoggedIn && !activeThreadEmail && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 text-xs bg-surface/60 border-border/60 rounded-xl"
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-8 text-xs bg-surface/60 border-border/60 rounded-xl"
                  required
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="h-10 text-xs bg-surface/80 border-border/60 rounded-xl flex-1 focus:border-gold"
                required
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 shrink-0 bg-gold hover:bg-gold-light text-black rounded-xl shadow-md shadow-gold/20"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
