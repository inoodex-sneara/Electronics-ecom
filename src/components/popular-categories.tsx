"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CategoryCircle {
  id: string;
  name: string;
  itemCount: string;
  href: string;
  image: string;
  tag?: string;
}

const CATEGORIES: CategoryCircle[] = [
  {
    id: "smartphone",
    name: "iPhone & Flagships",
    itemCount: "42+ Models",
    href: "/category/smartphone",
    image: "/images/categories/iphone-18-pro-max.webp",
    tag: "Trending",
  },
  {
    id: "tablet",
    name: "Tablets & iPads",
    itemCount: "28+ Models",
    href: "/category/tablet",
    image: "/images/categories/tablets.jpg",
  },
  {
    id: "mac",
    name: "Mac & MacBooks",
    itemCount: "19+ Models",
    href: "/category/mac",
    image: "/images/categories/mac.jpg",
    tag: "Hot",
  },
  {
    id: "laptop",
    name: "Laptops & Ultrabooks",
    itemCount: "35+ Models",
    href: "/category/laptop",
    image: "/images/categories/laptop.jpg",
  },
  {
    id: "gaming",
    name: "Gaming Laptops",
    itemCount: "24+ Models",
    href: "/category/laptop",
    image: "/images/categories/gaming.jpg",
    tag: "Popular",
  },
  {
    id: "smartwatch",
    name: "Smart Watches",
    itemCount: "31+ Models",
    href: "/category/smart-appliance",
    image: "/images/categories/smartwatch.jpg",
  },
  {
    id: "audio",
    name: "Sound & Audio",
    itemCount: "52+ Models",
    href: "/category/sound-appliance",
    image: "/images/categories/audio.jpg",
    tag: "New",
  },
  {
    id: "gadget",
    name: "Smart Gadgets",
    itemCount: "46+ Models",
    href: "/category/smart-appliance",
    image: "/images/categories/gadget.jpg",
  },
  {
    id: "smart-tv",
    name: "Smart TVs",
    itemCount: "18+ Models",
    href: "/category/smart-appliance",
    image: "/images/categories/smart-tv.jpg",
  },
  {
    id: "pc-components",
    name: "PC Components",
    itemCount: "64+ Items",
    href: "/category/desktop",
    image: "/images/categories/pc-components.jpg",
  },
  {
    id: "smart-appliances",
    name: "Smart Home",
    itemCount: "26+ Items",
    href: "/category/smart-appliance",
    image: "/images/categories/smart-appliances.jpg",
  },
  {
    id: "feature-phone",
    name: "Feature Phones",
    itemCount: "15+ Models",
    href: "/category/feature-phone",
    image: "/images/categories/smartphones.jpg",
  },
];

