"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import type { HeroSlideItem, HeroSliderProps } from "@/types/hero";

const ACCENT_OVERLAY: Record<HeroSlideItem["accentColor"], string> = {
  cyan: "from-emerald-600/25 via-emerald-500/5 to-transparent",
  indigo: "from-teal-600/25 via-teal-500/5 to-transparent",
  fuchsia: "from-lime-600/20 via-lime-500/5 to-transparent",
  emerald: "from-emerald-500/30 via-emerald-400/10 to-transparent",
};

const AUTOPLAY_DELAY = 5500;

const DEFAULT_SLIDES: HeroSlideItem[] = [
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
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop",
    accentColor: "fuchsia",
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
    <section className="relative w-full overflow-hidden bg-zinc-950">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => {
            const discount = getDiscountPercent(slide.price, slide.originalPrice);
            return (
              <div key={slide.id} className="relative flex-[0_0_100%] min-w-0">
                <div className="absolute inset-0">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="100vw"
                    priority={index === 0}
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/70" />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${ACCENT_OVERLAY[slide.accentColor]}`}
                  />
                </div>

                <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-16 sm:min-h-[600px] sm:px-6 lg:min-h-[660px] lg:px-8">
                  <div className="max-w-2xl space-y-6">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 backdrop-blur-sm">
                      <Zap className="size-3.5" />
                      <span>{slide.tagline}</span>
                    </div>

                    <div className="space-y-2">
                      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        {slide.title}
                      </h1>
                      <p className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                        {slide.highlightText}
                      </p>
                    </div>

                    <p className="max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                      {slide.description}
                    </p>

                    <div className="grid max-w-md grid-cols-3 gap-3">
                      {slide.specs.map((spec) => (
                        <div
                          key={spec.label}
                          className="rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-md"
                        >
                          <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
                            {spec.label}
                          </span>
                          <span className="mt-0.5 block truncate text-xs font-semibold text-white sm:text-sm">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-5">
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-3xl font-black text-white sm:text-4xl">
                          {slide.price}
                        </span>
                        {slide.originalPrice && (
                          <span className="text-sm text-zinc-500 line-through">
                            {slide.originalPrice}
                          </span>
                        )}
                        {discount !== null && (
                          <span className="rounded-full border border-red-500/30 bg-red-500/15 px-2.5 py-0.5 text-xs font-bold text-red-400">
                            SAVE {discount}%
                          </span>
                        )}
                      </div>

                      <Link
                        href={slide.ctaLink}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-400/40 active:scale-[0.98]"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        aria-label="Previous Slide"
        className="absolute top-1/2 left-4 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-emerald-500 hover:text-zinc-950 sm:left-6"
      >
        <ChevronLeft className="size-5" />
      </button>

      <button
        onClick={scrollNext}
        aria-label="Next Slide"
        className="absolute top-1/2 right-4 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-emerald-500 hover:text-zinc-950 sm:right-6"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 overflow-hidden rounded-full transition-all duration-300 ${
              selectedIndex === index ? "w-10 bg-white/20" : "w-2 bg-white/30 hover:bg-white/60"
            }`}
          >
            {selectedIndex === index && (
              <span
                key={`progress-${index}`}
                className="block size-full origin-left bg-emerald-400"
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
