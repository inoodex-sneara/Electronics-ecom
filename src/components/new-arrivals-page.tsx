"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Eye,
  Zap,
  Star,
  Check,
  SlidersHorizontal,
  Search,
  X,
  ShoppingCart,
} from "lucide-react";
import { NEW_PRODUCTS, CATEGORIES, formatBdt, type ProductItem } from "@/data/products";
import QuickViewModal from "@/components/quick-view-modal";
import OfferBadge from "@/components/offer-badge";
import { useCart } from "@/providers/cart-context";
import { useWishlist } from "@/providers/wishlist-context";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c !== "All Drops");

const BRAND_OPTIONS = Array.from(
  new Set(NEW_PRODUCTS.map((p) => p.brand))
).sort((a, b) => a.localeCompare(b));

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

export default function NewArrivalsPage() {
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeBrands, setActiveBrands] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);
  const [soldOut, setSoldOut] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const { has: hasWish, toggle } = useWishlist();
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const { addItem } = useCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let list = [...NEW_PRODUCTS];

    if (activeCategories.length > 0) {
      list = list.filter((item) => activeCategories.includes(item.category));
    }

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
        return [...list].sort((a, b) => a.price - b.price || b.rating - a.rating);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price || b.rating - a.rating);
      case "rating":
        return [...list].sort(
          (a, b) => b.rating - a.rating || a.price - b.price
        );
      default:
        return list;
    }
  }, [activeCategories, activeBrands, inStock, soldOut, minPrice, maxPrice, searchQuery, sortBy]);

  const toggleWishlist = (e: React.MouseEvent, product: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    applyWishlistToggle(product.id);
  };

  const applyWishlistToggle = (productId: string) => {
    const product = [...NEW_PRODUCTS].find((p) => p.id === productId);
    if (!product) return;
    const added = toggle({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      inStock: product.inStock,
    });
    showToast(added ? "Added to your Wishlist" : "Removed from Wishlist");
  };

  const handleAddToCart = (e: React.MouseEvent, product: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      inStock: product.inStock,
    });
    setAddedItem(product.id);
    showToast(`Added ${product.name} to cart`);
    setTimeout(() => {
      setAddedItem(null);
    }, 1600);
  };

  const addToCartFromModal = (product: ProductItem, qty: number) => {
    addItem(
      {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        inStock: product.inStock,
      },
      qty
    );
    setAddedItem(product.id);
    showToast(`Added ${qty}× ${product.name} to cart`);
    setTimeout(() => {
      setAddedItem(null);
    }, 1600);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2800);
  };

  const openQuickView = (e: React.MouseEvent, product: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleBrand = (brand: string) => {
    setActiveBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setActiveCategories([]);
    setActiveBrands([]);
    setInStock(false);
    setSoldOut(false);
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
  };

  const hasActiveFilters =
    activeCategories.length > 0 ||
    activeBrands.length > 0 ||
    inStock ||
    soldOut ||
    !!minPrice.trim() ||
    !!maxPrice.trim() ||
    !!searchQuery.trim();

  const SidebarContent = (
    <div className="flex flex-col">
      {/* Availability */}
      <div className="pb-4 border-b border-zinc-200">
        <h4 className="text-[13px] font-bold text-zinc-900 mb-2">Availability</h4>
        <FilterCheckbox
          checked={inStock}
          onChange={() => setInStock((v) => !v)}
          label="In Stock"
        />
        <FilterCheckbox
          checked={soldOut}
          onChange={() => setSoldOut((v) => !v)}
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
              onChange={(e) => setMinPrice(e.target.value)}
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
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white pl-7 pr-2 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-4 border-b border-zinc-200">
        <h4 className="text-[13px] font-bold text-zinc-900 mb-2">Categories</h4>
        <div className="flex flex-col">
          {CATEGORY_OPTIONS.map((cat) => (
            <FilterCheckbox
              key={cat}
              checked={activeCategories.includes(cat)}
              onChange={() => toggleCategory(cat)}
              label={cat}
            />
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="py-4 border-b border-zinc-200">
        <h4 className="text-[13px] font-bold text-zinc-900 mb-2">Brands</h4>
        <div className="flex flex-col">
          {BRAND_OPTIONS.map((brand) => (
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
            onChange={(e) => setSearchQuery(e.target.value)}
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
    <div className="relative w-full bg-white min-h-screen pb-20">
      {/* Toolbar */}
      <section className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200/80">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <span className="text-xs sm:text-sm text-zinc-500 font-medium">
            Showing{" "}
            <strong className="text-zinc-900 text-sm sm:text-base">
              {filteredProducts.length}
            </strong>{" "}
            products
          </span>

          {/* Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="size-4 text-zinc-400 hidden sm:block" />
            <label htmlFor="sort-select" className="sr-only">
              Sort products
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-full border border-zinc-200 bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-zinc-700 hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Main Layout: Sidebar + Grid */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex gap-8">
          {/* Left Sidebar — Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
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
                  {activeCategories.length +
                    activeBrands.length +
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
            <motion.div
              key={`${activeCategories.join(",")}-${activeBrands.join(",")}-${sortBy}-${searchQuery}-${minPrice}-${maxPrice}-${inStock}-${soldOut}`}
              initial="hidden"
              animate="active"
              variants={{
                hidden: {},
                active: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
              }}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
            >
          {filteredProducts.map((product) => {
            const isWishlisted = hasWish(product.id);
            const isJustAdded = addedItem === product.id;
            const savings = product.originalPrice - product.price;

            return (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 32 },
                  active: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
                className="group relative flex flex-col rounded-xl bg-white border border-zinc-200/90 hover:border-emerald-300 shadow-xs hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden"
              >
                {/* Discount Badge */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 px-1.5 py-0.5 text-[10px] font-black text-white shadow-sm">
                    <Zap className="size-2.5 fill-white" />
                    {product.tag}
                  </span>
                </div>
                <OfferBadge
                  price={product.price}
                  originalPrice={product.originalPrice}
                  className="top-9"
                />

                {/* Floating Action Buttons */}
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
                  <button
                    type="button"
                    onClick={(e) => toggleWishlist(e, product)}
                    className={`size-7 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-90 ${
                      isWishlisted
                        ? "bg-emerald-600 text-white"
                        : "bg-white/90 text-zinc-700 hover:text-emerald-600 hover:bg-white"
                    }`}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart className={`size-3.5 ${isWishlisted ? "fill-white" : ""}`} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => openQuickView(e, product)}
                    className="size-7 rounded-full bg-white/90 hover:bg-white text-zinc-700 hover:text-emerald-600 flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-90"
                    title="Quick Preview"
                  >
                    <Eye className="size-3.5" />
                  </button>
                </div>

                {/* Image Area */}
                <Link
                  href={`/products/${product.id}`}
                  className="relative w-full aspect-[4/3] bg-white overflow-hidden block"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover object-center mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-108"
                    draggable={false}
                  />
                </Link>

                {/* Content Body */}
                <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                  {/* Brand & Rating */}
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-0.5">
                    <span className="font-semibold uppercase tracking-wider text-zinc-400">
                      {product.brand}
                    </span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      {product.rating}
                    </span>
                  </div>

                  {/* Title */}
                  <Link
                    href={`/products/${product.id}`}
                    className="text-xs font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug min-h-[2rem]"
                  >
                    {product.name}
                  </Link>

                  {/* Pricing */}
                  <div className="mt-1.5 flex flex-wrap items-baseline gap-1">
                    <span className="text-sm font-black text-emerald-600">
                      {formatBdt(product.price)}
                    </span>
                    <span className="text-[10px] text-zinc-400 line-through">
                      {formatBdt(product.originalPrice)}
                    </span>
                  </div>

                  {/* Savings Tag */}
                  {savings > 0 && (
                    <div className="mt-0.5">
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 rounded px-1.5 py-0.5">
                        Save {formatBdt(savings)}
                      </span>
                    </div>
                  )}

                  {/* Stock Status */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[9px] font-semibold text-zinc-500">
                      <span className={product.inStock ? "text-emerald-600 font-bold" : "text-rose-500 font-bold"}>
                        {product.inStock ? "In Stock" : "Sold Out"}
                      </span>
                      <span>{product.reviewCount} reviews</span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`mt-2 w-full inline-flex items-center justify-center gap-1 rounded-lg py-1.5 px-2 text-[11px] font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
                      isJustAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-950 hover:bg-emerald-600 text-white shadow-xs"
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="size-3" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="size-3" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

            {filteredProducts.length === 0 && (
              <div className="py-20 text-center text-zinc-500 text-sm font-medium">
                No products match your filters.
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-sm font-bold transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          wishlisted={hasWish(quickViewProduct.id)}
          onClose={() => setQuickViewProduct(null)}
          onToggleWishlist={applyWishlistToggle}
          onAddToCart={addToCartFromModal}
        />
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-2xl ring-1 ring-white/10 animate-in slide-in-from-bottom-5 duration-200">
          <Check className="size-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
