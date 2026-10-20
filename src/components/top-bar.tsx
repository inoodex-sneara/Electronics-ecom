import Image from "next/image";
import Link from "next/link";
import type { TopBarProps } from "@/types/navigation";

export default function TopBar({
  bannerImage = "/images/Banner/top-bar-deals.png",
  bannerHref = "/offers/flash-sale",
  bannerAlt = "Electronics & Appliances Deals - Up to 43% Off - Official Warranty & EMI Facility",
}: TopBarProps) {
  return (
    <div
      role="banner"
      aria-label="Promotional Announcement"
      className="relative w-full bg-[#074799] border-b border-[#00387a] overflow-hidden"
    >
      <div className="relative mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 flex items-center justify-center">
        {/* Banner Link */}
        <Link
          href={bannerHref}
          className="group relative block w-full text-center transition-opacity hover:opacity-95"
          aria-label={bannerAlt}
        >
          <div className="relative mx-auto w-full aspect-[1024/57] min-h-[38px] sm:min-h-[46px] md:min-h-[54px] max-h-[64px] flex items-center justify-center">
            <Image
              src={bannerImage}
              alt={bannerAlt}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1280px"
              className="object-contain object-center transition-transform duration-300 group-hover:scale-[1.005]"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
