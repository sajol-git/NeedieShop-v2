'use client';

import { useStore } from '@/store/useStore';
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Package, Search, Clock, CheckCircle2, XCircle, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

export default function AccountPage() {
  const { orders } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const found = orders.find(o => 
      o.id.toLowerCase() === searchQuery.toLowerCase() && 
      o.customerInfo.phone === searchPhone
    );
    setSearchedOrder(found || null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Processing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Shipped': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'Delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-5 h-5" />;
      case 'Processing': return <Package className="w-5 h-5" />;
      case 'Shipped': return <Truck className="w-5 h-5" />;
      case 'Delivered': return <CheckCircle2 className="w-5 h-5" />;
      case 'Cancelled': return <XCircle className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Navbar />
      
      <main className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Exclusive Deals */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Exclusive Deals</h2>
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                <h3 className="font-bold text-red-900">10% OFF on Gadgets</h3>
                <p className="text-sm text-red-700">Use code: GADGET10</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <h3 className="font-bold text-emerald-900">Free Shipping</h3>
                <p className="text-sm text-emerald-700">On orders over ৳5000</p>
              </div>
            </div>
          </div>
          {/* Support */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Support</h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Need help? Our team is here for you.</p>
              <button className="w-full bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-gray-600">Enter your Order ID and Phone Number to see the current status.</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 mb-12">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input 
                type="text" 
                required
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Order ID (e.g., ORD-123456)"
                className="w-full px-4 py-3 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-[#8B183A]/20 focus:border-[#8B183A] transition-all outline-none"
              />
            </div>
            <div className="flex-1">
              <input 
                type="tel" 
                required
                value={searchPhone}
                onChange={e => setSearchPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-[#8B183A]/20 focus:border-[#8B183A] transition-all outline-none"
              />
            </div>
            <button 
              type="submit"
              className="bg-[#8B183A] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#6d122d] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-100"
            >
              <Search className="w-5 h-5" />
              Track
            </button>
          </form>
        </div>

        {hasSearched && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {searchedOrder ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Order {searchedOrder.id}</h2>
                    <p className="text-sm text-gray-500">Placed on {new Date(searchedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-medium ${getStatusColor(searchedOrder.status)}`}>
                    {getStatusIcon(searchedOrder.status)}
                    {searchedOrder.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Delivery Details</h3>
                    <div className="space-y-3 text-sm text-gray-600 bg-gray-50 p-6 rounded-3xl">
                      <p><span className="font-bold text-gray-900">Name:</span> {searchedOrder.customerInfo.name}</p>
                      <p><span className="font-bold text-gray-900">Phone:</span> {searchedOrder.customerInfo.phone}</p>
                      <p><span className="font-bold text-gray-900">Address:</span> {searchedOrder.customerInfo.address}</p>
                      <p><span className="font-bold text-gray-900">Zone:</span> {searchedOrder.customerInfo.zone}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Order Summary</h3>
                    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Subtotal</span>
                          <span className="font-bold text-gray-900">৳{searchedOrder.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Shipping</span>
                          <span className="font-bold text-gray-900">৳{searchedOrder.shippingFee.toLocaleString()}</span>
                        </div>
                        {searchedOrder.advancePayment > 0 && (
                          <div className="flex justify-between text-emerald-600 text-sm">
                            <span>Advance Paid</span>
                            <span className="font-bold">-৳{searchedOrder.advancePayment.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between font-black text-gray-900 pt-4 border-t border-dashed border-gray-200 text-lg">
                        <span>Total Due</span>
                        <span className="text-[#F14B24]">৳{searchedOrder.dueAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-12">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Ordered Items</h3>
                  <div className="space-y-4">
                    {searchedOrder.items.map((item: any) => {
                      const variant = item.product.variants.find((v: any) => v.id === item.variantId);
                      const price = variant?.price || item.product.price;
                      return (
                        <div key={`${item.product.id}-${item.variantId}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-200">
                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-sm">{item.product.name}</h4>
                            {variant && <p className="text-xs text-gray-500">{variant.name}</p>}
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="font-bold text-gray-900">
                            ৳{(price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    className="flex-1 bg-[#F14B24] text-white py-4 rounded-full font-bold hover:bg-[#d94320] transition-all shadow-lg shadow-orange-100"
                  >
                    Download Receipt
                  </button>
                  <button 
                    className="flex-1 border-2 border-[#F14B24] text-[#F14B24] py-4 rounded-full font-bold hover:bg-orange-50 transition-all"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h3>
                <p className="text-gray-500">Please check your Order ID and Phone Number and try again.</p>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
