import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Zap } from "lucide-react";
import {
  NAV_CATEGORIES,
  getCategoryProducts,
} from "@/data/nav-categories";
import { formatBdt } from "@/data/products";

export function generateStaticParams() {
  return NAV_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = NAV_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return { title: "Category Not Found | Synchroma" };
  return {
    title: `${cat.name} | Synchroma`,
    description: `Shop ${cat.name} at Synchroma — best prices in Bangladesh.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = NAV_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();

  const products = getCategoryProducts(slug);

  return (
    <div className="w-full min-h-screen bg-zinc-50 pb-16">
      {/* Header */}
      <section className="bg-emerald-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-white font-semibold">{cat.name}</span>
          </nav>
          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {cat.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {products.length} products — genuine, warranty-backed, delivered nationwide.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {products.length === 0 ? (
          <div className="py-24 text-center text-sm font-medium text-zinc-500 bg-white rounded-2xl border border-zinc-200">
            No products in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {products.map((p) => {
              const disc =
                p.originalPrice > p.price
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : 0;
              return (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group flex flex-col rounded-xl border border-zinc-200/90 bg-white shadow-xs overflow-hidden transition-all hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10"
                >
                  <div className="relative w-full aspect-[4/3] bg-zinc-50 overflow-hidden">
                    {disc > 0 && (
                      <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 px-1.5 py-0.5 text-[10px] font-black text-white shadow-sm">
                        <Zap className="size-2.5 fill-white" />-{disc}%
                      </span>
                    )}
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-0.5">
                      <span className="font-semibold uppercase tracking-wider text-zinc-400">
                        {p.brand}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        {p.rating}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug min-h-[2rem]">
                      {p.name}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-baseline gap-1">
                      <span className="text-sm font-black text-emerald-600">
                        {formatBdt(p.price)}
                      </span>
                      <span className="text-[10px] text-zinc-400 line-through">
                        {formatBdt(p.originalPrice)}
                      </span>
                    </div>
                    <span
                      className={`mt-1 text-[9px] font-bold ${
                        p.inStock ? "text-emerald-600" : "text-rose-500"
                      }`}
                    >
                      {p.inStock ? "In Stock" : "Sold Out"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
