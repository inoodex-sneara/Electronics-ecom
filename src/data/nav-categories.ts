import { NEW_PRODUCTS, type ProductItem } from "./products";
import { FLASH_SALE_PRODUCTS } from "./flash-sale";

export interface NavCategory {
  name: string;
  slug: string;
  href: string;
  match: string[];
  productIds: string[];
  fillEmpty?: boolean;
}

const ALL_PRODUCTS: ProductItem[] = [...NEW_PRODUCTS, ...FLASH_SALE_PRODUCTS];

export const NAV_CATEGORIES: NavCategory[] = [
  {
    name: "Smartphone",
    slug: "smartphone",
    href: "/category/smartphone",
    match: ["iphone", "galaxy", "pixel", "smartphone"],
    productIds: ["prod-1", "prod-2", "flash-1", "flash-16"],
    fillEmpty: false,
  },
  {
    name: "Tablet",
    slug: "tablet",
    href: "/category/tablet",
    match: ["ipad", "tablet", "tabx", "galaxy tab", "xiaomi pad", "lenovo tab"],
    productIds: ["prod-7", "prod-19", "flash-7", "prod-22", "prod-23", "prod-24"],
    fillEmpty: false,
  },
  {
    name: "Mac",
    slug: "mac",
    href: "/category/mac",
    match: ["macbook"],
    productIds: ["prod-3", "flash-3"],
    fillEmpty: false,
  },
  {
    name: "Laptop",
    slug: "laptop",
    href: "/category/laptop",
    match: ["laptop", "rog zephyrus", "zenith"],
    productIds: ["prod-4", "flash-8"],
    fillEmpty: false,
  },
  {
    name: "Desktop",
    slug: "desktop",
    href: "/category/desktop",
    match: ["monitor", "cyberstation", "keyboard", "mouse"],
    productIds: ["prod-8", "prod-11", "prod-17", "prod-13"],
    fillEmpty: false,
  },
  {
    name: "Sound Appliance",
    slug: "sound-appliance",
    href: "/category/sound-appliance",
    match: ["headphone", "speaker", "earbuds", "soundbar", "airpods"],
    productIds: ["prod-5", "flash-2", "flash-9", "prod-12", "prod-15", "prod-20", "flash-13"],
    fillEmpty: false,
  },
  {
    name: "Smart Appliance",
    slug: "smart-appliance",
    href: "/category/smart-appliance",
    match: ["watch", "projector", "vr", "camera", "power bank"],
    productIds: ["prod-6", "prod-16", "flash-4", "prod-21", "prod-18", "prod-10", "flash-15"],
    fillEmpty: false,
  },
  {
    name: "Feature Phone",
    slug: "feature-phone",
    href: "/category/feature-phone",
    match: ["keypad"],
    productIds: [],
    fillEmpty: false,
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
  const seen = new Set(list.map((p) => p.id));

  const MIN_PER_PAGE = 20;
  if (cat.fillEmpty !== false && list.length < MIN_PER_PAGE) {
    const filler = ALL_PRODUCTS.filter((p) => !seen.has(p.id));
    list.push(...filler.slice(0, MIN_PER_PAGE - list.length));
  }

  return list;
}
