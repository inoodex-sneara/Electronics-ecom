"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Star,
  ShoppingCart,
  Heart,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  Zap,
} from "lucide-react";
import { formatBdt, type ProductItem } from "@/data/products";
import { useCart } from "@/providers/cart-context";

interface QuickViewModalProps {
  product: ProductItem;
  wishlisted?: boolean;
  onClose: () => void;
  onAddToCart: (product: ProductItem, qty: number) => void;
  onToggleWishlist?: (productId: string) => void;
}

export default function QuickViewModal({
  product,
  wishlisted = false,
  onClose,
  onAddToCart,
  onToggleWishlist,
}: QuickViewModalProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || "");
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const discountPct =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;

  const handleAdd = () => {
    setAdding(true);
    onAddToCart(product, qty);
    setTimeout(() => {
      setAdding(false);
      onClose();
    }, 900);
  };

  const handleBuyNow = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        color: selectedColor || undefined,
        inStock: product.inStock,
      },
      qty
    );
    onClose();
    router.push("/checkout");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white shadow-2xl ring-1 ring-zinc-900/10 animate-in zoom-in-95 fade-in duration-200"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-3 right-3 z-20 flex size-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-zinc-500 shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-950 hover:text-white hover:ring-zinc-950 transition-all active:scale-90"
        >
          <X className="size-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* ---------- Left: Visual (Full Cover) ---------- */}
          <div className="relative overflow-hidden bg-gradient-to-br from-zinc-100 via-zinc-50 to-emerald-50/50 min-h-[300px] md:min-h-[480px]">
            {/* Tag */}
            <span className="absolute top-4 left-4 z-10 inline-flex items-center rounded-lg bg-zinc-950/85 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-white shadow-md">
              {product.tag}
            </span>

            {/* Wishlist */}
            {onToggleWishlist && (
              <button
                onClick={() => onToggleWishlist(product.id)}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className="absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/85 backdrop-blur-md text-zinc-600 shadow-sm transition-all hover:bg-white hover:text-rose-600 active:scale-90"
              >
                <Heart
                  className={`size-4 transition-colors ${
                    wishlisted ? "fill-rose-600 text-rose-600" : ""
                  }`}
                />
              </button>
            )}

            {/* Image - Full Cover */}
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-5 sm:p-8 transition-transform duration-500 ease-out hover:scale-105"
              priority
            />

            {/* Spec chips overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-4 bg-gradient-to-t from-black/75 via-black/40 to-transparent flex flex-wrap gap-1.5">
              {product.specs.map((spec) => (
                <span
                  key={spec}
                  className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-zinc-800 shadow-xs"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* ---------- Right: Content ---------- */}
          <div className="flex flex-col p-5 sm:p-7">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-600">
              {product.brand} <span className="text-zinc-300">·</span>{" "}
              <span className="text-zinc-400">{product.category}</span>
            </span>

            <h3 className="mt-1.5 text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950 leading-tight">
              {product.name}
            </h3>

            {/* Rating + stock */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <span className="flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 ring-1 ring-amber-200/70">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className={`size-3 ${
                        i < Math.round(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-zinc-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1 font-bold text-zinc-800">{product.rating}</span>
                </span>
                <span className="text-zinc-400">
                  {product.reviewCount} reviews
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                In Stock
              </span>
            </div>

            {/* Price */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <span className="text-3xl font-black tracking-tight text-zinc-950">
                {formatBdt(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-zinc-400 line-through">
                    {formatBdt(product.originalPrice)}
                  </span>
                  <span className="rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white shadow-sm">
                    SAVE {discountPct}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-5">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Color:{" "}
                  <strong className="text-zinc-900 normal-case tracking-normal">
                    {selectedColor}
                  </strong>
                </span>
                <div className="mt-2 flex items-center gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                      style={{ backgroundColor: color.hex }}
                      className={`size-7 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? "scale-110 ring-2 ring-emerald-600 ring-offset-2 border-white shadow-md"
                          : "border-zinc-200 hover:scale-105 hover:ring-1 hover:ring-zinc-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Trust perks */}
            <ul className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { icon: Truck, label: "Free Delivery" },
                { icon: ShieldCheck, label: "2-Year Warranty" },
                { icon: RotateCcw, label: "7-Day Returns" },
              ].map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-xl bg-zinc-50 ring-1 ring-zinc-100 px-2.5 py-2"
                >
                  <Icon className="size-4 shrink-0 text-emerald-600" />
                  <span className="text-[11px] font-semibold text-zinc-600">{label}</span>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="mt-auto pt-6">
              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Qty
                </span>
                <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-white">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex size-9 items-center justify-center text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 rounded-l-xl transition-colors"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-9 text-center text-sm font-bold text-zinc-900 tabular-nums">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                    className="flex size-9 items-center justify-center text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 rounded-r-xl transition-colors"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <span className="text-xs text-zinc-400">Max 10 per order</span>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-stretch gap-2.5">
                <button
                  onClick={handleAdd}
                  disabled={adding}
                  className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all active:scale-[0.98] ${
                    adding
                      ? "bg-emerald-500"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
                  }`}
                >
                  {adding ? (
                    <>
                      <Check className="size-4" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="size-4" />
                      <span className="hidden xs:inline">Add to </span>Cart
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white px-4 py-3 text-sm font-bold transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Zap className="size-4" />
                  Buy Now
                </button>
                <Link
                  href={`/products/${product.id}`}
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-bold text-zinc-800 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all active:scale-[0.98]"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
