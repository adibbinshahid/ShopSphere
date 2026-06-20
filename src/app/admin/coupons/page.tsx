'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Tag, Zap, Copy, Check } from 'lucide-react';

interface Coupon {
  id: number; code: string; type: 'percent' | 'fixed'; value: number;
  minOrder: number; uses: number; maxUses: number; expiry: string;
  status: 'Active' | 'Expired' | 'Scheduled';
}

interface Deal {
  id: number; title: string; category: string; discount: number;
  startDate: string; endDate: string; status: 'Active' | 'Ended' | 'Upcoming';
}

const initCoupons: Coupon[] = [
  { id: 1, code: 'SAVE10', type: 'percent', value: 10, minOrder: 0, uses: 342, maxUses: 1000, expiry: '2026-12-31', status: 'Active' },
  { id: 2, code: 'WELCOME20', type: 'percent', value: 20, minOrder: 50, uses: 891, maxUses: 2000, expiry: '2026-06-30', status: 'Active' },
  { id: 3, code: 'FLAT15', type: 'fixed', value: 15, minOrder: 75, uses: 123, maxUses: 500, expiry: '2026-03-01', status: 'Scheduled' },
  { id: 4, code: 'SUMMER50', type: 'percent', value: 50, minOrder: 100, uses: 2000, maxUses: 2000, expiry: '2025-09-01', status: 'Expired' },
];

const initDeals: Deal[] = [
  { id: 1, title: 'Summer Clearance', category: 'Fashion', discount: 40, startDate: '2026-06-01', endDate: '2026-06-30', status: 'Active' },
  { id: 2, title: 'Tech Flash Sale', category: 'Electronics', discount: 25, startDate: '2026-06-20', endDate: '2026-06-21', status: 'Active' },
  { id: 3, title: 'Beauty Week', category: 'Beauty', discount: 30, startDate: '2026-07-01', endDate: '2026-07-07', status: 'Upcoming' },
  { id: 4, title: 'Spring Home Deals', category: 'Home & Living', discount: 20, startDate: '2026-03-01', endDate: '2026-03-31', status: 'Ended' },
];

