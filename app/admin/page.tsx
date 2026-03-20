'use client';

import { useStore } from '@/store/useStore';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TotalOrderIcon, DashboardIcon, TrackOrderIcon, ShopIcon } from '@/components/icons';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`৳${totalRevenue.toLocaleString()}`} 
          icon={DashboardIcon} 
        />
        <StatCard 
          title="Total Orders" 
          value={totalOrders.toString()} 
          icon={TotalOrderIcon} 
        />
        <StatCard 
          title="Pending Orders" 
          value={pendingOrders.toString()} 
          icon={TrackOrderIcon} 
        />
        <StatCard 
          title="Total Products" 
          value={totalProducts.toString()} 
          icon={ShopIcon} 
        />
      </div>

      {/* Charts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} tickFormatter={(value) => `৳${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`৳${value}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
          </div>
          <div className="space-y-6">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.id}</p>
                  <p className="text-xs text-gray-500">{order.customerInfo.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">৳{order.total.toLocaleString()}</p>
                  <p className={`text-xs font-medium ${
                    order.status === 'Pending' ? 'text-amber-600' : 
                    order.status === 'Delivered' ? 'text-emerald-600' : 'text-indigo-600'
                  }`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No recent orders.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </motion.div>
  );
}
