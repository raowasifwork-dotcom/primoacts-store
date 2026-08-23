import { useEffect, useState } from "react";
import { BOOKS, type Book } from "./books";
import { CHARACTERS, type Character } from "./characters";
import { SITE } from "./site";

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

export type SiteSettings = {
  announcementEnabled: boolean;
  announcementText: string;
  announcementLink: string;
  contactEmail: string;
  contactPhone: string;
  allowInstantDownloads: boolean;
};

const DEFAULT_SETTINGS: SiteSettings = {
  announcementEnabled: true,
  announcementText: "🔥 Shadowrealm Season 2: The Past Truth is out now!",
  announcementLink: "/store",
  contactEmail: SITE.email,
  contactPhone: SITE.phone,
  allowInstantDownloads: true,
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

    const clean = input.trim();
    if (clean === savedPin || clean === savedPass) {
      setStorage("primo_auth_status", true);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setStorage("primo_auth_status", false);
    setIsAuthenticated(false);
  };

  const updateCredentials = (newPin: string, newPass: string) => {
    if (newPin) setStorage("primo_admin_pin", newPin);
    if (newPass) setStorage("primo_admin_pass", newPass);
  };

  return { isAuthenticated, login, logout, updateCredentials };
}

// --- LIVE BOOKS HOOK ---
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
    const next = books.map((b) => (b.slug === updated.slug ? updated : b));
    setBooks(next);
    setStorage("primo_books_catalog", next);
  };

  const addBook = (newBook: Book) => {
    const next = [newBook, ...books];
    setBooks(next);
    setStorage("primo_books_catalog", next);
  };

  const deleteBook = (slug: string) => {
    const next = books.filter((b) => b.slug !== slug);
    setBooks(next);
    setStorage("primo_books_catalog", next);
  };

  const resetBooks = () => {
    setBooks(BOOKS);
    setStorage("primo_books_catalog", BOOKS);
  };

  return { books, updateBook, addBook, deleteBook, resetBooks };
}

// --- LIVE CHARACTERS HOOK ---
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
    const next = characters.map((c) => (c.slug === updated.slug ? updated : c));
    setCharacters(next);
    setStorage("primo_characters_roster", next);
  };

  const addCharacter = (newChar: Character) => {
    const next = [...characters, newChar];
    setCharacters(next);
    setStorage("primo_characters_roster", next);
  };

  const deleteCharacter = (slug: string) => {
    const next = characters.filter((c) => c.slug !== slug);
    setCharacters(next);
    setStorage("primo_characters_roster", next);
  };

  const resetCharacters = () => {
    setCharacters(CHARACTERS);
    setStorage("primo_characters_roster", CHARACTERS);
  };

  return { characters, updateCharacter, addCharacter, deleteCharacter, resetCharacters };
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

  const createOrder = (orderData: Omit<Order, "id" | "createdAt" | "status">) => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now().toString().slice(-6)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const next = [newOrder, ...orders];
    setOrders(next);
    setStorage("primo_orders_list", next);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    const next = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(next);
    setStorage("primo_orders_list", next);
  };

  const deleteOrder = (orderId: string) => {
    const next = orders.filter((o) => o.id !== orderId);
    setOrders(next);
    setStorage("primo_orders_list", next);
  };

  return { orders, createOrder, updateOrderStatus, deleteOrder };
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

  const updateSettings = (partial: Partial<SiteSettings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    setStorage("primo_site_settings", next);
  };

  return { settings, updateSettings };
}
