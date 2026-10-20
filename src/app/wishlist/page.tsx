"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, X, Check } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "@/providers/wishlist-context";
import { useCart } from "@/providers/cart-context";
import { formatBdt } from "@/data/products";

export default function WishlistPage() {
  const { items, remove, clear } = useWishlist();
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleMoveToCart = (id: string) => {
    const item = items.find((p) => p.id === id);
    if (!item) return;
    addItem({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      inStock: item.inStock ?? true,
    });
    setAddedId(id);
    setTimeout(() => {
      setAddedId(null);
      remove(id);
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-900">Home</Link>
          <span className="text-zinc-300">/</span>
          <span className="font-semibold text-zinc-900">Wishlist</span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-950 flex items-center gap-2">
              <Heart className="size-6 text-rose-500 fill-rose-500" />
              My Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="text-xs font-semibold text-zinc-500 hover:text-rose-600 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-zinc-200">
            <Heart className="size-12 text-zinc-300 mx-auto mb-3" />
            <h2 className="text-base font-bold text-zinc-800">Your wishlist is empty</h2>
            <p className="text-sm text-zinc-500 mt-1">
              Tap the heart on any product to save it here.
            </p>
            <Link
              href="/collection/new-arrivals"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-bold transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {items.map((item) => {
              const isAdded = addedId === item.id;
              return (
                <div
                  key={item.id}
                  className="group flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-xs overflow-hidden transition-all hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="relative w-full aspect-[4/3] bg-zinc-50">
                    <Link href={`/products/${item.id}`} className="block size-full">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      aria-label="Remove from wishlist"
                      className="absolute top-2 right-2 size-8 rounded-full bg-white/90 hover:bg-rose-50 text-zinc-600 hover:text-rose-600 flex items-center justify-center shadow-md transition-colors"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col p-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      {item.brand}
                    </span>
                    <Link
                      href={`/products/${item.id}`}
                      className="mt-0.5 text-xs font-bold text-zinc-900 hover:text-emerald-700 transition-colors line-clamp-2 leading-snug min-h-[2rem]"
                    >
                      {item.name}
                    </Link>

                    <div className="mt-1.5 flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-emerald-600">
                        {formatBdt(item.price)}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-[11px] text-zinc-400 line-through">
                          {formatBdt(item.originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleMoveToCart(item.id)}
                      className={`mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all active:scale-95 ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-zinc-950 hover:bg-emerald-600 text-white"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="size-3.5" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="size-3.5" />
                          Move to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
