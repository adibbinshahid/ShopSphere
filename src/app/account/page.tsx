'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  User, Package, MapPin, CreditCard, Tag, Settings, LogOut,
  ChevronRight, Copy, CheckCircle, Clock, Truck, XCircle,
  Star, Shield, Eye, EyeOff, ArrowRight
} from 'lucide-react';
import { useUserStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

// ─── Login Gate ───────────────────────────────────────────────────────────────
function LoginGate() {
  const login = useUserStore(s => s.login);
  const [email, setEmail] = useState('alex@example.com');
  const [pass, setPass] = useState('demo123');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(email, pass)) setError('Invalid credentials. Use the pre-filled demo account.');
    else setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-br from-purple-700 to-indigo-700 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <User size={28} className="text-white" />
          </div>
          <h1 className="text-white font-black text-xl">Welcome Back</h1>
          <p className="text-purple-200 text-xs mt-1">Sign in to your ShopSphere account</p>
        </div>

        <div className="p-8">
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 mb-5 text-center">
            <p className="text-xs font-semibold text-purple-700">Demo credentials pre-filled below</p>
            <p className="text-xs text-purple-500 mt-0.5">alex@example.com · demo123</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 pr-10 transition-colors" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
              Sign In →
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Delivered: 'bg-green-100 text-green-700',
    'In Transit': 'bg-blue-100 text-blue-700',
    Processing: 'bg-yellow-100 text-yellow-700',
    Cancelled: 'bg-red-100 text-red-500',
  };
  const icons: Record<string, React.ReactNode> = {
    Delivered: <CheckCircle size={11} />,
    'In Transit': <Truck size={11} />,
    Processing: <Clock size={11} />,
    Cancelled: <XCircle size={11} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {icons[status]} {status}
    </span>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <button onClick={copy} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-purple-600">
      {copied ? <CheckCircle size={13} className="text-green-500" /> : <Copy size={13} />}
    </button>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'track', label: 'Track Order', icon: Truck },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'coupons', label: 'Coupons', icon: Tag },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// ─── Main Account Page ────────────────────────────────────────────────────────
