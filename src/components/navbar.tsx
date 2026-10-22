"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Heart,
  Megaphone,
  Menu,
  Search,
  ShoppingCart,
  Truck,
  User,
  X,
} from "lucide-react";
import { useCart } from "@/providers/cart-context";
import { useWishlist } from "@/providers/wishlist-context";
import { NAV_CATEGORIES, getNavProducts } from "@/data/nav-categories";
import { formatBdt } from "@/data/products";

const actions = [
  { name: "Track Order", href: "/track-order", icon: Truck },
  { name: "Offer", href: "/offers/flash-sale", icon: Megaphone },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategory, setMobileCategory] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const scrollbarHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrollThumb, setScrollThumb] = useState({
    visible: false,
    top: 0,
    height: 0,
  });

  const handleMobileMenuScroll = () => {
    const el = mobileMenuRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight) return;
    const height = Math.max(28, (clientHeight / scrollHeight) * clientHeight);
    const maxTop = clientHeight - height - 8;
    const top = (scrollTop / (scrollHeight - clientHeight)) * maxTop;
    setScrollThumb({ visible: true, top, height });
    if (scrollbarHideTimer.current) clearTimeout(scrollbarHideTimer.current);
    scrollbarHideTimer.current = setTimeout(() => {
      setScrollThumb((prev) => ({ ...prev, visible: false }));
    }, 900);
  };

  useEffect(() => {
    return () => {
      if (scrollbarHideTimer.current) clearTimeout(scrollbarHideTimer.current);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-emerald-950 text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4 sm:gap-6">
          <Link href="/" className="shrink-0 font-extrabold tracking-tight">
            <span className="text-lg sm:text-xl uppercase">
              Synchro<span className="text-emerald-400">ma</span>
              <sup className="ml-0.5 align-super text-[0.5em] font-semibold text-white">®</sup>
            </span>
          </Link>

          <div className="relative mx-auto hidden w-full max-w-md md:block">
            <input
              type="search"
              placeholder="Search for products..."
              className="h-10 w-full rounded-md border border-white/10 bg-emerald-900 pr-12 pl-4 text-sm text-white placeholder:text-zinc-400 focus:border-emerald-500/60 focus:ring-0 focus:outline-none"
            />
            <Search className="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2 text-zinc-400" />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative flex size-10 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/10"
            >
              <Heart className="size-5 text-white" />
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white shadow-xs">
                {wishlistCount}
              </span>
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex size-10 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/10"
            >
              <ShoppingCart className="size-5 text-white" />
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#f97316] text-[11px] font-bold text-white shadow-xs">
                {count}
              </span>
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="flex size-10 items-center justify-center rounded-full bg-white text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              <User className="size-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex size-10 items-center justify-center rounded-md border border-white/20 lg:hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <nav className="hidden border-t border-emerald-500/10 lg:block">
          <div className="flex h-11 items-center gap-4 pb-1.5 xl:gap-6">
            <ul className="flex min-w-0 mt-6 flex-1 items-center gap-3 whitespace-nowrap text-[13px] xl:gap-5 xl:text-sm">
              {NAV_CATEGORIES.map((category, index) => {
                const isOpen = openMenu === category.slug;
                return (
                  <li
                    key={category.slug}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(category.slug)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <Link
                      href={category.href}
                      onClick={() => setOpenMenu(null)}
                      className={`inline-flex items-center gap-1 transition-colors ${
                        isActive(category.href) || isOpen
                          ? "font-semibold text-emerald-400"
                          : "text-zinc-200 hover:text-emerald-400"
                      }`}
                    >
                      {category.name}
                      <ChevronDown
                        className={`size-3 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Link>

                    {isOpen && (
                      <div
                        className={`absolute top-full z-50 pt-1 ${
                          index >= NAV_CATEGORIES.length - 2 ? "right-0" : "left-0"
                        }`}
                      >
                        <div className="w-[560px] rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl shadow-black/20">
                          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-zinc-100">
                            <span className="text-xs font-black uppercase tracking-wider text-zinc-900">
                              {category.name}
                            </span>
                            <Link
                              href={category.href}
                              onClick={() => setOpenMenu(null)}
                              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                            >
                              View All →
                            </Link>
                          </div>
                          <div className="grid grid-cols-4 gap-3">
                            {getNavProducts(category.slug).map((p) => (
                              <Link
                                key={p.id}
                                href={`/products/${p.id}`}
                                onClick={() => setOpenMenu(null)}
                                className="group/item flex flex-col rounded-xl border border-zinc-200 bg-white p-2 transition-all hover:border-emerald-300 hover:shadow-md"
                              >
                                <div className="relative mx-auto size-16 overflow-hidden rounded-lg bg-white">
                                  <Image
                                    src={p.image}
                                    alt={p.name}
                                    fill
                                    sizes="64px"
                                    className="object-cover mix-blend-multiply transition-transform duration-300 group-hover/item:scale-110"
                                  />
                                </div>
                                <p className="mt-2 line-clamp-2 text-[11px] font-semibold leading-tight text-zinc-800 group-hover/item:text-emerald-700 min-h-[2.2em]">
                                  {p.name}
                                </p>
                                <p className="mt-1 text-xs font-black text-emerald-600">
                                  {formatBdt(p.price)}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="hidden shrink-0 items-center gap-5 pl-4 lg:flex">
              {actions.map(({ name, href, icon: Icon }) => (
                <Link
                  key={name}
                  href={href}
                  className={`relative flex items-center gap-1.5 pt-1.5 text-[13px] whitespace-nowrap transition-colors ${
                    isActive(href) ? "text-emerald-400" : "text-white hover:text-emerald-400"
                  }`}
                >
                  <span className="absolute top-0 left-0 h-0.5 w-full bg-emerald-500" />
                  <Icon className="size-4" />
                  <span className="underline decoration-emerald-500 decoration-2 decoration-wavy">
                    {name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {mobileMenuOpen && (
        <div className="relative lg:hidden">
          <div
            ref={mobileMenuRef}
            onScroll={handleMobileMenuScroll}
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain custom-scrollbar border-t border-emerald-500/10 bg-emerald-950 px-4 pb-8"
          >
          <div className="sticky top-0 z-10 bg-emerald-950 pt-3 pb-3">
            <div className="relative">
              <input
                type="search"
                placeholder="Search for products..."
                className="h-10 w-full rounded-md border border-white/10 bg-emerald-900 pr-12 pl-4 text-sm text-white placeholder:text-zinc-400 focus:border-emerald-500/60 focus:outline-none"
              />
              <Search className="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>
          <ul className="space-y-1">
            <li>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold transition-colors hover:bg-white/5 ${
                  isActive("/track-order")
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-emerald-300 hover:text-emerald-200"
                }`}
              >
                <Truck className="size-4 text-emerald-400" />
                <span>Track Order</span>
              </Link>
            </li>
            {NAV_CATEGORIES.map((category) => {
              const expanded = mobileCategory === category.slug;
              return (
                <li key={category.slug}>
                  <button
                    type="button"
                    onClick={() => setMobileCategory(expanded ? null : category.slug)}
                    aria-expanded={expanded}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-sm transition-colors hover:bg-white/5 ${
                      isActive(category.href)
                        ? "bg-emerald-500/15 font-semibold text-emerald-400"
                        : "text-zinc-200 hover:text-white"
                    }`}
                  >
                    <span>{category.name}</span>
                    <ChevronDown
                      className={`size-4 text-emerald-400 transition-transform duration-200 ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expanded && (
                    <div className="mt-1 mb-2 ml-2 pl-2 border-l border-emerald-500/25 space-y-1">
                      <Link
                        href={category.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-md bg-emerald-500/15 px-2 py-1.5 text-xs font-bold text-emerald-400"
                      >
                        View All {category.name} →
                      </Link>
                      {getNavProducts(category.slug).map((p) => (
                        <Link
                          key={p.id}
                          href={`/products/${p.id}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block rounded-md px-2 py-1.5 text-xs text-zinc-200 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <span className="truncate">{p.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
            <li>
              <Link
                href="/offers/flash-sale"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-white/5 ${
                  isActive("/offers/flash-sale")
                    ? "bg-emerald-500/15 font-semibold text-emerald-400"
                    : "text-zinc-200"
                }`}
              >
                <Megaphone className="size-4 text-emerald-400" />
                <span>Offers</span>
              </Link>
            </li>
          </ul>
          </div>

          {/* Scroll thumb — visible while scrolling, fades out after */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute right-1 w-1.5 rounded-full bg-emerald-400/90 shadow-sm shadow-emerald-500/40 transition-opacity duration-300 ${
              scrollThumb.visible ? "opacity-100" : "opacity-0"
            }`}
            style={{ top: scrollThumb.top + 4, height: scrollThumb.height }}
          />
        </div>
      )}
    </header>
  );
}