export default function PopularCategories() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  // Mouse drag support
  const isMouseDownRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartScrollRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);

  // Stepped auto-scroll refs
  const directionRef = useRef<1 | -1>(1); // 1 = toward right, -1 = toward left
  const isHoveredRef = useRef<boolean>(false);
  const isInteractingRef = useRef<boolean>(false);
  const pauseUntilRef = useRef<number>(0);

  // Update scroll boundaries
  const updateScrollStatus = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 0) {
      setCanScrollLeft(el.scrollLeft > 6);
      setCanScrollRight(el.scrollLeft < maxScroll - 6);
    } else {
      setCanScrollLeft(false);
      setCanScrollRight(false);
    }
  }, []);

  useEffect(() => {
    updateScrollStatus();
    const onResize = () => updateScrollStatus();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateScrollStatus]);

  const handleScroll = () => {
    updateScrollStatus();
  };

  const getStepSize = (container: HTMLElement) => {
    const firstItem = container.querySelector<HTMLElement>(":scope > div");
    const gap = parseFloat(getComputedStyle(container).columnGap || "0") || 0;
    return firstItem ? firstItem.offsetWidth + gap : 200;
  };

  // Stepped auto-scroll: one item at a time with a pause between steps,
  // ping-pong at the edges (right → left → right …)
  useEffect(() => {
    const tick = () => {
      const container = scrollRef.current;
      if (!container) return;
      if (isHoveredRef.current || isInteractingRef.current) return;
      if (performance.now() < pauseUntilRef.current) return;

      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 10) return;

      // Reverse direction at the edges
      if (directionRef.current === 1 && container.scrollLeft >= maxScroll - 8) {
        directionRef.current = -1;
      } else if (directionRef.current === -1 && container.scrollLeft <= 8) {
        directionRef.current = 1;
      }

      const step = getStepSize(container);
      container.scrollBy({
        left: directionRef.current === 1 ? step : -step,
        behavior: "smooth",
      });
    };

    const intervalId = setInterval(tick, 2800);
    return () => clearInterval(intervalId);
  }, []);

  // Pause stepping while the page itself is scrolling (prevents mobile jitter)
  useEffect(() => {
    const onWindowScroll = () => {
      pauseUntilRef.current = performance.now() + 900;
    };
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", onWindowScroll);
  }, []);

  // Manual arrow navigation — one item per click, smoothly animated
  const handleManualScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction === "left" ? -getStepSize(container) : getStepSize(container),
      behavior: "smooth",
    });

    // Follow the user's intent and give them time to browse
    directionRef.current = direction === "left" ? -1 : 1;
    pauseUntilRef.current = performance.now() + 3000;
  };

  // Mouse Drag Handlers (for effortless desktop click-and-drag)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only primary mouse button
    if (e.button !== 0 || !scrollRef.current) return;
    isMouseDownRef.current = true;
    dragStartXRef.current = e.pageX;
    dragStartScrollRef.current = scrollRef.current.scrollLeft;
    hasDraggedRef.current = false;
    isInteractingRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !scrollRef.current) return;
    const distance = e.pageX - dragStartXRef.current;
    if (Math.abs(distance) > 6) {
      hasDraggedRef.current = true;
    }
    scrollRef.current.scrollLeft = dragStartScrollRef.current - distance;
    updateScrollStatus();
  };

  const handleMouseUp = () => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;
    isInteractingRef.current = false;
    pauseUntilRef.current = performance.now() + 2000;
    // Reset drag flag after microtask to prevent link triggering
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 100);
  };

  // Touch handlers — pause stepping while the user is touching the row
  const handleTouchStart = () => {
    isInteractingRef.current = true;
  };

  const handleTouchEnd = () => {
    isInteractingRef.current = false;
    pauseUntilRef.current = performance.now() + 2000;
    updateScrollStatus();
  };

  return (
    <section className="relative w-full py-6 sm:py-12 lg:py-16 bg-gradient-to-b from-zinc-50 via-zinc-100/70 to-zinc-50 border-y border-zinc-200/80 overflow-hidden select-none">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-8">
          <div className="min-w-0 pr-1 sm:pr-2">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-950">
              Popular Categories
            </h2>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-zinc-600 line-clamp-1 sm:line-clamp-none">
              Explore authentic gadgets, smartphones, ultrabooks, and everyday tech
            </p>
          </div>

          {/* Interactive Navigation Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Left Button */}
            <button
              onClick={() => handleManualScroll("left")}
              aria-label="Previous categories"
              title="Scroll left"
              disabled={!canScrollLeft}
              className={`flex size-7 sm:size-9 items-center justify-center rounded-full border shadow-xs transition-all active:scale-95 ${
                canScrollLeft
                  ? "border-zinc-300 bg-white text-zinc-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
                  : "border-zinc-200 bg-zinc-100 text-zinc-300 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="size-3.5 sm:size-4" />
            </button>

            {/* Right Button */}
            <button
              onClick={() => handleManualScroll("right")}
              aria-label="Next categories"
              title="Scroll right"
              disabled={!canScrollRight}
              className={`flex size-7 sm:size-9 items-center justify-center rounded-full border shadow-xs transition-all active:scale-95 ${
                canScrollRight
                  ? "border-zinc-300 bg-white text-zinc-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
                  : "border-zinc-200 bg-zinc-100 text-zinc-300 cursor-not-allowed"
              }`}
            >
              <ChevronRight className="size-3.5 sm:size-4" />
            </button>
          </div>
        </div>

        {/* Categories Track Container with Smooth Edge Fades */}
        <div className="relative group/track">
          {/* Left Edge Gradient Fade */}
          <div
            className={`pointer-events-none absolute left-0 top-0 bottom-0 w-4 sm:w-16 bg-gradient-to-r from-zinc-100 via-zinc-100/80 to-transparent z-10 transition-opacity duration-300 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Right Edge Gradient Fade */}
          <div
            className={`pointer-events-none absolute right-0 top-0 bottom-0 w-4 sm:w-16 bg-gradient-to-l from-zinc-100 via-zinc-100/80 to-transparent z-10 transition-opacity duration-300 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Scrolling Items Row */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onMouseEnter={() => {
              isHoveredRef.current = true;
            }}
            onMouseLeave={() => {
              isHoveredRef.current = false;
              handleMouseUp();
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex items-start gap-3 sm:gap-6 lg:gap-8 overflow-x-auto no-scrollbar py-2 sm:py-3 px-1 sm:px-2 cursor-grab active:cursor-grabbing touch-pan-x"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="shrink-0 group/item">
                <Link
                  href={cat.href}
                  onClick={(e) => {
                    if (hasDraggedRef.current) {
                      e.preventDefault();
                    }
                  }}
                  className="flex w-20 sm:w-28 md:w-36 lg:w-40 flex-col items-center text-center focus:outline-none transition-transform duration-300 group-hover/item:-translate-y-1.5 active:scale-95"
                >
                  {/* Category Circle with Glow & Tag */}
                  <div className="relative size-20 sm:size-28 md:size-36 lg:size-40 shrink-0 rounded-full p-1 bg-white shadow-sm ring-1 ring-zinc-200/80 transition-all duration-300 group-hover/item:shadow-xl group-hover/item:shadow-emerald-500/10 group-hover/item:ring-2 group-hover/item:ring-emerald-500">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-zinc-100">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 80px, (max-width: 1024px) 144px, 160px"
                        className="object-cover object-center transition-transform duration-500 group-hover/item:scale-110"
                        draggable={false}
                      />
                    </div>

                    {/* Optional Badge */}
                    {cat.tag && (
                      <span className="absolute -top-1 right-0 sm:right-2 inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold tracking-wide uppercase bg-emerald-600 text-white shadow-xs">
                        {cat.tag}
                      </span>
                    )}
                  </div>

                  {/* Category Name & Count */}
                  <span className="mt-2 sm:mt-3 text-[11px] leading-tight sm:text-sm lg:text-base font-semibold text-zinc-800 transition-colors duration-200 group-hover/item:text-emerald-700">
                    {cat.name}
                  </span>
                  <span className="text-[10px] sm:text-xs text-zinc-500 font-medium">
                    {cat.itemCount}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
