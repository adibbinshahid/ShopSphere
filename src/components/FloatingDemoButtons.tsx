'use client';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function FloatingDemoButtons() {
  return (
    <div className="fixed bottom-6 left-5 z-50 flex flex-col gap-2.5">
      {/* Admin Panel */}
      <Link
        href="/admin"
        className="flex items-center gap-3 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-full pl-2 pr-4 py-2 hover:shadow-xl hover:scale-[1.03] transition-all duration-200 group w-[188px]"
      >
        <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={16} className="text-amber-600" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 leading-none mb-0.5">Experience the</p>
          <p className="text-[13px] font-bold text-gray-900 leading-none">Admin Panel</p>
        </div>
        <ArrowRight size={13} className="text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </Link>

      {/* Fiverr */}
      <a
        href="https://www.fiverr.com/adib_bin_shahid"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-full pl-2 pr-4 py-2 hover:shadow-xl hover:scale-[1.03] transition-all duration-200 group w-[188px]"
      >
        <div className="w-9 h-9 rounded-full bg-[#1DBF73] flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-[15px] leading-none" style={{ fontFamily: 'system-ui, sans-serif' }}>f</span>
          <span className="text-white font-black text-[9px] leading-none -ml-0.5 mt-1">•</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 leading-none mb-0.5">Contact us on</p>
          <p className="text-[13px] font-bold text-gray-900 leading-none">Fiverr</p>
        </div>
        <ArrowRight size={13} className="text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </a>
    </div>
  );
}
