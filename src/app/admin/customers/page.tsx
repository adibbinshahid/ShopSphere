'use client';
import { motion } from 'framer-motion';
import { Search, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { topCustomers } from '@/lib/adminData';

const allCustomers = [
  ...topCustomers,
  { name: 'Chris Lee', orders: 10, spent: 987, avatar: 'CL' },
  { name: 'Anna White', orders: 8, spent: 823, avatar: 'AW' },
  { name: 'Tom Black', orders: 7, spent: 712, avatar: 'TB' },
  { name: 'Sara Green', orders: 6, spent: 634, avatar: 'SG' },
  { name: 'Mike Brown', orders: 5, spent: 521, avatar: 'MB' },
  { name: 'Lily Zhang', orders: 4, spent: 408, avatar: 'LZ' },
  { name: 'Ryan Park', orders: 3, spent: 312, avatar: 'RP' },
].map((c, i) => ({
  ...c,
  email: `${c.name.toLowerCase().replace(' ', '.')}@email.com`,
  phone: `+1 (555) ${String(100 + i * 37).padStart(3, '0')}-${String(1000 + i * 213).slice(0, 4)}`,
  joined: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i % 6]} 202${Math.floor(i / 6) + 3}`,
  status: i < 5 ? 'Active' : 'Occasional',
}));

export default function AdminCustomers() {
  const [search, setSearch] = useState('');
  const filtered = allCustomers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Customers</h1>
          <p className="text-gray-500 text-sm">{allCustomers.length} registered customers</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: '3,241' },
          { label: 'Active This Month', value: '892' },
          { label: 'Avg. Lifetime Value', value: '$847' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-2xl font-black text-purple-600">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-purple-400"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Customer', 'Contact', 'Orders', 'Spent', 'Joined', 'Status'].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c, i) => (
                <motion.tr
                  key={c.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 text-xs font-bold">{c.avatar}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-xs text-gray-600"><Mail size={10} />{c.email}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400"><Phone size={10} />{c.phone}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-gray-700">{c.orders}</td>
                  <td className="px-5 py-4 text-xs font-bold text-purple-600">${c.spent.toLocaleString()}</td>
                  <td className="px-5 py-4 text-xs text-gray-500">{c.joined}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
