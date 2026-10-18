"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Timer, CreditCard, Gift, Zap } from "lucide-react";

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

export default function CampaignSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft());
    const id = setInterval(update, 1000);
    const first = setTimeout(update, 0);
    return () => {
      clearInterval(id);
      clearTimeout(first);
    };
  }, []);

  return (
    <section
      id="campaigns"
      className="relative w-full py-10 sm:py-14 lg:py-16 bg-zinc-50 overflow-hidden"
    >
      {/* Decorative glows */}
      <div className="pointer-events-none absolute top-10 right-1/4 size-[320px] rounded-full bg-rose-500/8 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/6 size-[300px] rounded-full bg-emerald-500/8 blur-[110px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 sm:mb-9">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-rose-600 mb-1.5 sm:mb-2">
              <Zap className="size-3.5 fill-rose-500 text-rose-500" />
              Campaign Zone
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-950">
              চলমান{" "}
              <span className="bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                ক্যাম্পেইন
              </span>
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-base text-zinc-600 max-w-xl">
              Flash sale, 0% EMI আর ফ্রি গিফ্ট — এক জায়গায় সব চলমান অফার, সীমিত সময়ের জন্য।
            </p>
          </div>

          <Link
            href="/offers"
            className="group inline-flex items-center gap-2 shrink-0 self-start md:self-end rounded-full border border-rose-600/30 bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 shadow-xs transition-all duration-200 active:scale-95"
          >
            <span>সব অফার দেখুন</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Campaign Grid */}
        <motion.div
          initial="hidden"
          whileInView="active"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            active: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5"
        >
          {/* ---------- Featured: Flash Sale ---------- */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 32 },
              active: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            className="group relative md:col-span-2 lg:row-span-2 overflow-hidden rounded-2xl sm:rounded-3xl bg-zinc-950 min-h-[300px] sm:min-h-[360px] lg:min-h-[440px]"
          >
            <Image
              src="/images/campaign/flash-sale.jpg"
              alt="Flash Sale 50 percent"
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover object-center opacity-80 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/70 to-zinc-950/20" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-7 lg:p-8">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white shadow-md shadow-rose-600/40">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                  </span>
                  Live Now
                </span>

                <h3 className="mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight max-w-md">
                  সপ্তাহের Flash Sale —{" "}
                  <span className="text-rose-400">সর্বোচ্চ ৫০% ছাড়</span>
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-300 max-w-sm">
                  নির্বাচিত স্মার্টফোন, ল্যাপটপ আর গ্যাজেটে ফ্ল্যাশ ডিসকাউন্ট — স্টক শেষ হওয়া পর্যন্ত।
                </p>
              </div>

              <div className="mt-6">
                {/* Countdown */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <Timer className="size-3.5 text-rose-400" />
                    Ends in
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[
                      { value: timeLeft?.hours ?? "--", label: "Hrs" },
                      { value: timeLeft?.minutes ?? "--", label: "Min" },
                      { value: timeLeft?.seconds ?? "--", label: "Sec" },
                    ].map((unit) => (
                      <div
                        key={unit.label}
                        className="flex flex-col items-center rounded-lg bg-white/10 ring-1 ring-white/15 backdrop-blur-xs px-2 sm:px-2.5 py-1.5 min-w-[46px] sm:min-w-[54px]"
                      >
                        <span className="text-base sm:text-lg font-black text-white tabular-nums leading-none">
                          {unit.value}
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-semibold uppercase text-zinc-400 tracking-wider mt-0.5">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/offers/flash-sale"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-zinc-950 shadow-md transition-all group-hover:bg-rose-500 group-hover:text-white active:scale-95"
                >
                  Shop the Sale
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ---------- Card: 0% EMI ---------- */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 32 },
              active: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white ring-1 ring-zinc-200/80 shadow-xs transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/10 hover:-translate-y-1"
          >
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-zinc-100">
              <Image
                src="/images/campaign/emi-payment.jpg"
                alt="0% EMI payment at store"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/55 to-transparent" />
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                <CreditCard className="size-3" />
                0% EMI
              </span>
            </div>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <h3 className="text-base sm:text-lg font-extrabold text-zinc-950 leading-snug">
                ১২ মাস পর্যন্ত <span className="text-emerald-600">০% EMI</span>
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                সব ফ্ল্যাগশিপ ডিভাইসে কোনো ইন্টারেস্ট ছাড়াই মাসিক কিস্তি — সহজ ডকুমেন্টেশন।
              </p>

              <Link
                href="/offers/emi"
                className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                EMI প্ল্যান দেখুন
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* ---------- Card: Free Gift ---------- */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 32 },
              active: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white ring-1 ring-zinc-200/80 shadow-xs transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/10 hover:-translate-y-1"
          >
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-zinc-100">
              <Image
                src="/images/campaign/free-gift.jpg"
                alt="Free gift box"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/45 to-transparent" />
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                <Gift className="size-3" />
                Free Gift
              </span>
            </div>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <h3 className="text-base sm:text-lg font-extrabold text-zinc-950 leading-snug">
                ৳ ৫০,০০০+ অর্ডারে <span className="text-purple-600">ফ্রি গিফ্ট</span>
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                প্রিমিয়াম এক্সেসরিজ বক্স, কভার আর ভাউচার — প্রতিটি বড় অর্ডারে সারপ্রাইজ গিফ্ট।
              </p>

              <Link
                href="/offers/free-gift"
                className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors"
              >
                শর্তাবলি দেখুন
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
