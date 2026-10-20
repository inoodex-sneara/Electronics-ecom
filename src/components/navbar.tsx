"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Megaphone,
  Menu,
  Search,
  ShoppingCart,
  Truck,
  User,
  X,
} from "lucide-react";
import { useCart } from "@/providers/cart-context";
import { NAV_CATEGORIES, getNavProducts } from "@/data/nav-categories";
import { formatBdt } from "@/data/products";

const categories = NAV_CATEGORIES.map((c) => ({ name: c.name, href: c.href }));

const actions = [
  { name: "Track Order", href: "/track-order", icon: Truck },
  { name: "Offer", href: "/offers", icon: Megaphone },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { count } = useCart();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

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
          <div className="flex h-11 items-center gap-4 xl:gap-6">
            <ul className="flex min-w-0 flex-1 items-center gap-3 whitespace-nowrap text-[13px] xl:gap-5 xl:text-sm">
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
                                <div className="relative mx-auto size-16 overflow-hidden rounded-lg bg-zinc-50">
                                  <Image
                                    src={p.image}
                                    alt={p.name}
                                    fill
                                    sizes="64px"
                                    className="object-contain p-1 transition-transform duration-300 group-hover/item:scale-110"
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
        <div className="border-t border-emerald-500/10 bg-emerald-950 px-4 pt-3 pb-5 lg:hidden">
          <div className="relative mb-4">
            <input
              type="search"
              placeholder="Search for products..."
              className="h-10 w-full rounded-md border border-white/10 bg-emerald-900 pr-12 pl-4 text-sm text-white placeholder:text-zinc-400 focus:border-emerald-500/60 focus:outline-none"
            />
            <Search className="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2 text-zinc-400" />
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
            {categories.map((category) => (
              <li key={category.href}>
                <Link
                  href={category.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-md px-2 py-2 text-sm transition-colors hover:bg-white/5 ${
                    isActive(category.href)
                      ? "bg-emerald-500/15 font-semibold text-emerald-400"
                      : "text-zinc-200 hover:text-white"
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
          
            </li>
            <li>
              <Link
                href="/offers"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-white/5 ${
                  isActive("/offers")
                    ? "bg-emerald-500/15 font-semibold text-emerald-400"
                    : "text-zinc-200"
                }`}
              >
                <Megaphone className="size-4 text-emerald-400" />
                <span>Offers</span>
              </Link>
            </li>
            <li>
              
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
