"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Eye,
  ShoppingBag,
  Star,
  Check,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { NEW_PRODUCTS, CATEGORIES, formatBdt, type ProductItem } from "@/data/products";
import QuickViewModal from "@/components/quick-view-modal";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function NewArrivalsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All Drops");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    const base =
      activeCategory === "All Drops"
        ? [...NEW_PRODUCTS]
        : NEW_PRODUCTS.filter((item) => item.category === activeCategory);

    switch (sortBy) {
      case "price-asc":
        return base.sort((a, b) => a.price - b.price);
      case "price-desc":
        return base.sort((a, b) => b.price - a.price);
      case "rating":
        return base.sort((a, b) => b.rating - a.rating);
      default:
        return base;
    }
  }, [activeCategory, sortBy]);

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    applyWishlistToggle(productId);
  };

  const applyWishlistToggle = (productId: string) => {
    const nextState = !wishlist[productId];
    setWishlist((prev) => ({ ...prev, [productId]: nextState }));
    showToast(nextState ? "Added to your Wishlist" : "Removed from Wishlist");
  };

  const handleAddToCart = (e: React.MouseEvent, product: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedItem(product.id);
    showToast(`Added ${product.name} to cart`);
    setTimeout(() => {
      setAddedItem(null);
    }, 1600);
  };

  const addToCartFromModal = (product: ProductItem, qty: number) => {
    setAddedItem(product.id);
    showToast(`Added ${qty}× ${product.name} to cart`);
    setTimeout(() => {
      setAddedItem(null);
    }, 1600);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2800);
  };

  const openQuickView = (e: React.MouseEvent, product: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const getTagBadgeClass = (color: ProductItem["tagColor"]) => {
    switch (color) {
      case "emerald":
        return "bg-emerald-600 text-white";
      case "rose":
        return "bg-rose-600 text-white";
      case "amber":
        return "bg-amber-500 text-zinc-950 font-bold";
      case "indigo":
        return "bg-indigo-600 text-white";
      case "purple":
        return "bg-purple-600 text-white";
      default:
        return "bg-zinc-900 text-white";
    }
  };

  return (
    <div className="relative w-full bg-white min-h-screen">
      {/* Page Header */}
      <section className="relative overflow-hidden bg-zinc-950">
        <div className="pointer-events-none absolute top-0 left-1/4 size-[420px] rounded-full bg-emerald-500/15 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/6 size-[340px] rounded-full bg-teal-500/12 blur-[120px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-12 sm:pb-14">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-zinc-500">Collection</span>
            <ChevronRight className="size-3.5" />
            <span className="text-white font-semibold">New Arrivals</span>
          </nav>

          <div className="mt-5 sm:mt-7 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="inline-block text-xs font-bold tracking-wider uppercase text-emerald-400 mb-2">
                Fresh Drops 2026
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                New{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                  Arrivals
                </span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-xl">
                Every freshly landed gadget in one place — flagships, creator machines, audio
                gear, and desk setups, all checked in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200/80">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Category pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 flex-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              const count =
                cat === "All Drops"
                  ? NEW_PRODUCTS.length
                  : NEW_PRODUCTS.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 rounded-full px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                      : "bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/90 active:scale-95"
                  }`}
                >
                  {cat}
                  <span
                    className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="size-4 text-zinc-400 hidden sm:block" />
            <label htmlFor="sort-select" className="sr-only">
              Sort products
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-full border border-zinc-200 bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-zinc-700 hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="hidden sm:inline text-xs text-zinc-500 font-medium whitespace-nowrap">
              {filteredProducts.length} results
            </span>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        <motion.div
          key={`${activeCategory}-${sortBy}`}
          initial="hidden"
          animate="active"
          variants={{
            hidden: {},
            active: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
          }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
        >
          {filteredProducts.map((product) => {
            const isWishlisted = !!wishlist[product.id];
            const isJustAdded = addedItem === product.id;

            return (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 32 },
                  active: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
                className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200/80 bg-white shadow-xs transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/10 hover:-translate-y-1"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-[4/3] sm:aspect-square overflow-hidden bg-zinc-100">
                  <span
                    className={`absolute top-2.5 left-2.5 z-10 inline-flex items-center px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold tracking-wide uppercase shadow-xs ${getTagBadgeClass(
                      product.tagColor
                    )}`}
                  >
                    {product.tag}
                  </span>

                  <button
                    onClick={(e) => toggleWishlist(e, product.id)}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    className="absolute top-2.5 right-2.5 z-10 flex size-7 sm:size-8 items-center justify-center rounded-full bg-white/85 backdrop-blur-xs text-zinc-600 shadow-xs transition-all hover:bg-white hover:text-rose-600 active:scale-90"
                  >
                    <Heart
                      className={`size-4 transition-colors ${
                        isWishlisted ? "fill-rose-600 text-rose-600" : ""
                      }`}
                    />
                  </button>

                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    draggable={false}
                  />

                  <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:flex translate-y-3 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => openQuickView(e, product)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-950/90 backdrop-blur-xs text-white font-semibold text-xs shadow-md hover:bg-emerald-600 transition-colors"
                    >
                      <Eye className="size-3.5" />
                      <span>Quick View</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    {product.brand}
                  </span>
                  <h3 className="mt-0.5 text-xs sm:text-sm lg:text-base font-semibold text-zinc-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2 min-h-9">
                    <Link href={`/product/${product.id}`}>{product.name}</Link>
                  </h3>

                  <div className="flex items-center gap-1 mt-1.5 text-[11px] sm:text-xs text-zinc-500">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-zinc-700">{product.rating}</span>
                    <span className="text-zinc-400">({product.reviewCount})</span>
                  </div>

                  <div className="mt-auto pt-3">
                    <div className="text-base sm:text-lg font-extrabold text-zinc-950">
                      {formatBdt(product.price)}
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {product.originalPrice > product.price && (
                        <span className="text-xs sm:text-sm text-zinc-400 line-through">
                          {formatBdt(product.originalPrice)}
                        </span>
                      )}
                      {product.originalPrice > product.price && (
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-emerald-700 border border-emerald-200/70">
                          {formatBdt(product.originalPrice - product.price)} OFF
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-zinc-100 pt-2.5">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-600">
                        In Stock
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        aria-label={`Add ${product.name} to cart`}
                        className={`flex size-8 sm:size-9 items-center justify-center rounded-xl font-semibold shadow-xs transition-all active:scale-95 ${
                          isJustAdded
                            ? "bg-emerald-600 text-white ring-2 ring-emerald-600/30"
                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-950 hover:text-white"
                        }`}
                      >
                        {isJustAdded ? (
                          <Check className="size-4" />
                        ) : (
                          <ShoppingBag className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center text-zinc-500 text-sm font-medium">
            No products in this category yet.
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          wishlisted={!!wishlist[quickViewProduct.id]}
          onClose={() => setQuickViewProduct(null)}
          onToggleWishlist={applyWishlistToggle}
          onAddToCart={addToCartFromModal}
        />
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-2xl ring-1 ring-white/10 animate-in slide-in-from-bottom-5 duration-200">
          <Check className="size-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
