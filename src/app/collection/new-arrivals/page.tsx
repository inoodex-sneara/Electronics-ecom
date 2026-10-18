import type { Metadata } from "next";
import NewArrivalsPage from "@/components/new-arrivals-page";

export const metadata: Metadata = {
  title: "New Arrivals 2026 | Synchroma",
  description: "Explore the latest 2026 tech drops — smartphones, laptops, audio gear, and smart gadgets.",
};

export default function Page() {
  return <NewArrivalsPage />;
}
