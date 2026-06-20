'use client';
import { m } from 'framer-motion';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import { useCartStore, useCartAnimStore } from '@/lib/store';
import { useState } from 'react';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const trigger = useCartAnimStore((s) => s.trigger);
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);

    const rect = e.currentTarget.getBoundingClientRect();
    trigger(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      product.image,
      product.name,
      product.price,
    );
  };

  const badgeColor: Record<string, string> = {
    Sale: 'bg-red-500',
    New: 'bg-green-500',
    Trending: 'bg-orange-500',
    Bestseller: 'bg-purple-600',
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={`/product/${product.id}`}>
        <m.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100"
        >
          {/* Image */}
          <div className="relative aspect-square bg-gray-50 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.badge && (
              <span className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full ${badgeColor[product.badge] ?? 'bg-gray-600'}`}>
                {product.badge}
              </span>
            )}
            {product.originalPrice && (
              <span className="absolute top-3 right-3 bg-white text-red-500 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
            <button
              onClick={(e) => { e.preventDefault(); setWishlist(!wishlist); }}
              className="absolute bottom-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart size={16} className={wishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-xs text-purple-600 font-medium mb-1">{product.category}</p>
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-purple-600 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mb-3">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-gray-700">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-gray-900">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <m.button
                whileTap={{ scale: 0.85 }}
                onClick={handleAdd}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  added ? 'bg-green-500 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <ShoppingCart size={13} />
                {added ? 'Added!' : 'Add'}
              </m.button>
            </div>
          </div>
        </m.div>
      </Link>
    </m.div>
  );
}
