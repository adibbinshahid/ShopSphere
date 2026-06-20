'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

const allCategories = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports'];
const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Top Rated', 'Newest'];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState('Featured');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory !== 'All') list = list.filter((p) => p.category === activeCategory);
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);
    if (sort === 'Price: Low to High') list.sort((a, b) => a.price - b.price);
    if (sort === 'Price: High to Low') list.sort((a, b) => b.price - a.price);
    if (sort === 'Top Rated') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [activeCategory, sort, search, minPrice, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Shop All Products</h1>
        <p className="text-gray-500 mt-2">{filtered.length} products found</p>
      </motion.div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-colors cursor-pointer"
        >
          {sortOptions.map((o) => <option key={o}>{o}</option>)}
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-white border border-gray-200 hover:border-purple-400 rounded-xl px-4 py-3 text-sm transition-colors"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 space-y-4"
        >
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Price Range</p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                placeholder="Min"
              />
              <span className="text-gray-400">—</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                placeholder="Max"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-lg">No products found.</p>
          <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="mt-4 text-purple-600 text-sm hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
