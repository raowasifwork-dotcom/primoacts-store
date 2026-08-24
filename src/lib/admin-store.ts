import { useEffect, useState } from "react";
import { BOOKS, type Book } from "./books";
import { CHARACTERS, type Character } from "./characters";
import { SITE } from "./site";
import { DEFAULT_VIDEOS, type VideoItem } from "./videos";

export type Order = {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  items: { slug: string; title: string; price: number }[];
  total: number;
  status: "pending" | "verified" | "cancelled";
  createdAt: string;
  note?: string;
};

export type SupportAgent = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  online: boolean;
};

export const DEFAULT_AGENTS: SupportAgent[] = [
  {
    id: "agent-1",
    name: "Support Agent 1",
    role: "Order & Pre-Order Specialist",
    online: true,
  },
  {
    id: "agent-2",
    name: "Support Agent 2",
    role: "Digital Delivery & Tech Support",
    online: true,
  },
  {
    id: "agent-3",
    name: "Support Agent 3",
    role: "Universe & General Inquiries",
    online: true,
  },
];

export type SupportMessage = {
  id: string;
  senderName: string;
  senderEmail: string;
  message: string;
  timestamp: string;
  status: "unread" | "replied";
  replyText?: string;
  repliedAt?: string;
  agentName?: string;
};

export type BookReview = {
  id: string;
  bookSlug: string;
  reviewerName: string;
  reviewerEmail?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  createdAt: string;
  status: "approved" | "pending";
};

export type HeroSlide = {
  id: string;
  universe: string;
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  image: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  active: boolean;
};

export type HeroConfig = {
  autoplayDuration: number; // milliseconds (e.g. 5000)
  slides: HeroSlide[];
};

export type SiteSettings = {
  announcementEnabled: boolean;
  announcementText: string;
  announcementLink: string;
  contactEmail: string;
  contactPhone: string;
  youtubeChannelUrl: string;
  allowInstantDownloads: boolean;
  founderPhotoUrl?: string;
  founderBio?: string;
};

const DEFAULT_SETTINGS: SiteSettings = {
  announcementEnabled: true,
  announcementText: "🔥 Shadowrealm Season 2: The Past Truth · Pre-Order Now!",
  announcementLink: "/store",
  contactEmail: SITE.email,
  contactPhone: SITE.phone,
  youtubeChannelUrl: "https://www.youtube.com/@primoacts_official",
  allowInstantDownloads: true,
  founderPhotoUrl: "",
  founderBio: "",
};

const DEFAULT_PIN = "7788";
const DEFAULT_PASSWORD = "primoacts";

// Helper for local storage
function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("primoacts_store_update"));
  } catch (e) {
    console.error("Storage error", e);
  }
}

// Initial orders list (starts completely clean at 0 orders)
const SAMPLE_ORDERS: Order[] = [];

