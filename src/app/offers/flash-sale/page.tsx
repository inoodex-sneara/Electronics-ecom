import type { Metadata } from "next";
import FlashSalePage from "@/components/flash-sale-page";

export const metadata: Metadata = {
  title: "Flash Sale & Limited Time Deals | Synchroma",
  description:
    "Explore limited-time flash discounts on flagship smartphones, laptops, audio gear, and gaming peripherals. Save up to 50% with official warranty.",
};

export default function Page() {
  return <FlashSalePage />;
}