const statusColor: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Expired: 'bg-gray-100 text-gray-500',
  Ended: 'bg-gray-100 text-gray-500',
  Scheduled: 'bg-blue-100 text-blue-700',
  Upcoming: 'bg-yellow-100 text-yellow-700',
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initCoupons);
  const [deals, setDeals] = useState<Deal[]>(initDeals);
  const [tab, setTab] = useState<'coupons' | 'deals'>('coupons');
  const [modal, setModal] = useState(false);
  const [dealModal, setDealModal] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Coupon>>({ type: 'percent', status: 'Active', maxUses: 1000, uses: 0 });
  const [dealForm, setDealForm] = useState<Partial<Deal>>({ status: 'Active', discount: 10 });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  const addCoupon = () => {
    if (!form.code || !form.value) return;
    setCoupons(prev => [...prev, { ...form, id: Date.now(), uses: 0 } as Coupon]);
    setModal(false); setForm({ type: 'percent', status: 'Active', maxUses: 1000, uses: 0 });
  };

  const addDeal = () => {
    if (!dealForm.title) return;
    setDeals(prev => [...prev, { ...dealForm, id: Date.now() } as Deal]);
    setDealModal(false); setDealForm({ status: 'Active', discount: 10 });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Coupons & Deals</h1>
          <p className="text-gray-500 text-sm">Manage promotions and discount codes</p>
        </div>
        <button onClick={() => tab === 'coupons' ? setModal(true) : setDealModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Plus size={16} /> Add {tab === 'coupons' ? 'Coupon' : 'Deal'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl p-1 w-fit">
        {(['coupons', 'deals'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${tab === t ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            {t === 'coupons' ? <><Tag size={14} className="inline mr-1.5" />Coupons ({coupons.length})</> : <><Zap size={14} className="inline mr-1.5" />Deals ({deals.length})</>}
          </button>
        ))}
      </div>

      {tab === 'coupons' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className={`px-5 py-4 ${c.status === 'Active' ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <p className={`font-black text-lg tracking-widest ${c.status === 'Active' ? 'text-white' : 'text-gray-500'}`}>{c.code}</p>
                  <button onClick={() => copyCode(c.code)} className={`p-1.5 rounded-lg ${c.status === 'Active' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-300 text-gray-600'} transition-colors`}>
                    {copied === c.code ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>
                <p className={`text-sm font-semibold mt-1 ${c.status === 'Active' ? 'text-purple-100' : 'text-gray-400'}`}>
                  {c.type === 'percent' ? `${c.value}% OFF` : `$${c.value} OFF`}
                  {c.minOrder > 0 ? ` (min $${c.minOrder})` : ''}
                </p>
              </div>
              <div className="px-5 py-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Uses: {c.uses}/{c.maxUses}</span>
                  <span className={`px-2 py-0.5 rounded-full font-semibold ${statusColor[c.status]}`}>{c.status}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(c.uses / c.maxUses) * 100}%` }} />
                </div>
                <p className="text-xs text-gray-400">Expires: {c.expiry}</p>
                <div className="flex justify-end">
                  <button onClick={() => setCoupons(prev => prev.filter(x => x.id !== c.id))}
                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'deals' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Deal', 'Category', 'Discount', 'Period', 'Status', ''].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {deals.map(d => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4"><p className="text-sm font-semibold text-gray-900">{d.title}</p></td>
                  <td className="px-5 py-4"><span className="bg-purple-50 text-purple-700 text-xs font-medium px-2 py-1 rounded-lg">{d.category}</span></td>
                  <td className="px-5 py-4"><span className="text-sm font-black text-red-500">{d.discount}% OFF</span></td>
                  <td className="px-5 py-4"><p className="text-xs text-gray-500">{d.startDate} → {d.endDate}</p></td>
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[d.status]}`}>{d.status}</span></td>
                  <td className="px-5 py-4">
                    <button onClick={() => setDeals(prev => prev.filter(x => x.id !== d.id))}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Coupon Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(false)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">New Coupon</h2>
                  <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={16} /></button>
                </div>
                <div className="p-6 space-y-4">
                  {[['code', 'Coupon Code (e.g. SAVE10)'], ['value', 'Discount Value'], ['minOrder', 'Min Order ($)'], ['maxUses', 'Max Uses'], ['expiry', 'Expiry Date']].map(([f, label]) => (
                    <div key={f}>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                      <input type={f === 'expiry' ? 'date' : f === 'code' ? 'text' : 'number'} value={(form as Record<string, string | number>)[f] ?? ''}
                        onChange={e => setForm({ ...form, [f]: f === 'code' ? e.target.value.toUpperCase() : Number(e.target.value) || e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Type</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400">
                      <option value="percent">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 px-6 pb-6">
                  <button onClick={() => setModal(false)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={addCoupon} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors">Create Coupon</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Deal Modal */}
      <AnimatePresence>
        {dealModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDealModal(false)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">New Deal</h2>
                  <button onClick={() => setDealModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={16} /></button>
                </div>
                <div className="p-6 space-y-4">
                  {[['title', 'Deal Title', 'text'], ['discount', 'Discount %', 'number'], ['startDate', 'Start Date', 'date'], ['endDate', 'End Date', 'date']].map(([f, label, type]) => (
                    <div key={f}>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                      <input type={type} value={(dealForm as Record<string, string | number>)[f] ?? ''}
                        onChange={e => setDealForm({ ...dealForm, [f]: type === 'number' ? Number(e.target.value) : e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                    <select value={dealForm.category ?? ''} onChange={e => setDealForm({ ...dealForm, category: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400">
                      {['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'All Categories'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 px-6 pb-6">
                  <button onClick={() => setDealModal(false)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={addDeal} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors">Create Deal</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
