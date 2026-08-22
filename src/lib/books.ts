import shadowrealm1 from "@/assets/shadowrealm-1.png.asset.json";
import shadowrealm2 from "@/assets/shadowrealm-2.png.asset.json";

export type Book = {
  slug: string;
  title: string;
  subtitle?: string;
  series?: string;
  genre: string;
  price: number;
  formats: string[];
  pages: number;
  cover: string;
  pdf: string;
  tagline: string;
  description: string;
  featured?: boolean;
};

export const GENRES = ["All", "Dark Fantasy"] as const;

export const BOOKS: Book[] = [
  {
    slug: "shadowrealm-a-darkness-awakens",
    title: "Shadowrealm: A Darkness Awakens",
    subtitle: "The Beginning of Fear",
    series: "Shadowrealm · Season 1",
    genre: "Dark Fantasy",
    price: 14.99,
    formats: ["PDF"],
    pages: 412,
    cover: shadowrealm1.url,
    pdf: "/downloads/shadowrealm-a-darkness-awakens.pdf",
    tagline: "Seven kids. One door that should have stayed shut.",
    description:
      "An original fantasy thriller series. When a door appears in the woods behind Hollow Creek, six teenagers and one very unwilling old man discover their town has been borrowing time from something patient. The first act of the Shadowrealm saga — a cinematic descent into the space between courage and curiosity.",
    featured: true,
  },
  {
    slug: "shadowrealm-2-the-past-truth",
    title: "Shadowrealm 2: The Past Truth",
    series: "Shadowrealm · Season 2",
    genre: "Dark Fantasy",
    price: 16.99,
    formats: ["PDF"],
    pages: 458,
    cover: shadowrealm2.url,
    pdf: "/downloads/shadowrealm-2-the-past-truth.pdf",
    tagline: "The town remembers what the children forgot.",
    description:
      "Hollow Creek is quiet again — too quiet. As fire spreads through the realm between, an old truth surfaces in the voices of the missing. Book two deepens the Shadowrealm mythos and forces every member of the group to choose a side.",
    featured: true,
  },
];

export const BUNDLE = {
  slug: "shadowrealm-bundle",
  title: "Shadowrealm Season 1 + 2 Bundle",
  price: 23.99,
  compareAt: 31.98,
  pdf: "/downloads/shadowrealm-bundle.pdf",
  includes: ["shadowrealm-a-darkness-awakens", "shadowrealm-2-the-past-truth"],
};

export function getBook(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}

export function getPdf(slug: string): string | undefined {
  if (slug === BUNDLE.slug) return BUNDLE.pdf;
  return getBook(slug)?.pdf;
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}
