"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Search, SlidersHorizontal, X, Percent, ChevronLeft, ChevronRight } from "lucide-react";
import OfferBadge from "@/components/offer-badge";
import { formatBdt, type ProductItem } from "@/data/products";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

const PER_PAGE = 20;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

function FilterCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-[18px] rounded border-zinc-300 accent-emerald-600 cursor-pointer shrink-0"
      />
      <span className="text-[13px] font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">
        {label}
      </span>
    </label>
  );
}

interface CategoryPageProps {
  category: { name: string; slug: string; href: string };
  products: ProductItem[];
}

export default function CategoryListing({ category, products }: CategoryPageProps) {
  const [activeBrands, setActiveBrands] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);
  const [soldOut, setSoldOut] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const brandOptions = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort((a, b) => a.localeCompare(b)),
    [products]
  );

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeBrands.length > 0) {
      list = list.filter((item) => activeBrands.includes(item.brand));
    }

    if (inStock && !soldOut) {
      list = list.filter((item) => item.inStock);
    } else if (soldOut && !inStock) {
      list = list.filter((item) => !item.inStock);
    }

    const min = minPrice.trim() ? Number(minPrice) : null;
    const max = maxPrice.trim() ? Number(maxPrice) : null;
    if (min !== null && !Number.isNaN(min)) {
      list = list.filter((item) => item.price >= min);
    }
    if (max !== null && !Number.isNaN(max)) {
      list = list.filter((item) => item.price <= max);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price || b.rating - a.rating);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price || b.rating - a.rating);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating || a.price - b.price);
      default:
        return list;
    }
  }, [products, activeBrands, inStock, soldOut, minPrice, maxPrice, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredProducts.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const toggleBrand = (brand: string) => {
    setActiveBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setPage(1);
  };

  const clearAllFilters = () => {
    setActiveBrands([]);
    setInStock(false);
    setSoldOut(false);
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
    setPage(1);
  };

  const hasActiveFilters =
    activeBrands.length > 0 ||
    inStock ||
    soldOut ||
    !!minPrice.trim() ||
    !!maxPrice.trim() ||
    !!searchQuery.trim();

  const setFilter = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    setter(value);
    setPage(1);
  };

  const SidebarContent = (
    <div className="flex flex-col">
      {/* Availability */}
      <div className="pb-4 border-b border-zinc-200">
        <h4 className="text-[13px] font-bold text-zinc-900 mb-2">Availability</h4>
        <FilterCheckbox
          checked={inStock}
          onChange={() => setFilter(setInStock, !inStock)}
          label="In Stock"
        />
        <FilterCheckbox
          checked={soldOut}
          onChange={() => setFilter(setSoldOut, !soldOut)}
          label="Sold Out"
        />
      </div>

      {/* Price Range */}
      <div className="py-4 border-b border-zinc-200">
        <h4 className="text-[13px] font-bold text-zinc-900 mb-2.5">Price Range</h4>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 pointer-events-none">
              ৳
            </span>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setFilter(setMinPrice, e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white pl-7 pr-2 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>
          <span className="text-zinc-400 text-sm">–</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 pointer-events-none">
              ৳
            </span>
            <input
              type="number"
              placeholder="0"
              value={maxPrice}
              onChange={(e) => setFilter(setMaxPrice, e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white pl-7 pr-2 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="py-4 border-b border-zinc-200">
        <h4 className="text-[13px] font-bold text-zinc-900 mb-2">Brands</h4>
        <div className="flex flex-col">
          {brandOptions.map((brand) => (
            <FilterCheckbox
              key={brand}
              checked={activeBrands.includes(brand)}
              onChange={() => toggleBrand(brand)}
              label={brand}
            />
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="py-4 border-b border-zinc-200">
        <h4 className="text-[13px] font-bold text-zinc-900 mb-2.5">Search</h4>
        <div className="relative">
          <Search className="size-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setFilter(setSearchQuery, e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white pl-9 pr-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Clear All */}
      <div className="pt-4">
        <button
          type="button"
          onClick={clearAllFilters}
          className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 text-sm font-bold transition-colors active:scale-[0.98] cursor-pointer"
        >
          Clear All
        </button>
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-16">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-zinc-200">
        <span className="text-xs text-zinc-500">
          Showing{" "}
          <strong className="text-zinc-900 text-sm">
            {pageItems.length}
          </strong>{" "}
          of {filteredProducts.length} products
        </span>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-zinc-400 hidden sm:block" />
          <select
            value={sortBy}
            onChange={(e) => setFilter(setSortBy, e.target.value as SortOption)}
            aria-label={`Sort ${category.name} products`}
            className="rounded-full border border-zinc-200 bg-white px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-zinc-700 hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Left Sidebar — Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-200">
              <h3 className="text-sm font-bold text-zinc-900">Filters</h3>
            </div>
            {SidebarContent}
          </div>
        </aside>

        {/* Mobile Filter Button */}
        <div className="lg:hidden fixed bottom-4 left-4 z-40">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-5 py-3 text-sm font-bold shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
          >
            <SlidersHorizontal className="size-4" />
            Filters
            {hasActiveFilters && (
              <span className="size-5 rounded-full bg-white text-emerald-600 text-[10px] font-black flex items-center justify-center">
                {activeBrands.length +
                  (inStock ? 1 : 0) +
                  (soldOut ? 1 : 0) +
                  (minPrice.trim() ? 1 : 0) +
                  (maxPrice.trim() ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative ml-auto w-80 max-w-[85vw] h-full bg-white overflow-y-auto p-4 shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-200">
                <h3 className="text-sm font-bold text-zinc-900">Filters</h3>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="size-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors"
                >
                  <X className="size-4 text-zinc-600" />
                </button>
              </div>
              {SidebarContent}
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {pageItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 p-8">
              <Percent className="size-12 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-800">No products found</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Try adjusting your filters or search query.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white px-4 py-2 text-xs font-bold hover:bg-emerald-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {pageItems.map((p) => {
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
                        <div className="relative w-full aspect-[4/3] bg-white overflow-hidden">
                      {disc > 0 && (
                        <OfferBadge price={p.price} originalPrice={p.originalPrice} className="top-2" />
                      )}
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover object-center mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((n) => Math.max(1, n - 1))}
                disabled={currentPage <= 1}
                aria-label="Previous page"
                className="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors disabled:opacity-35 disabled:pointer-events-none"
              >
                <ChevronLeft className="size-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={n === currentPage ? "page" : undefined}
                  className={`min-w-9 h-9 px-2 rounded-lg text-sm font-bold transition-colors ${
                    n === currentPage
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                      : "border border-zinc-200 bg-white text-zinc-700 hover:border-emerald-400 hover:text-emerald-600"
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage((n) => Math.min(totalPages, n + 1))}
                disabled={currentPage >= totalPages}
                aria-label="Next page"
                className="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors disabled:opacity-35 disabled:pointer-events-none"
              >
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}

          {totalPages > 1 && (
            <p className="mt-3 text-center text-xs text-zinc-400">
              Page {currentPage} of {totalPages} · {PER_PAGE} products per page
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
