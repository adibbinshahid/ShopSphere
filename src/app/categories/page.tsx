'use client';
import { motion } from 'framer-motion';
import { categories } from '@/lib/products';
import { products } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Suspense } from 'react';

function CategoriesContent() {
  const params = useSearchParams();
  const selectedCat = params.get('cat');
  const catProducts = selectedCat ? products.filter((p) => p.category === selectedCat) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Categories</h1>
        <p className="text-gray-500 mt-2">Explore our curated collections</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={`/categories?cat=${encodeURIComponent(cat.name)}`}>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`group relative overflow-hidden rounded-3xl cursor-pointer shadow-sm hover:shadow-xl transition-shadow ${
                  selectedCat === cat.name ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className="relative h-52 bg-gray-100">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                  <div>
                    <h3 className="text-white font-bold text-xl">{cat.name}</h3>
                    <p className="text-white/70 text-sm">{cat.count} products</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <ArrowRight size={16} className="text-white" />
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {selectedCat && catProducts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedCat}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {catProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense>
      <CategoriesContent />
    </Suspense>
  );
}
