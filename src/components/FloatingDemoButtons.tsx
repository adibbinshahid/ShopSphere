'use client';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function FloatingDemoButtons() {
  return (
    <div
      className="fixed bottom-6 left-5 z-50 flex flex-col gap-2"
      style={{ filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.28))' }}
    >
      {/* Admin Panel */}
      <Link
        href="/admin"
        className="flex items-center gap-2.5 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full pl-1 pr-3.5 py-1 hover:scale-[1.03] transition-all duration-200 group w-[190px]"
      >
        <div className="w-[40px] h-[40px] rounded-full bg-[#ede8db] flex items-center justify-center flex-shrink-0">
          <div className="w-[30px] h-[30px] rounded-full bg-[#c9a84c] flex items-center justify-center">
            <ShieldCheck size={14} className="text-white" strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[8px] font-semibold uppercase tracking-wider text-gray-400 leading-none mb-0.5 whitespace-nowrap">Experience the</p>
          <p className="text-[12px] font-bold text-gray-900 leading-none">Admin Panel</p>
        </div>
        <ArrowRight size={12} className="text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </Link>

      {/* Fiverr */}
      <a
        href="https://www.fiverr.com/adib_bin_shahid"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full pl-1 pr-3.5 py-1 hover:scale-[1.03] transition-all duration-200 group w-[190px]"
      >
        <div className="w-[40px] h-[40px] rounded-full bg-[#cde9d8] flex items-center justify-center flex-shrink-0">
          <div className="w-[30px] h-[30px] rounded-full bg-[#1DBF73] flex items-center justify-center">
            <span className="text-white font-black text-[8px] leading-none tracking-tight">fiverr.</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[8px] font-semibold uppercase tracking-wider text-gray-400 leading-none mb-0.5 whitespace-nowrap">Contact us on</p>
          <p className="text-[12px] font-bold text-gray-900 leading-none">Fiverr</p>
        </div>
        <ArrowRight size={12} className="text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </a>
    </div>
  );
}
