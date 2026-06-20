'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, MapPin, Search } from 'lucide-react';

const DUMMY_ORDERS: Record<string, {
  status: string; product: string; date: string; eta: string;
  steps: { label: string; time: string; done: boolean; active: boolean }[];
}> = {
  'SS-10042': {
    status: 'In Transit',
    product: 'AirPods Pro Wireless Headphones',
    date: 'Jun 18, 2026',
    eta: 'Jun 23, 2026',
    steps: [
      { label: 'Order Placed', time: 'Jun 18, 9:04am', done: true, active: false },
      { label: 'Processing', time: 'Jun 18, 11:30am', done: true, active: false },
      { label: 'Shipped', time: 'Jun 19, 2:15pm', done: true, active: false },
      { label: 'In Transit', time: 'Jun 20, 8:00am', done: true, active: true },
      { label: 'Delivered', time: 'Estimated Jun 23', done: false, active: false },
    ],
  },
  'SS-10078': {
    status: 'Delivered',
    product: 'Smart Watch Series X',
    date: 'Jun 14, 2026',
    eta: 'Jun 18, 2026',
    steps: [
      { label: 'Order Placed', time: 'Jun 14, 3:22pm', done: true, active: false },
      { label: 'Processing', time: 'Jun 14, 5:00pm', done: true, active: false },
      { label: 'Shipped', time: 'Jun 15, 10:00am', done: true, active: false },
      { label: 'In Transit', time: 'Jun 16, 7:30am', done: true, active: false },
      { label: 'Delivered', time: 'Jun 18, 1:45pm', done: true, active: true },
    ],
  },
  'SS-10093': {
    status: 'Processing',
    product: 'Yoga Mat Premium + Pro Gym Duffle Bag',
    date: 'Jun 21, 2026',
    eta: 'Jun 26, 2026',
    steps: [
      { label: 'Order Placed', time: 'Jun 21, 10:14am', done: true, active: false },
      { label: 'Processing', time: 'Jun 21, 10:20am', done: true, active: true },
      { label: 'Shipped', time: 'Pending', done: false, active: false },
      { label: 'In Transit', time: 'Pending', done: false, active: false },
      { label: 'Delivered', time: 'Estimated Jun 26', done: false, active: false },
    ],
  },
};

const statusIcon: Record<string, React.ReactNode> = {
  'Order Placed': <Clock size={14} />,
  Processing: <Package size={14} />,
  Shipped: <Truck size={14} />,
  'In Transit': <MapPin size={14} />,
  Delivered: <CheckCircle size={14} />,
};

export default function TrackOrderPage() {
  const [orderNum, setOrderNum] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<typeof DUMMY_ORDERS[string] | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const found = DUMMY_ORDERS[orderNum.trim().toUpperCase()];
    if (found) { setResult(found); setNotFound(false); }
    else { setResult(null); setNotFound(true); }
  };

  const statusColor: Record<string, string> = {
    'In Transit': 'bg-blue-100 text-blue-600',
    Delivered: 'bg-green-100 text-green-600',
    Processing: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-700 to-indigo-700 py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Truck size={26} className="text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl font-black text-white mb-3">Track Your Order</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-purple-200">Enter your order number and email to see real-time updates.</motion.p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-10 space-y-6">
        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Order Number</label>
              <input value={orderNum} onChange={e => setOrderNum(e.target.value)} placeholder="e.g. SS-10042"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-colors" />
              <p className="text-xs text-gray-400 mt-1">Try SS-10042, SS-10078, or SS-10093 for a demo</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-colors" />
            </div>
            <button type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              <Search size={15} /> Track Order
            </button>
          </form>
        </motion.div>

        {/* Not found */}
        <AnimatePresence>
          {notFound && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
              <p className="text-red-500 text-sm font-semibold">Order not found</p>
              <p className="text-red-400 text-xs mt-1">Check your order number and try again, or <a href="/contact" className="underline">contact support</a>.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Order #{orderNum.toUpperCase()}</p>
                    <p className="font-bold text-gray-900 text-sm">{result.product}</p>
                    <p className="text-xs text-gray-400 mt-1">Placed {result.date} · Est. delivery {result.eta}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${statusColor[result.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {result.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Tracking Timeline</h3>
                <div className="space-y-0">
                  {result.steps.map((step, i) => (
                    <div key={step.label} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                          step.active ? 'bg-purple-600 border-purple-600 text-white' :
                          step.done ? 'bg-green-500 border-green-500 text-white' :
                          'bg-gray-100 border-gray-200 text-gray-400'
                        }`}>
                          {statusIcon[step.label]}
                        </div>
                        {i < result.steps.length - 1 && (
                          <div className={`w-0.5 h-8 mt-1 ${step.done ? 'bg-green-300' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className={`text-sm font-semibold ${step.active ? 'text-purple-600' : step.done ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-gray-400">{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
