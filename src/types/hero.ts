// types/hero.ts
export interface SlideSpec {
  label: string;
  value: string;
}

export interface HeroSlideItem {
  id: string;
  tagline: string;
  title: string;
  highlightText: string;
  description: string;
  price: string;
  originalPrice?: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  specs: SlideSpec[];
  accentColor: "cyan" | "indigo" | "fuchsia" | "emerald";
}

export interface HeroSliderProps {
  slides?: HeroSlideItem[];
}