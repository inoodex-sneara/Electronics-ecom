import { NEW_PRODUCTS, type ProductItem } from "./products";
import { FLASH_SALE_PRODUCTS } from "./flash-sale";

export interface NavCategory {
  name: string;
  slug: string;
  href: string;
  match: string[];
  productIds: string[];
}

const ALL_PRODUCTS: ProductItem[] = [...NEW_PRODUCTS, ...FLASH_SALE_PRODUCTS];

export const NAV_CATEGORIES: NavCategory[] = [
  {
    name: "Smartphone",
    slug: "smartphone",
    href: "/category/smartphone",
    match: ["iphone", "galaxy", "pixel", "smartphone", "phone"],
    productIds: ["prod-1", "prod-2", "flash-1", "flash-16"],
  },
  {
    name: "Tablet",
    slug: "tablet",
    href: "/category/tablet",
    match: ["ipad", "tablet", "tabx"],
    productIds: ["prod-7", "prod-19", "flash-7"],
  },
  {
    name: "Mac",
    slug: "mac",
    href: "/category/mac",
    match: ["macbook"],
    productIds: ["prod-3", "flash-3"],
  },
  {
    name: "Laptop",
    slug: "laptop",
    href: "/category/laptop",
    match: ["laptop", "rog zephyrus", "zenith"],
    productIds: ["prod-4", "flash-8", "flash-3", "prod-3"],
  },
  {
    name: "Desktop",
    slug: "desktop",
    href: "/category/desktop",
    match: ["desktop", "monitor", "cyberstation", "keyboard", "mouse"],
    productIds: ["prod-8", "prod-11", "prod-17", "prod-13"],
  },
  {
    name: "Sound Appliance",
    slug: "sound-appliance",
    href: "/category/sound-appliance",
    match: ["headphone", "speaker", "earbuds", "soundbar", "airpods", "audio & wearables"],
    productIds: ["prod-5", "flash-2", "flash-9", "prod-12"],
  },
  {
    name: "Smart Appliance",
    slug: "smart-appliance",
    href: "/category/smart-appliance",
    match: ["smart gear", "watch", "projector", "vr"],
    productIds: ["prod-6", "prod-16", "flash-4", "prod-21"],
  },
  {
    name: "Feature Phone",
    slug: "feature-phone",
    href: "/category/feature-phone",
    match: ["feature phone", "keypad", "nokia"],
    productIds: ["prod-1", "flash-1", "flash-16", "prod-2"],
  },
];

function findById(id: string): ProductItem | undefined {
  return ALL_PRODUCTS.find((p) => p.id === id);
}

export function getNavProducts(slug: string): ProductItem[] {
  const cat = NAV_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return [];
  return cat.productIds.map(findById).filter((p): p is ProductItem => !!p);
}

export function getCategoryProducts(slug: string): ProductItem[] {
  const cat = NAV_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return [];

  const navProducts = getNavProducts(slug);
  const navIds = new Set(navProducts.map((p) => p.id));

  const matched = ALL_PRODUCTS.filter(
    (p) =>
      !navIds.has(p.id) &&
      cat.match.some((k) =>
        `${p.name} ${p.category} ${p.brand}`.toLowerCase().includes(k.toLowerCase())
      )
  );

  const list = [...navProducts, ...matched];
  return list.length > 0 ? list : navProducts;
}
