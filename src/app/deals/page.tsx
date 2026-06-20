'use client';
import { motion } from 'framer-motion';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Tag, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

function Countdown() {
  const [time, setTime] = useState({ h: 5, m: 59, s: 59 });

  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex gap-3">
      {[{ label: 'HRS', val: time.h }, { label: 'MIN', val: time.m }, { label: 'SEC', val: time.s }].map(({ label, val }) => (
        <div key={label} className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
          <p className="text-white font-black text-2xl">{String(val).padStart(2, '0')}</p>
          <p className="text-white/70 text-xs">{label}</p>
        </div>
      ))}
    </div>
  );
}

export default function DealsPage() {
  const saleProducts = products.filter((p) => p.originalPrice);
  const flashDeal = products.find((p) => p.badge === 'Bestseller');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Flash Sale Banner */}
        <div className="relative bg-gradient-to-r from-purple-700 to-indigo-700 rounded-3xl overflow-hidden p-8 sm:p-12 mb-10">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag size={16} className="text-purple-200" />
                <span className="text-purple-200 text-sm font-medium">Flash Sale</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white mb-2">Up to 50% Off</h1>
              <p className="text-white/70">On selected premium products</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-purple-200" />
                <span className="text-purple-200 text-sm">Ends in</span>
              </div>
              <Countdown />
            </div>
          </div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute right-10 bottom-0 w-40 h-40 bg-white/5 rounded-full" />
          </div>
        </div>

        {/* Flash Deal */}
        {flashDeal && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-8 flex items-center gap-4">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-bold text-gray-900 text-sm">Flash Deal of the Day</p>
              <p className="text-gray-600 text-xs">{flashDeal.name} — ${flashDeal.price.toFixed(2)}</p>
            </div>
            <span className="ml-auto bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">BESTSELLER</span>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sale Items</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {saleProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
