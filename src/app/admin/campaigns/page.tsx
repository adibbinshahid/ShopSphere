'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Megaphone, Mail, Share2, TrendingUp, Eye, MousePointer, ShoppingCart } from 'lucide-react';

interface Campaign {
  id: number; name: string; type: 'Email' | 'Social' | 'Push';
  status: 'Active' | 'Draft' | 'Ended' | 'Scheduled';
  sent: number; opens: number; clicks: number; conversions: number;
  budget: number; spent: number; startDate: string; endDate: string;
  subject: string;
}

const initCampaigns: Campaign[] = [
  { id: 1, name: 'Summer Sale Announcement', type: 'Email', status: 'Active', sent: 12400, opens: 4836, clicks: 1488, conversions: 312, budget: 500, spent: 280, startDate: '2026-06-01', endDate: '2026-06-30', subject: '🔥 Up to 50% off this summer!' },
  { id: 2, name: 'New Arrivals Drop', type: 'Social', status: 'Active', sent: 85000, opens: 34000, clicks: 6200, conversions: 890, budget: 1200, spent: 980, startDate: '2026-06-10', endDate: '2026-06-25', subject: 'New arrivals you\'ll love' },
  { id: 3, name: 'Abandoned Cart Recovery', type: 'Email', status: 'Active', sent: 3200, opens: 1920, clicks: 864, conversions: 234, budget: 0, spent: 0, startDate: '2026-01-01', endDate: '2026-12-31', subject: 'You left something behind 🛒' },
  { id: 4, name: 'Flash Sale Alert', type: 'Push', status: 'Scheduled', sent: 0, opens: 0, clicks: 0, conversions: 0, budget: 200, spent: 0, startDate: '2026-06-25', endDate: '2026-06-26', subject: '⚡ 24hr flash sale starts NOW' },
  { id: 5, name: 'Spring Collection', type: 'Email', status: 'Ended', sent: 9800, opens: 3136, clicks: 784, conversions: 156, budget: 400, spent: 400, startDate: '2026-03-01', endDate: '2026-03-31', subject: 'Spring is here 🌸' },
];

const statusColor: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Draft: 'bg-gray-100 text-gray-500',
  Ended: 'bg-gray-100 text-gray-500',
  Scheduled: 'bg-blue-100 text-blue-700',
};

const typeIcon: Record<string, React.ElementType> = { Email: Mail, Social: Share2, Push: Megaphone };
const typeColor: Record<string, string> = { Email: 'bg-blue-100 text-blue-600', Social: 'bg-pink-100 text-pink-600', Push: 'bg-orange-100 text-orange-600' };

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initCampaigns);
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState<'All' | Campaign['status']>('All');
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [form, setForm] = useState<Partial<Campaign>>({ type: 'Email', status: 'Draft' });

  const filtered = filter === 'All' ? campaigns : campaigns.filter(c => c.status === filter);

  const totals = campaigns.reduce((acc, c) => ({
    sent: acc.sent + c.sent, opens: acc.opens + c.opens,
    clicks: acc.clicks + c.clicks, conversions: acc.conversions + c.conversions,
  }), { sent: 0, opens: 0, clicks: 0, conversions: 0 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Campaigns</h1>
          <p className="text-gray-500 text-sm">Manage email, social & push campaigns</p>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sent', value: totals.sent.toLocaleString(), icon: Mail, color: 'text-blue-500 bg-blue-50' },
          { label: 'Total Opens', value: totals.opens.toLocaleString(), icon: Eye, color: 'text-purple-500 bg-purple-50' },
          { label: 'Total Clicks', value: totals.clicks.toLocaleString(), icon: MousePointer, color: 'text-green-500 bg-green-50' },
          { label: 'Conversions', value: totals.conversions.toLocaleString(), icon: ShoppingCart, color: 'text-orange-500 bg-orange-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.split(' ')[1]}`}>
              <Icon size={18} className={color.split(' ')[0]} />
            </div>
            <div>
              <p className="text-xl font-black text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['All', 'Active', 'Scheduled', 'Draft', 'Ended'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${filter === f ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Campaign cards */}
      <div className="space-y-3">
        {filtered.map((c, i) => {
          const Icon = typeIcon[c.type];
          const openRate = c.sent > 0 ? Math.round((c.opens / c.sent) * 100) : 0;
          const ctr = c.opens > 0 ? Math.round((c.clicks / c.opens) * 100) : 0;
          return (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:border-purple-200 transition-colors"
              onClick={() => setSelected(c)}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColor[c.type]}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[c.status]}`}>{c.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{c.subject}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.startDate} → {c.endDate}</p>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  {[
                    { label: 'Sent', value: c.sent.toLocaleString() },
                    { label: 'Open Rate', value: `${openRate}%` },
                    { label: 'CTR', value: `${ctr}%` },
                    { label: 'Conv.', value: c.conversions },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-sm font-black text-gray-900">{value}</p>
                      <p className="text-xs text-gray-400">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>Budget: ${c.budget}</p>
                  <p>Spent: <span className="font-semibold text-gray-700">${c.spent}</span></p>
                </div>
              </div>
              {c.sent > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[{ label: 'Open Rate', val: openRate, color: '#9333ea' }, { label: 'CTR', val: ctr, color: '#6366f1' }, { label: 'Conv. Rate', val: c.sent > 0 ? Math.round((c.conversions / c.sent) * 100) : 0, color: '#10b981' }].map(({ label, val, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">{label}</span><span className="font-bold" style={{ color }}>{val}%</span></div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.min(val, 100)}%`, background: color }} /></div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* New Campaign Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(false)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">New Campaign</h2>
                  <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={16} /></button>
                </div>
                <div className="p-6 space-y-4">
                  {[['name', 'Campaign Name', 'text'], ['subject', 'Subject / Message', 'text'], ['budget', 'Budget ($)', 'number'], ['startDate', 'Start Date', 'date'], ['endDate', 'End Date', 'date']].map(([f, label, type]) => (
                    <div key={f}>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                      <input type={type} value={(form as Record<string, string | number>)[f] ?? ''}
                        onChange={e => setForm({ ...form, [f]: type === 'number' ? Number(e.target.value) : e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Type</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Campaign['type'] })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400">
                      <option>Email</option><option>Social</option><option>Push</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Campaign['status'] })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400">
                      <option>Draft</option><option>Scheduled</option><option>Active</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 px-6 pb-6">
                  <button onClick={() => setModal(false)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={() => {
                    if (!form.name) return;
                    setCampaigns(prev => [...prev, { ...form, id: Date.now(), sent: 0, opens: 0, clicks: 0, conversions: 0, spent: 0 } as Campaign]);
                    setModal(false);
                  }} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors">Create Campaign</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
              <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">{selected.name}</h2>
                  <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={16} /></button>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  {[
                    { label: 'Sent', value: selected.sent.toLocaleString() },
                    { label: 'Opens', value: selected.opens.toLocaleString() },
                    { label: 'Clicks', value: selected.clicks.toLocaleString() },
                    { label: 'Conversions', value: selected.conversions },
                    { label: 'Open Rate', value: `${selected.sent > 0 ? Math.round((selected.opens / selected.sent) * 100) : 0}%` },
                    { label: 'CTR', value: `${selected.opens > 0 ? Math.round((selected.clicks / selected.opens) * 100) : 0}%` },
                    { label: 'Budget', value: `$${selected.budget}` },
                    { label: 'Spent', value: `$${selected.spent}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="text-lg font-black text-gray-900 mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
