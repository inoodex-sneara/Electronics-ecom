"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Eye,
  ShoppingCart,
  Check,
  ArrowRight,
} from "lucide-react";
import { NEW_PRODUCTS, formatBdt, type ProductItem } from "@/data/products";
import QuickViewModal from "@/components/quick-view-modal";
import OfferBadge from "@/components/offer-badge";
import { useCart } from "@/providers/cart-context";
import { useWishlist } from "@/providers/wishlist-context";

export default function NewCollection() {
  const { has: hasWish, toggle } = useWishlist();
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const { addItem } = useCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredProducts = NEW_PRODUCTS.slice(0, 8);

  const toggleWishlist = (e: React.MouseEvent, product: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    applyWishlistToggle(product.id);
  };

  const applyWishlistToggle = (productId: string) => {
    const product = NEW_PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const added = toggle({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      inStock: product.inStock,
    });
    showToast(added ? "Added to your Wishlist" : "Removed from Wishlist");
  };

  const handleAddToCart = (e: React.MouseEvent, product: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      inStock: product.inStock,
    });
    setAddedItem(product.id);
    showToast(`Added ${product.name} to cart`);
    setTimeout(() => {
      setAddedItem(null);
    }, 1600);
  };

  const addToCartFromModal = (product: ProductItem, qty: number) => {
    addItem(
      {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        inStock: product.inStock,
      },
      qty
    );
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
    <section
      id="new-collection"
      className="relative w-full py-10 sm:py-16 lg:py-20 bg-white overflow-hidden"
    >
      {/* Decorative background glows */}
      <div className="pointer-events-none absolute top-0 left-1/4 size-[380px] rounded-full bg-emerald-500/8 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 right-1/5 size-[320px] rounded-full bg-teal-500/8 blur-[110px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 sm:mb-10">
          <div>
            {/* Section Tag */}
            <span className="inline-block text-xs font-bold tracking-wider uppercase text-emerald-700 mb-1.5 sm:mb-2">
              Fresh Drops 2026
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-950">
              New{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                Collection
              </span>
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-base text-zinc-600 max-w-xl">
              Handpicked flagship releases, next-gen silicon, and newly dropped gadgets built to elevate your lifestyle.
            </p>
          </div>

          {/* View All Link */}
          <Link
            href="/collection/new-arrivals"
            className="group inline-flex items-center gap-2 shrink-0 self-start md:self-end rounded-full border border-emerald-600/30 bg-emerald-50 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-200 active:scale-95"
          >
            <span>Explore All 2026 Drops</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Products Grid */}
        <motion.div
          key="new-collection-grid"
          initial="hidden"
          animate="active"
          variants={{
            hidden: {},
            active: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
          }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
        >
          {filteredProducts.map((product) => {
            const isWishlisted = hasWish(product.id);
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
                {/* Product Image - Full Width of Card */}
                <Link
                  href={`/products/${product.id}`}
                    className="relative w-full aspect-[4/3] sm:aspect-square overflow-hidden bg-white block"
                >
                  <span
                    className={`absolute top-2.5 left-2.5 z-10 inline-flex items-center px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold tracking-wide uppercase shadow-xs ${getTagBadgeClass(
                      product.tagColor
                    )}`}
                  >
                    {product.tag}
                  </span>
                  <OfferBadge
                    price={product.price}
                    originalPrice={product.originalPrice}
                    className="top-10"
                  />

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => toggleWishlist(e, product)}
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
                    className={`h-full w-full object-cover mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105 ${
                      product.id === "prod-2"
                        ? "object-[75%_center]"
                        : product.id === "prod-4"
                        ? "object-[70%_center]"
                        : "object-center"
                    }`}
                    draggable={false}
                  />

                  {/* Hover Quick View (Desktop) */}
                  <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:flex translate-y-3 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => openQuickView(e, product)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-950/90 backdrop-blur-xs text-white font-semibold text-xs shadow-md hover:bg-emerald-600 transition-colors"
                    >
                      <Eye className="size-3.5" />
                      <span>Quick View</span>
                    </button>
                  </div>
                </Link>

                {/* Content */}
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-zinc-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2 min-h-9">
                    <Link href={`/products/${product.id}`}>{product.name}</Link>
                  </h3>

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

                    {/* Quick Add */}
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
                          <ShoppingCart className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          wishlisted={hasWish(quickViewProduct.id)}
          onClose={() => setQuickViewProduct(null)}
          onToggleWishlist={applyWishlistToggle}
          onAddToCart={addToCartFromModal}
        />
      )}

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-2xl ring-1 ring-white/10 animate-in slide-in-from-bottom-5 duration-200">
          <Check className="size-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
