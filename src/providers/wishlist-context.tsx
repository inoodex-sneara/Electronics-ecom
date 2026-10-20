"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  inStock?: boolean;
}

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  has: (id: string) => boolean;
  toggle: (item: Omit<WishlistItem, "id"> & { id: string }) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "synchroma-wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setItems(parsed);
        }
      } catch {
        /* ignore corrupt storage */
      }
      setHydrated(true);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* quota */
    }
  }, [items, hydrated]);

  const has = useCallback((id: string) => items.some((p) => p.id === id), [items]);

  const toggle = useCallback(
    (item: WishlistItem) => {
      const exists = items.some((p) => p.id === item.id);
      setItems((prev) =>
        exists ? prev.filter((p) => p.id !== item.id) : [...prev, item]
      );
      return !exists;
    },
    [items]
  );

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.length;

  const value = useMemo(
    () => ({ items, count, has, toggle, remove, clear }),
    [items, count, has, toggle, remove, clear]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
