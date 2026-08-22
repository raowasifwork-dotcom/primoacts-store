import { BUNDLE, getBook } from "./books";

export type LibraryEntry = {
  slug: string;
  title: string;
  pdf: string;
  reference: string;
  purchasedAt: string;
};

const STORAGE_KEY = "primo-acts-library";

export function readLibrary(): LibraryEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LibraryEntry[]) : [];
  } catch {
    return [];
  }
}

/** Unlock the PDFs for purchased slugs; a bundle unlocks both books plus the bundle file. */
export function unlockPurchases(slugs: string[], reference: string): LibraryEntry[] {
  const expanded = new Set<string>();
  for (const slug of slugs) {
    expanded.add(slug);
    if (slug === BUNDLE.slug) BUNDLE.includes.forEach((s) => expanded.add(s));
  }

  const next = readLibrary();
  for (const slug of expanded) {
    if (next.some((e) => e.slug === slug)) continue;
    const entry =
      slug === BUNDLE.slug
        ? { slug, title: BUNDLE.title, pdf: BUNDLE.pdf }
        : (() => {
            const book = getBook(slug);
            return book ? { slug, title: book.title, pdf: book.pdf } : null;
          })();
    if (!entry) continue;
    next.push({ ...entry, reference, purchasedAt: new Date().toISOString() });
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota errors */
  }
  return next;
}
