'use client';

import { useStore } from '@/store/useStore';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, ShoppingBag, Package, Clock, ArrowUpRight, ArrowDownRight, ChevronRight, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { orders, products } = useStore();

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const totalProducts = products.length;

  // Generate last 7 days data
  const data = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    const dayOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate.getDate() === d.getDate() && 
             orderDate.getMonth() === d.getMonth() && 
             orderDate.getFullYear() === d.getFullYear();
    });
    
    const revenue = dayOrders.reduce((acc, order) => acc + order.total, 0);
    
    return { name: dayName, revenue };
  });

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`৳${totalRevenue.toLocaleString()}`} 
          icon={LayoutDashboard} 
          trend="+12.5%"
          trendUp={true}
          color="indigo"
        />
        <StatCard 
          title="Total Orders" 
          value={totalOrders.toString()} 
          icon={ShoppingBag} 
          trend="+5.2%"
          trendUp={true}
          color="emerald"
        />
        <StatCard 
          title="Pending Orders" 
          value={pendingOrders.toString()} 
          icon={Clock} 
          trend="-2.1%"
          trendUp={false}
          color="amber"
        />
        <StatCard 
          title="Total Products" 
          value={totalProducts.toString()} 
          icon={Package} 
          trend="+1.2%"
          trendUp={true}
          color="blue"
        />
      </div>

      {/* Charts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Revenue Overview</h2>
              <p className="text-sm text-gray-500 mt-1">Last 7 days performance</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} tickFormatter={(value) => `৳${value}`} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontWeight: 500 }}
                  formatter={(value: any) => [`৳${value}`, 'Revenue']}
                  cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#4f46e5' }} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Recent Orders</h2>
              <p className="text-sm text-gray-500 mt-1">Latest transactions</p>
            </div>
            <Link href="/admin/orders" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {orders.slice(0, 6).map((order) => (
              <div key={order.id} className="flex items-center justify-between group p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm border border-indigo-100">
                    {order.customerInfo.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">{order.customerInfo.name}</p>
                    <p className="text-xs text-gray-500 font-medium">#{order.id.startsWith('ORD-NS-') ? order.id : order.id.slice(0, 8)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">৳{order.total.toLocaleString()}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${
                    order.status === 'Pending' ? 'text-amber-600' : 
                    order.status === 'Delivered' ? 'text-emerald-600' : 'text-indigo-600'
                  }`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-8">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No recent orders found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendUp, color }: any) {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
  }[color as string] || 'bg-gray-50 text-gray-600';

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses}`}>
          <Icon className="w-6 h-6" strokeWidth={2} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 tracking-tight mb-1">{value}</p>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      </div>
    </motion.div>
  );
}
