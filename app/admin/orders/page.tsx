'use client';

import { useStore } from '@/store/useStore';
import { useState } from 'react';
import { Search, Filter, MoreVertical, Eye, CheckCircle, XCircle, Truck, ShoppingBag, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isUpdatingBulk, setIsUpdatingBulk] = useState(false);

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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(filteredOrders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
    );
  };

  const handleBulkStatusUpdate = async (newStatus: any) => {
    if (!selectedOrders.length) return;
    setIsUpdatingBulk(true);
    try {
      await Promise.all(selectedOrders.map(id => updateOrderStatus(id, newStatus)));
      toast.success(`Updated ${selectedOrders.length} orders to ${newStatus}`);
      setSelectedOrders([]);
    } catch (error) {
      toast.error('Failed to update some orders');
    } finally {
      setIsUpdatingBulk(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Bulk Actions Bar */}
      {selectedOrders.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 px-6 py-4 flex items-center gap-6"
        >
          <span className="font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md text-sm">
            {selectedOrders.length} selected
          </span>
          <div className="h-6 w-px bg-gray-200"></div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">Change Status:</span>
            <div className="relative">
              <select 
                onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                disabled={isUpdatingBulk}
                className="text-sm font-medium pl-4 pr-10 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors appearance-none"
                value=""
              >
                <option value="" disabled>Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-sm text-gray-500 font-medium">Manage and track customer orders</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
          <input 
            type="text" 
            placeholder="Search orders by ID, name, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none text-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none appearance-none bg-white text-sm font-medium cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
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
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`transition-colors hover:bg-gray-50 ${selectedOrders.includes(order.id) ? 'bg-indigo-50/50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 whitespace-nowrap">#{order.id.startsWith('ORD-NS-') ? order.id : order.id.slice(0, 8)}</div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">{order.items.length} items</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 whitespace-nowrap">{order.customerInfo.name}</div>
                      <div className="text-sm text-gray-500 whitespace-nowrap">{order.customerInfo.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">{new Date(order.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 whitespace-nowrap">৳{order.total.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">Due: ৳{order.dueAmount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border whitespace-nowrap ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex"
                      >
                        <Eye className="w-5 h-5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                <p className="text-sm text-gray-500 mt-1">#{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-indigo-600" /> Customer Info
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Name:</span> <span className="font-medium">{selectedOrder.customerInfo.name}</span></p>
                  <p><span className="text-gray-500">Phone:</span> <span className="font-medium">{selectedOrder.customerInfo.phone}</span></p>
                  <p><span className="text-gray-500">Address:</span> <span className="font-medium">{selectedOrder.customerInfo.address}</span></p>
                  <p><span className="text-gray-500">Zone:</span> <span className="font-medium">{selectedOrder.customerInfo.zone}</span></p>
                </div>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-600" /> Order Status
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Current Status</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <label className="text-sm text-gray-500 block mb-2">Update Status</label>
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => {
                        updateOrderStatus(selectedOrder.id, e.target.value as any);
                        setSelectedOrder({...selectedOrder, status: e.target.value});
                        toast.success(`Order status updated to ${e.target.value}`);
                      }}
                      className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none text-sm font-medium bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-600">Product</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-center">Qty</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-right">Price</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{item.product.title}</div>
                          {item.variantId && <div className="text-xs text-gray-500 mt-0.5">Variant: {item.variantId}</div>}
                        </td>
                        <td className="px-4 py-3 text-center font-medium">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">৳{item.product.discount_price.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">৳{(item.product.discount_price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-full sm:w-64 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">৳{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="font-medium text-gray-900">৳{selectedOrder.shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Advance Payment</span>
                  <span className="font-medium text-gray-900">- ৳{selectedOrder.advancePayment.toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Due</span>
                  <span className="text-xl font-black text-indigo-600">৳{selectedOrder.dueAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