// --- AUTH HOOK ---
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return getStorage<boolean>("primo_auth_status", false);
  });

  const login = (input: string): boolean => {
    const savedPin = getStorage<string>("primo_admin_pin", DEFAULT_PIN);
    const savedPass = getStorage<string>("primo_admin_pass", DEFAULT_PASSWORD);

    if (input === savedPin || input === savedPass) {
      setIsAuthenticated(true);
      setStorage("primo_auth_status", true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setStorage("primo_auth_status", false);
  };

  const updateCredentials = (newPin: string, newPass: string) => {
    setStorage("primo_admin_pin", newPin);
    setStorage("primo_admin_pass", newPass);
  };

  return { isAuthenticated, login, logout, updateCredentials };
}

// --- BOOKS HOOK ---
export function useLiveBooks() {
  const [books, setBooks] = useState<Book[]>(() => {
    return getStorage<Book[]>("primo_books_catalog", BOOKS);
  });

  useEffect(() => {
    const handleUpdate = () => {
      setBooks(getStorage<Book[]>("primo_books_catalog", BOOKS));
    };
    window.addEventListener("primoacts_store_update", handleUpdate);
    return () => window.removeEventListener("primoacts_store_update", handleUpdate);
  }, []);

  const updateBook = (updated: Book) => {
    const newBooks = books.map((b) => (b.slug === updated.slug ? updated : b));
    setBooks(newBooks);
    setStorage("primo_books_catalog", newBooks);
  };

  const addBook = (newBook: Book) => {
    const newBooks = [newBook, ...books];
    setBooks(newBooks);
    setStorage("primo_books_catalog", newBooks);
  };

  const deleteBook = (slug: string) => {
    const newBooks = books.filter((b) => b.slug !== slug);
    setBooks(newBooks);
    setStorage("primo_books_catalog", newBooks);
  };

  const resetBooks = () => {
    setBooks(BOOKS);
    setStorage("primo_books_catalog", BOOKS);
  };

  return { books, updateBook, addBook, deleteBook, resetBooks };
}

// --- CHARACTERS HOOK ---
export function useLiveCharacters() {
  const [characters, setCharacters] = useState<Character[]>(() => {
    return getStorage<Character[]>("primo_characters_roster", CHARACTERS);
  });

  useEffect(() => {
    const handleUpdate = () => {
      setCharacters(getStorage<Character[]>("primo_characters_roster", CHARACTERS));
    };
    window.addEventListener("primoacts_store_update", handleUpdate);
    return () => window.removeEventListener("primoacts_store_update", handleUpdate);
  }, []);

  const updateCharacter = (updated: Character) => {
    const newChars = characters.map((c) => (c.slug === updated.slug ? updated : c));
    setCharacters(newChars);
    setStorage("primo_characters_roster", newChars);
  };

  const addCharacter = (newChar: Character) => {
    const newChars = [newChar, ...characters];
    setCharacters(newChars);
    setStorage("primo_characters_roster", newChars);
  };

  const deleteCharacter = (slug: string) => {
    const newChars = characters.filter((c) => c.slug !== slug);
    setCharacters(newChars);
    setStorage("primo_characters_roster", newChars);
  };

  const resetCharacters = () => {
    setCharacters(CHARACTERS);
    setStorage("primo_characters_roster", CHARACTERS);
  };

  return { characters, updateCharacter, addCharacter, deleteCharacter, resetCharacters };
}

// --- YOUTUBE VIDEOS & TRAILERS HOOK ---
export function useLiveVideos() {
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    return getStorage<VideoItem[]>("primo_youtube_videos", DEFAULT_VIDEOS);
  });

  useEffect(() => {
    const handleUpdate = () => {
      setVideos(getStorage<VideoItem[]>("primo_youtube_videos", DEFAULT_VIDEOS));
    };
    window.addEventListener("primoacts_store_update", handleUpdate);
    return () => window.removeEventListener("primoacts_store_update", handleUpdate);
  }, []);

  const addVideo = (newVideo: VideoItem) => {
    const updated = [newVideo, ...videos];
    setVideos(updated);
    setStorage("primo_youtube_videos", updated);
  };

  const updateVideo = (updatedVideo: VideoItem) => {
    const updated = videos.map((v) => (v.id === updatedVideo.id ? updatedVideo : v));
    setVideos(updated);
    setStorage("primo_youtube_videos", updated);
  };

  const deleteVideo = (id: string) => {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    setStorage("primo_youtube_videos", updated);
  };

  const resetVideos = () => {
    setVideos(DEFAULT_VIDEOS);
    setStorage("primo_youtube_videos", DEFAULT_VIDEOS);
  };

  return { videos, addVideo, updateVideo, deleteVideo, resetVideos };
}

