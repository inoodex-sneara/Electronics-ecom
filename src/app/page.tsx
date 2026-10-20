import HeroSlider from "@/components/hero-slider";
import PopularCategories from "@/components/popular-categories";
import FlashSaleSection from "@/components/flash-sale-section";
import ExchangeOfferBanner from "@/components/exchange-offer-banner";
import NewCollection from "@/components/new-collection";
import SeoSection from "@/components/seo-section";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full bg-white font-sans">
      <HeroSlider />
      <PopularCategories />
      <FlashSaleSection />
      <ExchangeOfferBanner />
     
      <NewCollection />
   
    </div>
  );
}
