'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartFeedback from './CartFeedback';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  if (isAdmin) return <>{children}</>;
  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24">{children}</main>
      <Footer />
      <CartFeedback />
    </>
  );
}
