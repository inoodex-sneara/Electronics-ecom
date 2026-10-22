"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.06 3.76-2.06 4.02 0 4.76 2.64 4.76 6.08V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.84 0-2.12 1.43-2.12 2.9V21H9z" />
    </svg>
  );
}

function MessengerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#fff"
        d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.19.16.14.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.99-.88c.17-.07.36-.09.53-.04.91.25 1.88.38 2.9.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2z"
        opacity="0.25"
      />
      <path
        fill="#fff"
        d="M6.85 14.5l3.6-5.72c.57-.9 1.83-1.12 2.68-.48l2.84 2.14c.25.19.6.19.85 0l2.14-1.62c.47-.36 1.1.14.87.7l-3.6 5.72c-.57.9-1.83 1.12-2.68.48l-2.84-2.14a.72.72 0 0 0-.85 0l-2.14 1.62c-.47.36-1.1-.14-.87-.7z"
      />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23 12s0-3.5-.45-5.17a2.9 2.9 0 0 0-2.04-2.05C18.84 4.33 12 4.33 12 4.33s-6.84 0-8.51.45A2.9 2.9 0 0 0 1.45 6.83C1 8.5 1 12 1 12s0 3.5.45 5.17a2.9 2.9 0 0 0 2.04 2.05c1.67.45 8.51.45 8.51.45s6.84 0 8.51-.45a2.9 2.9 0 0 0 2.04-2.05C23 15.5 23 12 23 12zM9.75 15.27V8.73L15.5 12z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative w-full bg-black text-white overflow-hidden border-t border-zinc-900 select-none">
      {/* Subtle watermark background logo */}
      <div className="pointer-events-none absolute bottom-0 left-10 opacity-5 select-none -translate-x-10 translate-y-10">
        <svg
          viewBox="0 0 170 170"
          className="size-80 fill-current text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6.19-9.36-11.05-20.09-14.58-32.18-3.53-12.09-5.3-23.77-5.3-35.03 0-16.7 4.17-30.56 12.51-41.59 8.34-11.03 18.73-16.66 31.17-16.9 4.9 0 10.63 1.34 17.2 4.02 6.57 2.68 10.87 4.07 12.9 4.17 1.8.11 6.33-1.39 13.58-4.5 7.26-3.11 13.3-4.48 18.13-4.12 13.72.65 24.52 5.56 32.4 14.72-11.97 7.28-17.84 17.3-17.61 30.06.24 10.02 4.13 18.42 11.67 25.21 7.54 6.79 16.5 10.63 26.89 11.52-2.18 6.64-4.8 13.06-7.85 19.26zM119.22 33.64c0-7.39 2.67-14.28 8.01-20.67 5.34-6.39 11.97-10.72 19.89-12.97.22 1.41.33 2.72.33 3.92 0 7.39-2.78 14.39-8.34 21-5.56 6.61-12.35 10.85-20.37 12.72-.11-1.31-.16-2.31-.16-3.03z" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12">
          {/* Column 1: Brand, Contact & App Download (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-2xl font-black uppercase tracking-tight text-white">
                    Synchro<span className="text-emerald-400">ma</span>
                  </span>
                  <sup className="ml-0.5 text-xs font-bold text-emerald-400">®</sup>
                </div>
                <span className="text-[11px] font-medium tracking-widest text-zinc-400 uppercase -mt-0.5">
                  Tech Electronics Ecosystem
                </span>
              </div>
            </Link>

            {/* Phone Number */}
            <div className="flex items-start gap-3">
              <Phone className="size-4 text-zinc-400 mt-1 shrink-0" />
              <div>
                <p className="text-xs text-zinc-400 font-medium">Phone Number</p>
                <a
                  href="tel:09678148148"
                  className="text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
                >
                  09678148148
                </a>
              </div>
            </div>

            {/* Email Address */}
            <div className="flex items-start gap-3">
              <Mail className="size-4 text-zinc-400 mt-1 shrink-0" />
              <div>
                <p className="text-xs text-zinc-400 font-medium">Email Address</p>
                <a
                  href="mailto:contact@synchroma.com"
                  className="text-sm text-zinc-200 hover:text-emerald-400 transition-colors"
                >
                  contact@synchroma.com
                </a>
              </div>
            </div>

            {/* App Store Download Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {/* App Store */}
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-colors"
              >
                <svg className="size-5 fill-white" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6.19-9.36-11.05-20.09-14.58-32.18-3.53-12.09-5.3-23.77-5.3-35.03 0-16.7 4.17-30.56 12.51-41.59 8.34-11.03 18.73-16.66 31.17-16.9 4.9 0 10.63 1.34 17.2 4.02 6.57 2.68 10.87 4.07 12.9 4.17 1.8.11 6.33-1.39 13.58-4.5 7.26-3.11 13.3-4.48 18.13-4.12 13.72.65 24.52 5.56 32.4 14.72-11.97 7.28-17.84 17.3-17.61 30.06.24 10.02 4.13 18.42 11.67 25.21 7.54 6.79 16.5 10.63 26.89 11.52-2.18 6.64-4.8 13.06-7.85 19.26zM119.22 33.64c0-7.39 2.67-14.28 8.01-20.67 5.34-6.39 11.97-10.72 19.89-12.97.22 1.41.33 2.72.33 3.92 0 7.39-2.78 14.39-8.34 21-5.56 6.61-12.35 10.85-20.37 12.72-.11-1.31-.16-2.31-.16-3.03z" />
                </svg>
                <div className="flex flex-col text-left">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-400 leading-none">
                    Download on the
                  </span>
                  <span className="text-xs font-semibold text-white leading-tight">
                    App Store
                  </span>
                </div>
              </a>

              {/* Google Play */}
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-colors"
              >
                <svg className="size-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M3.6 1.8c-.3.3-.4.8-.4 1.4v17.6c0 .6.1 1.1.4 1.4l9.5-10.2L3.6 1.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M17.2 8.4l-4.1 3.6 4.1 3.6 3.1-1.8c.9-.5.9-1.4 0-1.9l-3.1-3.5z"
                  />
                  <path
                    fill="#EA4335"
                    d="M13.1 12L3.6 22.2c.4.4 1.1.4 1.7.1l11.9-6.9-4.1-3.4z"
                  />
                  <path
                    fill="#34A853"
                    d="M13.1 12l4.1-3.6-11.9-6.9c-.6-.3-1.3-.3-1.7.1L13.1 12z"
                  />
                </svg>
                <div className="flex flex-col text-left">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-400 leading-none">
                    GET IT ON
                  </span>
                  <span className="text-xs font-semibold text-white leading-tight">
                    Google Play
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Column 2: LOCATION (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-200">
              LOCATION
            </h4>

            {/* Store 1 */}
            <div className="flex items-start gap-2.5">
              <MapPin className="size-4 text-[#f97316] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-zinc-100 leading-snug">
                  Synchroma Flagship - Basement 2, Shop 26, Bashundhara City Shopping Complex
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Basement 2, Shop 26</p>
              </div>
            </div>

            {/* Store 2 */}
            <div className="flex items-start gap-2.5">
              <MapPin className="size-4 text-[#f97316] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-zinc-100 leading-snug">
                  Synchroma Experience Center - Level- 5, Block- A, Shop- 6, 7, 8. Bashundhara City
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Level- 5, Block- A, Shop- 6, 7, 8
                </p>
              </div>
            </div>

            {/* Store 3 */}
            <div className="flex items-start gap-2.5">
              <MapPin className="size-4 text-[#f97316] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-zinc-100 leading-snug">
                  Synchroma Premier Outlet - Level 4, Zone A (West Court), Shop 28D, Jamuna Future Park
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Level 4, Zone A (West Court), Shop 28D
                </p>
              </div>
            </div>

            {/* See All Outlet */}
            
          </div>

          {/* Column 3: ABOUT US (2 cols on lg) */}
          <div className="lg:col-span-2 flex flex-col space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-200">
              ABOUT US
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                { name: "About Us", href: "/about" },
                { name: "Corporate", href: "/corporate" },
                { name: "Order Tracking", href: "/track-order" },
                { name: "Blog", href: "/blog" },
                { name: "Press Coverage", href: "/press" },
                { name: "Careers", href: "/careers" },
                { name: "Complain / Advice", href: "/complain-advice" },
                { name: "Contact Us", href: "/contact" },
                { name: "FAQs", href: "/faqs" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: POLICY (2 cols on lg) */}
          <div className="lg:col-span-2 flex flex-col space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-200">
              POLICY
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                { name: "Privacy Policy", href: "/policy/privacy" },
                { name: "EMI and Payment Policy", href: "/policy/emi-payment" },
                { name: "Warranty Policy", href: "/policy/warranty" },
                { name: "Exchange Policy", href: "/policy/exchange" },
                { name: "Delivery Policy", href: "/policy/delivery" },
                { name: "Pre-Order Policy", href: "/policy/pre-order" },
                { name: "Refund Policy", href: "/policy/refund" },
                { name: "Return Policy", href: "/policy/return" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer Bar */}
        <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-zinc-500 text-center sm:text-left">
            © 2026 Synchroma. All Rights Reserved.
          </p>

          <div className="flex items-center gap-3">
            {/* WhatsApp Green Pill Button */}
            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366] text-white font-bold text-xs shadow-md hover:brightness-105 transition-all active:scale-95"
            >
              <MessageCircle className="size-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>

            {/* Social Icons in circular border */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex size-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-900 transition-colors"
            >
              <FacebookIcon className="size-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex size-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-900 transition-colors"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex size-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-900 transition-colors"
            >
              <LinkedinIcon className="size-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex size-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-900 transition-colors"
            >
              <YoutubeIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Floating Messenger Chat Button on Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
        <a
          href="https://wa.me/8801700000000"
          target="_blank"
          rel="noopener noreferrer"
          title="Chat with Customer Support"
          className="group relative flex size-12 items-center justify-center rounded-full p-0.5 bg-gradient-to-br from-[#00B2FF] via-[#006AFF] to-[#A033FF] shadow-2xl ring-2 ring-emerald-500 transition-transform hover:scale-110 active:scale-95"
        >
          <span className="relative flex size-full items-center justify-center rounded-full overflow-hidden">
            <MessengerIcon className="size-7" />
          </span>
          {/* Active online indicator */}
          <span className="absolute top-0 right-0 size-3.5 rounded-full bg-emerald-500 border-2 border-zinc-950" />
        </a>
      </div>
    </footer>
  );
}
