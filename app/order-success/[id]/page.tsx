'use client';

import { useStore } from '@/store/useStore';
import { Navbar } from '@/components/Navbar';
import { CheckCircle2, Package, Truck, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const orders = useStore((state) => state.orders);
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Navbar />
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Link href="/" className="text-[#8B183A] font-bold">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      <Navbar />
      
      <main className="pt-32 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          
          <h1 className="text-4xl font-black text-gray-900 mb-4">Order Placed!</h1>
          <p className="text-gray-500 mb-12 text-lg">
            Thank you for your order. Your order ID is <span className="font-bold text-gray-900">#{order.id}</span>.
            We will contact you shortly to confirm your delivery.
          </p>

          {/* Order Summary Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-sm mb-12 text-left">
            <h2 className="text-xl font-bold text-gray-900 text-center mb-8">Order Summary</h2>
            
            <div className="space-y-6 mb-8">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.product.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-gray-900">
                    ৳{(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-dashed border-gray-200">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping Charge</span>
                <span className="font-medium">৳{order.shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Discount</span>
                <span className="font-medium">৳0.00</span>
              </div>
              <div className="flex justify-between text-xl font-black text-gray-900 pt-4 border-t border-dashed border-gray-200">
                <span>Total</span>
                <span>৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => toast.info('Receipt download started...')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#F14B24] text-white px-10 py-4 rounded-full font-bold hover:bg-[#d94320] transition-all shadow-lg shadow-orange-200"
            >
              Download Receipt
            </button>
            <button 
              onClick={() => toast.error('Please contact support to cancel order')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 border-2 border-[#F14B24] text-[#F14B24] px-10 py-4 rounded-full font-bold hover:bg-orange-50 transition-all"
            >
              Cancel Order
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6">
            <Link href="/track-order" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Track Order
            </Link>
            <Link href="/" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
