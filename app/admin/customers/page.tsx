'use client';

import { useStore } from '@/store/useStore';
import { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, UserX, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminCustomers() {
  const { orders } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique customers from orders for demo purposes
  const customersMap = new Map();
  orders.forEach(order => {
    if (!customersMap.has(order.customerInfo.phone)) {
      customersMap.set(order.customerInfo.phone, {
        name: order.customerInfo.name,
        phone: order.customerInfo.phone,
        address: order.customerInfo.address,
        totalOrders: 1,
        totalSpent: order.total,
        isSuspect: false // Mock status
      });
    } else {
      const customer = customersMap.get(order.customerInfo.phone);
      customer.totalOrders += 1;
      customer.totalSpent += order.total;
    }
  });

  const [customers, setCustomers] = useState(Array.from(customersMap.values()));

  const toggleSuspectStatus = (phone: string) => {
    setCustomers(customers.map(c => 
      c.phone === phone ? { ...c, isSuspect: !c.isSuspect } : c
    ));
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search customers by name or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Contact</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Orders</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Total Spent</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <motion.tr 
                    key={customer.phone}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`transition-colors ${customer.isSuspect ? 'bg-red-50/50' : 'hover:bg-gray-50/50'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{customer.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{customer.phone}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">{customer.address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{customer.totalOrders}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">৳{customer.totalSpent.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      {customer.isSuspect ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium border border-red-200">
                          <ShieldAlert className="w-3 h-3" /> Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleSuspectStatus(customer.phone)}
                        className={`p-2 transition-colors rounded-lg flex items-center gap-2 ml-auto ${
                          customer.isSuspect 
                            ? 'text-emerald-600 hover:bg-emerald-50' 
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                        title={customer.isSuspect ? "Unblock User" : "Block User"}
                      >
                        {customer.isSuspect ? <UserCheck className="w-5 h-5" /> : <UserX className="w-5 h-5" />}
                        <span className="text-sm font-medium">{customer.isSuspect ? 'Unblock' : 'Block'}</span>
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
