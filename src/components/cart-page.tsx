"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { formatBdt } from "@/data/products";
import { useCart } from "@/providers/cart-context";

const DELIVERY_FEE = 60;

export default function CartPage() {
  const router = useRouter();
  const { items, count, subtotal, updateQty, removeItem, clearCart } = useCart();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const discount = promoApplied ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal - discount + (items.length > 0 ? DELIVERY_FEE : 0);

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!code) {
      setPromoError("Enter a promo code");
      setPromoApplied(false);
      return;
    }
    if (code === "SYNCHRO10" || code === "WELCOME5") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoApplied(false);
      setPromoError("Invalid promo code. Try SYNCHRO10");
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full min-h-[70vh] bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-md rounded-2xl bg-white border border-zinc-200 p-10 text-center">
            <span className="mx-auto size-16 rounded-full bg-emerald-50 flex items-center justify-center">
              <ShoppingCart className="size-8 text-emerald-600" />
            </span>
            <h1 className="mt-4 text-xl font-black text-zinc-950">Your cart is empty</h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              Browse products and add items to your cart.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-2.5 justify-center">
              <Link
                href="/collection/new-arrivals"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-sm font-bold transition-colors"
              >
                Shop New Arrivals
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/offers/flash-sale"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 px-5 py-3 text-sm font-bold transition-colors"
              >
                Flash Sale
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-50 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:text-zinc-900">Home</Link>
            <span>/</span>
            <span className="font-semibold text-zinc-900">Cart</span>
          </nav>
          <h1 className="mt-2 text-2xl font-black text-zinc-950">Shopping Cart</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            {count} item{count !== 1 ? "s" : ""} in your cart
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-3">
          {items.map((item) => {
            const lineTotal = item.price * item.qty;
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-zinc-200 p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Link
                  href={`/products/${item.id}`}
                  className="relative size-20 sm:size-28 rounded-xl bg-zinc-50 border border-zinc-100 overflow-hidden shrink-0 self-center sm:self-start"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="112px"
                    className="object-contain p-2"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        {item.brand}
                      </p>
                      <Link
                        href={`/products/${item.id}`}
                        className="mt-0.5 text-sm font-bold text-zinc-900 hover:text-emerald-700 transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      {item.color && (
                        <p className="mt-0.5 text-[11px] text-zinc-500">Color: {item.color}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="shrink-0 size-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-white">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        aria-label="Decrease quantity"
                        disabled={item.qty <= 1}
                        className="flex size-9 items-center justify-center text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 rounded-l-xl transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm font-bold text-zinc-900 tabular-nums">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        aria-label="Increase quantity"
                        disabled={item.qty >= 10}
                        className="flex size-9 items-center justify-center text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 rounded-r-xl transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-black text-zinc-950 tabular-nums">
                        {formatBdt(lineTotal)}
                      </p>
                      {item.qty > 1 && (
                        <p className="text-[11px] text-zinc-400 tabular-nums">
                          {formatBdt(item.price)} × {item.qty}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <Link
              href="/collection/new-arrivals"
              className="text-sm font-bold text-emerald-600 hover:underline"
            >
              ← Continue shopping
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-semibold text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
            >
              Clear cart
            </button>
          </div>
        </div>

        {/* Summary Sidebar */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-3">
            <div className="rounded-2xl bg-white border border-zinc-200 p-5">
              <h2 className="text-base font-black text-zinc-950">Order Summary</h2>

              <div className="mt-4">
                <label className="text-xs font-bold text-zinc-700">Promo code</label>
                <div className="mt-1.5 flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input
                      type="text"
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                      placeholder="SYNCHRO10"
                      className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm font-semibold uppercase tracking-wide text-zinc-900 placeholder:text-zinc-400 placeholder:normal-case placeholder:tracking-normal focus:border-emerald-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="h-10 rounded-xl bg-zinc-950 hover:bg-emerald-600 text-white px-4 text-sm font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-500">{promoError}</p>
                )}
                {promoApplied && (
                  <p className="mt-1.5 text-xs font-semibold text-emerald-600">
                    Promo applied — 5% off
                  </p>
                )}
              </div>

              <div className="mt-5 space-y-2.5 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-zinc-900 tabular-nums">{formatBdt(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Promo discount</span>
                    <span className="font-bold tabular-nums">−{formatBdt(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600">
                  <span>Delivery</span>
                  <span className="font-bold text-zinc-900 tabular-nums">{formatBdt(DELIVERY_FEE)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-100 flex items-baseline justify-between">
                <span className="text-sm font-bold text-zinc-700">Total</span>
                <span className="text-2xl font-black text-zinc-950 tabular-nums">
                  {formatBdt(total)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] cursor-pointer"
              >
                Proceed to Checkout
                <ArrowRight className="size-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-white border border-zinc-200 p-4 space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-zinc-700">100% Authentic products</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Truck className="size-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-zinc-700">
                  Delivery ৳60 inside Dhaka · ৳120 outside
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky mobile checkout bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t border-zinc-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-zinc-500">Total</p>
            <p className="text-lg font-black text-zinc-950 tabular-nums">{formatBdt(total)}</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            className="ml-auto inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-sm font-bold transition-colors active:scale-95 cursor-pointer"
          >
            Checkout
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