export default function AccountPage() {
  const { isLoggedIn, user, orders, cards, coupons, logout } = useUserStore();
  const router = useRouter();
  const [tab, setTab] = useState('overview');
  const [trackInput, setTrackInput] = useState('');
  const [trackResult, setTrackResult] = useState<typeof orders[0] | null>(null);
  const [trackNotFound, setTrackNotFound] = useState(false);

  if (!isLoggedIn || !user) return <LoginGate />;

  const active = orders.filter(o => o.status === 'In Transit' || o.status === 'Processing');
  const past = orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');
  const tierColor = { Silver: 'text-gray-500', Gold: 'text-yellow-500', Platinum: 'text-purple-500' }[user.tier];

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => o.id.toLowerCase() === trackInput.trim().toLowerCase());
    if (found) { setTrackResult(found); setTrackNotFound(false); }
    else { setTrackResult(null); setTrackNotFound(true); }
  };

  const handleLogout = () => { logout(); router.push('/'); };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  <p className={`text-xs font-bold mt-0.5 ${tierColor}`}>★ {user.tier} Member</p>
                </div>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-500 font-semibold">Reward Points</p>
                  <p className="text-xl font-black text-purple-700">{user.points.toLocaleString()}</p>
                </div>
                <Star size={24} className="text-purple-300" />
              </div>
            </div>

            {/* Nav */}
            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors border-b border-gray-50 last:border-0 ${
                    tab === id ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                  <Icon size={16} /> {label}
                  {tab === id && <ChevronRight size={14} className="ml-auto" />}
                </button>
              ))}
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-400 hover:bg-red-50 transition-colors">
                <LogOut size={16} /> Sign Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

                {/* ── OVERVIEW ── */}
                {tab === 'overview' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-black text-gray-900">Hello, {user.name.split(' ')[0]} 👋</h2>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: 'Total Orders', val: orders.length },
                        { label: 'Active Orders', val: active.length },
                        { label: 'Reward Points', val: user.points.toLocaleString() },
                        { label: 'Saved Coupons', val: coupons.filter(c => !c.used).length },
                      ].map(({ label, val }) => (
                        <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                          <p className="text-2xl font-black text-purple-600">{val}</p>
                          <p className="text-xs text-gray-500 mt-1">{label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Active orders */}
                    {active.length > 0 && (
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-gray-900">Active Orders</h3>
                          <button onClick={() => setTab('orders')} className="text-xs text-purple-600 font-semibold hover:underline flex items-center gap-1">View All <ArrowRight size={12} /></button>
                        </div>
                        <div className="space-y-3">
                          {active.map(o => (
                            <div key={o.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                <Image src={o.items[0].image} alt="" fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">{o.id}</p>
                                <p className="text-xs text-gray-400">{o.items.length} item{o.items.length > 1 ? 's' : ''} · ${o.total}</p>
                              </div>
                              <StatusBadge status={o.status} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Account info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <h3 className="font-bold text-gray-900 mb-4">Account Details</h3>
                      <div className="space-y-3 text-sm">
                        {[
                          { label: 'Email', val: user.email },
                          { label: 'Phone', val: user.phone },
                          { label: 'Address', val: user.address },
                          { label: 'Member Since', val: user.memberSince },
                        ].map(({ label, val }) => (
                          <div key={label} className="flex items-start gap-3">
                            <p className="text-gray-400 w-28 flex-shrink-0 text-xs pt-0.5">{label}</p>
                            <p className="text-gray-900 text-xs font-medium flex-1">{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── ORDERS ── */}
                {tab === 'orders' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-black text-gray-900">My Orders</h2>

                    {active.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Active</p>
                        <div className="space-y-3">
                          {active.map(o => <OrderCard key={o.id} order={o} />)}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-2">Past Orders</p>
                      <div className="space-y-3">
                        {past.map(o => <OrderCard key={o.id} order={o} />)}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TRACK ── */}
                {tab === 'track' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-black text-gray-900">Track Order</h2>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <form onSubmit={handleTrack} className="flex gap-3">
                        <input value={trackInput} onChange={e => setTrackInput(e.target.value)}
                          placeholder="Enter order number e.g. SS-10042"
                          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400" />
                        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors">
                          Track
                        </button>
                      </form>
                      <p className="text-xs text-gray-400 mt-2">Your orders: {orders.map(o => o.id).join(', ')}</p>
                    </div>

                    <AnimatePresence>
                      {trackNotFound && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="bg-red-50 border border-red-100 rounded-2xl p-4 text-sm text-red-500 text-center">
                          Order not found. Try one of your order IDs above.
                        </motion.div>
                      )}
                      {trackResult && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-xs text-gray-400">{trackResult.id}</p>
                              <p className="font-bold text-gray-900">{trackResult.items.map(i => i.name).join(', ')}</p>
                              {trackResult.eta && <p className="text-xs text-gray-400 mt-0.5">Est. delivery: {trackResult.eta}</p>}
                            </div>
                            <StatusBadge status={trackResult.status} />
                          </div>
                          <TrackTimeline status={trackResult.status} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* ── PAYMENT ── */}
                {tab === 'payment' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-black text-gray-900">Payment Methods</h2>
                    <div className="space-y-3">
                      {cards.map(card => (
                        <div key={card.id} className={`bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-4 ${card.isDefault ? 'border-purple-200' : 'border-gray-100'}`}>
                          <div className={`w-12 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black ${card.brand === 'Visa' ? 'bg-blue-600' : card.brand === 'Mastercard' ? 'bg-red-500' : 'bg-gray-700'}`}>
                            {card.brand === 'Visa' ? 'VISA' : card.brand === 'Mastercard' ? 'MC' : 'AMEX'}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">{card.brand} •••• {card.last4}</p>
                            <p className="text-xs text-gray-400">Expires {card.expiry}</p>
                          </div>
                          {card.isDefault && (
                            <span className="text-xs bg-purple-100 text-purple-600 font-bold px-2.5 py-1 rounded-full">Default</span>
                          )}
                          <Shield size={16} className="text-green-400" />
                        </div>
                      ))}
                    </div>
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-5 flex items-center justify-center gap-2 text-gray-400 hover:border-purple-300 hover:text-purple-500 transition-colors cursor-pointer">
                      <span className="text-xl">+</span>
                      <span className="text-sm font-medium">Add New Card</span>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <h3 className="font-bold text-gray-900 mb-4">Billing Address</h3>
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600">{user.address}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── COUPONS ── */}
                {tab === 'coupons' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-black text-gray-900">My Coupons</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {coupons.map(c => (
                        <div key={c.code} className={`bg-white rounded-2xl border shadow-sm p-5 relative overflow-hidden ${c.used ? 'opacity-50' : 'border-gray-100'}`}>
                          {/* decorative dots */}
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-50 border border-gray-100" />
                          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-50 border border-gray-100" />

                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="bg-purple-100 text-purple-700 text-xs font-black px-3 py-1 rounded-lg">{c.discount}</div>
                            {c.used && <span className="text-xs text-gray-400 font-semibold">USED</span>}
                          </div>
                          <p className="text-sm font-bold text-gray-900 mb-1">{c.desc}</p>
                          <p className="text-xs text-gray-400 mb-3">Expires {c.expires}</p>
                          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                            <code className="text-sm font-black text-purple-700 tracking-wider">{c.code}</code>
                            {!c.used && <CopyBtn text={c.code} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── SETTINGS ── */}
                {tab === 'settings' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-black text-gray-900">Account Settings</h2>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                      <h3 className="font-bold text-gray-900">Personal Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { label: 'Full Name', val: user.name },
                          { label: 'Email', val: user.email },
                          { label: 'Phone', val: user.phone },
                          { label: 'Address', val: user.address },
                        ].map(({ label, val }) => (
                          <div key={label} className={label === 'Address' ? 'sm:col-span-2' : ''}>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
                            <input defaultValue={val}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-colors" />
                          </div>
                        ))}
                      </div>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                        Save Changes
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                      <h3 className="font-bold text-gray-900">Change Password</h3>
                      <div className="space-y-3">
                        {['Current Password', 'New Password', 'Confirm New Password'].map(l => (
                          <div key={l}>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">{l}</label>
                            <input type="password" placeholder="••••••••"
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-colors" />
                          </div>
                        ))}
                      </div>
                      <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                        Update Password
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h3 className="font-bold text-gray-900 mb-1">Email Notifications</h3>
                      <p className="text-xs text-gray-400 mb-4">Choose what you want to hear about.</p>
                      {['Order updates', 'Promotions & deals', 'New arrivals', 'Account activity'].map(l => (
                        <label key={l} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 cursor-pointer">
                          <span className="text-sm text-gray-700">{l}</span>
                          <input type="checkbox" defaultChecked={l !== 'New arrivals'} className="w-4 h-4 accent-purple-600" />
                        </label>
                      ))}
                    </div>

                    <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                      <h3 className="font-bold text-red-600 mb-1">Danger Zone</h3>
                      <p className="text-xs text-red-400 mb-3">Permanently delete your account and all data. This cannot be undone.</p>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────
function OrderCard({ order }: { order: ReturnType<typeof useUserStore.getState>['orders'][0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 flex items-center gap-3 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex -space-x-2">
          {order.items.slice(0, 3).map((item, i) => (
            <div key={i} className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-white flex-shrink-0">
              <Image src={item.image} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-gray-900">{order.id}</p>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{order.date} · {order.items.length} item{order.items.length > 1 ? 's' : ''} · <span className="font-semibold text-gray-700">${order.total}</span></p>
        </div>
        <ChevronRight size={16} className={`text-gray-300 transition-transform ${open ? 'rotate-90' : ''}`} />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="border-t border-gray-100 p-4 space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt="" fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty {item.qty} · ${item.price}</p>
                  </div>
                </div>
              ))}
              {order.eta && (
                <p className="text-xs text-purple-600 font-semibold pt-1">Estimated delivery: {order.eta}</p>
              )}
              <div className="flex gap-2 pt-1">
                {order.status === 'Delivered' && (
                  <button className="text-xs bg-purple-50 text-purple-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors">
                    Buy Again
                  </button>
                )}
                <button className="text-xs bg-gray-50 text-gray-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  {order.status === 'Delivered' ? 'Write Review' : 'Contact Support'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Track Timeline ───────────────────────────────────────────────────────────
function TrackTimeline({ status }: { status: string }) {
  const steps = ['Order Placed', 'Processing', 'Shipped', 'In Transit', 'Delivered'];
  const idx = { 'Order Placed': 0, Processing: 1, Shipped: 2, 'In Transit': 3, Delivered: 4, Cancelled: -1 }[status] ?? 0;
  if (status === 'Cancelled') return <p className="text-sm text-red-500 font-semibold">This order was cancelled.</p>;
  return (
    <div className="flex items-center gap-1">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i < idx ? 'bg-green-500 text-white' : i === idx ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
            {i < idx ? '✓' : i + 1}
          </div>
          {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${i < idx ? 'bg-green-400' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );
}
