'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { products } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.length > 1
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                <Search size={20} className="text-purple-500 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 text-sm outline-none text-gray-900 placeholder:text-gray-400"
                />
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              <AnimatePresence>
                {results.length > 0 && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="py-2">
                      {results.map((p) => (
                        <Link
                          key={p.id}
                          href={`/product/${p.id}`}
                          onClick={onClose}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors"
                        >
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{p.name}</p>
                            <p className="text-xs text-gray-500">{p.category} • ${p.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
                {query.length > 1 && results.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">
                    No results for &quot;{query}&quot;
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
