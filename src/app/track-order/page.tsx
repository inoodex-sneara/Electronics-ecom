"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  ClipboardList,
  Warehouse,
  MapPin,
  Phone,
  Box,
  Clock,
  FileText,
  MousePointerClick,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { formatBdt } from "@/data/products";
import {
  TRACK_STAGES,
  findOrder,
  getStageIndex,
  getStageTimes,
  recentOrders,
  type StoredOrder,
} from "@/lib/orders";

const STAGE_ICONS = [ClipboardList, Package, Warehouse, Truck, CheckCircle2];

const HOW_STEPS = [
  {
    icon: FileText,
    title: "Find your Order ID",
    desc: "It's on the confirmation screen, invoice, or in the SMS we sent you.",
  },
  {
    icon: MousePointerClick,
    title: "Paste & track",
    desc: "Enter the ID above and hit Track Order — no login needed.",
  },
  {
    icon: Truck,
    title: "Watch it live",
    desc: "See real-time status from packing to out-for-delivery.",
  },
];

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<StoredOrder | null>(null);
  const [error, setError] = useState("");
  const [stage, setStage] = useState(0);
  const [stageTimes, setStageTimes] = useState<string[]>([]);
  const [recent, setRecent] = useState<StoredOrder[]>([]);

  useEffect(() => {
    const id = setTimeout(() => setRecent(recentOrders()), 0);
    return () => clearTimeout(id);
  }, []);

  const lookup = (id: string) => {
    const found = findOrder(id);
    if (!found) {
      setResult(null);
      setError("Order not found. Check your Order ID (e.g. SYN12345678).");
      return;
    }
    setError("");
    setResult(found);
    setStage(getStageIndex(found.ts));
    setStageTimes(getStageTimes(found.ts));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookup(query);
  };

  const progress = result ? (stage / (TRACK_STAGES.length - 1)) * 100 : 0;

  return (
    <div className="w-full min-h-screen bg-zinc-50 pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden bg-emerald-950">
        <div className="pointer-events-none absolute -top-32 left-1/4 size-[420px] rounded-full bg-emerald-500/20 blur-[130px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:pt-12 sm:pb-16 text-center">
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 mb-5">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <span className="text-zinc-600">/</span>
            <span className="text-white font-semibold">Track Order</span>
          </nav>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Real-time order tracking
          </span>

          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Track Your <span className="text-emerald-400">Order</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-400">
            Enter your Order ID and follow every step, from packing to your doorstep.
          </p>

          {/* Search card */}
          <form onSubmit={handleSubmit} className="mt-7 max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-emerald-950/40 ring-1 ring-white/30">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Order ID (e.g. SYN12345678)"
                  className="w-full h-11 rounded-xl bg-zinc-100 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 transition"
                />
              </div>
              <button
                type="submit"
                className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-7 text-sm font-black transition-colors active:scale-95"
              >
                Track Order
              </button>
            </div>
            <p
              className={`mt-3 text-xs font-semibold ${
                error ? "text-rose-400" : "text-zinc-500"
              }`}
            >
              {error || "Find it on your confirmation page, invoice or order SMS."}
            </p>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Result */}
        {result ? (
          <div className="space-y-4">
            {/* Status card */}
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 text-white flex flex-wrap items-center justify-between gap-3">
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100/80">
                    Order ID
                  </p>
                  <p className="text-lg font-black tracking-wide">{result.order.id}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 ring-1 ring-white/30 px-3 py-1.5 text-xs font-black">
                  <span className="size-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  {TRACK_STAGES[stage]}
                </span>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100/80">
                    Placed At
                  </p>
                  <p className="text-sm font-semibold">{result.order.placedAt}</p>
                </div>
              </div>

              <div className="px-5 pt-5 sm:px-6">
                {/* Progress */}
                <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                  <span className="text-emerald-600">{Math.round(progress)}% complete</span>
                  <span className="text-zinc-400">
                    {stage >= TRACK_STAGES.length - 1 ? "Arrived" : "On the way"}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-[width] duration-700"
                    style={{ width: `${Math.max(progress, 6)}%` }}
                  />
                </div>

                {/* Timeline */}
                <ol className="mt-6">
                  {TRACK_STAGES.map((label, i) => {
                    const Icon = STAGE_ICONS[i];
                    const done = i < stage;
                    const active = i === stage;
                    return (
                      <li key={label} className="relative flex gap-4 pb-5 last:pb-0">
                        {i < TRACK_STAGES.length - 1 && (
                          <span
                            className={`absolute left-[17px] top-9 bottom-0 w-0.5 rounded ${
                              i < stage ? "bg-emerald-500" : "bg-zinc-200"
                            }`}
                          />
                        )}
                        <span
                          className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 ${
                            done
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : active
                                ? "border-emerald-500 bg-white text-emerald-600 ring-4 ring-emerald-500/15 animate-pulse"
                                : "border-zinc-200 bg-white text-zinc-400"
                          }`}
                        >
                          <Icon className="size-4" />
                        </span>
                        <div className="pt-1.5 min-w-0 flex-1 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p
                              className={`text-sm font-bold ${
                                done || active ? "text-zinc-900" : "text-zinc-400"
                              }`}
                            >
                              {label}
                            </p>
                            {active && (
                              <p className="text-[11px] font-semibold text-emerald-600">
                                Current status
                              </p>
                            )}
                          </div>
                          <p className="shrink-0 text-[11px] text-zinc-400 text-right">
                            {stageTimes[i]}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <div className="mt-5 flex items-center gap-2 bg-emerald-50 border-t border-emerald-100 px-5 py-3 sm:px-6">
                <Clock className="size-4 shrink-0 text-emerald-600" />
                <p className="text-[11px] font-semibold text-emerald-800">
                  Estimated delivery within 24–48 hours of dispatch. Our rider will call before
                  arrival.
                </p>
              </div>
            </div>

            {/* Delivery + payment info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <MapPin className="size-4" />
                  </span>
                  <h3 className="text-sm font-black text-zinc-900">Delivery Address</h3>
                </div>
                <p className="text-sm font-semibold text-zinc-800">{result.order.name}</p>
                <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                  {result.order.address}, {result.order.area}, {result.order.city}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                  <Phone className="size-3.5 text-emerald-600" />
                  <span>{result.order.phone}</span>
                </p>
                <p className="mt-3 inline-block rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                  {result.order.zone === "inside" ? "Inside Dhaka" : "Outside Dhaka"} ·{" "}
                  {formatBdt(result.order.deliveryFee)} delivery
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Box className="size-4" />
                  </span>
                  <h3 className="text-sm font-black text-zinc-900">Payment & Total</h3>
                </div>
                <p className="text-xs text-zinc-500">Payment method</p>
                <p className="text-sm font-bold text-zinc-800 uppercase">
                  {result.order.method}
                </p>
                <p className="mt-2 text-xs text-zinc-500">Total paid</p>
                <p className="text-lg font-black text-emerald-600">
                  {formatBdt(result.order.total)}
                </p>
                <Link
                  href="/cart"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  <Box className="size-3.5" /> Reorder similar items
                </Link>
              </div>
            </div>

            {/* Items */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-black text-zinc-900 mb-1">
                Items ({result.order.items.length})
              </h3>
              <p className="text-xs text-zinc-500 mb-3">
                What&apos;s inside this shipment.
              </p>
              <ul className="divide-y divide-zinc-100">
                {result.order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-3">
                    <span className="relative size-12 shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 overflow-hidden">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold text-zinc-900">
                        {item.name}
                      </span>
                      <span className="block text-[11px] text-zinc-500">
                        {item.brand} · Qty {item.qty}
                      </span>
                    </span>
                    <span className="text-sm font-black text-zinc-900">
                      {formatBdt(item.price * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Recent orders */}
            {recent.length > 0 && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Package className="size-4" />
                  </span>
                  <h3 className="text-sm font-black text-zinc-900">Recent Orders</h3>
                </div>
                <p className="text-xs text-zinc-500 mb-3">
                  Orders placed on this device — tap to track.
                </p>
                <ul className="space-y-2">
                  {recent.map(({ order, ts }) => {
                    const idx = getStageIndex(ts);
                    return (
                      <li key={order.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setQuery(order.id);
                            lookup(order.id);
                            window.scrollTo({ top: 260, behavior: "smooth" });
                          }}
                          className="group w-full flex items-center justify-between gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-left hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors"
                        >
                          <span className="min-w-0">
                            <span className="block text-sm font-black text-zinc-900">
                              {order.id}
                            </span>
                            <span className="block truncate text-[11px] text-zinc-500">
                              {order.placedAt} · {formatBdt(order.total)}
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                            {TRACK_STAGES[idx]}
                            <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* How it works */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <ClipboardList className="size-4" />
                </span>
                <h3 className="text-sm font-black text-zinc-900">How tracking works</h3>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {HOW_STEPS.map((step, i) => (
                  <div
                    key={step.title}
                    className="rounded-xl bg-zinc-50 border border-zinc-100 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <step.icon className="size-5 text-emerald-600" />
                      <span className="text-[10px] font-black text-zinc-300">
                        0{i + 1}
                      </span>
                    </div>
                    <p className="text-xs font-black text-zinc-900">{step.title}</p>
                    <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="relative overflow-hidden rounded-2xl bg-emerald-950 px-5 py-6 text-center">
              <div className="pointer-events-none absolute -top-16 right-0 size-48 rounded-full bg-emerald-500/25 blur-3xl" />
              <Headphones className="relative size-8 text-emerald-400 mx-auto mb-2" />
              <p className="relative text-sm font-black text-white">Still can&apos;t find it?</p>
              <p className="relative mt-1 text-xs text-zinc-400">
                Our support team can look up your order with a phone number.
              </p>
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-6 py-2.5 text-xs font-black transition-colors active:scale-95"
              >
                Chat with Support <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
