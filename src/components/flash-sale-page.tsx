"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Zap,
  Heart,
  Eye,
  ShoppingCart,
  Check,
  Star,
  SlidersHorizontal,
  Search,
  Percent,
  X,
} from "lucide-react";
import { FLASH_SALE_PRODUCTS, type FlashSaleItem } from "@/data/flash-sale";
import { formatBdt, type ProductItem } from "@/data/products";
import QuickViewModal from "@/components/quick-view-modal";
import OfferBadge from "@/components/offer-badge";
import { useCart } from "@/providers/cart-context";
import { useWishlist } from "@/providers/wishlist-context";

type SortOption = "discount" | "price-asc" | "price-desc" | "rating";

const CATEGORY_OPTIONS = [
  "Smartphones",
  "Laptops & Mac",
  "Audio & Wearables",
  "Smart Gear",
] as const;

const BRAND_OPTIONS = [
  "Anker",
  "Apple",
  "Asus ROG",
  "Google",
  "JBL",
  "Samsung",
  "Sony",
] as const;

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

export default function FlashSalePage() {
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeBrands, setActiveBrands] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);
  const [soldOut, setSoldOut] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("discount");
  const { has: hasWish, toggle } = useWishlist();
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const { addItem } = useCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let list = [...FLASH_SALE_PRODUCTS];

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
      case "discount":
        return [...list].sort(
          (a, b) => b.discountPct - a.discountPct || b.rating - a.rating
        );
      case "price-asc":
        return [...list].sort(
          (a, b) => a.price - b.price || b.rating - a.rating
        );
      case "price-desc":
        return [...list].sort(
          (a, b) => b.price - a.price || b.rating - a.rating
        );
      case "rating":
        return [...list].sort(
          (a, b) =>
            b.rating - a.rating || b.discountPct - a.discountPct || a.price - b.price
        );
      default:
        return list;
    }
  }, [activeCategories, activeBrands, inStock, soldOut, minPrice, maxPrice, searchQuery, sortBy]);

  const toggleWishlist = (e: React.MouseEvent, product: FlashSaleItem) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggle({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      inStock: product.inStock ?? true,
    });
    showToast(added ? "Added to your Wishlist" : "Removed from Wishlist");
  };

  const handleAddToCart = (e: React.MouseEvent, product: FlashSaleItem) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      inStock: product.inStock ?? true,
    });
    setAddedItem(product.id);
    showToast(`Added ${product.name} to cart`);
    setTimeout(() => setAddedItem(null), 1600);
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
    setTimeout(() => setAddedItem(null), 1600);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2600);
  };

  const openQuickView = (e: React.MouseEvent, product: FlashSaleItem) => {
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
            placeholder="Search deals..."
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
    <div className="w-full min-h-screen bg-zinc-50 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white shadow-2xl ring-1 ring-white/10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Check className="size-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Layout: Sidebar + Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex gap-8">
          {/* Left Sidebar — Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-6 bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
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
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-zinc-200">
              <span className="text-xs text-zinc-500">
                Showing <strong className="text-zinc-900 text-sm">{filteredProducts.length}</strong> flash deals
              </span>
              <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-full px-3 py-1.5 text-xs">
                <SlidersHorizontal className="size-3.5 text-zinc-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort flash sale products"
                  className="bg-transparent text-xs font-semibold text-zinc-800 focus:outline-none cursor-pointer"
                >
                  <option value="discount">Biggest Discount</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 p-8">
                <Percent className="size-12 text-zinc-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-zinc-800">No flash deals found</h3>
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
                {filteredProducts.map((product) => {
                  const isWishlisted = hasWish(product.id);
                  const isAdded = addedItem === product.id;
                  const percentSold = Math.round((product.soldCount / product.totalStock) * 100);
                  const savings = product.originalPrice - product.price;

                  return (
                    <div
                      key={product.id}
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
                        className="relative w-full aspect-[4/3] bg-zinc-50 overflow-hidden block"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
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
                        <div className="mt-0.5">
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 rounded px-1.5 py-0.5">
                            Save {formatBdt(savings)}
                          </span>
                        </div>

                        {/* Stock Claimed Urgency */}
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-[9px] font-semibold text-zinc-500 mb-0.5">
                            <span>Claimed: {percentSold}%</span>
                            <span className="text-emerald-600 font-bold">
                              {product.totalStock - product.soldCount} left
                            </span>
                          </div>
                          <div className="w-full h-1 rounded-full bg-zinc-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                              style={{ width: `${percentSold}%` }}
                            />
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, product)}
                          className={`mt-2 w-full inline-flex items-center justify-center gap-1 rounded-lg py-1.5 px-2 text-[11px] font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
                            isAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-zinc-950 hover:bg-emerald-600 text-white shadow-xs"
                          }`}
                        >
                          {isAdded ? (
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
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          wishlisted={hasWish(quickViewProduct.id)}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={addToCartFromModal}
          onToggleWishlist={(id) => {
            const p = quickViewProduct;
            const added = toggle({
              id,
              name: p.name,
              brand: p.brand,
              price: p.price,
              originalPrice: p.originalPrice,
              image: p.image,
              inStock: p.inStock ?? true,
            });
            showToast(added ? "Added to your Wishlist" : "Removed from Wishlist");
          }}
        />
      )}
    </div>
  );
}
