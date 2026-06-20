import Link from 'next/link';
import { ShoppingBag, Camera, X, Globe, Tv } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center">
                <ShoppingBag size={18} className="text-white" />
              </div>
              <span className="text-white font-bold text-xl">ShopSphere</span>
            </div>
            <p className="text-sm leading-relaxed mb-5">Premium products. Smart choices. Better life. Your one-stop destination for everything you love.</p>
            <div className="flex gap-3">
              {[Camera, X, Globe, Tv].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-purple-600 rounded-xl flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['Home', 'Shop', 'Categories', 'Deals', 'About'].map((l) => (
                <li key={l}>
                  <Link href={l === 'Home' ? '/' : `/${l.toLowerCase()}`} className="hover:text-purple-400 transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'FAQ', href: '/faq' },
                { label: 'Shipping Policy', href: '/shipping' },
                { label: 'Return Policy', href: '/returns' },
                { label: 'Track Order', href: '/track-order' },
                { label: 'Contact Us', href: '/contact' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-purple-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-4">Get the latest deals and updates delivered to your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
              />
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 ShopSphere. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-purple-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
