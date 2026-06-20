'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, Tag, CheckCircle, AlertTriangle } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';

const VALID_CODES: Record<string, { label: string; pct: number }> = {
  SAVE10:     { label: '10% off',             pct: 0.10 },
  SUMMER10:   { label: '10% off summer sale', pct: 0.10 },
  GOLD20:     { label: '20% Gold member',     pct: 0.20 },
  BIRTHDAY15: { label: '15% birthday offer',  pct: 0.15 },
  FREESHIP:   { label: 'Free shipping',        pct: 0.00 },
};

export default function CartDrawer() {
  const { isOpen, toggleCart, items, updateQuantity, removeItem, clearCart, total } = useCartStore();

  // Confirm state: item id to delete, or 'all' for clear cart
  const [confirm, setConfirm] = useState<number | 'all' | null>(null);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');

  const couponData = appliedCode ? VALID_CODES[appliedCode] : null;
  const discount = couponData ? total() * couponData.pct : 0;
  const finalTotal = total() - discount;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (VALID_CODES[code]) {
      setAppliedCode(code);
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Invalid code. Try SAVE10, GOLD20, BIRTHDAY15, FREESHIP.');
    }
  };

  const handleConfirmDelete = () => {
    if (confirm === 'all') clearCart();
    else if (typeof confirm === 'number') removeItem(confirm);
    setConfirm(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={toggleCart} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />

          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
                <span className="bg-purple-100 text-purple-600 text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button onClick={() => setConfirm('all')}
                    className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors px-2 py-1 hover:bg-red-50 rounded-lg">
                    Clear all
                  </button>
                )}
                <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center">
                      <ShoppingBag size={32} className="text-purple-300" />
                    </div>
                    <p className="text-gray-500 text-sm">Your cart is empty</p>
                    <button onClick={toggleCart} className="text-purple-600 font-medium text-sm hover:underline">
                      Continue Shopping
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div key={item.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-3 bg-gray-50 rounded-2xl">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
                        <p className="text-sm font-bold text-purple-600 mt-1">${item.price.toFixed(2)}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1">
                            <button onClick={() => item.quantity === 1 ? setConfirm(item.id) : updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center hover:bg-purple-50 rounded-lg transition-colors">
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center hover:bg-purple-50 rounded-lg transition-colors">
                              <Plus size={12} />
                            </button>
                          </div>
                          <button onClick={() => setConfirm(item.id)}
                            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-gray-100 space-y-3">
                {/* Coupon */}
                <div className="bg-gray-50 rounded-2xl p-3">
                  <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Tag size={12} /> Promo Code</p>
                  {appliedCode ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={13} className="text-green-500" />
                        <span className="text-xs font-bold text-green-700">{appliedCode}</span>
                        <span className="text-xs text-green-600">— {couponData?.label}</span>
                      </div>
                      <button onClick={() => setAppliedCode(null)} className="text-green-400 hover:text-green-600 text-xs">✕</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input value={couponInput} onChange={e => { setCouponInput(e.target.value); setCouponError(''); }}
                          onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                          placeholder="Enter code" className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400" />
                        <button onClick={handleApplyCoupon} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors">
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                      <p className="text-xs text-gray-400 mt-1">Try: SAVE10, GOLD20, BIRTHDAY15, FREESHIP</p>
                    </>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${total().toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-green-600 font-medium">
                      <span>Discount ({appliedCode})</span>
                      <span>−${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-500 font-medium">Free</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-base pt-1 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-purple-600">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/cart" onClick={toggleCart}
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-4 rounded-2xl font-semibold transition-colors">
                  Checkout — ${finalTotal.toFixed(2)}
                </Link>
                <button onClick={toggleCart} className="block w-full text-gray-500 hover:text-gray-700 text-center text-sm transition-colors">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>

          {/* Confirm dialog */}
          <AnimatePresence>
            {confirm !== null && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-black/30" onClick={() => setConfirm(null)} />
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed z-[61] bottom-1/2 translate-y-1/2 left-1/2 -translate-x-1/2 w-80 bg-white rounded-2xl shadow-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle size={22} className="text-red-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    {confirm === 'all' ? 'Clear entire cart?' : 'Remove this item?'}
                  </h3>
                  <p className="text-sm text-gray-400 mb-5">
                    {confirm === 'all' ? 'All items will be removed. This cannot be undone.' : 'This item will be removed from your cart.'}
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => setConfirm(null)}
                      className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleConfirmDelete}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                      {confirm === 'all' ? 'Clear Cart' : 'Remove'}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
