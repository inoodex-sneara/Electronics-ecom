// types/navigation.ts
import type { LucideIcon } from "lucide-react";

export interface NavCategoryItem {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface AnnouncementItem {
  tag: string;
  message: string;
  promoCode?: string;
  link?: string;
}

export interface ContactSupportInfo {
  phone: string;
  displayPhone: string;
  trackOrderUrl: string;
  supportUrl: string;
}

export interface TopBarProps {
  bannerImage?: string;
  bannerHref?: string;
  bannerAlt?: string;
  announcement?: AnnouncementItem;
  supportInfo?: ContactSupportInfo;
}

export interface NavbarProps {
  categories?: NavCategoryItem[];
  cartCount?: number;
  wishlistCount?: number;
}