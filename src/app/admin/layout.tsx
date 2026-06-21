'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingBag, BarChart2, Users,
  ChevronLeft, Menu, X, Tag, Megaphone, Mail, Bot, ShoppingCart, LogOut, Eye, EyeOff, Layers
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
  { href: '/admin/coupons', icon: Tag, label: 'Coupons & Deals' },
  { href: '/admin/campaigns', icon: Megaphone, label: 'Campaigns' },
  { href: '/admin/mailbox', icon: Mail, label: 'Mailbox', badge: 4 },
  { href: '/admin/ai', icon: Bot, label: 'AI Section' },
  { href: '/admin/carousel', icon: Layers, label: 'Hero Carousel' },
];

function LoginGate() {
  const { login } = useAuthStore();
  const [user, setUser] = useState('admin');
  const [pass, setPass] = useState('admin');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!login(user, pass)) setError('Invalid credentials. Use admin / admin');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        <div className="bg-gradient-to-br from-purple-700 to-indigo-700 p-8 text-center">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShoppingCart size={24} className="text-white" />
          </div>
          <h1 className="text-white font-black text-xl">ShopSphere Admin</h1>
          <p className="text-purple-200 text-xs mt-1">Secure access portal</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Username</label>
              <input value={user} onChange={e => setUser(e.target.value)}
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
          <Link href="/" className="flex items-center justify-center gap-1.5 mt-5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronLeft size={13} /> Back to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function PinModal() {
  const { pinPending, verifyPin, cancelPin } = useAuthStore();
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const pinRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    if (pinPending) { setPin(['', '', '', '']); setError(''); setTimeout(() => pinRefs[0].current?.focus(), 100); }
  }, [pinPending]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...pin]; next[i] = val; setPin(next);
    if (val && i < 3) pinRefs[i + 1].current?.focus();
    if (next.every(d => d)) {
      if (!verifyPin(next.join(''))) {
        setError('Wrong PIN'); setPin(['', '', '', '']);
        setTimeout(() => pinRefs[0].current?.focus(), 50);
      }
    }
  };

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[i] && i > 0) pinRefs[i - 1].current?.focus();
    if (e.key === 'Escape') cancelPin();
  };

  if (!pinPending) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={cancelPin} className="fixed inset-0 bg-black/60 z-[100]" />
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-8 text-center">
          <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="font-black text-gray-900 text-lg mb-1">Confirm PIN</h2>
          <p className="text-xs text-gray-500 mb-6">Enter your 4-digit PIN to save changes</p>
          <div className="flex gap-3 justify-center mb-4">
            {pin.map((d, i) => (
              <input key={i} ref={pinRefs[i]} type="password" inputMode="numeric" maxLength={1} value={d}
                onChange={e => handleChange(i, e.target.value)} onKeyDown={e => handleKey(i, e)}
                className="w-14 h-14 border-2 border-gray-200 rounded-2xl text-center text-xl font-black focus:outline-none focus:border-purple-500 transition-colors" />
            ))}
          </div>
          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          <button onClick={cancelPin} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) return <LoginGate />;

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full bg-gray-950 transition-all duration-300 ${mobile ? 'w-64' : collapsed ? 'w-16' : 'w-60'}`}>
      <div className={`flex items-center ${collapsed && !mobile ? 'justify-center px-2' : 'gap-2 px-4'} py-5 border-b border-gray-800`}>
        <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <ShoppingCart size={15} className="text-white" />
        </div>
        {(!collapsed || mobile) && <span className="text-white font-bold text-sm">ShopSphere</span>}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${active ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'} ${collapsed && !mobile ? 'justify-center' : ''}`}
              title={collapsed && !mobile ? label : undefined}
            >
              <Icon size={17} className="flex-shrink-0" />
              {(!collapsed || mobile) && (
                <span className="flex-1">{label}</span>
              )}
              {(!collapsed || mobile) && badge && (
                <span className="bg-purple-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 pb-4 border-t border-gray-800 pt-3 space-y-0.5">
        <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white text-sm transition-colors ${collapsed && !mobile ? 'justify-center' : ''}`}>
          <ChevronLeft size={17} className="flex-shrink-0" />
          {(!collapsed || mobile) && 'Back to Store'}
        </Link>
        <button onClick={logout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-red-900/40 hover:text-red-400 text-sm transition-colors ${collapsed && !mobile ? 'justify-center' : ''}`}>
          <LogOut size={17} className="flex-shrink-0" />
          {(!collapsed || mobile) && 'Logout'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="hidden md:flex flex-shrink-0"><Sidebar /></div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="md:hidden fixed inset-0 bg-black/50 z-40" />
            <motion.div initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} className="md:hidden fixed left-0 top-0 h-full z-50">
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-xl">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <button onClick={() => setCollapsed(!collapsed)} className="hidden md:flex p-2 hover:bg-gray-100 rounded-xl">
              <Menu size={18} className="text-gray-600" />
            </button>
            <h2 className="font-semibold text-gray-900 text-sm capitalize">
              {pathname.replace('/admin', '').replace('/', '') || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/mailbox" className="relative p-2 hover:bg-gray-100 rounded-xl">
              <Mail size={17} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-600 rounded-full" />
            </Link>
            <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-purple-600 text-xs font-bold">AD</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500">admin@shopsphere.com</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
      </div>
      <PinModal />
    </div>
  );
}
