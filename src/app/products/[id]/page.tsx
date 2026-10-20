import { notFound } from "next/navigation";
import { NEW_PRODUCTS, type ProductItem } from "@/data/products";
import { FLASH_SALE_PRODUCTS } from "@/data/flash-sale";
import ProductDetailPage from "@/components/product-detail-page";

function findProduct(id: string): ProductItem | undefined {
  return (
    NEW_PRODUCTS.find((p) => p.id === id) ||
    FLASH_SALE_PRODUCTS.find((p) => p.id === id)
  );
}

export function generateStaticParams() {
  const all = [...NEW_PRODUCTS, ...FLASH_SALE_PRODUCTS];
  return all.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = findProduct(id);
  if (!product) return { title: "Product Not Found | Synchroma" };
  return {
    title: `${product.name} | Synchroma`,
    description: product.description.slice(0, 150),
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = findProduct(id);
  if (!product) notFound();

  const all = [...NEW_PRODUCTS, ...FLASH_SALE_PRODUCTS].filter((p) => p.id !== product.id);

  const related = all
    .map((p) => {
      let score = 0;
      if (p.brand === product.brand) score += 3;
      if (p.category === product.category) score += 2;
      const priceGap = Math.abs(p.price - product.price) / Math.max(product.price, 1);
      if (priceGap <= 0.3) score += 1;
      if (priceGap <= 0.6) score += 1;
      if (p.inStock) score += 1;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating)
    .map(({ p }) => p)
    .slice(0, 8);

  return <ProductDetailPage product={product} related={related} />;
}
