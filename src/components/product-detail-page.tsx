"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
  MapPin,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Plus,
  Minus,
} from "lucide-react";
import { formatBdt, type ProductItem } from "@/data/products";
import { useCart } from "@/providers/cart-context";
import { useWishlist } from "@/providers/wishlist-context";

interface ProductDetailPageProps {
  product: ProductItem;
  related: ProductItem[];
}

const SAMPLE_REVIEWS = [
  { name: "Subrato Kumar Dey", rating: 5.0, date: "07 Sep 2026", title: "Nice", body: "Nice product, authentic and well packed." },
  { name: "Amit Das", rating: 5.0, date: "30 Jul 2026", title: "Fast delivery", body: "Fast delivery. Will recommend after using the product." },
  { name: "Nusrat Jahan", rating: 5.0, date: "20 Mar 2026", title: "Good for this price", body: "Good for this price. Genuine product with official warranty." },
  { name: "Rahim Uddin", rating: 4.0, date: "12 Jan 2026", title: "Excellent", body: "100% authentic, performance is excellent." },
  { name: "Afiya Rahman", rating: 5.0, date: "17 Aug 2025", title: "Good service", body: "Synchroma er service is too good." },
];

export default function ProductDetailPage({ product, related }: ProductDetailPageProps) {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || "");
  const { has: hasWish, toggle: toggleWish } = useWishlist();
  const wishlisted = hasWish(product.id);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<"specs" | "desc">("specs");
  const [toast, setToast] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();

  const gallery = React.useMemo(() => {
    if (product.images && product.images.length > 0) {
      const seen = new Set<string>();
      const imgs: string[] = [];
      for (const img of product.images) {
        if (!seen.has(img)) {
          seen.add(img);
          imgs.push(img);
        }
      }
      return imgs;
    }
    const seen = new Set<string>([product.image]);
    const images = [product.image];
    for (const rel of related) {
      if (images.length >= 4) break;
      if (!seen.has(rel.image)) {
        seen.add(rel.image);
        images.push(rel.image);
      }
    }
    return images;
  }, [product, related]);

  const discountPct =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
  const emiMonthly = Math.round(product.price / 12);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast((c) => (c === msg ? null : c)), 2200);
  };

  const handleAdd = (withQty = false) => {
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
      withQty ? qty : 1
    );
    setAdded(true);
    showToast(`Added ${withQty ? `${qty}× ` : ""}${product.name} to cart`);
    setTimeout(() => setAdded(false), 1600);
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
    router.push("/checkout");
  };

  return (
    <div className="w-full min-h-screen bg-zinc-50 pb-28">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white shadow-2xl">
          <Check className="size-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-900">Home</Link>
          <ChevronRight className="size-3" />
          <Link href="/collection/new-arrivals" className="hover:text-zinc-900">Products</Link>
          <ChevronRight className="size-3" />
          <span className="font-semibold text-zinc-900 truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {/* Top Grid: Image | Info | Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Image Gallery */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-zinc-200 p-4">
              <div className="relative aspect-square rounded-xl bg-white overflow-hidden">
                {discountPct > 0 && (
                  <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-black text-white shadow-sm">
                    <Zap className="size-3 fill-white" />-{discountPct}% OFF
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const added = toggleWish({
                      id: product.id,
                      name: product.name,
                      brand: product.brand,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      image: product.image,
                      inStock: product.inStock,
                    });
                    showToast(added ? "Added to your Wishlist" : "Removed from Wishlist");
                  }}
                  className="absolute top-3 right-3 z-10 size-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <Heart className={`size-4 ${wishlisted ? "fill-rose-500 text-rose-500" : "text-zinc-600"}`} />
                </button>
                <Image
                  src={gallery[activeImage]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover p-6 mix-blend-multiply"
                  priority
                />
              </div>
              {/* Thumbnails */}
              <div className="mt-3 flex gap-2">
                {gallery.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`relative size-14 rounded-lg border bg-white overflow-hidden shrink-0 transition-all ${
                      i === activeImage
                        ? "border-emerald-500 ring-1 ring-emerald-500/30"
                        : "border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="56px" className="object-cover p-1 mix-blend-multiply" />
                  </button>
                ))}
              </div>
              {/* Tabs */}
              <div className="mt-3 flex gap-2">
                <button className="flex-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 py-2 text-xs font-bold">
                  Photos ({gallery.length})
                </button>
                <button className="flex-1 rounded-full bg-white border border-zinc-200 text-zinc-600 py-2 text-xs font-bold hover:bg-zinc-50">
                  Customer ({product.reviewCount})
                </button>
              </div>
            </div>
          </div>

          {/* Main Info */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-zinc-200 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-600">Brand: {product.brand}</span>
                <button type="button" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors">
                  <Share2 className="size-3.5" /> Share
                </button>
              </div>

              <h1 className="mt-1.5 text-xl sm:text-2xl font-black text-zinc-950 leading-snug">
                {product.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-black text-zinc-950">{formatBdt(product.price)}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-zinc-400 line-through">{formatBdt(product.originalPrice)}</span>
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-bold text-emerald-700">
                      {discountPct}% OFF
                    </span>
                  </>
                )}
              </div>

              <div className="mt-2.5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                  {product.rating} <Star className="size-3 fill-white" />
                </span>
                <span className="text-xs text-zinc-500">{product.reviewCount} Reviews</span>
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs font-bold text-zinc-700">Color: </span>
                  <span className="text-xs text-zinc-500">{selectedColor}</span>
                  <div className="mt-2 flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        title={c.name}
                        className={`size-8 rounded-full ring-2 transition-all ${
                          selectedColor === c.name ? "ring-emerald-600 ring-offset-2" : "ring-zinc-200"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Qty
                </span>
                <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    disabled={qty <= 1}
                    className="flex size-10 items-center justify-center text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 rounded-l-xl transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-zinc-900 tabular-nums">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                    disabled={qty >= 10}
                    className="flex size-10 items-center justify-center text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 rounded-r-xl transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                <span className="text-xs text-zinc-400">Max 10 per order</span>
                <span className="ml-auto text-sm font-black text-zinc-950 tabular-nums">
                  {formatBdt(product.price * qty)}
                </span>
              </div>

              {/* Shop with confidence */}
              <div className="mt-5 pt-4 border-t border-zinc-100">
                <h4 className="text-sm font-bold text-zinc-900 mb-3">Shop with confidence</h4>
                <div className="rounded-xl bg-emerald-50/70 border border-emerald-100 px-4 py-3 flex items-center gap-2.5 mb-3">
                  <ShieldCheck className="size-5 text-emerald-600 shrink-0" />
                  <span className="text-sm font-bold text-zinc-900">12 Months Official Warranty</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center gap-1.5 rounded-xl border border-zinc-200 py-3">
                    <BadgeCheck className="size-5 text-emerald-600" />
                    <span className="text-[11px] font-semibold text-zinc-700">Authentic Product</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 rounded-xl border border-zinc-200 py-3">
                    <Truck className="size-5 text-emerald-600" />
                    <span className="text-[11px] font-semibold text-zinc-700">Faster Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 rounded-xl border border-zinc-200 py-3">
                    <RotateCcw className="size-5 text-emerald-600" />
                    <span className="text-[11px] font-semibold text-zinc-700">Easy Return</span>
                  </div>
                </div>
              </div>

              {/* EMI */}
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-emerald-50 transition-colors">
                <div>
                  <span className="text-sm font-bold text-zinc-900">
                    EMI available from {formatBdt(emiMonthly)}/month
                  </span>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Compare banks &amp; tenures</p>
                </div>
                <ChevronRight className="size-4 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-3">
            {/* Assured */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-4">
              <div className="flex items-center gap-2.5">
                <span className="size-9 rounded-full bg-emerald-100 flex items-center justify-center">
                  <BadgeCheck className="size-5 text-emerald-600" />
                </span>
                <div>
                  <span className="text-sm font-black text-zinc-900">Synchroma Assured</span>
                  <p className="text-[11px] text-zinc-500">Quality checked, securely packed</p>
                </div>
              </div>
            </div>

            {/* Sold by */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-4">
              <span className="text-xs text-zinc-500">Sold by</span>
              <p className="mt-0.5 text-sm font-bold text-emerald-600">Synchroma Official Store</p>
            </div>

            {/* Club Points */}
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
              <span className="text-xs font-bold text-amber-800">Club Points</span>
              <p className="mt-0.5 text-[11px] text-amber-700">
                Earn {Math.round(product.price * 0.002 * 10) / 10} points, redeemable next order
              </p>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-3">
                Delivery Information
              </h4>
              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <span className="text-sm font-bold text-zinc-900">Select Delivery Location</span>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Inside Dhaka ৳60 · Outside Dhaka ৳120
                  </p>
                </div>
                <button type="button" className="text-xs font-bold text-emerald-600 hover:underline shrink-0">
                  Select
                </button>
              </div>
            </div>

            {/* At a glance */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-3">
                At a Glance
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {product.specs.slice(0, 4).map((spec) => (
                  <div key={spec} className="rounded-lg bg-zinc-50 px-2.5 py-2">
                    <span className="text-[11px] font-semibold text-zinc-600">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Specs / Description Tabs */}
        <div className="mt-6 bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="flex border-b border-zinc-200">
            <button
              type="button"
              onClick={() => setTab("specs")}
              className={`px-6 py-3.5 text-sm font-bold transition-colors ${
                tab === "specs"
                  ? "text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50/50"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Specifications
            </button>
            <button
              type="button"
              onClick={() => setTab("desc")}
              className={`px-6 py-3.5 text-sm font-bold transition-colors ${
                tab === "desc"
                  ? "text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50/50"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Descriptions
            </button>
          </div>

          <div className="p-5">
            {tab === "specs" ? (
              <div className="space-y-0">
                <div className="rounded-t-xl bg-zinc-100 px-4 py-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-700">General</span>
                </div>
                <div className="divide-y divide-zinc-100">
                  {[
                    { k: "Brand", v: product.brand },
                    { k: "Category", v: product.category },
                    { k: "SKU", v: product.id.toUpperCase().replace(/-/g, "") },
                    { k: "Warranty Information", v: "12 Months Official Warranty" },
                    ...product.specs.map((s, i) => ({ k: `Feature ${i + 1}`, v: s })),
                  ].map((row) => (
                    <div key={row.k} className="grid grid-cols-2 px-4 py-3 text-sm">
                      <span className="text-zinc-500">{row.k}</span>
                      <span className="font-semibold text-zinc-900">{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-700 leading-relaxed">{product.description}</p>
            )}
          </div>
        </div>

        {/* Ratings & Reviews */}
        <div className="mt-6 bg-white rounded-2xl border border-zinc-200 p-5">
          <h3 className="text-base font-black text-zinc-950 mb-4">Ratings &amp; Reviews</h3>

          <div className="rounded-xl border border-zinc-200 p-5 flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center justify-center shrink-0">
              <span className="text-4xl font-black text-zinc-950">{product.rating}</span>
              <div className="mt-1 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`size-4 ${i <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-zinc-300"}`}
                  />
                ))}
              </div>
              <span className="mt-1 text-[11px] text-zinc-500">
                Based on {product.reviewCount} ratings
              </span>
            </div>

            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const pct = star === 5 ? 85 : star === 4 ? 10 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-6 font-semibold text-zinc-600">{star}★</span>
                    <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-6 text-right text-zinc-500">{star === 5 ? Math.round(product.reviewCount * 0.85) : star === 4 ? Math.max(1, Math.round(product.reviewCount * 0.1)) : 0}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review List */}
          <div className="mt-5 space-y-3">
            {SAMPLE_REVIEWS.map((r, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 p-4">
                <div className="flex items-center gap-3">
                  <span className="size-9 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center shrink-0">
                    {r.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-zinc-900">{r.name}</span>
                      <span className="inline-flex items-center gap-0.5 rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {r.rating} <Star className="size-2.5 fill-white" />
                      </span>
                      <span className="text-[11px] text-zinc-400">{r.date}</span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-zinc-800">{r.title}</p>
                    <p className="mt-0.5 text-sm text-zinc-600">{r.body}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Was this review helpful?</span>
                  <div className="flex items-center gap-4">
                    <button type="button" className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-emerald-600">
                      <ThumbsUp className="size-3.5" /> Helpful (0)
                    </button>
                    <button type="button" className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-800">
                      <ThumbsDown className="size-3.5" /> Not Helpful (0)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl border border-zinc-200 p-5">
            <h3 className="text-base font-black text-zinc-950">Related Products</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Explore similar items you might like</p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {related.map((r) => {
                const rDisc =
                  r.originalPrice > r.price
                    ? Math.round(((r.originalPrice - r.price) / r.originalPrice) * 100)
                    : 0;
                return (
                  <Link
                    key={r.id}
                    href={`/products/${r.id}`}
                    className="group rounded-xl border border-zinc-200 overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-square bg-white">
                      {rDisc > 0 && (
                        <span className="absolute top-2 left-2 z-10 rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-black text-white">
                          -{rDisc}%
                        </span>
                      )}
                      <Image
                        src={r.image}
                        alt={r.name}
                        fill
                        sizes="150px"
                        className="object-cover p-3 mix-blend-multiply group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="text-[11px] font-bold text-zinc-900 line-clamp-2 leading-snug min-h-[2rem]">
                        {r.name}
                      </p>
                      <p className="mt-1 text-sm font-black text-emerald-600">{formatBdt(r.price)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-zinc-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="relative size-11 rounded-lg border border-zinc-200 bg-white overflow-hidden shrink-0">
              <Image src={product.image} alt="" fill sizes="44px" className="object-cover p-0.5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-zinc-900 truncate">{product.name}</p>
              <p className="text-[11px] font-semibold text-emerald-600">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            <div className="text-right mr-1 hidden sm:block">
              <p className="text-lg font-black text-zinc-950 leading-tight tabular-nums">
                {formatBdt(product.price * qty)}
              </p>
              {product.originalPrice > product.price && (
                <p className="text-[11px] text-zinc-400 line-through tabular-nums">
                  {formatBdt(product.originalPrice * qty)}
                </p>
              )}
            </div>
            {/* Compact qty stepper (mobile-friendly) */}
            <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-white shrink-0">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                disabled={qty <= 1}
                className="flex size-9 items-center justify-center text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 rounded-l-xl transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-zinc-900 tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                aria-label="Increase quantity"
                disabled={qty >= 10}
                className="flex size-9 items-center justify-center text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 rounded-r-xl transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleAdd(true)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 sm:px-5 py-2.5 text-sm font-bold transition-all active:scale-95 cursor-pointer ${
                added ? "bg-emerald-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
              <span className="hidden xs:inline">Add to </span>Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
