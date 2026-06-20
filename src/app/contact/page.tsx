'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageCircle } from 'lucide-react';

const contacts = [
  { icon: Mail, label: 'Email', val: 'support@shopsphere.com', sub: 'We reply within 24 hours' },
  { icon: Phone, label: 'Phone', val: '+1 (800) 555-0192', sub: 'Mon–Fri, 9am–6pm EST' },
  { icon: MapPin, label: 'Address', val: '123 Commerce Ave, Suite 400', sub: 'New York, NY 10001' },
  { icon: Clock, label: 'Support Hours', val: 'Mon–Fri: 9am–6pm EST', sub: 'Sat: 10am–4pm EST' },
];

const topics = ['Order Issue', 'Return / Refund', 'Shipping Question', 'Product Inquiry', 'Technical Support', 'Partnership', 'Other'];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-700 to-indigo-700 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={26} className="text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl font-black text-white mb-3">Contact Us</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-purple-200">Our support team is here to help. Expect a reply within 24 hours.</motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            {contacts.map((c, i) => (
              <motion.div key={c.label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <c.icon size={17} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400">{c.label}</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{c.val}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-sm">Thanks, {form.name.split(' ')[0]}. We'll get back to you at {form.email} within 24 hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', topic: '', message: '' }); }}
                    className="mt-6 text-purple-600 text-sm font-semibold hover:underline">Send another message</button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="font-bold text-gray-900 mb-4">Send a Message</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                      <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Jane Smith"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                      <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="jane@example.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Topic</label>
                    <select required value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-colors text-gray-700">
                      <option value="">Select a topic...</option>
                      {topics.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message</label>
                    <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      rows={5} placeholder="Describe your issue or question in detail..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-colors resize-none" />
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                    {loading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      <><Send size={14} /> Send Message</>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
