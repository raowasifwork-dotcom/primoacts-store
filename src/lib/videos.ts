export type VideoItem = {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  videoId: string;
  category: "Official Trailer" | "Teaser" | "Character Spotlight" | "Behind The Scenes";
  featured?: boolean;
  publishedAt?: string;
};

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@primoacts_official";

export function extractYoutubeId(url: string): string {
  if (!url) return "";
  const clean = url.trim();
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = clean.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  // If user pasted just the 11 character ID
  if (clean.length === 11 && !clean.includes("/") && !clean.includes(".")) {
    return clean;
  }
  return clean;
}

export function getYoutubeEmbedUrl(urlOrId: string): string {
  const id = extractYoutubeId(urlOrId);
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
}

export function getYoutubeThumbnail(urlOrId: string): string {
  const id = extractYoutubeId(urlOrId);
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: "vid-1",
    title: "Shadowrealm: The Beginning of Fear",
    description: "Official cinematic trailer for the Shadowrealm saga. Step into the dark universe created by Rao Wasif.",
    youtubeUrl: "https://youtu.be/ivGyqUJ6BPs",
    videoId: "ivGyqUJ6BPs",
    category: "Official Trailer",
    featured: true,
    publishedAt: "2026",
  },
  {
    id: "vid-2",
    title: "Rise of the Supreme: Alexander Vega Awakens",
    description: "The celestial emergence of Alexander Vega (The Supreme). Power defines a king, sacrifice makes a legend.",
    youtubeUrl: "https://youtu.be/E6FXDQq17Is",
    videoId: "E6FXDQq17Is",
    category: "Character Spotlight",
    featured: true,
    publishedAt: "2026",
  },
  {
    id: "vid-3",
    title: "Shadowrealm 2: The Past Truth (Teaser)",
    description: "Official teaser for Season 2. Ravenwood remembers what the children forgot. Releasing September 10, 2026.",
    youtubeUrl: "https://youtu.be/DDWWNMClXUI",
    videoId: "DDWWNMClXUI",
    category: "Teaser",
    featured: true,
    publishedAt: "2026",
  },
  {
    id: "vid-4",
    title: "Primo Acts Cinematic Universe: Author Spotlight",
    description: "Explore the dark fantasy thriller worlds, characters, and original sagas created by founder Rao Wasif.",
    youtubeUrl: "https://youtu.be/lCpUVGKNLAg",
    videoId: "lCpUVGKNLAg",
    category: "Behind The Scenes",
    featured: false,
    publishedAt: "2026",
  },
];
