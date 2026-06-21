'use client';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function FloatingDemoButtons() {
  return (
    <div className="fixed bottom-6 left-5 z-50 flex flex-col gap-2.5">
      {/* Admin Panel */}
      <Link
        href="/admin"
        className="flex items-center gap-3 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-full pl-1.5 pr-4 py-1.5 hover:shadow-xl hover:scale-[1.03] transition-all duration-200 group w-[210px]"
      >
        {/* outer beige ring → inner gold circle */}
        <div className="w-[44px] h-[44px] rounded-full bg-[#ede8db] flex items-center justify-center flex-shrink-0">
          <div className="w-[34px] h-[34px] rounded-full bg-[#c9a84c] flex items-center justify-center">
            <ShieldCheck size={16} className="text-white" strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 leading-none mb-0.5 whitespace-nowrap">Experience the</p>
          <p className="text-[13px] font-bold text-gray-900 leading-none">Admin Panel</p>
        </div>
        <ArrowRight size={13} className="text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </Link>

      {/* Fiverr */}
      <a
        href="https://www.fiverr.com/adib_bin_shahid"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-full pl-1.5 pr-4 py-1.5 hover:shadow-xl hover:scale-[1.03] transition-all duration-200 group w-[210px]"
      >
        {/* outer mint ring → inner fiverr green circle */}
        <div className="w-[44px] h-[44px] rounded-full bg-[#cde9d8] flex items-center justify-center flex-shrink-0">
          <div className="w-[34px] h-[34px] rounded-full bg-[#1DBF73] flex items-center justify-center">
            <span className="text-white font-black text-[9px] leading-none tracking-tight">fiverr.</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 leading-none mb-0.5 whitespace-nowrap">Contact us on</p>
          <p className="text-[13px] font-bold text-gray-900 leading-none">Fiverr</p>
        </div>
        <ArrowRight size={13} className="text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </a>
    </div>
  );
}
