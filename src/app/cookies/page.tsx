'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cookie, CheckCircle } from 'lucide-react';

const cookieTypes = [
  {
    name: 'Essential Cookies',
    required: true,
    desc: 'These cookies are necessary for the website to function and cannot be disabled. They include session management, security tokens, and shopping cart persistence.',
    examples: ['Session ID', 'CSRF token', 'Cart state', 'Authentication token'],
  },
  {
    name: 'Analytics Cookies',
    required: false,
    desc: 'Help us understand how visitors interact with our website by collecting anonymous data. We use this to improve page performance and user experience.',
    examples: ['Google Analytics', 'Page view tracking', 'Click heatmaps', 'Funnel analysis'],
  },
  {
    name: 'Preference Cookies',
    required: false,
    desc: 'Remember your settings and preferences to personalise your experience across visits.',
    examples: ['Language preference', 'Currency setting', 'Recently viewed products', 'Wishlist items'],
  },
  {
    name: 'Marketing Cookies',
    required: false,
    desc: 'Used to track visitors across websites to display relevant advertising and measure campaign effectiveness.',
    examples: ['Retargeting pixels', 'Ad click tracking', 'Social media embeds', 'Affiliate attribution'],
  },
];

const faq = [
  { q: 'What is a cookie?', a: 'A cookie is a small text file stored on your device by your browser when you visit a website. It allows the site to remember information about your visit.' },
  { q: 'How long do cookies last?', a: 'Session cookies expire when you close your browser. Persistent cookies last from a few days to several years depending on their purpose.' },
  { q: 'Can I disable cookies?', a: 'You can disable non-essential cookies via your browser settings or our preference panel. Note that disabling essential cookies will affect site functionality.' },
  { q: 'Do third parties set cookies?', a: 'Yes, some cookies are set by trusted third-party services (analytics, payment processors) under their own privacy policies.' },
];

export default function CookiesPage() {
  const [prefs, setPrefs] = useState({ analytics: true, preference: true, marketing: false });
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-700 to-indigo-700 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Cookie size={26} className="text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl font-black text-white mb-3">Cookie Policy</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-purple-200 text-sm">Last updated: June 1, 2026</motion.p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        {/* Intro */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm text-gray-500 leading-relaxed">
            ShopSphere uses cookies and similar technologies to improve your browsing experience, analyse site traffic, and personalise content. This policy explains what cookies we use and how you can manage them.
          </p>
        </motion.div>

        {/* Cookie types */}
        <div className="space-y-4">
          {cookieTypes.map((ct, i) => (
            <motion.div key={ct.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{ct.name}</h3>
                  {ct.required && <span className="text-xs bg-purple-100 text-purple-600 font-bold px-2 py-0.5 rounded-full">Always Active</span>}
                </div>
                {!ct.required && (
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input type="checkbox"
                      checked={ct.name === 'Analytics Cookies' ? prefs.analytics : ct.name === 'Preference Cookies' ? prefs.preference : prefs.marketing}
                      onChange={e => {
                        const key = ct.name === 'Analytics Cookies' ? 'analytics' : ct.name === 'Preference Cookies' ? 'preference' : 'marketing';
                        setPrefs(p => ({ ...p, [key]: e.target.checked }));
                      }}
                      className="sr-only peer" />
                    <div className="w-10 h-6 bg-gray-200 peer-checked:bg-purple-600 rounded-full transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">{ct.desc}</p>
              <div className="flex flex-wrap gap-2">
                {ct.examples.map(ex => (
                  <span key={ex} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{ex}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Save preferences */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-500">Update your cookie preferences at any time.</p>
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}>
            {saved ? <><CheckCircle size={14} /> Saved!</> : 'Save Preferences'}
          </button>
        </motion.div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Common Questions</h2>
          <div className="space-y-4">
            {faq.map(f => (
              <div key={f.q}>
                <p className="text-sm font-semibold text-gray-900 mb-1">{f.q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="text-center text-sm text-gray-400 pt-2">
          Questions? <a href="/contact" className="text-purple-600 font-semibold hover:underline">Contact us →</a>
        </p>
      </div>
    </div>
  );
}
