import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, Phone } from "lucide-react";

import founderAsset from "@/assets/rao-wasif.png";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About Rao Wasif — Founder of ${SITE.name}` },
      {
        name: "description",
        content:
          "Rao Wasif is the writer and founder behind Primo Acts, creator of the Shadowrealm saga and a growing library of cinematic fiction.",
      },
      { property: "og:title", content: "About Rao Wasif — Primo Acts" },
      {
        property: "og:description",
        content: "The writer behind the Shadowrealm saga and the Primo Acts digital library.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] md:items-start">
          <div className="glass-panel animate-drift overflow-hidden rounded-3xl p-3">
            <img
              src={founderAsset}
              alt={`Portrait of ${SITE.founder}, founder of ${SITE.name}`}
              className="w-full rounded-2xl object-cover"
            />
          </div>

          <div>
            <p className="font-display text-xs uppercase tracking-[0.35em] text-gold">
              The author
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl">{SITE.founder}</h1>
            <p className="mt-3 font-display text-lg text-muted-foreground">
              Writer · Founder of {SITE.name}
            </p>

            <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
              <p>
                {SITE.name} began with a single question: what would happen if a small, ordinary
                town had been quietly paying for its peace? That question became the Shadowrealm
                saga — an original fantasy thriller series built around seven characters who each
                carry a piece of the truth.
              </p>
              <p>
                I write cinematic fiction. Every chapter is shaped like a scene: light, sound,
                tension, and a reason to turn the page. Beyond Shadowrealm, the {SITE.name} library
                spans thriller, mystery, romance, science fiction and one quiet book about paying
                attention.
              </p>
              <p>
                Every title here is sold direct and DRM-free. That means you own the file, you can
                read it anywhere, and I get to keep writing without a middle layer between the story
                and the reader.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <a
                href={`mailto:${SITE.email}`}
                className="glass-panel flex min-w-0 items-center gap-3 rounded-2xl p-4 text-sm transition-colors hover:text-gold"
              >
                <Mail className="h-5 w-5 shrink-0 text-gold" />
                <span className="truncate">{SITE.email}</span>
              </a>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="glass-panel flex min-w-0 items-center gap-3 rounded-2xl p-4 text-sm transition-colors hover:text-gold"
              >
                <Phone className="h-5 w-5 shrink-0 text-gold" />
                <span className="truncate">{SITE.phone}</span>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-gold hover:bg-gold-light text-black font-semibold rounded-xl">
                <Link to="/store">
                  Read the books <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border/60 text-white hover:bg-surface rounded-xl">
                <Link to="/contact">
                  Get in touch
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
