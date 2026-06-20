'use client';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Share2, Trash2, Mail } from 'lucide-react';

const sections = [
  {
    icon: Eye,
    title: '1. Information We Collect',
    body: [
      'Personal information you provide when creating an account (name, email, phone number, billing and shipping address).',
      'Payment information processed securely by our PCI-compliant payment partners. We never store full card numbers.',
      'Order history, browsing behaviour, wishlist items, and product reviews you submit.',
      'Device information, IP address, browser type, and usage data collected automatically via cookies and analytics tools.',
      'Communications you send us via email, chat, or our contact forms.',
    ],
  },
  {
    icon: Share2,
    title: '2. How We Use Your Information',
    body: [
      'Process and fulfil orders, including sending shipping and delivery notifications.',
      'Manage your account and provide customer support.',
      'Send transactional emails (order confirmations, receipts, return updates).',
      'Send promotional communications — only with your consent, which you can withdraw at any time.',
      'Improve our website, personalise your experience, and conduct internal analytics.',
      'Prevent fraud, enforce our terms, and comply with legal obligations.',
    ],
  },
  {
    icon: Share2,
    title: '3. Information Sharing',
    body: [
      'We do not sell, rent, or trade your personal data to third parties.',
      'We share data with trusted service providers (payment processors, shipping carriers, analytics platforms) under strict data processing agreements.',
      'We may disclose information when required by law, court order, or to protect the rights and safety of ShopSphere and its users.',
      'In the event of a merger or acquisition, your data may be transferred as part of business assets with prior notice.',
    ],
  },
  {
    icon: Lock,
    title: '4. Data Security',
    body: [
      'We use 256-bit SSL/TLS encryption for all data transmitted between your browser and our servers.',
      'Payment data is processed by Stripe and never touches our servers in unencrypted form.',
      'Access to personal data is restricted to authorised personnel on a need-to-know basis.',
      'We conduct regular security audits and penetration testing.',
      'In the event of a data breach, we will notify affected users within 72 hours as required by applicable law.',
    ],
  },
  {
    icon: Trash2,
    title: '5. Data Retention & Deletion',
    body: [
      'We retain account data for as long as your account is active or as needed to provide services.',
      'Order records are retained for 7 years for legal and tax compliance purposes.',
      'You may request deletion of your account and personal data at any time via our Contact page.',
      'Some data may be retained in anonymised or aggregated form for analytics after deletion.',
    ],
  },
  {
    icon: Mail,
    title: '6. Your Rights',
    body: [
      'Access: You may request a copy of the personal data we hold about you.',
      'Rectification: You may correct inaccurate or incomplete data via your account settings.',
      'Erasure: You may request deletion of your personal data ("right to be forgotten").',
      'Portability: You may request your data in a structured, machine-readable format.',
      'Objection: You may object to processing of your data for marketing purposes at any time.',
      'To exercise any of these rights, contact privacy@shopsphere.com.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-700 to-indigo-700 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={26} className="text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl font-black text-white mb-3">Privacy Policy</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-purple-200 text-sm">Effective date: January 1, 2026 · Last updated: June 1, 2026</motion.p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm text-gray-500 leading-relaxed">
            ShopSphere (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase. Please read this policy carefully.
          </p>
        </motion.div>

        {sections.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <s.icon size={16} className="text-purple-600" />
              </div>
              <h2 className="font-bold text-gray-900">{s.title}</h2>
            </div>
            <ul className="space-y-2">
              {s.body.map((b, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-500 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        <p className="text-center text-sm text-gray-400 pt-2">
          Questions? <a href="/contact" className="text-purple-600 font-semibold hover:underline">Contact us →</a>
        </p>
      </div>
    </div>
  );
}
