'use client';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, BarChart2, RefreshCw, Eye, ShoppingCart, Star, Package, ArrowUpRight } from 'lucide-react';
import { statsCards, recentOrders, categoryData, revenueData, weeklyData, topCustomers } from '@/lib/adminData';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, FunnelChart, Funnel, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const iconMap: Record<string, React.ElementType> = {
  revenue: DollarSign, orders: ShoppingBag, customers: Users, avg: BarChart2,
};

const statusColor: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Pending: 'bg-yellow-100 text-yellow-700',
};

const trafficData = [
  { source: 'Organic Search', visits: 12400, color: '#9333ea' },
  { source: 'Direct', visits: 8200, color: '#6366f1' },
  { source: 'Social Media', visits: 6100, color: '#a78bfa' },
  { source: 'Email', visits: 4300, color: '#c4b5fd' },
  { source: 'Referral', visits: 2100, color: '#ddd6fe' },
];

const funnelData = [
  { name: 'Visitors', value: 45000, fill: '#9333ea' },
  { name: 'Product Views', value: 28000, fill: '#7c3aed' },
  { name: 'Add to Cart', value: 12000, fill: '#6d28d9' },
  { name: 'Checkout', value: 6800, fill: '#5b21b6' },
  { name: 'Purchased', value: 4200, fill: '#4c1d95' },
];

const retentionData = [
  { week: 'W1', retention: 100 },
  { week: 'W2', retention: 68 },
  { week: 'W3', retention: 52 },
  { week: 'W4', retention: 44 },
  { week: 'W5', retention: 38 },
  { week: 'W6', retention: 34 },
  { week: 'W7', retention: 31 },
  { week: 'W8', retention: 29 },
];

const topProducts = [
  { name: 'Vitamin C Serum', sales: 1240, revenue: 49560, growth: 23 },
  { name: 'Leather Sneakers', sales: 892, revenue: 115908, growth: 18 },
  { name: 'Smart Watch X', sales: 634, revenue: 126766, growth: 12 },
  { name: 'Yoga Mat Premium', sales: 521, revenue: 28630, growth: 31 },
  { name: 'AirPods Pro', sales: 489, revenue: 44001, growth: -4 },
];

const liveMetrics = [
  { label: 'Active Visitors', value: '127', icon: Eye, color: 'text-green-500' },
  { label: 'Orders Today', value: '43', icon: ShoppingCart, color: 'text-blue-500' },
  { label: 'Avg Rating', value: '4.7★', icon: Star, color: 'text-yellow-500' },
  { label: 'Low Stock Items', value: '6', icon: Package, color: 'text-red-500' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 bg-white px-3 py-2 rounded-xl transition-colors">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Live metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {liveMetrics.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon size={16} className={color} />
            </div>
            <div>
              <p className="text-xl font-black text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statsCards.map((card, i) => {
          const Icon = iconMap[card.icon];
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Icon size={18} className="text-purple-600" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold ${card.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {card.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {card.change}
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue + Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900">Revenue Overview</h3>
              <p className="text-xs text-gray-500">Full year 2025</p>
            </div>
            <span className="text-xs bg-green-100 text-green-600 font-semibold px-3 py-1 rounded-full">+18.2% YoY</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9333ea" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#9333ea" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#9333ea" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">Category Sales</h3>
          <p className="text-xs text-gray-500 mb-4">Distribution</p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                {categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categoryData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="font-bold text-gray-800">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel + Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">Conversion Funnel</h3>
          <p className="text-xs text-gray-500 mb-4">Visitor → Purchase</p>
          <div className="space-y-2">
            {funnelData.map((f, i) => {
              const pct = Math.round((f.value / funnelData[0].value) * 100);
              return (
                <div key={f.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{f.name}</span>
                    <span className="font-bold text-gray-900">{f.value.toLocaleString()} <span className="text-gray-400">({pct}%)</span></span>
                  </div>
                  <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-lg flex items-center justify-end pr-2"
                      style={{ background: f.fill }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 bg-purple-50 rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs text-gray-600">Overall Conversion Rate</span>
            <span className="text-sm font-black text-purple-600">9.3%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">Traffic Sources</h3>
          <p className="text-xs text-gray-500 mb-4">This month</p>
          <div className="space-y-3">
            {trafficData.map((t) => {
              const total = trafficData.reduce((s, x) => s + x.visits, 0);
              const pct = Math.round((t.visits / total) * 100);
              return (
                <div key={t.source}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{t.source}</span>
                    <span className="font-bold text-gray-900">{t.visits.toLocaleString()} <span className="text-gray-400">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ background: t.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Weekly bar + Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">Weekly Sales</h3>
          <p className="text-xs text-gray-500 mb-4">Current week</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Sales']} />
              <Bar dataKey="sales" fill="#9333ea" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">Customer Retention</h3>
          <p className="text-xs text-gray-500 mb-4">8-week cohort</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => [`${v}%`, 'Retention']} />
              <Line type="monotone" dataKey="retention" stroke="#9333ea" strokeWidth={2.5} dot={{ fill: '#9333ea', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Top Products</h3>
            <a href="/admin/products" className="text-purple-600 text-xs font-medium hover:underline">View All</a>
          </div>
          <div className="divide-y divide-gray-50">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 px-5 py-3.5">
                <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.sales} sold</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-900">${p.revenue.toLocaleString()}</p>
                  <p className={`text-xs font-semibold flex items-center gap-0.5 justify-end ${p.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <ArrowUpRight size={10} className={p.growth < 0 ? 'rotate-90' : ''} />
                    {Math.abs(p.growth)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
            <a href="/admin/orders" className="text-purple-600 text-xs font-medium hover:underline">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <tbody className="divide-y divide-gray-50">
                {recentOrders.slice(0, 6).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-purple-600">{order.id}</td>
                    <td className="px-5 py-3 text-gray-700">{order.customer}</td>
                    <td className="px-5 py-3 font-semibold text-gray-900">${order.amount}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[order.status]}`}>{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Top Customers</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {topCustomers.map((c, i) => (
            <div key={c.name} className="p-5 text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 text-xs font-bold">{c.avatar}</span>
              </div>
              <p className="text-xs font-bold text-gray-900">{c.name}</p>
              <p className="text-xs text-gray-500">{c.orders} orders</p>
              <p className="text-sm font-black text-purple-600 mt-1">${c.spent.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
