'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';

const faqs = [
  {
    category: 'Orders',
    items: [
      { q: 'How do I place an order?', a: 'Browse products, click "Add to Cart", and proceed to checkout. You\'ll receive a confirmation email once your order is placed successfully.' },
      { q: 'Can I modify or cancel my order?', a: 'Orders can be modified or cancelled within 1 hour of placement. Contact our support team immediately via the Contact Us page.' },
      { q: 'How do I track my order?', a: 'Use the Track Order page with your order number and email address. You\'ll also receive tracking updates via email at each stage.' },
      { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, Google Pay, and ShopSphere Gift Cards.' },
    ],
  },
  {
    category: 'Shipping',
    items: [
      { q: 'How long does delivery take?', a: 'Standard shipping takes 3–5 business days. Express shipping (1–2 days) is available at checkout for an additional fee.' },
      { q: 'Do you ship internationally?', a: 'Yes, we ship to 120+ countries. International delivery typically takes 7–14 business days depending on destination.' },
      { q: 'Is free shipping available?', a: 'Free standard shipping on all orders over $75. Orders under $75 have a flat $4.99 shipping fee.' },
      { q: 'What happens if my package is lost?', a: 'If your package hasn\'t arrived within 10 business days, contact us. We\'ll investigate and either reship or issue a full refund.' },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return policy. Items must be unused, in original packaging, with all tags attached.' },
      { q: 'How long do refunds take?', a: 'Refunds are processed within 2–3 business days of receiving your return. It may take an additional 3–5 days to appear on your statement.' },
      { q: 'Can I exchange an item?', a: 'Yes, exchanges are free for size or colour changes. Initiate an exchange via the Return Policy page or contact our support team.' },
      { q: 'Who pays return shipping?', a: 'We provide a prepaid return label for defective or incorrect items. For change-of-mind returns, a $5.99 return label fee is deducted from your refund.' },
    ],
  },
  {
    category: 'Account & Privacy',
    items: [
      { q: 'How do I create an account?', a: 'Click the person icon in the top navigation and select "Sign Up". Creating an account lets you track orders, save addresses, and earn loyalty points.' },
      { q: 'Is my payment information secure?', a: 'Absolutely. We use 256-bit SSL encryption and never store your full card details. All payments are processed through PCI-compliant gateways.' },
      { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page. You\'ll receive a reset link via email within a few minutes.' },
      { q: 'Can I delete my account?', a: 'Yes. Contact our support team and we\'ll delete your account and all associated data within 30 days in accordance with GDPR.' },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left gap-4">
        <span className={`text-sm font-semibold transition-colors ${open ? 'text-purple-600' : 'text-gray-900'}`}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
          <ChevronDown size={16} className={open ? 'text-purple-600' : 'text-gray-400'} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-gray-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState('');

  const filtered = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(i =>
      i.q.toLowerCase().includes(search.toLowerCase()) ||
      i.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-700 to-indigo-700 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-white mb-3">
            Frequently Asked Questions
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-purple-200 mb-8">
            Find answers to the most common questions about ShopSphere.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none shadow-lg"
            />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No results for "{search}"</p>
        ) : (
          filtered.map((cat, i) => (
            <motion.div key={cat.category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6">
              <h2 className="text-xs font-bold text-purple-600 uppercase tracking-wider pt-5 pb-2">{cat.category}</h2>
              {cat.items.map(item => <AccordionItem key={item.q} q={item.q} a={item.a} />)}
            </motion.div>
          ))
        )}

        <p className="text-center text-sm text-gray-400 pt-4">
          Still have questions?{' '}
          <a href="/contact" className="text-purple-600 font-semibold hover:underline">Contact our support team →</a>
        </p>
      </div>
    </div>
  );
}
