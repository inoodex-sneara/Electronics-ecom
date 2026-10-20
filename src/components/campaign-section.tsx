"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Timer,
  CreditCard,
  Gift,
  Zap,
  Flame,
  Copy,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Tag,
} from "lucide-react";

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

const pad = (n: number) => n.toString().padStart(2, "0");

function getTimeLeft(): TimeLeft {
  const now = new Date();
  // Set an engaging countdown target (midnight + 2 days)
  const target = new Date(now);
  target.setHours(23, 59, 59, 999);
  // Add 2 days for realistic multi-day campaign countdown
  const diff = Math.max(0, target.getTime() - now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const totalSec = Math.floor(diff / 1000);

  const days = Math.floor(totalSec / (3600 * 24));
  const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  };
}

export default function CampaignSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft());
    const first = setTimeout(update, 0);
    const id = setInterval(update, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => {
        setCopiedCode((cur) => (cur === code ? null : cur));
      }, 2200);
    }
  };

  return (
    <section
      id="campaigns"
      className="relative w-full py-8 sm:py-12 lg:py-14 bg-zinc-50/60 overflow-hidden"
    >
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -top-24 right-1/4 size-[400px] rounded-full bg-emerald-500/15 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-24 left-1/5 size-[360px] rounded-full bg-teal-400/12 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-2/3 size-[280px] rounded-full bg-emerald-400/10 blur-[100px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-3 shadow-xs">
              <Flame className="size-3.5 fill-emerald-500 text-emerald-500 animate-pulse" />
              <span>Limited-Time Campaigns</span>
              <span className="size-1 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold text-emerald-700/80">Active Now</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-950">
              Featured{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                Campaigns & Deals
              </span>
            </h2>

            <p className="mt-2 text-xs sm:text-sm lg:text-base text-zinc-600 max-w-2xl leading-relaxed">
              Explore handpicked flash discounts, 0% EMI installments on 30+ banks, and guaranteed
              free gift bundles on the latest electronics.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <Link
              href="/offers"
              className="group inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-zinc-900 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white shadow-xs hover:shadow-md hover:shadow-emerald-500/15 transition-all duration-300 active:scale-95"
            >
              <span>Explore All Offers</span>
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Campaign Grid (Bento Arrangement) */}
        <motion.div
          initial="hidden"
          whileInView="active"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            active: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
        >
          {/* ---------- Featured Card: Mega Flash Sale ---------- */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              active: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            className="group relative md:col-span-2 lg:row-span-2 overflow-hidden rounded-2xl sm:rounded-3xl bg-zinc-950 ring-1 ring-emerald-500/25 shadow-lg shadow-emerald-950/20 flex flex-col justify-between min-h-[300px] sm:min-h-[330px] lg:min-h-[360px]"
          >
            {/* Background Image with Depth Gradient */}
            <Image
              src="/images/campaign/flash-sale.jpg"
              alt="Mega Flash Sale - Up to 50% Off"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
              className="object-cover object-center opacity-45 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-950/90 to-emerald-950/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

            {/* Brand glows & accents */}
            <div className="pointer-events-none absolute -top-16 -left-10 size-52 rounded-full bg-emerald-500/25 blur-[70px]" />
            <div className="pointer-events-none absolute bottom-0 right-8 size-40 rounded-full bg-teal-400/20 blur-[60px]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 opacity-80" />

            {/* Top Bar with Live Tag & Discount Pill */}
            <div className="relative z-10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-2.5">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600/90 ring-1 ring-emerald-400/40 backdrop-blur-md px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white shadow-md shadow-emerald-600/30">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-300" />
                </span>
                <span>Live Flash Sale</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 text-zinc-950 font-black text-[11px] sm:text-xs px-2.5 py-1 shadow-md shadow-emerald-500/30">
                <Zap className="size-3.5 fill-zinc-950 text-zinc-950" />
                <span>UP TO 50% OFF</span>
              </div>
            </div>

            {/* Middle & Bottom Content */}
            <div className="relative z-10 p-4 sm:p-5 flex flex-col justify-end mt-auto space-y-3">
              <div>
                <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase text-emerald-400 flex items-center gap-1.5 mb-1">
                  <Sparkles className="size-3" />
                  Limited Inventory Drop
                </span>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white leading-tight max-w-xl">
                  Mega Weekend Flash Deals —{" "}
                  <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
                    Save Up to 50%
                  </span>
                </h3>
                <p className="mt-1 text-[11px] sm:text-xs text-zinc-300 max-w-lg leading-relaxed line-clamp-2">
                  Huge discounts on flagship smartphones, ultrabooks, noise-canceling headphones, and
                  smart wearables. Stock is strictly limited on every deal.
                </p>
              </div>

              {/* Progress Urgency Bar */}
              <div className="bg-white/10 backdrop-blur-md ring-1 ring-emerald-400/20 rounded-lg p-2.5 sm:p-3 max-w-lg">
                <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold mb-1.5 text-zinc-200">
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <Flame className="size-3 fill-emerald-300" />
                    84% Claimed — Selling Fast
                  </span>
                  <span className="text-zinc-400">Ends in 2 Days</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 transition-all duration-1000"
                    style={{ width: "84%" }}
                  />
                </div>
              </div>

              {/* Countdown & Coupon Grid */}
              <div className="flex flex-wrap sm:flex-nowrap sm:items-center justify-between gap-3 pt-0.5">
                {/* Countdown Timer */}
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="flex flex-col items-start pr-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      <Timer className="size-3 text-emerald-400" />
                      Deal Ends:
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[
                      { value: timeLeft?.days ?? "02", label: "Days" },
                      { value: timeLeft?.hours ?? "--", label: "Hours" },
                      { value: timeLeft?.minutes ?? "--", label: "Mins" },
                      { value: timeLeft?.seconds ?? "--", label: "Secs" },
                    ].map((unit) => (
                      <div
                        key={unit.label}
                        className="flex flex-col items-center justify-center rounded-lg bg-zinc-900/80 ring-1 ring-emerald-400/25 backdrop-blur-md px-2 py-1 min-w-[42px] sm:min-w-[46px] shadow-inner"
                      >
                        <span className="text-sm sm:text-base font-black text-white tabular-nums leading-none">
                          {unit.value}
                        </span>
                        <span className="text-[8px] font-semibold uppercase text-emerald-400/70 tracking-wider mt-0.5">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Voucher Chip with Copy Function */}
                <button
                  type="button"
                  onClick={() => handleCopyCode("FLASH50")}
                  className="group/code inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 ring-1 ring-emerald-400/30 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
                  title="Click to copy coupon code"
                >
                  <Tag className="size-3 text-emerald-300" />
                  <span>Code:</span>
                  <span className="font-mono font-black text-emerald-300 tracking-wider">FLASH50</span>
                  {copiedCode === "FLASH50" ? (
                    <span className="inline-flex items-center gap-1 text-emerald-300 font-bold ml-1">
                      <Check className="size-3" />
                      Copied!
                    </span>
                  ) : (
                    <Copy className="size-3 text-zinc-400 group-hover/code:text-white transition-colors ml-1" />
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <Link
                  href="/offers/flash-sale"
                  className="group/btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-400/40 active:scale-95"
                >
                  <span>Shop Flash Deals</span>
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>

                <Link
                  href="/offers/flash-sale"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-200/90 hover:text-white px-2 py-1.5 transition-colors"
                >
                  <span>140+ Products On Sale</span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ---------- Card: 0% Interest EMI ---------- */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              active: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white ring-1 ring-zinc-200/90 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/10 hover:-translate-y-1"
          >
            {/* Top Graphic */}
            <div className="relative w-full aspect-[16/7] overflow-hidden bg-zinc-100">
              <Image
                src="/images/campaign/emi-payment.jpg"
                alt="0% Interest EMI Financing Scheme"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/20 to-transparent" />

              {/* Badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-600/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                <CreditCard className="size-3.5" />
                <span>0% EMI Scheme</span>
              </div>

              {/* Tag bottom */}
              <span className="absolute bottom-2 left-3 text-[11px] font-bold text-white/90 drop-shadow-sm">
                Up to 36 Months Installments
              </span>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base lg:text-lg font-extrabold text-zinc-950 leading-snug group-hover:text-emerald-700 transition-colors">
                Up to 36 Months <span className="text-emerald-600">0% Easy EMI</span>
              </h3>
              <p className="mt-1.5 text-[11px] sm:text-xs text-zinc-600 leading-relaxed line-clamp-2">
                Purchase your favorite flagship phones, laptops, and gadgets with zero extra interest
                and low monthly payments across 30+ partner banks.
              </p>

              {/* Feature Pills */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {["Zero Markup", "30+ Banks Supported", "Paperless Approval"].map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-700 bg-zinc-100 rounded-md px-2.5 py-1"
                  >
                    <Check className="size-3 text-emerald-600" />
                    {feature}
                  </span>
                ))}
              </div>

              {/* Footer CTA */}
              <Link
                href="/offers/emi"
                className="mt-3 pt-3 border-t border-zinc-100 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <span>View EMI Plans & Eligibility</span>
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* ---------- Card: Free Gift Box ---------- */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              active: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white ring-1 ring-zinc-200/90 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/10 hover:-translate-y-1"
          >
            {/* Top Graphic */}
            <div className="relative w-full aspect-[16/7] overflow-hidden bg-zinc-100">
              <Image
                src="/images/campaign/free-gift.jpg"
                alt="Complimentary Free Gift on Orders"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/20 to-transparent" />

              {/* Badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 inline-flex items-center gap-1.5 rounded-full bg-purple-600/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                <Gift className="size-3.5" />
                <span>Free Gift Bundle</span>
              </div>

              {/* Tag bottom */}
              <span className="absolute bottom-2 left-3 text-[11px] font-bold text-white/90 drop-shadow-sm">
                Orders Above ৳ 50,000
              </span>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base lg:text-lg font-extrabold text-zinc-950 leading-snug group-hover:text-purple-700 transition-colors">
                Guaranteed Gift on <span className="text-purple-600">৳ 50,000+ Orders</span>
              </h3>
              <p className="mt-1.5 text-[11px] sm:text-xs text-zinc-600 leading-relaxed line-clamp-2">
                Enjoy complimentary high-grade accessories, wireless earbuds, protective cases, and
                shopping vouchers automatically added to your checkout.
              </p>

              {/* Feature Pills */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {["Free Tech Hamper", "Priority Express Delivery", "VIP Voucher"].map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-700 bg-zinc-100 rounded-md px-2.5 py-1"
                  >
                    <Check className="size-3 text-purple-600" />
                    {feature}
                  </span>
                ))}
              </div>

              {/* Footer CTA */}
              <Link
                href="/offers/free-gift"
                className="mt-3 pt-3 border-t border-zinc-100 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors"
              >
                <span>View Qualifying Bundles</span>
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* ---------- Bottom Campaign Trust & Perks Strip ---------- */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 pt-5 sm:pt-6 border-t border-zinc-200/80">
          {[
            {
              icon: Truck,
              title: "Express Delivery",
              subtitle: "Same-day Dhaka, nationwide fast shipping",
              color: "text-rose-600",
              bgColor: "bg-rose-50",
            },
            {
              icon: ShieldCheck,
              title: "Official Warranty",
              subtitle: "100% authentic brand warranty guarantee",
              color: "text-emerald-600",
              bgColor: "bg-emerald-50",
            },
            {
              icon: CreditCard,
              title: "Flexible Payments",
              subtitle: "Cash on delivery, bKash & 0% EMI",
              color: "text-blue-600",
              bgColor: "bg-blue-50",
            },
            {
              icon: RotateCcw,
              title: "7-Day Easy Returns",
              subtitle: "Hassle-free replacement policy",
              color: "text-amber-600",
              bgColor: "bg-amber-50",
            },
          ].map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.title}
                className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white border border-zinc-200/70 shadow-xs hover:border-zinc-300 transition-colors"
              >
                <div
                  className={`size-9 sm:size-10 rounded-lg ${perk.bgColor} ${perk.color} flex items-center justify-center shrink-0`}
                >
                  <Icon className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                    {perk.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
                    {perk.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
