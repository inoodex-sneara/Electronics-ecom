import { notFound } from "next/navigation";
import Link from "next/link";
import {
  NAV_CATEGORIES,
  getCategoryProducts,
} from "@/data/nav-categories";
import CategoryListing from "@/components/category-listing";

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
        </div>
      </section>

      {/* Grid */}
      <CategoryListing category={{ name: cat.name, slug: cat.slug, href: cat.href }} products={products} />
    </div>
  );
}
