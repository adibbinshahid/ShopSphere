'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Search, User, Menu, X, ShoppingBag, LogOut, Package, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { m, AnimatePresence } from 'framer-motion';
import { useCartStore, useUserStore } from '@/lib/store';
import Image from 'next/image';

const CartDrawer = dynamic(() => import('./CartDrawer'));
const SearchModal = dynamic(() => import('./SearchModal'));

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/categories', label: 'Categories' },
  { href: '/deals', label: 'Deals' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const count = useCartStore((s) => s.count());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const { isLoggedIn, user, logout } = useUserStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <m.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <m.div whileHover={{ scale: 1.05 }}
                className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center">
                <ShoppingBag size={18} className="text-white" />
              </m.div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">ShopSphere</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors focus:outline-none">
                  {link.label}
                  {pathname === link.href && (
                    <m.div layoutId="nav-underline"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-purple-600 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors">
                <Search size={20} />
              </m.button>

              {/* User button / dropdown */}
              <div ref={userMenuRef} className="relative hidden sm:block">
                <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => mounted && isLoggedIn ? setUserMenuOpen(!userMenuOpen) : router.push('/account')}
                  className={`flex items-center gap-1.5 p-2 rounded-xl transition-colors ${
                    isLoggedIn ? 'hover:bg-purple-50 text-purple-600' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}>
                  {mounted && isLoggedIn && user ? (
                    <>
                      <div className="relative w-7 h-7 rounded-lg overflow-hidden">
                        <Image src={user.avatar} alt={user.name} fill className="object-cover" sizes="28px" />
                      </div>
                      <span className="text-xs font-semibold max-w-[80px] truncate hidden lg:block">{user.name.split(' ')[0]}</span>
                      <ChevronDown size={13} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </>
                  ) : (
                    <User size={20} />
                  )}
                </m.button>

                <AnimatePresence>
                  {userMenuOpen && isLoggedIn && user && (
                    <m.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      {/* Header */}
                      <div className="px-4 py-3 bg-purple-50 border-b border-purple-100">
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-purple-600 font-semibold">★ {user.tier} Member · {user.points.toLocaleString()} pts</p>
                      </div>
                      {/* Links */}
                      {[
                        { label: 'My Account', href: '/account', icon: User },
                        { label: 'My Orders', href: '/account', icon: Package },
                      ].map(({ label, href, icon: Icon }) => (
                        <Link key={label} href={href}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Icon size={15} className="text-gray-400" /> {label}
                        </Link>
                      ))}
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>

              <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                id="navbar-cart-btn"
                onClick={toggleCart}
                className="relative p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors">
                <ShoppingCart size={20} />
                <AnimatePresence>
                  {mounted && count > 0 && (
                    <m.span key="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {count > 9 ? '9+' : count}
                    </m.span>
                  )}
                </AnimatePresence>
              </m.button>

              <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-purple-600 rounded-xl">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </m.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 bg-white overflow-hidden">
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      pathname === link.href ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                    {link.label}
                  </Link>
                ))}
                <Link href="/account" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  {isLoggedIn ? 'My Account' : 'Sign In'}
                </Link>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </m.nav>

      <CartDrawer />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
