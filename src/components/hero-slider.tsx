"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgePercent,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import type { HeroSlideItem, HeroSliderProps } from "@/types/hero";

const AUTOPLAY_DELAY = 5500;

const TRUST_BADGES = [
  { icon: Truck, label: "Free Shipping" },
  { icon: ShieldCheck, label: "2 Year Warranty" },
  { icon: BadgePercent, label: "EMI Available" },
];

const containerVariants = {
  hidden: {},
  active: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  active: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const DEFAULT_SLIDES: HeroSlideItem[] = [
  {
    id: "slide-0",
    tagline: "Next-Gen Flagship",
    title: "iPhone 18 Pro Max",
    highlightText: "Deep Burgundy Titanium",
    description:
      "Aerospace-grade titanium unibody, A20 Pro chip, and a revolutionary camera system built for every light.",
    price: "$1,199",
    originalPrice: "$1,299",
    ctaText: "Order Now",
    ctaLink: "/category/smartphone",
    image: "/images/hero/iPhone-18-Pro-dark-cherry-3.webp",
    accentColor: "rose",
    theme: "dark",
    specs: [
      { label: "Chip", value: "A20 Pro" },
      { label: "Display", value: "6.9\" Super Retina XDR" },
      { label: "Camera", value: "48MP Pro Fusion" },
    ],
  },
  {
    id: "slide-1",
    tagline: "Ultra Performance Ecosystem",
    title: "Zenith Pro X1",
    highlightText: "M4 Ultra Architecture",
    description:
      "Experience desktop-class rendering and extreme thermal efficiency in a featherweight chassis.",
    price: "$1,899",
    originalPrice: "$2,199",
    ctaText: "Configure Now",
    ctaLink: "/category/laptops",
    image: "/images/hero/laptop.jpg",
    accentColor: "cyan",
    specs: [
      { label: "Processor", value: "24-Core CPU" },
      { label: "Display", value: "3.2K Mini-LED" },
      { label: "Battery", value: "Up to 22h" },
    ],
  },
  {
    id: "slide-2",
    tagline: "Acoustic Perfection",
    title: "AuraPods Nova",
    highlightText: "Lossless Spatial Sound",
    description:
      "Adaptive active noise cancellation with ultra-low latency diamond-coated acoustic drivers.",
    price: "$299",
    originalPrice: "$349",
    ctaText: "Order Audio",
    ctaLink: "/category/audio",
    image: "/images/hero/headphones.jpg",
    accentColor: "indigo",
    specs: [
      { label: "Drivers", value: "50mm Beryllium" },
      { label: "Latency", value: "18ms Ultra-Low" },
      { label: "ANC", value: "-45dB Hybrid" },
    ],
  },
  {
    id: "slide-3",
    tagline: "Bio-Sync Intelligence",
    title: "ChronoSync Apex",
    highlightText: "Titanium Sapphire Guard",
    description:
      "Advanced biometric telemetry, dual-frequency GPS navigation, and 14-day expedition stamina.",
    price: "$449",
    originalPrice: "$499",
    ctaText: "Explore Watch",
    ctaLink: "/category/wearables",
    image: "/images/hero/smartwatch.jpg",
    accentColor: "emerald",
    specs: [
      { label: "Glass", value: "Sapphire Crystal" },
      { label: "Water", value: "10 ATM Rated" },
      { label: "Sensors", value: "BioTracker 5.0" },
    ],
  },
];

function getDiscountPercent(price: string, originalPrice?: string): number | null {
  if (!originalPrice) return null;
  const p = parseFloat(price.replace(/[^0-9.]/g, ""));
  const o = parseFloat(originalPrice.replace(/[^0-9.]/g, ""));
  if (!p || !o || o <= p) return null;
  return Math.round(((o - p) / o) * 100);
}


export default function HeroSlider({ slides = DEFAULT_SLIDES }: HeroSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 30 },
    [
      Autoplay({
        delay: AUTOPLAY_DELAY,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => {
            const discount = getDiscountPercent(slide.price, slide.originalPrice);
            const isActive = index === selectedIndex;
            const isDark = slide.theme === "dark";

            return (
              <div
                key={slide.id}
                className={`relative flex-[0_0_100%] min-w-0 ${isDark ? "bg-zinc-950" : "bg-white"}`}
              >
                {/* Background on Desktop (lg+) */}
                <div className="hidden lg:block absolute inset-0">
                  {isDark ? (
                    <>
                      <div className="absolute inset-0 bg-zinc-950" />
                      <div className="absolute inset-y-0 right-0 w-[55%] flex items-center justify-center p-8">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          width={720}
                          height={720}
                          priority={index === 0}
                          sizes="55vw"
                          className="h-full w-auto max-w-full object-contain drop-shadow-2xl"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/95 via-40% to-transparent pointer-events-none" />
                      <div className="pointer-events-none absolute top-1/3 right-1/4 size-[420px] rounded-full bg-rose-600/15 blur-[130px]" />
                    </>
                  ) : (
                    <>
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        sizes="100vw"
                        priority={index === 0}
                        className="object-cover object-right transition-opacity duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-42% to-transparent pointer-events-none" />
                    </>
                  )}
                </div>

                {/* Ambient glow decoration (light slides) */}
                {!isDark && (
                  <div className="pointer-events-none absolute top-1/4 left-1/4 size-[400px] rounded-full bg-emerald-500/10 blur-[120px]" />
                )}

                {/* Main Content Container */}
                <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12 md:px-16 lg:pl-20 lg:pr-12 xl:pl-24 xl:pr-16 min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-center">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isActive ? "active" : "hidden"}
                    className="w-full max-w-xl lg:max-w-md xl:max-w-xl space-y-4 sm:space-y-6"
                  >
                    {/* Tagline Badge */}
                    <motion.div
                      variants={itemVariants}
                      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs font-semibold shadow-xs ${
                        isDark
                          ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                          : "border-emerald-600/20 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      <Zap className={`size-3.5 ${isDark ? "text-rose-400" : "text-emerald-600"}`} />
                      <span>{slide.tagline}</span>
                    </motion.div>

                    {/* Title & Highlight */}
                    <motion.div variants={itemVariants} className="space-y-1 sm:space-y-2">
                      <h1
                        className={`text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl ${
                          isDark ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {slide.title}
                      </h1>
                      <p
                        className={`bg-gradient-to-r bg-clip-text text-lg font-bold text-transparent sm:text-xl lg:text-2xl ${
                          isDark
                            ? "from-rose-400 via-pink-400 to-rose-500"
                            : "from-emerald-600 via-teal-600 to-emerald-700"
                        }`}
                      >
                        {slide.highlightText}
                      </p>
                    </motion.div>

                    {/* Dedicated Product Showcase on Mobile & Tablet (< lg) */}
                    <motion.div
                      variants={itemVariants}
                      className="block lg:hidden my-3 w-full"
                    >
                      <div
                        className={`relative h-52 xs:h-60 sm:h-72 w-full overflow-hidden rounded-2xl border shadow-md ${
                          isDark
                            ? "border-white/10 bg-zinc-900"
                            : "border-zinc-200/80 bg-gradient-to-br from-zinc-100 via-zinc-50 to-white"
                        }`}
                      >
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          priority={index === 0}
                          sizes="(max-width: 1024px) 100vw, 600px"
                          className={isDark ? "object-contain p-4" : "object-cover object-[72%_center]"}
                        />
                      </div>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                      variants={itemVariants}
                      className={`text-xs leading-relaxed sm:text-sm lg:text-base ${
                        isDark ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    >
                      {slide.description}
                    </motion.p>

                    {/* Specs Cards */}
                    <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2 sm:gap-3">
                      {slide.specs.map((spec) => (
                        <div
                          key={spec.label}
                          className={`rounded-xl border p-2 sm:p-2.5 shadow-xs backdrop-blur-md ${
                            isDark
                              ? "border-white/10 bg-white/5"
                              : "border-zinc-200/80 bg-white/90"
                          }`}
                        >
                          <span
                            className={`text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase block truncate ${
                              isDark ? "text-zinc-500" : "text-zinc-500"
                            }`}
                          >
                            {spec.label}
                          </span>
                          <span
                            className={`mt-0.5 block truncate text-xs sm:text-sm font-bold ${
                              isDark ? "text-white" : "text-zinc-900"
                            }`}
                          >
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </motion.div>

                    {/* Price and CTA Button */}
                    <motion.div
                      variants={itemVariants}
                      className="flex flex-wrap items-center gap-3 sm:gap-5 pt-1"
                    >
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-2xl sm:text-3xl lg:text-4xl font-black ${
                            isDark ? "text-white" : "text-zinc-950"
                          }`}
                        >
                          {slide.price}
                        </span>
                        {slide.originalPrice && (
                          <span className="text-xs sm:text-sm font-medium text-zinc-400 line-through">
                            {slide.originalPrice}
                          </span>
                        )}
                        {discount !== null && (
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-bold ${
                              isDark
                                ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                                : "border-rose-500/20 bg-rose-50 text-rose-600"
                            }`}
                          >
                            SAVE {discount}%
                          </span>
                        )}
                      </div>

                      <Link
                        href={slide.ctaLink}
                        className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 sm:px-7 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                          isDark
                            ? "bg-rose-600 shadow-rose-600/25 hover:bg-rose-500 hover:shadow-rose-500/35"
                            : "bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-500 hover:shadow-emerald-500/30"
                        }`}
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                      variants={itemVariants}
                      className={`flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-4 text-xs font-medium ${
                        isDark ? "border-white/10 text-zinc-400" : "border-zinc-200/80 text-zinc-600"
                      }`}
                    >
                      {TRUST_BADGES.map(({ icon: Icon, label }) => (
                        <span key={label} className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                          <Icon
                            className={`size-3.5 ${isDark ? "text-rose-400" : "text-emerald-600"}`}
                          />
                          {label}
                        </span>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows: Hidden on small mobile screens to prevent blocking content, visible on md+ */}
      <button
        onClick={scrollPrev}
        aria-label="Previous Slide"
        className="hidden md:flex absolute top-1/2 left-3 lg:left-6 z-20 size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-zinc-200/80 bg-white/90 text-zinc-800 shadow-md backdrop-blur-md transition-all hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:scale-105 active:scale-95"
      >
        <ChevronLeft className="size-5" />
      </button>

      <button
        onClick={scrollNext}
        aria-label="Next Slide"
        className="hidden md:flex absolute top-1/2 right-3 lg:right-6 z-20 size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-zinc-200/80 bg-white/90 text-zinc-800 shadow-md backdrop-blur-md transition-all hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:scale-105 active:scale-95"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 cursor-pointer overflow-hidden rounded-full transition-all duration-300 ${
              selectedIndex === index ? "w-10 bg-zinc-200" : "w-2 bg-zinc-300 hover:bg-zinc-400"
            }`}
          >
            {selectedIndex === index && (
              <span
                key={`progress-${index}`}
                className="block size-full origin-left bg-emerald-600"
                style={{
                  animation: `hero-slide-progress ${AUTOPLAY_DELAY}ms linear forwards`,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
