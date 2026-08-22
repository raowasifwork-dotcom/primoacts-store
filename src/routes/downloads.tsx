import { createFileRoute, Link } from "@tanstack/react-router";
import { FileDown, Library } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { readLibrary, type LibraryEntry } from "@/lib/library";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Your PDF Downloads — Primo Acts" },
      {
        name: "description",
        content:
          "Download the Shadowrealm PDF editions you have purchased from Primo Acts, any time on this device.",
      },
      { property: "og:title", content: "Your PDF Downloads — Primo Acts" },
      { property: "og:description", content: "Access your purchased Shadowrealm PDF editions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DownloadsPage,
});

function DownloadsPage() {
  const [entries, setEntries] = useState<LibraryEntry[]>([]);

  useEffect(() => {
    setEntries(readLibrary());
  }, []);

  return (
    <div className="section-pad">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <p className="font-display text-xs uppercase tracking-[0.35em] text-gold">Your library</p>
        <h1 className="mt-4 text-4xl md:text-5xl">PDF downloads</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Every PDF you have purchased is listed here, DRM-free and unlimited. Bundle orders unlock
          both books plus the combined edition.
        </p>

        {entries.length === 0 ? (
          <div className="glass-panel mt-10 rounded-3xl p-8 text-center">
            <Library className="mx-auto h-10 w-10 text-gold" />
            <p className="mt-4 text-sm text-muted-foreground">
              No downloads yet on this device. Once an order is placed, your PDFs appear here.
            </p>
            <Button asChild className="mt-6">
              <Link to="/store">Browse the store</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-10 grid gap-4">
            {entries.map((entry) => (
              <li
                key={entry.slug}
                className="glass-panel flex items-center justify-between gap-4 rounded-2xl p-5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm">{entry.title}</p>
                  <p className="text-xs text-muted-foreground">
                    PDF · order {entry.reference}
                  </p>
                </div>
                <Button asChild variant="secondary" className="shrink-0">
                  <a href={entry.pdf} download>
                    <FileDown className="h-4 w-4" /> Download
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
