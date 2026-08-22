import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-display text-xs uppercase tracking-[0.35em] text-gold">Contact</p>
        <h1 className="mt-4 text-4xl md:text-5xl">Say hello</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Order questions, missing download links, rights enquiries or just a note about the story —
          it all reaches {SITE.founder} directly.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
          <form
            className="glass-panel grid gap-5 rounded-3xl p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              const subject = encodeURIComponent(`Primo Acts enquiry from ${name || "a reader"}`);
              const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
              window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
              toast.success("Opening your email app with the message ready to send.");
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Reader"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me what you need…"
              />
            </div>

            <Button type="submit" size="lg" className="justify-self-start">
              <Send className="h-4 w-4" /> Send message
            </Button>
          </form>

          <aside className="glass-panel h-fit rounded-3xl p-6">
            <p className="font-display text-lg">Direct lines</p>
            <div className="mt-5 flex flex-col gap-4 text-sm">
              <a
                href={`mailto:${SITE.email}`}
                className="flex min-w-0 items-center gap-3 hover:text-gold"
              >
                <Mail className="h-5 w-5 shrink-0 text-gold" />
                <span className="truncate">{SITE.email}</span>
              </a>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="flex min-w-0 items-center gap-3 hover:text-gold"
              >
                <Phone className="h-5 w-5 shrink-0 text-gold" />
                <span className="truncate">{SITE.phone}</span>
              </a>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              Order and download issues are usually answered the same day. Please include your order
              reference if you have one.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
