'use client';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';

const steps = [
  { n: '01', title: 'Initiate Return', desc: 'Visit the Track Order page or contact support with your order number to start a return request.' },
  { n: '02', title: 'Pack Your Item', desc: 'Place the item in its original packaging with all tags attached. Include the return slip inside the package.' },
  { n: '03', title: 'Ship It Back', desc: 'Use the prepaid return label emailed to you (for eligible returns) or ship via any carrier at your cost.' },
  { n: '04', title: 'Get Your Refund', desc: 'Once received and inspected, your refund is processed within 2–3 business days to your original payment method.' },
];

const eligible = [
  'Unused items in original packaging',
  'Items with all tags attached',
  'Defective or damaged products',
  'Wrong item received',
  'Items returned within 30 days of delivery',
];

const ineligible = [
  'Used, washed, or worn items',
  'Items without original packaging',
  'Personalised or custom orders',
  'Perishable goods',
  'Items returned after 30 days',
  'Gift cards and digital downloads',
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-700 to-indigo-700 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RotateCcw size={26} className="text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl font-black text-white mb-3">Return Policy</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-purple-200">30-day hassle-free returns. No questions asked. Last updated: January 2026</motion.p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {/* Summary cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4">
          {[
            { icon: Clock, label: 'Return Window', val: '30 Days' },
            { icon: CheckCircle, label: 'Refund Time', val: '2–3 Days' },
            { icon: RotateCcw, label: 'Free Exchanges', val: 'Always' },
          ].map(({ icon: Icon, label, val }, i) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Icon size={18} className="text-purple-600" />
              </div>
              <p className="text-xl font-black text-gray-900">{val}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Steps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">How to Return</h2>
          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.07 }}
                className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                  {s.n}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{s.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Eligible / Ineligible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" /> Eligible for Return
            </h3>
            <ul className="space-y-2">
              {eligible.map(e => (
                <li key={e} className="flex items-start gap-2 text-sm text-gray-500">
                  <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" /> {e}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <XCircle size={16} className="text-red-400" /> Not Eligible
            </h3>
            <ul className="space-y-2">
              {ineligible.map(e => (
                <li key={e} className="flex items-start gap-2 text-sm text-gray-500">
                  <XCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" /> {e}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <p className="text-center text-sm text-gray-400">
          Need to start a return?{' '}
          <a href="/contact" className="text-purple-600 font-semibold hover:underline">Contact support →</a>
        </p>
      </div>
    </div>
  );
}
