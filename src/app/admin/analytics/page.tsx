'use client';
import { motion } from 'framer-motion';
import { revenueData, categoryData, weeklyData, topCustomers, statsCards } from '@/lib/adminData';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const PURPLE = '#9333ea';
const INDIGO = '#6366f1';

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm">Detailed performance insights for 2025</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
          >
            <p className="text-xs text-gray-500 mb-2">{card.label}</p>
            <p className="text-xl font-black text-gray-900 mb-1">{card.value}</p>
            <span className={`flex items-center gap-1 text-xs font-semibold ${card.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {card.trend === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {card.change} vs last year
            </span>
          </motion.div>
        ))}
      </div>

      {/* Revenue + Orders dual-line */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-gray-900">Revenue vs Orders</h3>
            <p className="text-xs text-gray-500">Monthly comparison 2025</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke={PURPLE} strokeWidth={2.5} dot={false} name="Revenue ($)" />
            <Line yAxisId="right" type="monotone" dataKey="orders" stroke={INDIGO} strokeWidth={2.5} dot={false} strokeDasharray="5 5" name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">Revenue Trend</h3>
          <p className="text-xs text-gray-500 mb-5">Cumulative growth</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PURPLE} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={PURPLE} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke={PURPLE} strokeWidth={2} fill="url(#grad2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">Category Breakdown</h3>
          <p className="text-xs text-gray-500 mb-5">% of total revenue</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={70} dataKey="value" strokeWidth={0}>
                  {categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5 flex-1">
              {categoryData.map((d) => (
                <div key={d.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      {d.name}
                    </span>
                    <span className="font-bold text-gray-800">{d.value}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.value}%`, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly bars + Top customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">Daily Sales</h3>
          <p className="text-xs text-gray-500 mb-5">This week</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Sales']} />
              <Bar dataKey="sales" fill={PURPLE} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Top Customers</h3>
            <p className="text-xs text-gray-500">By lifetime value</p>
          </div>
          <div className="divide-y divide-gray-50">
            {topCustomers.map((c, i) => (
              <div key={c.name} className="flex items-center gap-4 px-6 py-4">
                <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-xs font-bold">{c.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.orders} orders</p>
                </div>
                <p className="text-sm font-bold text-purple-600">${c.spent.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
