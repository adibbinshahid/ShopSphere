'use client';
import { motion } from 'framer-motion';
import { Truck, Clock, Globe, Package, ShieldCheck, AlertCircle } from 'lucide-react';

const methods = [
  { name: 'Standard Shipping', time: '3–5 Business Days', price: '$4.99', free: 'Free on orders $75+', icon: Truck },
  { name: 'Express Shipping', time: '1–2 Business Days', price: '$12.99', free: 'Free on orders $150+', icon: Clock },
  { name: 'International', time: '7–14 Business Days', price: 'From $14.99', free: 'Rates vary by country', icon: Globe },
  { name: 'Same-Day Delivery', time: 'Same Day (order by 12pm)', price: '$19.99', free: 'Select cities only', icon: Package },
];

const sections = [
  {
    icon: Truck,
    title: 'Processing Time',
    body: 'Orders are processed within 1–2 business days (Monday–Friday, excluding public holidays). Orders placed after 2pm EST will begin processing the next business day. You will receive a confirmation email with tracking details as soon as your order ships.',
  },
  {
    icon: Globe,
    title: 'International Shipping',
    body: 'We ship to 120+ countries worldwide. International orders may be subject to customs duties, taxes, and fees upon arrival — these are the responsibility of the recipient. ShopSphere is not responsible for delays caused by customs processing.',
  },
  {
    icon: ShieldCheck,
    title: 'Order Protection',
    body: 'Every order is insured during transit. If your package is lost or arrives damaged, contact us within 7 days of the expected delivery date and we\'ll reship or issue a full refund at no extra cost.',
  },
  {
    icon: AlertCircle,
    title: 'Delivery Issues',
    body: 'If your tracking shows "delivered" but you haven\'t received your package, check with neighbours and your building\'s mail area first. If still missing, contact us within 5 business days and we will open an investigation with the carrier.',
  },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-700 to-indigo-700 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Truck size={26} className="text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl font-black text-white mb-3">Shipping Policy</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-purple-200">Fast, reliable delivery to your door. Last updated: January 2026</motion.p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {/* Shipping methods */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Options</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {methods.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                    <m.icon size={16} className="text-purple-600" />
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{m.name}</span>
                </div>
                <p className="text-2xl font-black text-purple-600 mb-1">{m.price}</p>
                <p className="text-xs text-gray-500">{m.time}</p>
                <p className="text-xs text-green-600 font-semibold mt-1">{m.free}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Policy sections */}
        <div className="space-y-4">
          {sections.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                  <s.icon size={16} className="text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900">{s.title}</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400">
          Questions about your shipment?{' '}
          <a href="/contact" className="text-purple-600 font-semibold hover:underline">Contact us →</a>
        </p>
      </div>
    </div>
  );
}
