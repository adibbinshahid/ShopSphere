'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { recentOrders } from '@/lib/adminData';

const statusOptions = ['All', 'Delivered', 'Processing', 'Shipped', 'Pending'];
const statusColor: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Pending: 'bg-yellow-100 text-yellow-700',
};

export default function AdminOrders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const allOrders = [...recentOrders, ...recentOrders.map((o, i) => ({
    ...o,
    id: `#ORD-${8913 - i}`,
    customer: ['Chris Lee', 'Anna White', 'Tom Black', 'Sara Green', 'Mike Brown'][i % 5],
    date: 'Dec 16, 2025',
    status: statusOptions[Math.floor(Math.random() * 4) + 1] as string,
  }))];

  const filtered = allOrders.filter((o) => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm">{allOrders.length} total orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-purple-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400" />
          <div className="flex gap-2 overflow-x-auto">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  statusFilter === s ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order ID', 'Customer', 'Product', 'Amount', 'Date', 'Status', 'Action'].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order, i) => (
                <motion.tr
                  key={`${order.id}-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3.5 font-semibold text-purple-600 text-xs">{order.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 text-xs font-bold">{order.customer.charAt(0)}</span>
                      </div>
                      <span className="text-xs text-gray-700">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-600">{order.product}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-gray-900">${order.amount}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">{order.date}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="text-xs text-purple-600 hover:text-purple-700 font-medium hover:underline">View</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">Showing {filtered.length} of {allOrders.length} orders</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors">Previous</button>
            <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium">1</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors">2</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
