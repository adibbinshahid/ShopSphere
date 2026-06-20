'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Truck, Award, Headphones, Star, ChevronRight } from 'lucide-react';
import { products, categories } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';

const trustBadges = [
  { icon: ShieldCheck, title: 'Secure Checkout', sub: '100% Safe Payments' },
  { icon: Truck, title: 'Fast Delivery', sub: 'Quick & Reliable' },
  { icon: Award, title: 'Premium Quality', sub: 'Top Rated Products' },
  { icon: Headphones, title: '24/7 Support', sub: 'Always Here to Help' },
];

const categoryImages: Record<string, string> = {
  Electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
  Fashion: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=300&fit=crop',
  'Home & Living': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
  Beauty: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop',
  Sports: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const featured = products.slice(0, 4);
  const trending = products.filter((p) => p.badge === 'Trending' || p.badge === 'Bestseller' || p.rating >= 4.8);

  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[5px] pb-[5px]">
        <div className="bg-white rounded-3xl overflow-hidden relative min-h-[440px] sm:min-h-[480px] lg:min-h-[520px] flex items-center shadow-sm border border-gray-100">
          {/* Content */}
          <div className="relative z-10 px-8 sm:px-12 lg:px-16 py-10 max-w-lg translate-x-[30px]">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            >
              <motion.h1
                variants={fadeUp}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-950 leading-[1.05] tracking-tight"
              >
                Discover.
                <br />
                Shop.
                <br />
                <span className="text-purple-600">Enjoy.</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-5 text-gray-500 text-base sm:text-lg leading-relaxed">
                Premium products.<br />
                Smart choices.<br />
                Better life.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-7 py-4 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:gap-3"
                >
                  Shop Now <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute right-0 top-0 bottom-0 w-1/2 lg:w-3/5"
          >
            <HeroCarousel />
          </motion.div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
            {trustBadges.map(({ icon: Icon, title, sub }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 px-6 py-5"
              >
                <div className="w-10 h-10 rounded-xl border-2 border-purple-200 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-purple-600" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Categories ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-7"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top Categories</h2>
          <Link href="/categories" className="text-purple-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View All <ChevronRight size={14} />
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/categories?cat=${encodeURIComponent(cat.name)}`}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <Image
                      src={categoryImages[cat.name] ?? ''}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">{cat.name}</span>
                    <ArrowRight size={14} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-7"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 text-sm mt-1">Handpicked just for you</p>
          </div>
          <Link href="/shop" className="text-purple-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View All <ChevronRight size={14} />
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* ── Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-purple-700 to-indigo-700 rounded-3xl overflow-hidden px-8 sm:px-12 py-12 flex items-center justify-between gap-8"
        >
          <div className="relative z-10">
            <p className="text-purple-200 text-sm font-medium mb-2">Limited Time Offer</p>
            <h3 className="text-white text-3xl sm:text-4xl font-black mb-4">
              Up to 50% Off<br />
              <span className="text-purple-200">Summer Collection</span>
            </h3>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-purple-50 transition-colors"
            >
              Shop Deals <ArrowRight size={14} />
            </Link>
          </div>
          <div className="absolute right-0 top-0 w-64 h-full opacity-10">
            <div className="w-96 h-96 bg-white rounded-full absolute -right-20 -top-20" />
            <div className="w-64 h-64 bg-white rounded-full absolute -right-10 bottom-0" />
          </div>
        </motion.div>
      </section>

      {/* ── Trending ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-7"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Trending Now</h2>
            <p className="text-gray-500 text-sm mt-1">What everyone&apos;s loving</p>
          </div>
          <Link href="/shop" className="text-purple-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View All <ChevronRight size={14} />
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {trending.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* ── Customer Reviews ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <div className="flex justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />)}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Our Customers Say</h2>
          <p className="text-gray-500 text-sm mt-2">Real reviews from verified buyers</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { name: 'Sarah Mitchell', location: 'New York, US', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', rating: 5, product: 'Vitamin C Serum', text: 'Absolutely love this serum! My skin has never looked better. The packaging is premium and it arrived super fast. Will definitely be ordering again.', date: 'Jun 14, 2026' },
            { name: 'James Okafor', location: 'London, UK', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', rating: 5, product: 'Smart Watch Series X', text: 'The watch is stunning — the build quality blew me away for the price. Battery lasts a full week with normal use. ShopSphere is now my go-to for electronics.', date: 'Jun 10, 2026' },
            { name: 'Priya Nair', location: 'Sydney, AU', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face', rating: 5, product: 'Yoga Mat Premium', text: 'The grip is incredible and it has held up through 3 months of daily hot yoga. The alignment lines are actually useful. Worth every cent.', date: 'May 29, 2026' },
            { name: 'Carlos Rivera', location: 'Toronto, CA', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', rating: 4, product: 'Pro Gym Duffle Bag', text: 'Huge bag with great compartments. The shoe pocket is a game-changer. Only minor thing is I wish it came in more colours, but overall a fantastic buy.', date: 'Jun 1, 2026' },
            { name: 'Aisha Patel', location: 'Dubai, UAE', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face', rating: 5, product: 'Modern Accent Chair', text: 'This chair transformed my living room. The velvet is incredibly soft and the colour is exactly as shown. Assembly took 10 minutes. Delivery was faster than expected!', date: 'May 20, 2026' },
            { name: 'Daniel Lee', location: 'Seoul, KR', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', rating: 5, product: 'AirPods Pro Headphones', text: 'Insane noise cancellation. I wear these on my commute daily and I forget the rest of the world exists. Sound quality is crisp and the mic is clear on calls.', date: 'Jun 18, 2026' },
          ].map((r, i) => (
            <motion.div key={r.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={r.avatar} alt={r.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.location}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => <Star key={j} size={11} className={j < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />)}
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed flex-1">"{r.text}"</p>
              <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                <span className="text-xs font-medium text-purple-600">{r.product}</span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Verified · {r.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Loved by 50,000+ customers</h3>
            <p className="text-gray-500 max-w-lg mx-auto text-sm">
              Join our growing community of happy shoppers and discover why ShopSphere is the #1 rated lifestyle store.
            </p>
            <div className="grid grid-cols-3 gap-8 mt-12 max-w-xl mx-auto">
              {[
                { label: 'Happy Customers', value: '50K+' },
                { label: 'Products', value: '10K+' },
                { label: 'Countries', value: '120+' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-3xl font-black text-purple-600">{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
