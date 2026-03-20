'use client';

import { useStore } from '@/store/useStore';
import { useState } from 'react';
import { Search, Filter, MoreVertical, Eye, CheckCircle, XCircle, Truck } from 'lucide-react';
import { TotalOrderIcon } from '@/components/icons';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customerInfo?.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Processing': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Shipped': return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'Delivered': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Cancelled': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <TotalOrderIcon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-500">View and manage all customer orders.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
          <input 
            type="text" 
            placeholder="Search orders by ID, name, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-8 py-3 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none appearance-none bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Order ID</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Customer</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Total</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-indigo-600">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.customerInfo.name}</div>
                      <div className="text-sm text-gray-500">{order.customerInfo.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">৳{order.total.toLocaleString()}</div>
                      {order.advancePayment > 0 && (
                        <div className="text-xs text-amber-600 font-medium">Adv: ৳{order.advancePayment}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value as any;
                          try {
                            await updateOrderStatus(order.id, newStatus);
                            toast.success(`Order status updated to ${newStatus}`);
                            fetch('/api/sms/send', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                number: order.customerInfo.phone,
                                message: `Your order #${order.id} status has been updated to ${newStatus}.`,
                              }),
                            }).catch(console.error);
                          } catch (error) {
                            toast.error('Failed to update order status');
                          }
                        }}
                        className={`text-sm font-medium px-3 py-1.5 rounded-full border outline-none cursor-pointer ${getStatusColor(order.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                      >
                        <Eye className="w-5 h-5" strokeWidth={2} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Order Details: {selectedOrder.id}</h3>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircle className="w-6 h-6 text-gray-400" strokeWidth={2} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Name:</span> <span className="font-medium">{selectedOrder.customerInfo.name}</span></p>
                  <p><span className="text-gray-500">Phone:</span> <span className="font-medium">{selectedOrder.customerInfo.phone}</span></p>
                  <p><span className="text-gray-500">Address:</span> <span className="font-medium">{selectedOrder.customerInfo.address}</span></p>
                  {selectedOrder.customerInfo.note && (
                    <p><span className="text-gray-500">Note:</span> <span className="font-medium italic text-gray-600">{selectedOrder.customerInfo.note}</span></p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Status:</span> <span className={`font-bold px-2 py-0.5 rounded-full ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                  <p><span className="text-gray-500">Date:</span> <span className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</span></p>
                  <p><span className="text-gray-500">Payment:</span> <span className="font-medium">{selectedOrder.paymentMethod}</span></p>
                  <p><span className="text-gray-500">Advance:</span> <span className="font-medium">৳{selectedOrder.advancePayment}</span></p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Items</h4>
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Product</th>
                      <th className="px-4 py-3 font-semibold text-center">Qty</th>
                      <th className="px-4 py-3 font-semibold text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{item.product?.name || 'Unknown Product'}</div>
                          {item.variantId && <div className="text-xs text-gray-500">{item.variantId}</div>}
                        </td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">৳{item.product?.price?.toLocaleString() || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-bold">
                    <tr>
                      <td colSpan={2} className="px-4 py-3 text-right">Subtotal</td>
                      <td className="px-4 py-3 text-right">৳{selectedOrder.subtotal.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="px-4 py-3 text-right">Shipping</td>
                      <td className="px-4 py-3 text-right">৳{selectedOrder.shippingFee.toLocaleString()}</td>
                    </tr>
                    <tr className="text-indigo-600 text-lg">
                      <td colSpan={2} className="px-4 py-3 text-right">Total</td>
                      <td className="px-4 py-3 text-right">৳{selectedOrder.total.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
