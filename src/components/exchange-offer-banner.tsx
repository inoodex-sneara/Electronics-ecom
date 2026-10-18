import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ExchangeOfferBannerProps {
  className?: string;
  href?: string;
}

export default function ExchangeOfferBanner({
  className = "",
  href = "/offers/exchange-offer",
}: ExchangeOfferBannerProps) {
  return (
    <section
      aria-label="পুরোনো ফোন বদলে নিন নতুন ফোন - Exchange Offer"
      className={`w-full py-3 sm:py-6 lg:py-8 bg-white ${className}`}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <Link
          href={href}
          aria-label="পুরোনো ফোন বদলে নিন নতুন ফোন - Exchange Now"
          className="group relative block w-full overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl bg-amber-400 shadow-xs sm:shadow-sm ring-1 ring-zinc-200/80 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-amber-500/15 hover:ring-zinc-300 hover:-translate-y-0.5 active:scale-[0.99]"
        >
          {/* Subtle sheen highlight on hover */}
          <div className="pointer-events-none absolute inset-0 z-10 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full" />

          {/* Banner Graphic - 1500 x 323 */}
          <div className="relative w-full aspect-[1500/323] overflow-hidden">
            <Image
              src="/images/Banner/Exchange-Offer-up-1-7872.png"
              alt="পুরোনো ফোন বদলে নিন নতুন ফোন - Exchange Now"
              width={1500}
              height={323}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1280px"
              className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.015]"
              priority
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