// --- SUPPORT MESSAGES & LIVE CHAT HOOK ---
export function useLiveMessages() {
  const [messages, setMessages] = useState<SupportMessage[]>(() => {
    return getStorage<SupportMessage[]>("primo_support_messages", []);
  });

  const [agents, setAgents] = useState<SupportAgent[]>(() => {
    return getStorage<SupportAgent[]>("primo_support_agents", DEFAULT_AGENTS);
  });

  useEffect(() => {
    const handleUpdate = () => {
      setMessages(getStorage<SupportMessage[]>("primo_support_messages", []));
      setAgents(getStorage<SupportAgent[]>("primo_support_agents", DEFAULT_AGENTS));
    };
    window.addEventListener("primoacts_store_update", handleUpdate);
    return () => window.removeEventListener("primoacts_store_update", handleUpdate);
  }, []);

  const sendMessage = (senderName: string, senderEmail: string, messageText: string) => {
    const newMsg: SupportMessage = {
      id: `msg-${Date.now()}`,
      senderName,
      senderEmail,
      message: messageText,
      timestamp: new Date().toISOString(),
      status: "unread",
    };
    const updated = [newMsg, ...messages];
    setMessages(updated);
    setStorage("primo_support_messages", updated);
    return newMsg;
  };

  const replyMessage = (
    id: string,
    replyText: string,
    agentName: string = "Primo Acts Support Desk",
  ) => {
    const updated = messages.map((m) =>
      m.id === id
        ? {
            ...m,
            status: "replied" as const,
            replyText,
            repliedAt: new Date().toISOString(),
            agentName,
          }
        : m,
    );
    setMessages(updated);
    setStorage("primo_support_messages", updated);
  };

  const deleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    setStorage("primo_support_messages", updated);
  };

  const updateAgent = (updatedAgent: SupportAgent) => {
    const updated = agents.map((a) => (a.id === updatedAgent.id ? updatedAgent : a));
    setAgents(updated);
    setStorage("primo_support_agents", updated);
  };

  const addAgent = (newAgent: SupportAgent) => {
    const updated = [...agents, newAgent];
    setAgents(updated);
    setStorage("primo_support_agents", updated);
  };

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return {
    messages,
    agents,
    unreadCount,
    sendMessage,
    replyMessage,
    deleteMessage,
    updateAgent,
    addAgent,
  };
}

// --- ORDERS HOOK ---
export function useLiveOrders() {
  const [orders, setOrders] = useState<Order[]>(() => {
    return getStorage<Order[]>("primo_orders_list", SAMPLE_ORDERS);
  });

  useEffect(() => {
    const handleUpdate = () => {
      setOrders(getStorage<Order[]>("primo_orders_list", SAMPLE_ORDERS));
    };
    window.addEventListener("primoacts_store_update", handleUpdate);
    return () => window.removeEventListener("primoacts_store_update", handleUpdate);
  }, []);

  const addOrder = (order: Order) => {
    const newOrders = [order, ...orders];
    setOrders(newOrders);
    setStorage("primo_orders_list", newOrders);
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    const newOrders = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(newOrders);
    setStorage("primo_orders_list", newOrders);
  };

  const deleteOrder = (id: string) => {
    const newOrders = orders.filter((o) => o.id !== id);
    setOrders(newOrders);
    setStorage("primo_orders_list", newOrders);
  };

  return { orders, addOrder, updateOrderStatus, deleteOrder };
}

// --- SETTINGS HOOK ---
export function useLiveSettings() {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    return getStorage<SiteSettings>("primo_site_settings", DEFAULT_SETTINGS);
  });

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getStorage<SiteSettings>("primo_site_settings", DEFAULT_SETTINGS));
    };
    window.addEventListener("primoacts_store_update", handleUpdate);
    return () => window.removeEventListener("primoacts_store_update", handleUpdate);
  }, []);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    setStorage("primo_site_settings", updated);
  };

  return { settings, updateSettings };
}

