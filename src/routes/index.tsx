import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Download, MessageCircle, Quote, ShieldCheck, Sparkles, Star, UserCheck } from "lucide-react";
import { toast } from "sonner";

import { BookCard } from "@/components/site/BookCard";
import { CinematicTrailersSection } from "@/components/site/CinematicTrailersSection";
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
      {/* Clean Nexora-Style Static Executive Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 bg-[#070a12] border-b border-slate-800">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center md:px-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400 backdrop-blur-md mb-8 shadow-lg shadow-emerald-950/40">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Direct Digital Book Delivery — No Waiting</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-2xl">
            Cinematic digital books that <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              grip you from page one.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300/90 max-w-3xl mx-auto leading-relaxed font-normal">
            Explore original dark fantasy, sci-fi, and thriller sagas created by <strong className="text-white font-semibold">Rao Wasif</strong>. Instant high-resolution DRM-Free PDF editions delivered directly to your device.
          </p>

          {/* 3 Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="https://wa.me/92309296743?text=Hi%20Rao%20Wasif,%20I%20want%20to%20order%20Primo%20Acts%20digital%20books."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25d366] hover:bg-[#20bd5a] text-black font-bold px-6 py-3.5 text-xs sm:text-sm shadow-xl shadow-emerald-950/50 hover:scale-105 transition-all"
            >
              <MessageCircle className="h-4 w-4 fill-black text-black" />
              <span>Order via WhatsApp</span>
            </a>

            <Button asChild size="lg" className="rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3.5 text-xs sm:text-sm border border-slate-700 shadow-xl">
              <Link to="/store">
                <span>Browse All Books</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="rounded-full border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white px-5 py-3.5 text-xs sm:text-sm">
              <Link to="/characters">
                <Sparkles className="mr-2 h-4 w-4 text-blue-400" />
                <span>Meet Characters</span>
              </Link>
            </Button>
          </div>

          {/* 3 Executive Stat Cards (Matching Nexora Screenshot) */}
          <div className="mt-14 grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto text-left">
            <div className="p-5 rounded-2xl border border-slate-800/80 bg-[#0d1322]/80 backdrop-blur-md shadow-xl flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-white font-display">Instant</p>
                <p className="text-xs text-slate-400 mt-0.5">DRM-Free PDF Download</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800/80 bg-[#0d1322]/80 backdrop-blur-md shadow-xl flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-white font-display">5+ Titles</p>
                <p className="text-xs text-slate-400 mt-0.5">Complete Digital Library</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800/80 bg-[#0d1322]/80 backdrop-blur-md shadow-xl flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-white font-display">100%</p>
                <p className="text-xs text-slate-400 mt-0.5">Direct Author Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="section-pad">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-slate-800 pb-6">
            <div className="min-w-0">
              <span className="text-[11px] uppercase tracking-widest text-blue-400 font-bold">
                Official Book Catalog
              </span>
              <h2 className="mt-1 text-3xl md:text-4xl font-display text-white">
                Featured Releases
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Stories readers start with — and finish in a single night.
              </p>
            </div>
            <Link to="/store" className="shrink-0 text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1">
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
          <div className="glass-panel grid gap-8 rounded-3xl p-6 md:grid-cols-2 md:p-10 border border-slate-700 shadow-2xl">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              {bundleBooks.map(
                (book, i) =>
                  book && (
                    <img
                      key={book.slug}
                      src={book.cover}
                      alt={`Cover of ${book.title}`}
                      loading="lazy"
                      className={`h-48 w-32 rounded-xl object-cover shadow-2xl border border-slate-700 md:h-64 md:w-44 ${
                        i > 0 ? "-ml-12 md:-ml-20" : ""
                      }`}
                    />
                  ),
              )}
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-[11px] uppercase tracking-widest text-blue-400 font-bold">
                Special Author's Edition
              </span>
              <h3 className="mt-2 text-2xl md:text-3xl font-display font-bold text-white">
                {BUNDLE.title}
              </h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                {BUNDLE.description}
              </p>
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-white">
                  {formatPrice(BUNDLE.price)}
                </span>
                <span className="text-sm text-slate-500 line-through">
                  {formatPrice(BUNDLE.originalPrice)}
                </span>
                <span className="rounded-full bg-blue-500/15 border border-blue-500/40 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
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
                <Button asChild variant="outline" className="border-slate-700 rounded-xl px-6 h-11 text-xs text-slate-200 hover:bg-slate-800">
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
      <section className="section-pad border-t border-slate-800">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-slate-800 pb-6">
            <div className="min-w-0">
              <span className="text-[11px] uppercase tracking-widest text-blue-400 font-bold">
                Lore & Universe
              </span>
              <h2 className="mt-1 text-3xl md:text-4xl font-display text-white">
                Meet the Characters
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                The legends, villains, and anti-heroes shaping the universe of Primo Acts.
              </p>
            </div>
            <Link to="/characters" className="shrink-0 text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1">
              <span>All 7 Characters</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CHARACTERS.slice(0, 3).map((character) => (
              <Link
                key={character.id}
                to="/characters"
                className="glass-panel group block overflow-hidden rounded-2xl border border-slate-800 p-4 transition-all duration-300 hover:border-blue-500/50 shadow-xl"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-xl bg-slate-900 border border-white/5">
                  <img
                    src={character.imageUrl}
                    alt={character.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                    {character.role}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-bold text-white">
                    {character.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {character.shortBio}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reader Reviews & Ratings Section */}
      <section className="section-pad border-t border-slate-800 bg-[#0a0f1d]/90">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-blue-400 font-bold">
                Verified Reader Ratings
              </span>
              <h2 className="mt-1 text-3xl md:text-4xl font-display text-white">
                Reader Reviews & Feedback
              </h2>
            </div>
            <Link
              to="/store"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1"
            >
              <span>Explore Bookstore Reviews</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedReviews.map((rev) => (
              <div
                key={rev.id}
                className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4 shadow-xl hover:border-blue-500/40 transition-all"
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
                  <p className="text-xs text-slate-400 leading-relaxed">“{rev.comment}”</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
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
      <section className="section-pad border-t border-slate-800">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6 space-y-4">
          <span className="text-[11px] uppercase tracking-widest text-blue-400 font-bold">
            Author Commitment
          </span>
          <h2 className="text-2xl md:text-3xl font-display text-white">
            Direct from Writer to Reader
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            No DRM locks, no middleman markups. Every book purchased on Primo Acts delivers authentic DRM-Free PDF editions readable on any smartphone, tablet, Kindle, or laptop forever.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Button asChild variant="outline" className="border-blue-500/40 text-blue-400 hover:bg-blue-500/10 rounded-xl text-xs px-6">
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
