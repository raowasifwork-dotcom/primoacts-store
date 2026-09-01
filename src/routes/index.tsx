import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Download, ShieldCheck } from "lucide-react";

import { toast } from "sonner";

import { BookCard } from "@/components/site/BookCard";
import { CinematicTrailersSection } from "@/components/site/CinematicTrailersSection";
import { HeroSlideshow } from "@/components/site/HeroSlideshow";
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
      {/* Netflix-Style Cinematic Hero Slideshow */}
      <HeroSlideshow />

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
                      className={`h-48 w-32 rounded-xl object-cover shadow-float md:h-64 md:w-44 ${
                        i > 0 ? "-ml-12 md:-ml-20" : ""
                      }`}
                    />
                  ),
              )}
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-xs uppercase tracking-widest text-gold">Complete package</span>
              <h3 className="mt-2 text-2xl md:text-3xl">{BUNDLE.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{BUNDLE.description}</p>
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-gold">
                  {formatPrice(BUNDLE.price)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(BUNDLE.originalPrice)}
                </span>
                <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold">
                  Save {Math.round((1 - BUNDLE.price / BUNDLE.originalPrice) * 100)}%
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  className="btn-gold"
                  disabled={bundleInCart}
                  onClick={() => {
                    add({
                      slug: BUNDLE.slug,
                      title: BUNDLE.title,
                      price: BUNDLE.price,
                      cover: BUNDLE.cover,
                      format: "PDF Edition",
                    });
                    toast.success("Bundle added to cart");
                  }}
                >
                  {bundleInCart ? "In cart" : "Get the bundle"}
                </Button>
                <Link to="/checkout">
                  <Button variant="outline">Buy now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Book Trailers */}
      <CinematicTrailersSection />

      {/* Meet the Characters */}
      <section className="section-pad border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div className="min-w-0">
              <span className="text-xs uppercase tracking-widest text-gold">Lore & Universe</span>
              <h2 className="mt-1 text-3xl md:text-4xl">Meet the Characters</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The legends, villains, and anti-heroes shaping the world of Primo Acts.
              </p>
            </div>
            <Link to="/characters" className="shrink-0 text-sm text-gold hover:underline">
              All characters
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CHARACTERS.slice(0, 3).map((character) => (
              <Link
                key={character.id}
                to="/characters"
                className="glass-panel group block overflow-hidden rounded-2xl border border-border/40 p-4 transition-all duration-300 hover:border-gold/50"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-xl bg-surface">
                  <img
                    src={character.imageUrl}
                    alt={character.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3">
                  <span className="text-[10px] uppercase tracking-wider text-gold">
                    {character.role}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {character.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {character.shortBio}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Author note */}
      <section className="section-pad border-t border-border/60">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <span className="text-xs uppercase tracking-widest text-gold">From the author</span>
          <h2 className="mt-2 text-2xl md:text-3xl">Direct from writer to reader</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            No middleman, no DRM, no platform locks. When you buy a book here, you get standard PDF files that work on Kindle, Apple Books, Kobo, and any device you own forever.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/about" className="inline-flex items-center gap-1.5 text-sm text-gold hover:underline">
              <span>Read Rao Wasif's story</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
