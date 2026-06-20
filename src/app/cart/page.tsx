'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, CheckCircle, AlertTriangle, X, FlaskConical } from 'lucide-react';

const VALID_CODES: Record<string, { label: string; pct: number }> = {
  SAVE10:     { label: '10% off',              pct: 0.10 },
  SUMMER10:   { label: '10% off summer sale',  pct: 0.10 },
  GOLD20:     { label: '20% Gold member',      pct: 0.20 },
  BIRTHDAY15: { label: '15% birthday offer',   pct: 0.15 },
  FREESHIP:   { label: 'Free shipping bonus',  pct: 0.05 },
};

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCartStore();

  const [confirm, setConfirm] = useState<number | 'all' | null>(null);
  const [demoModal, setDemoModal] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');

  const couponData = appliedCode ? VALID_CODES[appliedCode] : null;
  const discount = couponData ? total() * couponData.pct : 0;
  const subtotal = total();
  const finalTotal = subtotal - discount;
  const tax = finalTotal * 0.08;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (VALID_CODES[code]) {
      setAppliedCode(code);
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Invalid code.');
    }
  };

  const handleConfirmDelete = () => {
    if (confirm === 'all') clearCart();
    else if (typeof confirm === 'number') removeItem(confirm);
    setConfirm(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <Link href="/shop" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={18} className="text-gray-600" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Shopping Cart <span className="text-purple-600">({items.length})</span>
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center">
              <ShoppingBag size={40} className="text-purple-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
            <p className="text-gray-500 text-sm">Add some products to get started</p>
            <Link href="/shop" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex gap-4">
                    <Link href={`/product/${item.id}`} className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-purple-600 font-medium">{item.category}</p>
                          <Link href={`/product/${item.id}`}>
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 hover:text-purple-600 transition-colors">{item.name}</h3>
                          </Link>
                        </div>
                        <button onClick={() => setConfirm(item.id)}
                          className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors flex-shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                          <button onClick={() => item.quantity === 1 ? setConfirm(item.id) : updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition-colors">
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition-colors">
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="text-base font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button onClick={() => setConfirm('all')}
                className="text-sm text-red-400 hover:text-red-600 transition-colors font-medium">
                Clear entire cart
              </button>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              {/* Coupon */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Tag size={16} className="text-purple-600" /> Promo Code</h3>
                {appliedCode ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={15} className="text-green-500" />
                      <div>
                        <p className="text-sm font-bold text-green-700">{appliedCode}</p>
                        <p className="text-xs text-green-600">{couponData?.label} — saving ${discount.toFixed(2)}</p>
                      </div>
                    </div>
                    <button onClick={() => setAppliedCode(null)} className="text-green-400 hover:text-green-600">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input value={couponInput} onChange={e => { setCouponInput(e.target.value); setCouponError(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Enter promo code"
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400" />
                      <button onClick={handleApplyCoupon}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 rounded-xl text-sm font-medium transition-colors">
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-red-500 text-xs mt-1.5">{couponError}</p>}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {Object.keys(VALID_CODES).map(code => (
                        <button key={code} onClick={() => { setCouponInput(code); setCouponError(''); }}
                          className="text-xs bg-purple-50 text-purple-600 font-semibold px-2.5 py-1 rounded-lg hover:bg-purple-100 transition-colors">
                          {code}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount ({appliedCode})</span>
                      <span>−${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-500 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-purple-600">${(finalTotal + tax).toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={() => setDemoModal(true)} className="mt-5 w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-semibold transition-colors shadow-lg shadow-purple-200">
                  Proceed to Checkout
                </button>
                <Link href="/shop" className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-3 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Demo notice modal */}
      <AnimatePresence>
        {demoModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setDemoModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Top stripe */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 text-center relative">
                <button onClick={() => setDemoModal(false)} className="absolute right-4 top-4 text-white/70 hover:text-white">
                  <X size={18} />
                </button>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FlaskConical size={26} className="text-white" />
                </div>
                <h3 className="text-white font-black text-lg">Demo Website</h3>
                <p className="text-purple-200 text-xs mt-1">For demonstration purposes only</p>
              </div>
              <div className="p-6 text-center space-y-3">
                <p className="text-gray-700 text-sm leading-relaxed">
                  This is a <span className="font-bold text-purple-600">demo e-commerce website</span>. No real orders will be placed, no payments will be charged, and nothing will be delivered.
                </p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  ShopSphere is built purely to showcase a modern shopping experience — product browsing, cart management, admin panel, AI workflows, and more.
                </p>
                <div className="bg-purple-50 rounded-2xl px-4 py-3 text-xs text-purple-600 font-medium">
                  ✦ Real-looking · Fully interactive · Zero risk
                </div>
                <button onClick={() => setDemoModal(false)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-2xl text-sm font-semibold transition-colors mt-1">
                  Got it, continue exploring →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirm !== null && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setConfirm(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white rounded-2xl shadow-2xl p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle size={22} className="text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-lg">
                {confirm === 'all' ? 'Clear entire cart?' : 'Remove this item?'}
              </h3>
              <p className="text-sm text-gray-400 mb-5">
                {confirm === 'all'
                  ? 'All items will be removed. This cannot be undone.'
                  : 'This item will be removed from your cart.'}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirm(null)}
                  className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleConfirmDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
                  {confirm === 'all' ? 'Clear Cart' : 'Remove'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
