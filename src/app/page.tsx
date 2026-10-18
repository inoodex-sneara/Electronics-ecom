import HeroSlider from "@/components/hero-slider";
import PopularCategories from "@/components/popular-categories";
import ExchangeOfferBanner from "@/components/exchange-offer-banner";
import NewCollection from "@/components/new-collection";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full bg-white font-sans">
      <HeroSlider />
      <PopularCategories />
      <ExchangeOfferBanner />
      <NewCollection />
    </div>
  );
}
