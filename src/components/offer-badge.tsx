import React from "react";

interface OfferBadgeProps {
  price: number;
  originalPrice: number;
  className?: string;
}

export default function OfferBadge({
  price,
  originalPrice,
  className = "",
}: OfferBadgeProps) {
  if (originalPrice <= price) return null;
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <div
      className={`pointer-events-none absolute left-0 z-10 select-none drop-shadow-md ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-center gap-1.5 rounded-r-full bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-500 py-1 pl-2 pr-1.5">
        <span className="text-[8px] sm:text-[10px] font-black leading-none text-white whitespace-nowrap">
          Express Special Deals
        </span>
        <span className="flex size-4.5 sm:size-6 items-center justify-center rounded-full bg-orange-500 text-[8px] sm:text-[10px] font-black leading-none text-white ring-2 ring-white/50">
          -{discount}%
        </span>
      </div>
      <div className="mt-[2px] rounded-r-full bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 py-1 pl-2 pr-3">
        <span className="block text-[7px] sm:text-[8px] font-bold uppercase leading-none text-white/85">
          Special Price
        </span>
        <span className="block text-[10px] sm:text-xs font-black leading-tight text-white whitespace-nowrap">
          TK. {price.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}
