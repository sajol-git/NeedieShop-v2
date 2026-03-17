'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Navbar } from '@/components/Navbar';
import { Search, Truck, CheckCircle, Clock, ChevronRight, MapPin, Phone, User } from 'lucide-react';
import { TotalOrderIcon } from '@/components/icons';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const orders = useStore((state) => state.orders);

  // Use useMemo for the initial result to avoid extra renders
  const initialResult = useMemo(() => {
    if (!initialSearch) return null;
    const order = orders.find(o => 
      o.id.toLowerCase() === initialSearch.toLowerCase() || 
      o.customerInfo.phone === initialSearch
    );
    return order || 'not_found';
  }, [initialSearch, orders]);

  const [manualResult, setManualResult] = useState<any>(null);
  const trackingResult = manualResult || initialResult;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const order = orders.find(o => 
      o.id.toLowerCase() === searchQuery.toLowerCase() || 
      o.customerInfo.phone === searchQuery
    );
    setManualResult(order || 'not_found');
  };

  const getStatusStep = (status: string) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    return steps.indexOf(status);
  };

  return (
    <main className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Track Your Order</h1>
        <p className="text-gray-500">Enter your Order ID or Phone Number to see the status</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-12">
        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Order ID (e.g. ORD-123...) or Phone Number"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#8B183A]/20 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-[#8B183A] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#721430] transition-colors"
          >
            Track Now
          </button>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {trackingResult === 'not_found' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl p-12 text-center border border-gray-100"
          >
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-500">We couldn&apos;t find any order with that ID or phone number. Please check and try again.</p>
          </motion.div>
        )}

        {trackingResult && trackingResult !== 'not_found' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Status Stepper */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                  <h3 className="text-xl font-black text-gray-900">{trackingResult.id}</h3>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                  trackingResult.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                  trackingResult.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-indigo-100 text-indigo-700'
                }`}>
                  {trackingResult.status}
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 -z-10" />
                <div 
                  className="absolute top-5 left-0 h-1 bg-[#8B183A] transition-all duration-1000 -z-10" 
                  style={{ width: `${(getStatusStep(trackingResult.status) / 3) * 100}%` }}
                />
                
                <div className="flex justify-between">
                  {[
                    { label: 'Pending', icon: Clock },
                    { label: 'Processing', icon: TotalOrderIcon },
                    { label: 'Shipped', icon: Truck },
                    { label: 'Delivered', icon: CheckCircle },
                  ].map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = getStatusStep(trackingResult.status) >= index;
                    const isCurrent = getStatusStep(trackingResult.status) === index;

                    return (
                      <div key={step.label} className="flex flex-col items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted ? 'bg-[#8B183A] text-white' : 'bg-white border-2 border-gray-100 text-gray-300'
                        } ${isCurrent ? 'ring-4 ring-[#8B183A]/20' : ''}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          isCompleted ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Tracking History */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Tracking History</h3>
                <div className="space-y-8">
                  {trackingResult.trackingHistory.slice().reverse().map((update: any, index: number) => (
                    <div key={index} className="relative flex gap-4">
                      {index !== trackingResult.trackingHistory.length - 1 && (
                        <div className="absolute left-2.5 top-6 w-0.5 h-10 bg-gray-100" />
                      )}
                      <div className={`w-5 h-5 rounded-full mt-1 shrink-0 ${
                        index === 0 ? 'bg-[#8B183A]' : 'bg-gray-200'
                      }`} />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{update.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(update.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Order Details</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</p>
                      <p className="text-sm font-bold text-gray-900">{trackingResult.customerInfo.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                      <p className="text-sm font-bold text-gray-900">{trackingResult.customerInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Address</p>
                      <p className="text-sm font-bold text-gray-900">{trackingResult.customerInfo.address}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Amount</span>
                    <span className="text-xl font-black text-[#8B183A]">৳{trackingResult.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Navbar />
      <Suspense fallback={<div className="pt-32 text-center">Loading tracker...</div>}>
        <TrackOrderContent />
      </Suspense>
    </div>
  );
}
