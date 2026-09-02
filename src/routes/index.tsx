import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Download, Quote, ShieldCheck, Star, UserCheck } from "lucide-react";
import { toast } from "sonner";

import { BookCard } from "@/components/site/BookCard";
import { CinematicTrailersSection } from "@/components/site/CinematicTrailersSection";
import { HeroSlideshow } from "@/components/site/HeroSlideshow";
import { Button } from "@/components/ui/button";
import { useLiveReviews } from "@/lib/admin-store";
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
  const { allReviews = [] } = useLiveReviews();
  const bundleInCart = has(BUNDLE.slug);
  const featured = BOOKS.filter((b) => b.featured);
  const bundleBooks = BUNDLE.includes.map(getBook).filter(Boolean);

  const displayedReviews =
    allReviews.length > 0
      ? allReviews.slice(0, 3)
      : [
          {
            id: "rev-1",
            reviewerName: "Hamza Tariq",
            title: "Unputdownable Dark Fantasy!",
            comment:
              "Shadowrealm gripped me from chapter one. The dark atmosphere and worldbuilding by Rao Wasif are world-class.",
            rating: 5,
            bookSlug: "shadowrealm-a-darkness-awakens",
          },
          {
            id: "rev-2",
            reviewerName: "Sarah Jenkins",
            title: "Masterpiece in Worldbuilding",
            comment:
              "The seven heroes dynamic feels so fresh and cinematic. High-resolution PDF delivery was instant within seconds.",
            rating: 5,
            bookSlug: "shadowrealm-2-the-past-truth",
          },
          {
            id: "rev-3",
            reviewerName: "Bilal Ahmed",
            title: "Superb Character Depth",
            comment:
              "Alexander Vega in Rise of the Supreme is one of the coolest sci-fi protagonists I've read this year. 10/10 recommended.",
            rating: 5,
            bookSlug: "rise-of-the-supreme",
          },
        ];

  return (
    <div>
      {/* Netflix-Style Cinematic Hero Slideshow */}
      <HeroSlideshow />

      {/* Trust strip */}
      <section className="border-y border-border/60 bg-[#080b12]/80 backdrop-blur-md">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3 md:px-6">
          {[
            {
              icon: Download,
              title: "Instant Digital Delivery",
              body: "Clean DRM-Free PDF editions emailed straight to your inbox.",
            },
            {
              icon: ShieldCheck,
              title: "Verified Secure Payment",
              body: "Encrypted Visa, Mastercard & Verified Bank Transfers.",
            },
            {
              icon: BookOpen,
              title: "Universal Device Support",
              body: "Works on Kindle, iPad, Android, Mac & PC forever.",
            },
          ].map((item) => (
            <div key={item.title} className="flex min-w-0 items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 text-gold">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="section-pad">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-border/40 pb-6">
            <div className="min-w-0">
              <span className="text-[11px] uppercase tracking-widest text-gold font-bold">
                Official Book Catalog
              </span>
              <h2 className="mt-1 text-3xl md:text-4xl font-display text-white">
                Featured Releases
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Stories readers start with — and finish in a single night.
              </p>
            </div>
            <Link to="/store" className="shrink-0 text-sm font-semibold text-gold hover:underline flex items-center gap-1">
              <span>View All Books</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Complete Bundle Offer */}
      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="glass-panel grid gap-8 rounded-3xl p-6 md:grid-cols-2 md:p-10 border border-gold/30 shadow-2xl">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              {bundleBooks.map(
                (book, i) =>
                  book && (
                    <img
                      key={book.slug}
                      src={book.cover}
                      alt={`Cover of ${book.title}`}
                      loading="lazy"
                      className={`h-48 w-32 rounded-xl object-cover shadow-2xl border border-gold/30 md:h-64 md:w-44 ${
                        i > 0 ? "-ml-12 md:-ml-20" : ""
                      }`}
                    />
                  ),
              )}
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-[11px] uppercase tracking-widest text-gold font-bold">
                Special Author's Edition
              </span>
              <h3 className="mt-2 text-2xl md:text-3xl font-display font-bold text-white">
                {BUNDLE.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {BUNDLE.description}
              </p>
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-gold">
                  {formatPrice(BUNDLE.price)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(BUNDLE.originalPrice)}
                </span>
                <span className="rounded-full bg-gold/15 border border-gold/40 px-2.5 py-0.5 text-xs font-semibold text-gold">
                  Save {Math.round((1 - BUNDLE.price / BUNDLE.originalPrice) * 100)}%
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  className="btn-gold rounded-xl px-6 h-11 text-xs"
                  disabled={bundleInCart}
                  onClick={() => {
                    add({
                      slug: BUNDLE.slug,
                      title: BUNDLE.title,
                      price: BUNDLE.price,
                      cover: BUNDLE.cover,
                      format: "PDF Edition",
                    });
                    toast.success("Complete Bundle added to your cart!");
                  }}
                >
                  {bundleInCart ? "In Cart" : "Get Complete Bundle"}
                </Button>
                <Button asChild variant="outline" className="border-border/60 rounded-xl px-6 h-11 text-xs text-white hover:bg-surface">
                  <Link to="/checkout">Buy Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Book Trailers */}
      <CinematicTrailersSection />

      {/* Meet the Characters Universe */}
      <section className="section-pad border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-border/40 pb-6">
            <div className="min-w-0">
              <span className="text-[11px] uppercase tracking-widest text-gold font-bold">
                Lore & Universe
              </span>
              <h2 className="mt-1 text-3xl md:text-4xl font-display text-white">
                Meet the Characters
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The legends, villains, and anti-heroes shaping the universe of Primo Acts.
              </p>
            </div>
            <Link to="/characters" className="shrink-0 text-sm font-semibold text-gold hover:underline flex items-center gap-1">
              <span>All 7 Characters</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CHARACTERS.slice(0, 3).map((character) => (
              <Link
                key={character.id}
                to="/characters"
                className="glass-panel group block overflow-hidden rounded-2xl border border-border/40 p-4 transition-all duration-300 hover:border-gold/50 shadow-xl"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-xl bg-surface border border-white/5">
                  <img
                    src={character.imageUrl}
                    alt={character.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
                    {character.role}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-bold text-white">
                    {character.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {character.shortBio}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reader Reviews & Ratings Section */}
      <section className="section-pad border-t border-border/60 bg-[#080b12]/90">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-gold font-bold">
                Verified Reader Ratings
              </span>
              <h2 className="mt-1 text-3xl md:text-4xl font-display text-white">
                Reader Reviews & Feedback
              </h2>
            </div>
            <Link
              to="/store"
              className="text-xs font-semibold text-gold hover:underline inline-flex items-center gap-1"
            >
              <span>Explore Bookstore Reviews</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedReviews.map((rev) => (
              <div
                key={rev.id}
                className="glass-panel p-6 rounded-2xl border border-border/50 flex flex-col justify-between gap-4 shadow-xl hover:border-gold/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${
                          s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-zinc-600"
                        }`}
                      />
                    ))}
                  </div>
                  <h4 className="font-bold text-sm text-white">{rev.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">“{rev.comment}”</p>
                </div>

                <div className="pt-3 border-t border-border/30 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{rev.reviewerName}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <UserCheck className="h-3 w-3" /> Verified Reader
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct Author Guarantee Note */}
      <section className="section-pad border-t border-border/60">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6 space-y-4">
          <span className="text-[11px] uppercase tracking-widest text-gold font-bold">
            Author Commitment
          </span>
          <h2 className="text-2xl md:text-3xl font-display text-white">
            Direct from Writer to Reader
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            No DRM locks, no middleman markups. Every book purchased on Primo Acts delivers authentic DRM-Free PDF editions readable on any smartphone, tablet, Kindle, or laptop forever.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-xl text-xs px-6">
              <Link to="/about">
                <span>Read Rao Wasif's Story</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
