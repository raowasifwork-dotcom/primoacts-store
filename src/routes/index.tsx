import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Download, ShieldCheck } from "lucide-react";

import { toast } from "sonner";

import heroImage from "@/assets/hero-shadowrealm.jpg";
import { BookCard } from "@/components/site/BookCard";
import { CinematicTrailersSection } from "@/components/site/CinematicTrailersSection";
import { Button } from "@/components/ui/button";
import { BOOKS, BUNDLE, formatPrice, getBook } from "@/lib/books";
import { useCart } from "@/lib/cart";
import { CHARACTERS } from "@/lib/characters";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Primo Acts — Cinematic Fiction & Digital Books by Rao Wasif" },
      {
        name: "description",
        content:
          "Primo Acts is the home of Shadowrealm and other cinematic fiction by Rao Wasif. Buy digital books in PDF with instant download.",
      },
      { property: "og:title", content: "Primo Acts — Cinematic Fiction & Digital Books" },
      {
        property: "og:description",
        content:
          "Dark, cinematic storytelling from Rao Wasif. Explore the Shadowrealm saga and the full Primo Acts digital library.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { add, has } = useCart();
  const bundleInCart = has(BUNDLE.slug);
  const featured = BOOKS.filter((b) => b.featured);
  const bundleBooks = BUNDLE.includes.map(getBook).filter(Boolean);

  return (
    <div>
      {/* Hero */}
      <section className="veil-bottom relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="The seven characters of the Shadowrealm saga standing beneath a stormy moonlit sky"
          width={1536}
          height={1152}
          className="absolute inset-0 h-full w-full object-cover object-top opacity-60"
        />
        <div className="relative z-10 mx-auto flex min-h-[86vh] max-w-6xl flex-col justify-end px-4 pb-20 pt-28 md:px-6">
          <p className="animate-rise font-display text-xs uppercase tracking-[0.4em] text-gold">
            {SITE.name} Presents
          </p>
          <h1 className="animate-rise mt-5 max-w-3xl text-4xl leading-[1.05] sm:text-6xl md:text-7xl">
            <span className="text-gradient-violet">Stories that step</span>
            <br />
            <span className="text-gradient-gold">out of the dark.</span>
          </h1>
          <p className="animate-rise mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            An original fantasy thriller universe written by {SITE.founder}. Seven unlikely heroes,
            one town that keeps its secrets, and a door that should have stayed shut.
          </p>
          <div className="animate-rise mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/store">
                Enter the store <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/characters">Meet the seven</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3 md:px-6">
          {[
            { icon: Download, title: "Instant digital delivery", body: "EPUB, PDF and MOBI files sent straight to your inbox." },
            { icon: ShieldCheck, title: "Verified bank transfer", body: "Manual payment review by the author — no card required." },
            { icon: BookOpen, title: "Read on any device", body: "Kindle, iPad, phone or desktop. DRM-free forever." },
          ].map((item) => (
            <div key={item.title} className="flex min-w-0 items-start gap-3">
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div className="min-w-0">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="section-pad">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div className="min-w-0">
              <h2 className="text-3xl md:text-4xl">Featured releases</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The books readers start with — and finish in a single night.
              </p>
            </div>
            <Link to="/store" className="shrink-0 text-sm text-gold hover:underline">
              All books
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Bundle */}
      <section className="pb-8">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="glass-panel grid gap-8 rounded-3xl p-6 md:grid-cols-2 md:p-10">
            <div className="flex items-center gap-4">
              {bundleBooks.map(
                (book, i) =>
                  book && (
                    <img
                      key={book.slug}
                      src={book.cover}
                      alt={`Cover of ${book.title}`}
                      loading="lazy"
                      className={`animate-drift w-1/2 rounded-xl object-cover shadow-[var(--shadow-float)] ${
                        i === 1 ? "[animation-delay:1.4s]" : ""
                      }`}
                    />
                  ),
              )}
            </div>
            <div className="flex flex-col justify-center">
              <p className="font-display text-xs uppercase tracking-[0.3em] text-gold">
                Saga bundle
              </p>
              <h2 className="mt-4 text-3xl font-display uppercase tracking-wide">{BUNDLE.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Both seasons of the Shadowrealm story as digital editions, bundled at a special pre-order discount price.
              </p>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-3xl text-gold font-bold">
                  {formatPrice(BUNDLE.price)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(BUNDLE.compareAt)}
                </span>
              </div>
              <Button
                size="lg"
                variant={bundleInCart ? "secondary" : "default"}
                className="mt-6 self-start bg-gold hover:bg-gold-light text-black font-semibold rounded-xl"
                onClick={() => {
                  if (bundleInCart) return;
                  add({
                    slug: BUNDLE.slug,
                    title: BUNDLE.title,
                    price: BUNDLE.price,
                    cover: bundleBooks[0]?.cover ?? "",
                    format: "PDF",
                  });
                  toast.success("Shadowrealm bundle added to cart");
                }}
              >
                {bundleInCart ? "Bundle in cart" : "Pre-Order Saga Bundle"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING NOVELS & UNIVERSE EXPANSION */}
      <section className="section-pad border-t border-border/60 bg-gradient-to-b from-[#0a0d14] via-[#07090e] to-background">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
            <div>
              <span className="font-display text-xs uppercase tracking-[0.35em] text-gold font-semibold">
                New Universes · Coming 2026
              </span>
              <h2 className="mt-2 text-3xl md:text-5xl font-display uppercase tracking-wide text-white">
                Upcoming Novels & Series
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Explore the upcoming cinematic universe created and written by <strong className="text-white">{SITE.founder}</strong>. Pre-order now to secure day-one digital copies.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0 border-gold/40 text-gold hover:bg-gold/10 rounded-xl">
              <Link to="/store">View Full Catalog →</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BOOKS.filter((b) => b.status === "preorder" || b.status === "upcoming").map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* OFFICIAL YOUTUBE TRAILERS & TEASERS */}
      <CinematicTrailersSection />

      {/* Characters preview */}
      <section className="section-pad">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-display uppercase tracking-wide text-white">The seven of Ravenwood</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Every act of the Shadowrealm saga is carried by these seven. Some of them will not make
            it to the end.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CHARACTERS.slice(0, 4).map((c) => (
              <Link
                key={c.slug}
                to="/characters"
                className="float-card group relative overflow-hidden rounded-2xl border border-border"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-4">
                  <p className="font-display text-sm">{c.name}</p>
                  <p className="text-xs text-gold">{c.role}</p>
                </div>
              </Link>
            ))}
          </div>

          <Button asChild variant="outline" className="mt-8">
            <Link to="/characters">
              Meet all seven <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