// --- BOOK REVIEWS & 5-STAR RATINGS HOOK (Clean - No Fake Reviews) ---
export function useLiveReviews(bookSlug?: string) {
  const [reviews, setReviews] = useState<BookReview[]>(() => {
    return getStorage<BookReview[]>("primo_book_reviews", []);
  });

  useEffect(() => {
    const handleUpdate = () => {
      setReviews(getStorage<BookReview[]>("primo_book_reviews", []));
    };
    window.addEventListener("primoacts_store_update", handleUpdate);
    return () => window.removeEventListener("primoacts_store_update", handleUpdate);
  }, []);

  const addReview = (reviewData: {
    bookSlug: string;
    reviewerName: string;
    reviewerEmail?: string;
    rating: number;
    title: string;
    comment: string;
  }) => {
    const newRev: BookReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "approved",
    };
    const updated = [newRev, ...reviews];
    setReviews(updated);
    setStorage("primo_book_reviews", updated);
    return newRev;
  };

  const deleteReview = (id: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    setReviews(updated);
    setStorage("primo_book_reviews", updated);
  };

  const bookReviews = bookSlug ? reviews.filter((r) => r.bookSlug === bookSlug) : reviews;

  const totalReviews = bookReviews.length;
  const averageRating =
    totalReviews > 0
      ? Number((bookReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
      : 5.0;

  return {
    reviews: bookReviews,
    allReviews: reviews,
    totalReviews,
    averageRating,
    addReview,
    deleteReview,
  };
}

// --- HERO SLIDESHOW HOOK ---
export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-shadowrealm",
    universe: "Shadowrealm Saga",
    badge: "PRIMO ACTS PRESENTS · DARK FANTASY THRILLER",
    title: "Stories that step",
    titleHighlight: "out of the dark.",
    description:
      "Seven unlikely heroes, one town that keeps its secrets, and a door that should have stayed shut.",
    image: "/hero-shadowrealm.jpg",
    primaryBtnText: "Enter the store",
    primaryBtnLink: "/store",
    secondaryBtnText: "Meet the seven",
    secondaryBtnLink: "/characters",
    active: true,
  },
  {
    id: "slide-supreme",
    universe: "Rise of the Supreme",
    badge: "EPIC SCI-FI FANTASY UNIVERSE",
    title: "Rise of the",
    titleHighlight: "Supreme Warrior.",
    description:
      "Alexander Vega awakens supreme cosmic powers to confront ancient dark conquerors threatening the galaxies.",
    image: "/hero-supreme.jpg",
    primaryBtnText: "Read Supreme",
    primaryBtnLink: "/store/rise-of-the-supreme",
    secondaryBtnText: "Meet The Heroes",
    secondaryBtnLink: "/characters",
    active: true,
  },
];

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  autoplayDuration: 5000,
  slides: DEFAULT_HERO_SLIDES,
};

export function useLiveHero() {
  const [config, setConfig] = useState<HeroConfig>(() => {
    return getStorage<HeroConfig>("primo_hero_config", DEFAULT_HERO_CONFIG);
  });

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getStorage<HeroConfig>("primo_hero_config", DEFAULT_HERO_CONFIG));
    };
    window.addEventListener("primoacts_store_update", handleUpdate);
    return () => window.removeEventListener("primoacts_store_update", handleUpdate);
  }, []);

  const updateDuration = (durationMs: number) => {
    const updated = { ...config, autoplayDuration: durationMs };
    setConfig(updated);
    setStorage("primo_hero_config", updated);
  };

  const updateSlide = (id: string, partial: Partial<HeroSlide>) => {
    const updatedSlides = config.slides.map((s) => (s.id === id ? { ...s, ...partial } : s));
    const updated = { ...config, slides: updatedSlides };
    setConfig(updated);
    setStorage("primo_hero_config", updated);
  };

  const addSlide = (slide: Omit<HeroSlide, "id">) => {
    const newSlide: HeroSlide = {
      ...slide,
      id: `slide-${Date.now()}`,
    };
    const updatedSlides = [...config.slides, newSlide];
    const updated = { ...config, slides: updatedSlides };
    setConfig(updated);
    setStorage("primo_hero_config", updated);
    return newSlide;
  };

  const deleteSlide = (id: string) => {
    const updatedSlides = config.slides.filter((s) => s.id !== id);
    const updated = { ...config, slides: updatedSlides };
    setConfig(updated);
    setStorage("primo_hero_config", updated);
  };

  return {
    heroConfig: config,
    slides: config.slides.filter((s) => s.active),
    allSlides: config.slides,
    autoplayDuration: config.autoplayDuration || 5000,
    updateDuration,
    updateSlide,
    addSlide,
    deleteSlide,
  };
}
