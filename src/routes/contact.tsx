import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Mail, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLiveMessages } from "@/lib/admin-store";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${SITE.name}` },
      {
        name: "description",
        content:
          "Get in touch with Primo Acts about orders, download links, rights enquiries or collaborations.",
      },
      { property: "og:title", content: "Contact — Primo Acts" },
      {
        property: "og:description",
        content: "Questions about an order or a collaboration? Reach Rao Wasif directly.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { sendMessage } = useLiveMessages();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Direct transmission to Admin Portal Support Desk & Cloud
    sendMessage(name.trim(), email.trim(), message.trim(), "Contact Page Enquiry");
    setSent(true);
    toast.success("Message sent! It has been delivered directly to Rao Wasif's Admin Portal.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-display text-xs uppercase tracking-[0.35em] text-blue-400 font-bold">Contact</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-display text-white">Say hello</h1>
        <p className="mt-3 max-w-xl text-sm text-slate-400">
          Order questions, missing download links, rights enquiries or just a note about the story —
          it all reaches {SITE.founder} directly in the Admin Portal.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
          {sent ? (
            <div className="glass-panel rounded-3xl p-8 border border-emerald-500/30 bg-emerald-500/5 text-center space-y-4">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
              <h2 className="font-display text-2xl text-white">Message Transmitted!</h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Thank you, your message has been sent directly to Rao Wasif's Admin Portal desk. Rao Wasif will review and reply to your email shortly.
              </p>
              <Button
                onClick={() => setSent(false)}
                variant="outline"
                className="rounded-xl border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 text-xs mt-2"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form
              className="glass-panel grid gap-5 rounded-3xl p-6 md:p-8 border border-slate-800"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-slate-300 text-xs font-semibold">Your name *</Label>
                  <Input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Reader"
                    className="bg-slate-900 border-slate-700 text-white rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-slate-300 text-xs font-semibold">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-slate-900 border-slate-700 text-white rounded-xl"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message" className="text-slate-300 text-xs font-semibold">Message *</Label>
                <Textarea
                  id="message"
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me what you need…"
                  className="bg-slate-900 border-slate-700 text-white rounded-xl"
                />
              </div>

              <Button type="submit" size="lg" className="btn-gold justify-self-start rounded-xl">
                <Send className="h-4 w-4 mr-1.5" /> Send message to Rao Wasif
              </Button>
            </form>
          )}

          <aside className="glass-panel h-fit rounded-3xl p-6 border border-slate-800">
            <p className="font-display text-lg text-white font-bold">Direct lines</p>
            <div className="mt-5 flex flex-col gap-4 text-sm text-slate-300">
              <a
                href={`mailto:${SITE.email}`}
                className="flex min-w-0 items-center gap-3 hover:text-blue-400 transition-colors"
              >
                <Mail className="h-5 w-5 shrink-0 text-blue-400" />
                <span className="truncate">{SITE.email}</span>
              </a>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="flex min-w-0 items-center gap-3 hover:text-blue-400 transition-colors"
              >
                <Phone className="h-5 w-5 shrink-0 text-blue-400" />
                <span className="truncate">{SITE.phone}</span>
              </a>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-slate-400">
              Order and download issues are usually answered the same day. Please include your order
              reference if you have one.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
