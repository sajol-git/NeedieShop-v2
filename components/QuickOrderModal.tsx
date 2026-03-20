'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Phone, User, Truck } from 'lucide-react';
import { AddToBagIcon } from './icons/AddToBagIcon';
import { Product, useStore, Order } from '@/store/useStore';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedVariantId?: string;
  quantity: number;
}

const generateOrderId = (orderCount: number) => {
  const serial = (orderCount + 1).toString().padStart(5, '0');
  return `ORD-NS-${serial}`;
};

export function QuickOrderModal({ isOpen, onClose, product, selectedVariantId, quantity }: QuickOrderModalProps) {
  const addOrder = useStore((state) => state.addOrder);
  const orders = useStore((state) => state.orders);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    zone: 'Inside Dhaka' as 'Inside Dhaka' | 'Outside Dhaka',
  });

  const shippingFee = formData.zone === 'Inside Dhaka' ? 60 : 120;
  const subtotal = product.discount_price * quantity;
  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    let ipAddress = 'unknown';
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      ipAddress = data.ip;
    } catch (error) {
      console.error('Failed to get IP address', error);
    }

    const newOrder: Order = {
      id: generateOrderId(orders.length),
      items: [{ product, variantId: selectedVariantId, quantity }],
      total,
      subtotal,
      shippingFee,
      advancePayment: 0,
      dueAmount: total,
      status: 'Pending',
      customerInfo: {
        ...formData,
        ipAddress,
      },
      trackingHistory: [
        {
          status: 'Pending',
          date: new Date().toISOString(),
          message: 'Order placed successfully.',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    addOrder(newOrder);
    toast.success('Order placed successfully!');
    onClose();
    router.push(`/order-success/${newOrder.id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#8B183A] rounded-xl flex items-center justify-center text-white">
                    <AddToBagIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Quick Order</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-3xl text-sm focus:ring-2 focus:ring-[#8B183A]/20 outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-3xl text-sm focus:ring-2 focus:ring-[#8B183A]/20 outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                    <textarea
                      placeholder="Delivery Address"
                      required
                      rows={3}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-3xl text-sm focus:ring-2 focus:ring-[#8B183A]/20 outline-none resize-none"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, zone: 'Inside Dhaka' })}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.zone === 'Inside Dhaka' ? 'border-[#8B183A] bg-[#8B183A]/5 text-[#8B183A]' : 'border-gray-100 text-gray-500'
                    }`}
                  >
                    <Truck className="w-6 h-6" strokeWidth={1.5} />
                    <span className="text-xs font-bold uppercase">Inside Dhaka</span>
                    <span className="text-sm font-bold">৳60</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, zone: 'Outside Dhaka' })}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.zone === 'Outside Dhaka' ? 'border-[#8B183A] bg-[#8B183A]/5 text-[#8B183A]' : 'border-gray-100 text-gray-500'
                    }`}
                  >
                    <Truck className="w-6 h-6" strokeWidth={1.5} />
                    <span className="text-xs font-bold uppercase">Outside Dhaka</span>
                    <span className="text-sm font-bold">৳120</span>
                  </button>
                </div>

                <div className="bg-white border border-gray-100 p-6 rounded-3xl space-y-3 shadow-sm">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping Fee</span>
                    <span className="font-bold text-gray-900">৳{shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-gray-900 pt-4 border-t border-dashed border-gray-200">
                    <span>Total</span>
                    <span className="text-[#8B183A]">৳{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8B183A] text-white py-5 rounded-full font-bold text-lg hover:bg-[#721430] transition-all shadow-xl shadow-red-100"
                >
                  Confirm Order
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
