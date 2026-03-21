'use client';

import { useStore } from '@/store/useStore';
import { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, UserX, UserCheck, X, Users, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminCustomers() {
  const { orders } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [suspectPhones, setSuspectPhones] = useState<string[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isUpdatingBulk, setIsUpdatingBulk] = useState(false);

  // Extract unique customers from orders
  const customersMap = new Map();
  orders.forEach(order => {
    if (!customersMap.has(order.customerInfo.phone)) {
      customersMap.set(order.customerInfo.phone, {
        name: order.customerInfo.name,
        phone: order.customerInfo.phone,
        address: order.customerInfo.address,
        totalOrders: 1,
        totalSpent: order.total,
      });
    } else {
      const customer = customersMap.get(order.customerInfo.phone);
      customer.totalOrders += 1;
      customer.totalSpent += order.total;
    }
  });

  const customers = Array.from(customersMap.values()).map(c => ({
    ...c,
    isSuspect: suspectPhones.includes(c.phone)
  }));

  const toggleSuspectStatus = (phone: string) => {
    setSuspectPhones(prev => 
      prev.includes(phone) ? prev.filter(p => p !== phone) : [...prev, phone]
    );
  };

  const getCustomerOrders = (phone: string) => {
    return orders.filter(o => o.customerInfo.phone === phone);
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.phone?.includes(searchTerm)
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCustomers(filteredCustomers.map(c => c.phone));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (phone: string) => {
    setSelectedCustomers(prev => 
      prev.includes(phone) ? prev.filter(p => p !== phone) : [...prev, phone]
    );
  };

  const handleBulkStatusUpdate = (action: 'block' | 'unblock') => {
    if (!selectedCustomers.length) return;
    setIsUpdatingBulk(true);
    try {
      if (action === 'block') {
        setSuspectPhones(prev => [...new Set([...prev, ...selectedCustomers])]);
      } else {
        setSuspectPhones(prev => prev.filter(p => !selectedCustomers.includes(p)));
      }
      setSelectedCustomers([]);
    } finally {
      setIsUpdatingBulk(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Bulk Actions Bar */}
      {selectedCustomers.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 px-6 py-4 flex items-center gap-6"
        >
          <span className="font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md text-sm">
            {selectedCustomers.length} selected
          </span>
          <div className="h-6 w-px bg-gray-200"></div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleBulkStatusUpdate('block')}
              disabled={isUpdatingBulk}
              className="text-sm font-medium px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <UserX className="w-4 h-4" />
              Block Selected
            </button>
            <button 
              onClick={() => handleBulkStatusUpdate('unblock')}
              disabled={isUpdatingBulk}
              className="text-sm font-medium px-4 py-2 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              Unblock Selected
            </button>
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <Users className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customers</h1>
          <p className="text-sm text-gray-500 font-medium">Manage your customer base</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
          <input 
            type="text" 
            placeholder="Search customers by name or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left w-12">
                  <input 
                    type="checkbox" 
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Orders</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <motion.tr 
                    key={customer.phone}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`transition-colors ${customer.isSuspect ? 'bg-red-50/50' : 'hover:bg-gray-50'} ${selectedCustomers.includes(customer.phone) ? 'bg-indigo-50/50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedCustomers.includes(customer.phone)}
                        onChange={() => handleSelectCustomer(customer.phone)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm border border-indigo-100 shrink-0">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="font-semibold text-gray-900 whitespace-nowrap">{customer.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 whitespace-nowrap">{customer.phone}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">{customer.address}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-semibold text-gray-900">{customer.totalOrders}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 whitespace-nowrap">৳{customer.totalSpent.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      {customer.isSuspect ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-xs font-semibold border border-red-200 whitespace-nowrap">
                          <ShieldAlert className="w-3 h-3" /> Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 whitespace-nowrap">
                          <ShieldCheck className="w-3 h-3" /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Activity"
                        >
                          <Activity className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toggleSuspectStatus(customer.phone)}
                          className={`p-2 transition-colors rounded-lg flex items-center gap-2 whitespace-nowrap ${
                            customer.isSuspect 
                              ? 'text-emerald-600 hover:bg-emerald-50' 
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                          title={customer.isSuspect ? "Unblock User" : "Block User"}
                        >
                          {customer.isSuspect ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Activity Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-100 shrink-0">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{selectedCustomer.phone}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" /> Order History
            </h4>
            
            <div className="space-y-3">
              {getCustomerOrders(selectedCustomer.phone).map((order: any) => (
                <div key={order.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between hover:border-indigo-100 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900">#{order.id.slice(0, 8)}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}>{order.status}</span>
                    </div>
                    <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">৳{order.total.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{order.items.length} items</div>
                  </div>
                </div>
              ))}
              {getCustomerOrders(selectedCustomer.phone).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No orders found for this customer.</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
