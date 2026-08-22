import { createFileRoute } from "@tanstack/react-router";

import { CHARACTERS } from "@/lib/characters";

export const Route = createFileRoute("/characters")({
  head: () => ({
    meta: [
      { title: "Characters of the Shadowrealm Saga — Primo Acts" },
      {
        name: "description",
        content:
          "Meet the seven of Hollow Creek: Mia Carter, Lucas Reed, Ethan Cole, Noah Brooks, Ava Miller, Mr. Holloway and Mrs. Finch.",
      },
      { property: "og:title", content: "Characters of the Shadowrealm Saga" },
      {
        property: "og:description",
        content: "Seven characters carry the Shadowrealm saga. Some of them won't make it.",
      },
    ],
  }),
  component: CharactersPage,
});

function CharactersPage() {
  return (
    <div className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-display text-xs uppercase tracking-[0.35em] text-gold">Cast</p>
        <h1 className="mt-4 text-4xl md:text-5xl">The seven of Hollow Creek</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Five kids who shouldn't be out after dark, and two adults who know exactly why they
          shouldn't.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CHARACTERS.map((c, i) => (
            <article
              key={c.slug}
              className="float-card glass-panel group overflow-hidden rounded-3xl"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={c.image}
                  alt={`Portrait of ${c.name}`}
                  loading="lazy"
                  className="aspect-3/4 w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/60 to-transparent p-5">
                  <p className="font-display text-xl">{c.name}</p>
                  <p className="text-xs uppercase tracking-widest text-gold">
                    {c.role} · Age {c.age}
                  </p>
                </div>
              </div>

              <div className="p-5">
                <span className="rounded-full border border-border px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  {c.trait}
                </span>
                <blockquote className="mt-4 border-l-2 border-gold/50 pl-4 font-display text-sm italic leading-relaxed">
                  “{c.quote}”
                </blockquote>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
