'use client';
import { products } from '@/lib/products';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Shield, Truck, RefreshCw, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useState } from 'react';

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const addItem = useCartStore((s) => s.addItem);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return notFound();

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => { setAdded(false); toggleCart(); }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-purple-600 transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </div>

      <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm"
        >
          <Image src={product.image} alt={product.name} fill className="object-cover" />
          {product.badge && (
            <span className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              {product.badge}
            </span>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <p className="text-purple-600 font-medium text-sm mb-2">{product.category}</p>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-800">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews.toLocaleString()} reviews)</span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-black text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-sm font-medium text-gray-700">Quantity</p>
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors font-bold"
              >
                −
              </button>
              <span className="w-6 text-center font-bold text-sm">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors font-bold"
              >
                +
              </button>
            </div>
            <p className="text-xs text-gray-500">{product.stock} in stock</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleAdd}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-colors ${
                added ? 'bg-green-500 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200'
              }`}
            >
              <ShoppingCart size={16} />
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </motion.button>
            <button
              onClick={() => setWishlist(!wishlist)}
              className={`w-14 h-14 flex items-center justify-center rounded-2xl border-2 transition-colors ${
                wishlist ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-200 hover:border-red-300 text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart size={18} className={wishlist ? 'fill-red-500' : ''} />
            </button>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Shield, label: 'Secure Payment' },
              { icon: Truck, label: 'Free Shipping' },
              { icon: RefreshCw, label: 'Easy Returns' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 p-3 bg-purple-50 rounded-xl text-center">
                <Icon size={16} className="text-purple-600" />
                <span className="text-xs font-medium text-gray-700">{label}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-4">SKU: {product.sku} • Tags: {product.tags.join(', ')}</p>
        </motion.div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
