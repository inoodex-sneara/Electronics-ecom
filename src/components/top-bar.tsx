// components/top-bar.tsx
import Link from "next/link";
import { Sparkles, Truck, HelpCircle, PhoneCall } from "lucide-react";
import type { TopBarProps } from "@/types/navigation";

const DEFAULT_ANNOUNCEMENT = {
  tag: "Launch Offer",
  message: "Get 10% off on your first ecosystem order with code:",
  promoCode: "SYNCHRO10",
};

const DEFAULT_SUPPORT = {
  phone: "+8801700000000",
  displayPhone: "+880 1700-000000",
  trackOrderUrl: "/track-order",
  supportUrl: "/support",
};

export default function TopBar({
  announcement = DEFAULT_ANNOUNCEMENT,
  supportInfo = DEFAULT_SUPPORT,
}: TopBarProps) {
  return (
    <div className="w-full bg-zinc-900/90 border-b border-zinc-800 text-xs text-zinc-400 py-1.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* অ্যানাউন্সমেন্ট */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-cyan-400 font-semibold uppercase tracking-wider text-[11px] bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 animate-pulse" /> {announcement.tag}
          </span>
          <span className="hidden sm:inline text-zinc-300">
            {announcement.message}{" "}
            {announcement.promoCode && (
              <strong className="text-white font-medium">{announcement.promoCode}</strong>
            )}
          </span>
        </div>

        {/* কুইক ইউটিলিটি লিংকস */}
        <div className="flex items-center gap-4 text-[11px]">
          <Link
            href={supportInfo.trackOrderUrl}
            className="hidden md:flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
          >
            <Truck className="w-3.5 h-3.5 text-zinc-500" />
            <span>Track Order</span>
          </Link>

          <Link
            href={supportInfo.supportUrl}
            className="hidden md:flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
            <span>Support</span>
          </Link>

          <div className="h-3 w-[1px] bg-zinc-800 hidden md:block" />

          <a
            href={`tel:${supportInfo.phone}`}
            className="flex items-center gap-1.5 text-zinc-300 hover:text-cyan-400 transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-cyan-500" />
            <span>{supportInfo.displayPhone}</span>
          </a>
        </div>

      </div>
    </div>
  );
}