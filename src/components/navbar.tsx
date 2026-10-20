"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Megaphone, Menu, Phone, Search, ShoppingCart, Truck, User, X } from "lucide-react";
import { useCart } from "@/providers/cart-context";

const categories = [
  { name: "Smartphone", href: "/category/smartphone" },
  { name: "Tablet", href: "/category/tablet" },
  { name: "Mac", href: "/category/mac" },
  { name: "Laptop", href: "/category/laptop" },
  { name: "Desktop", href: "/category/desktop" },
  { name: "Accessories", href: "/category/accessories" },
  { name: "Sound Appliance", href: "/category/sound-appliance" },
  { name: "Smart Appliance", href: "/category/smart-appliance" },
  { name: "Feature Phone", href: "/category/feature-phone" },
];

const actions = [
  { name: "Track Order", href: "/track-order", icon: Truck },
  { name: "Offer", href: "/offers", icon: Megaphone },
  { name: "Used Device", href: "/used-device", icon: Phone },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
              href="/track-order"
              className={`hidden rounded-md border px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors md:flex lg:hidden items-center gap-1.5 ${
                isActive("/track-order")
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                  : "border-white/20 text-zinc-200 hover:border-emerald-500/60 hover:text-emerald-400 hover:bg-emerald-500/10"
              }`}
            >
              <Truck className="size-3.5" />
              <span>Track Order</span>
            </Link>

            <Link
              href="/pc-builder"
              className={`hidden rounded-md border px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors lg:block ${
                isActive("/pc-builder")
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                  : "border-emerald-500/60 text-emerald-400 hover:bg-emerald-500/10"
              }`}
            >
              PC Builder
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
          <div className="flex h-11 items-center gap-6">
            <ul className="flex flex-1 items-center gap-5 text-sm whitespace-nowrap">
              {categories.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className={`transition-colors ${
                      isActive(category.href)
                        ? "font-semibold text-emerald-400"
                        : "text-zinc-200 hover:text-emerald-400"
                    }`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex shrink-0 items-center gap-6">
              {actions.map(({ name, href, icon: Icon }) => (
                <Link
                  key={name}
                  href={href}
                  className={`relative flex items-center gap-1.5 pt-1.5 text-sm whitespace-nowrap transition-colors ${
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
              <Link
                href="/pc-builder"
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-md px-2 py-2 text-sm hover:bg-white/5 ${
                  isActive("/pc-builder")
                    ? "bg-emerald-500/15 font-semibold text-emerald-400"
                    : "text-zinc-200"
                }`}
              >
                PC Builder
              </Link>
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
              <Link
                href="/used-device"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-white/5 ${
                  isActive("/used-device")
                    ? "bg-emerald-500/15 font-semibold text-emerald-400"
                    : "text-zinc-200"
                }`}
              >
                <Phone className="size-4 text-emerald-400" />
                <span>Used Device</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
