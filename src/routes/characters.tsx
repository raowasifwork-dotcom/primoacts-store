import { createFileRoute } from "@tanstack/react-router";
import { Flame, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

import { useLiveCharacters } from "@/lib/admin-store";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/characters")({
  head: () => ({
    meta: [
      { title: "Characters & Legends Universe — Primo Acts" },
      {
        name: "description",
        content:
          "Explore the iconic characters of Shadowrealm and Rise of the Supreme created and written by Rao Wasif.",
      },
      { property: "og:title", content: "Characters of the Primo Acts Universe" },
      {
        property: "og:description",
        content: "Explore the full roster of heroes, guardians, and villains created by Rao Wasif.",
      },
    ],
  }),
  component: CharactersPage,
});

function CharactersPage() {
  const { characters } = useLiveCharacters();
  const [activeTab, setActiveTab] = useState<"all" | "shadowrealm" | "supreme">("all");

  const shadowrealmChars = characters.filter(
    (c) => c.universe === "Shadowrealm Saga" || !c.universe,
  );
  const supremeChars = characters.filter(
    (c) => c.universe === "Rise of the Supreme",
  );

  return (
    <div className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="font-display text-xs uppercase tracking-[0.4em] text-gold font-semibold">
            Primo Acts Character Universe
          </span>
          <h1 className="text-4xl md:text-6xl font-display uppercase tracking-wide text-white">
            Heroes & Legends
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Discover the iconic characters, guardians, and villains of the <strong>Shadowrealm Saga</strong> and <strong>Rise of the Supreme</strong>, written by <strong className="text-white">{SITE.founder}</strong>.
          </p>

          {/* Universe Navigation Badges */}
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === "all"
                  ? "border-gold/60 bg-gold/15 text-gold shadow-md shadow-gold/10"
                  : "border-border/60 text-muted-foreground hover:text-white"
              }`}
            >
              All Universes ({characters.length})
            </button>
            <button
              onClick={() => setActiveTab("shadowrealm")}
              className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "shadowrealm"
                  ? "border-gold/60 bg-gold/15 text-gold shadow-md shadow-gold/10"
                  : "border-border/60 text-muted-foreground hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Shadowrealm Saga ({shadowrealmChars.length})
            </button>
            <button
              onClick={() => setActiveTab("supreme")}
              className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "supreme"
                  ? "border-purple-500/60 bg-purple-500/20 text-purple-300 shadow-md shadow-purple-900/30"
                  : "border-border/60 text-muted-foreground hover:text-white"
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-purple-400" />
              Rise of the Supreme ({supremeChars.length})
            </button>
          </div>
        </div>

        {/* SECTION 1: RISE OF THE SUPREME (DEDICATED SECTION) */}
        {(activeTab === "all" || activeTab === "supreme") && (
          <section className="space-y-8 rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 via-[#0a0d14] to-[#07090e] p-6 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-96 w-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="border-b border-purple-500/20 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 px-3 py-1 text-[11px] font-bold text-purple-300 uppercase tracking-widest mb-3">
                  <Zap className="h-3.5 w-3.5 text-purple-400" /> Epic Superhero Universe
                </span>
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-wide text-white">
                  Rise of the Supreme
                </h2>
                <p className="mt-2 text-xs md:text-sm text-muted-foreground max-w-2xl">
                  Starring <strong>Alexander Vega (The Supreme / Rao Wasif)</strong>. When cosmic void overlords invade humanity, the Resistance awakens ancient celestial powers.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/40 px-3 py-1.5 rounded-xl border border-purple-500/30 shrink-0">
                {supremeChars.length} Iconic Characters
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {supremeChars.map((c, i) => (
                <article
                  key={c.slug}
                  className="float-card glass-panel group overflow-hidden rounded-3xl flex flex-col justify-between border-purple-500/20 hover:border-purple-500/50 transition-all"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div>
                    <div className="relative overflow-hidden bg-black/60 aspect-[3/4]">
                      <img
                        src={c.image}
                        alt={`Portrait of ${c.name}`}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition-transform duration-[900ms] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-purple-300">
                          {c.role}
                        </span>
                        <h3 className="font-display text-lg font-bold text-white truncate">
                          {c.name}
                        </h3>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-purple-200">
                        {c.trait}
                      </span>
                      <blockquote className="border-l-2 border-purple-400/60 pl-3 font-display text-xs italic leading-relaxed text-purple-200/90">
                        “{c.quote}”
                      </blockquote>
                      <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                        {c.bio}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: SHADOWREALM SAGA (DEDICATED SECTION) */}
        {(activeTab === "all" || activeTab === "shadowrealm") && (
          <section className="space-y-8 rounded-3xl border border-gold/30 bg-gradient-to-b from-gold/10 via-[#0a0d14] to-[#07090e] p-6 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="border-b border-gold/20 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 border border-gold/30 px-3 py-1 text-[11px] font-bold text-gold uppercase tracking-widest mb-3">
                  <Sparkles className="h-3.5 w-3.5 text-gold" /> Dark Fantasy Thriller
                </span>
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-wide text-white">
                  Shadowrealm: The Seven of Ravenwood
                </h2>
                <p className="mt-2 text-xs md:text-sm text-muted-foreground max-w-2xl">
                  Five teenagers and two adults who know the dark truth behind the doors of Ravenwood.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-gold bg-gold/10 px-3 py-1.5 rounded-xl border border-gold/30 shrink-0">
                {shadowrealmChars.length} Heroes
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shadowrealmChars.map((c, i) => (
                <article
                  key={c.slug}
                  className="float-card glass-panel group overflow-hidden rounded-3xl flex flex-col justify-between border-gold/20 hover:border-gold/50 transition-all"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div>
                    <div className="relative overflow-hidden bg-black/60 aspect-[3/4]">
                      <img
                        src={c.image}
                        alt={`Portrait of ${c.name}`}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition-transform duration-[900ms] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

                      <div className="absolute top-3 left-3">
                        <span className="rounded-full bg-black/70 border border-gold/40 text-gold px-2.5 py-0.5 text-[10px] font-bold">
                          Age {c.age}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-gold">
                          {c.role}
                        </span>
                        <h3 className="font-display text-lg font-bold text-white truncate">
                          {c.name}
                        </h3>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                        {c.trait}
                      </span>
                      <blockquote className="border-l-2 border-gold/50 pl-3 font-display text-xs italic leading-relaxed text-gold/90">
                        “{c.quote}”
                      </blockquote>
                      <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                        {c.bio}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
