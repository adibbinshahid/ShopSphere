'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle, ShoppingCart } from 'lucide-react';
import { useCartAnimStore } from '@/lib/store';

/* ── Flying dot ─────────────────────────────────────────────────────────────── */
function FlyBubble() {
  const { fly, clearFly } = useCartAnimStore();
  const [target, setTarget] = useState({ x: 0, y: 0 });
  const flyKey = fly?.id;

  useEffect(() => {
    if (!fly) return;
    // Find cart button position
    const btn = document.getElementById('navbar-cart-btn');
    if (btn) {
      const r = btn.getBoundingClientRect();
      setTarget({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    } else {
      setTarget({ x: window.innerWidth - 60, y: 36 });
    }
  }, [flyKey]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!fly) return null;

  const dx = target.x - fly.x;
  const dy = target.y - fly.y;

  return (
    <motion.div
      key={fly.id}
      initial={{ x: fly.x - 20, y: fly.y - 20, scale: 1, opacity: 1 }}
      animate={{
        x: [fly.x - 20, fly.x - 20 + dx * 0.35, target.x - 20],
        y: [fly.y - 20, fly.y - 20 - Math.abs(dy) * 0.4 - 40, target.y - 20],
        scale: [1, 0.9, 0.2],
        opacity: [1, 1, 0],
      }}
      transition={{ duration: 0.65, ease: 'easeInOut', times: [0, 0.5, 1] }}
      onAnimationComplete={clearFly}
      className="fixed z-[9999] pointer-events-none w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500 shadow-lg shadow-purple-300"
      style={{ top: 0, left: 0 }}
    >
      <Image src={fly.image} alt="" fill className="object-cover" />
    </motion.div>
  );
}

/* ── Toast ──────────────────────────────────────────────────────────────────── */
function CartToast() {
  const { toast, clearToast } = useCartAnimStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!toast) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(clearToast, 2800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [toast, clearToast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.name + toast.price}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed bottom-6 right-4 sm:right-6 z-[9998] w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden pointer-events-none"
        >
          {/* progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 2.8, ease: 'linear' }}
            className="absolute top-0 left-0 right-0 h-0.5 bg-purple-500 origin-left"
          />

          <div className="flex items-center gap-3 p-4">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
              <Image src={toast.image} alt="" fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                <span className="text-xs font-bold text-green-600">Added to cart</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 truncate">{toast.name}</p>
              <p className="text-xs text-purple-600 font-bold">${toast.price.toFixed(2)}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShoppingCart size={15} className="text-purple-600" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Combined export ─────────────────────────────────────────────────────────── */
export default function CartFeedback() {
  return (
    <>
      <FlyBubble />
      <CartToast />
    </>
  );
}
