import thousandUnsaidImg from "@/assets/a-thousand-unsaid-things.jpg";
import riseSupremeImg from "@/assets/rise-of-the-supreme.jpg";
import shadowrealm1 from "@/assets/shadowrealm-1.jpg";
import shadowrealm2 from "@/assets/shadowrealm-2.jpg";
import silentCodeImg from "@/assets/the-silent-code.jpg";

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
  status?: "available" | "preorder" | "upcoming";
  releaseDate?: string;
};

export const GENRES = [
  "All",
  "Dark Fantasy",
  "Epic Fantasy",
  "Romantic Fiction",
  "Cyber Thriller",
  "Pre-Order / Upcoming",
] as const;

export const BOOKS: Book[] = [
  {
    slug: "shadowrealm-a-darkness-awakens",
    title: "Shadowrealm: A Darkness Awakens",
    subtitle: "The Beginning of Fear",
    series: "Shadowrealm · Season 1",
    genre: "Dark Fantasy",
    price: 14.99,
    formats: ["PDF", "Word / Doc"],
    pages: 412,
    cover: shadowrealm1,
    pdf: "/downloads/shadowrealm-a-darkness-awakens.pdf",
    tagline: "Seven kids. One door that should have stayed shut.",
    description:
      "An original fantasy thriller series. When a door appears in the woods behind Ravenwood, six teenagers and one very unwilling old man discover their town has been borrowing time from something patient. The first act of the Shadowrealm saga — a cinematic descent into the space between courage and curiosity.",
    featured: true,
    status: "available",
  },
  {
    slug: "shadowrealm-2-the-past-truth",
    title: "Shadowrealm 2: The Past Truth",
    subtitle: "Season 2 Finale · Pre-Order",
    series: "Shadowrealm · Season 2",
    genre: "Dark Fantasy",
    price: 16.99,
    formats: ["PDF", "Word / Doc"],
    pages: 458,
    cover: shadowrealm2,
    pdf: "/downloads/shadowrealm-2-the-past-truth.pdf",
    tagline: "The town remembers what the children forgot.",
    description:
      "Releasing September 10, 2026! Ravenwood is quiet again — too quiet. As fire spreads through the realm between, an old truth surfaces in the voices of the missing. Book two deepens the Shadowrealm mythos and forces every member of the group to choose a side. Pre-order now to receive the digital edition on release day.",
    featured: true,
    status: "preorder",
    releaseDate: "September 10, 2026",
  },
  {
    slug: "a-thousand-unsaid-things",
    title: "A Thousand Unsaid Things",
    subtitle: "Written by Rao Wasif",
    series: "Primo Acts Romance & Drama",
    genre: "Romantic Fiction",
    price: 13.99,
    formats: ["PDF", "Word / Doc"],
    pages: 320,
    cover: thousandUnsaidImg,
    pdf: "/downloads/a-thousand-unsaid-things.pdf",
    tagline: "Some feelings never fade, they just remain unspoken.",
    description:
      "Written by Rao Wasif. Not all loves find a place, some live in the heart forever. A deeply emotional and poetic romance novel exploring words left unsaid, memories etched in candlelight, and love that outlasts silence. Pre-order now.",
    featured: true,
    status: "preorder",
    releaseDate: "Coming Soon 2026",
  },
  {
    slug: "rise-of-the-supreme",
    title: "Rise of the Supreme",
    subtitle: "A New Legend Begins",
    series: "Supreme Universe · Phase 1",
    genre: "Epic Fantasy",
    price: 18.99,
    formats: ["PDF", "Word / Doc"],
    pages: 520,
    cover: riseSupremeImg,
    pdf: "/downloads/rise-of-the-supreme.pdf",
    tagline: "Power defines a king. Sacrifice makes a legend.",
    description:
      "Created and Written by Rao Wasif. Starring Alexander Vega (The Supreme). When darkness falls and cosmic warlords threaten humanity, Alexander awakens an ancient celestial power. A massive cinematic superhero saga featuring The Resistance, The Divine Council, and the Order of the Void.",
    featured: true,
    status: "upcoming",
    releaseDate: "Coming Soon 2026",
  },
  {
    slug: "the-silent-code",
    title: "The Silent Code",
    subtitle: "Project Zero: Classified",
    series: "Classified Thrillers",
    genre: "Cyber Thriller",
    price: 15.99,
    formats: ["PDF", "Word / Doc"],
    pages: 380,
    cover: silentCodeImg,
    pdf: "/downloads/the-silent-code.pdf",
    tagline: "Some secrets are worth killing for.",
    description:
      "Written by Rao Wasif. A conspiracy. A coverup. A truth they fear. In a world driven by unseen surveillance and hidden shadow codes, one classified folder holds the key to uncovering the greatest digital conspiracy of modern times.",
    featured: true,
    status: "upcoming",
    releaseDate: "Coming Soon 2026",
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
