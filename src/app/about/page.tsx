'use client';
import { motion } from 'framer-motion';
import { Shield, Heart, Globe, Award } from 'lucide-react';

const values = [
  { icon: Shield, title: 'Trust & Security', desc: 'Your data and payments are always protected with enterprise-grade encryption.' },
  { icon: Heart, title: 'Customer First', desc: 'Every decision we make starts with what\'s best for our community.' },
  { icon: Globe, title: 'Sustainable', desc: 'We partner with eco-conscious brands and offset our carbon footprint.' },
  { icon: Award, title: 'Quality Guaranteed', desc: 'Every product is curated and tested before it hits our shelves.' },
];

const team = [
  { name: 'Alex Rivera', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' },
  { name: 'Maya Chen', role: 'Head of Design', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face' },
  { name: 'Jordan Taylor', role: 'CTO', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
  { name: 'Priya Sharma', role: 'Head of Product', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face' },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-purple-700 to-indigo-800 text-white py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ staggerChildren: 0.1 }}>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-purple-200 text-sm font-medium mb-3 uppercase tracking-widest">About Us</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-6xl font-black mb-6">
              We&apos;re on a mission to<br />
              <span className="text-purple-200">redefine shopping.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-purple-100 text-lg max-w-xl mx-auto">
              ShopSphere was founded in 2021 with a single vision: make premium lifestyle products accessible to everyone, everywhere.
            </motion.p>
          </motion.div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-40 -top-40 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -left-20 bottom-0 w-64 h-64 bg-white/5 rounded-full" />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Happy Customers', value: '50,000+' },
            { label: 'Products', value: '10,000+' },
            { label: 'Countries', value: '120+' },
            { label: 'Years', value: '5+' },
          ].map(({ label, value }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <p className="text-3xl sm:text-4xl font-black text-purple-600">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-black text-gray-900 text-center mb-10">
          Our Core Values
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon size={22} className="text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-black text-gray-900 text-center mb-10">
            Meet the Team
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {team.map(({ name, role, img }, i) => (
              <motion.div key={name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center">
                <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden mb-3 bg-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={name} className="w-full h-full object-cover" />
                </div>
                <p className="font-bold text-gray-900 text-sm">{name}</p>
                <p className="text-xs text-gray-500">{role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
