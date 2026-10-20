"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Zap,
  Heart,
  Eye,
  ShoppingCart,
  Check,
  Star,
  ArrowRight,
} from "lucide-react";
import { FLASH_SALE_PRODUCTS, type FlashSaleItem } from "@/data/flash-sale";
import { formatBdt, type ProductItem } from "@/data/products";
import QuickViewModal from "@/components/quick-view-modal";
import { useCart } from "@/providers/cart-context";

interface TimeLeft {
  hours: string;
  minutes: string;
  seconds: string;
}

const pad = (n: number) => n.toString().padStart(2, "0");

function getTimeLeft(): TimeLeft {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const diff = Math.max(0, end.getTime() - now.getTime());
  const totalSec = Math.floor(diff / 1000);
  return {
    hours: pad(Math.floor(totalSec / 3600)),
    minutes: pad(Math.floor((totalSec % 3600) / 60)),
    seconds: pad(totalSec % 60),
  };
}

export default function FlashSaleSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { addItem } = useCart();

  // Exact 10 products limit for the home page
  const homeProducts = FLASH_SALE_PRODUCTS.slice(0, 10);

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft());
    const first = setTimeout(update, 0);
    const id = setInterval(update, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !wishlist[productId];
    setWishlist((prev) => ({ ...prev, [productId]: nextState }));
    showToast(nextState ? "Added to your Wishlist" : "Removed from Wishlist");
  };

  const handleAddToCart = (e: React.MouseEvent, product: FlashSaleItem) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      inStock: product.inStock ?? true,
    });
    setAddedItem(product.id);
    showToast(`Added ${product.name} to cart`);
    setTimeout(() => setAddedItem(null), 1600);
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
    setTimeout(() => setAddedItem(null), 1600);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2600);
  };

  const openQuickView = (e: React.MouseEvent, product: FlashSaleItem) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <section
      id="flash-sale"
      className="relative w-full py-10 sm:py-14 lg:py-16 bg-white overflow-hidden"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white shadow-2xl ring-1 ring-white/10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Check className="size-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Background Ambience */}
      <div className="pointer-events-none absolute -top-20 left-1/3 size-[380px] rounded-full bg-emerald-500/10 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 size-[340px] rounded-full bg-teal-400/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-zinc-950">
              Flash Sale
            </h2>

            {/* Countdown Timer */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex flex-col items-center">
                <span className="rounded-lg bg-[#f26b5b] px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-sm sm:text-lg font-black text-white tabular-nums min-w-[2.75rem] sm:min-w-[3.25rem] text-center">
                  {timeLeft?.hours ?? "00"}
                </span>
                <span className="mt-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Hrs
                </span>
              </div>
              <span className="text-[#f26b5b] font-black text-lg sm:text-xl mb-3">:</span>
              <div className="flex flex-col items-center">
                <span className="rounded-lg bg-[#f26b5b] px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-sm sm:text-lg font-black text-white tabular-nums min-w-[2.75rem] sm:min-w-[3.25rem] text-center">
                  {timeLeft?.minutes ?? "00"}
                </span>
                <span className="mt-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Mins
                </span>
              </div>
              <span className="text-[#f26b5b] font-black text-lg sm:text-xl mb-3">:</span>
              <div className="flex flex-col items-center">
                <span className="rounded-lg bg-[#f26b5b] px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-sm sm:text-lg font-black text-white tabular-nums min-w-[2.75rem] sm:min-w-[3.25rem] text-center">
                  {timeLeft?.seconds ?? "00"}
                </span>
                <span className="mt-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Secs
                </span>
              </div>
            </div>
          </div>

          {/* View All Button */}
          <Link
            href="/offers/flash-sale"
            className="group inline-flex items-center gap-1.5 rounded-full bg-zinc-950 hover:bg-emerald-600 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition-colors duration-200 shrink-0"
          >
            <span>View All Deals</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 10 Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {homeProducts.map((product) => {
            const isWishlisted = !!wishlist[product.id];
            const isAdded = addedItem === product.id;
            const percentSold = Math.round((product.soldCount / product.totalStock) * 100);
            const savings = product.originalPrice - product.price;

            return (
              <div
                key={product.id}
                className="group relative flex flex-col rounded-2xl bg-white border border-zinc-200/90 hover:border-emerald-300 shadow-xs hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden"
              >
                {/* Discount Badge */}
                <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-2 py-0.5 text-[10px] sm:text-[11px] font-black text-white shadow-sm">
                    <Zap className="size-2.5 fill-white" />
                    {product.tag}
                  </span>
                </div>

                {/* Quick Action Floating Buttons */}
                <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
                  <button
                    type="button"
                    onClick={(e) => toggleWishlist(e, product.id)}
                    className={`size-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-90 ${
                      isWishlisted
                        ? "bg-emerald-600 text-white"
                        : "bg-white/90 text-zinc-700 hover:text-emerald-600 hover:bg-white"
                    }`}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart
                      className={`size-4 ${isWishlisted ? "fill-white" : ""}`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => openQuickView(e, product)}
                    className="size-8 rounded-full bg-white/90 hover:bg-white text-zinc-700 hover:text-emerald-600 flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-90"
                    title="Quick Preview"
                  >
                    <Eye className="size-4" />
                  </button>
                </div>

                {/* Image Area */}
                <Link
                  href={`/products/${product.id}`}
                  className="relative w-full aspect-square bg-zinc-50 overflow-hidden p-3 sm:p-4 block"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
                  />
                </Link>

                {/* Content Body */}
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  {/* Brand & Rating */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                    <span className="font-semibold uppercase tracking-wider text-zinc-400">
                      {product.brand}
                    </span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      {product.rating}
                    </span>
                  </div>

                  {/* Title */}
                  <Link
                    href={`/products/${product.id}`}
                    className="text-xs sm:text-sm font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug min-h-[2.5rem]"
                  >
                    {product.name}
                  </Link>

                  {/* Pricing */}
                  <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
                    <span className="text-sm sm:text-base font-black text-emerald-600">
                      {formatBdt(product.price)}
                    </span>
                    <span className="text-[11px] sm:text-xs text-zinc-400 line-through">
                      {formatBdt(product.originalPrice)}
                    </span>
                  </div>

                  {/* Savings Tag */}
                  <div className="mt-1">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded px-1.5 py-0.5">
                      Save {formatBdt(savings)}
                    </span>
                  </div>

                  {/* Progress / Sold Urgency */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-500 mb-1">
                      <span>Claimed: {percentSold}%</span>
                      <span className="text-emerald-600 font-bold">
                        {product.totalStock - product.soldCount} left
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                        style={{ width: `${percentSold}%` }}
                      />
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-950 hover:bg-emerald-600 text-white shadow-xs"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="size-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="size-3.5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          wishlisted={!!wishlist[quickViewProduct.id]}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={addToCartFromModal}
          onToggleWishlist={(id) => {
            const nextState = !wishlist[id];
            setWishlist((prev) => ({ ...prev, [id]: nextState }));
            showToast(nextState ? "Added to your Wishlist" : "Removed from Wishlist");
          }}
        />
      )}
    </section>
  );
}
