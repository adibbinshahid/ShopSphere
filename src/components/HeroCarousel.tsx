'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCarouselStore } from '@/lib/store';

const DRAG_THRESHOLD = 40;
const WHEEL_THRESHOLD = 30;
const WHEEL_COOLDOWN = 600; // ms between trackpad-triggered slides

export default function HeroCarousel() {
  const { items, interval } = useCarouselStore();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastWheelRef = useRef(0);

  const go = useCallback((newDir: number) => {
    setDir(newDir);
    setIndex((i) => (i + newDir + items.length) % items.length);
  }, [items.length]);

  const resetAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    if (items.length <= 1) return;
    autoplayRef.current = setInterval(() => go(1), interval);
  }, [go, interval, items.length]);

  useEffect(() => {
    resetAutoplay();
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [resetAutoplay]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipe = info.offset.x + info.velocity.x * 0.3;
    if (swipe < -DRAG_THRESHOLD) { go(1); resetAutoplay(); }
    else if (swipe > DRAG_THRESHOLD) { go(-1); resetAutoplay(); }
  };

  // Trackpad two-finger horizontal swipe
  const handleWheel = useCallback((e: React.WheelEvent) => {
    const now = Date.now();
    if (Math.abs(e.deltaX) < WHEEL_THRESHOLD) return;
    if (now - lastWheelRef.current < WHEEL_COOLDOWN) return;
    lastWheelRef.current = now;
    if (e.deltaX > 0) { go(1); resetAutoplay(); }
    else { go(-1); resetAutoplay(); }
  }, [go, resetAutoplay]);

  const current = items[index] ?? items[0];
  if (!current) return null;

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? -50 : 50 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? 50 : -50 }),
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onWheel={handleWheel}
    >
      {/* Static purple circle */}
      <div
        className="absolute rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 opacity-90 pointer-events-none"
        style={{ width: 'clamp(201px, 34.5vw, 431px)', height: 'clamp(201px, 34.5vw, 431px)' }}
      />

      {/* Animated product image */}
      <AnimatePresence mode="sync" custom={dir}>
        <motion.div
          key={current.id}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 z-10 flex items-center justify-center p-6 touch-pan-y"
        >
          <div className="relative w-full h-full pointer-events-none">
            <Image
              src={current.image}
              alt={current.label ?? 'Product'}
              fill
              className="object-contain drop-shadow-2xl"
              priority
              draggable={false}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Badge */}
      {current.badge && (
        <span className="absolute top-5 right-5 z-20 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow pointer-events-none">
          {current.badge}
        </span>
      )}

      {/* Dot indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); resetAutoplay(); }}
              className={`rounded-full transition-all duration-300 ${
                i === index ? 'w-5 h-1.5 bg-purple-600' : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
