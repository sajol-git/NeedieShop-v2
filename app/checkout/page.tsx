'use client';

import { useStore, Order } from '@/store/useStore';
import { Navbar } from '@/components/Navbar';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { CartIcon, UserIcon, TrackOrderIcon } from '@/components/icons';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const generateOrderId = (orderCount: number) => {
  const serial = (orderCount + 1).toString().padStart(5, '0');
  return `ORD-NS-${serial}`;
};

export default function CheckoutPage() {
  const cart = useStore((state) => state.cart);
  const user = useStore((state) => state.user);
  const orders = useStore((state) => state.orders);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const addOrder = useStore((state) => state.addOrder);
  const clearCart = useStore((state) => state.clearCart);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user && user.isProfileCompleted ? user.name : '',
    phone: user && user.isProfileCompleted ? user.phone : '',
    address: '',
    zone: 'Inside Dhaka' as 'Inside Dhaka' | 'Outside Dhaka',
    paymentMethod: 'Cash on Delivery' as 'Cash on Delivery' | 'bKash',
  });

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = formData.zone === 'Inside Dhaka' ? 60 : 120;
  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

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
      items: cart,
      total,
      subtotal,
      shippingFee,
      advancePayment: 0,
      dueAmount: total,
      status: 'Pending',
      customerInfo: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        zone: formData.zone,
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
    clearCart();
    toast.success('Order placed successfully!');
    router.push(`/order-success/${newOrder.id}`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Navbar />
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
            <CartIcon className="w-12 h-12 text-gray-300" strokeWidth={10} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="text-gray-500 max-w-xs mx-auto">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link 
            href="/shop" 
            className="inline-block bg-[#8B183A] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#721430] transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Navbar />
      
      <main className="pt-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-500">Complete your order details below</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Shipping & Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* Shipping Info */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#8B183A]/10 rounded-xl flex items-center justify-center text-[#8B183A]">
                  <TrackOrderIcon className="w-5 h-5" strokeWidth={10} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-3xl text-sm focus:ring-2 focus:ring-[#8B183A]/20 outline-none"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-3xl text-sm focus:ring-2 focus:ring-[#8B183A]/20 outline-none"
                        placeholder="01XXXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Delivery Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                      required
                      rows={3}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-3xl text-sm focus:ring-2 focus:ring-[#8B183A]/20 outline-none resize-none"
                      placeholder="House no, Road no, Area, City"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, zone: 'Inside Dhaka' })}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.zone === 'Inside Dhaka' ? 'border-[#8B183A] bg-[#8B183A]/5 text-[#8B183A]' : 'border-gray-100 text-gray-500'
                    }`}
                  >
                    <TrackOrderIcon className="w-6 h-6" strokeWidth={10} />
                    <span className="text-xs font-bold uppercase">Inside Dhaka</span>
                    <span className="text-sm font-bold">৳60</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, zone: 'Outside Dhaka' })}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.zone === 'Outside Dhaka' ? 'border-[#8B183A] bg-[#8B183A]/5 text-[#8B183A]' : 'border-gray-100 text-gray-500'
                    }`}
                  >
                    <TrackOrderIcon className="w-6 h-6" strokeWidth={10} />
                    <span className="text-xs font-bold uppercase">Outside Dhaka</span>
                    <span className="text-sm font-bold">৳120</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#8B183A]/10 rounded-xl flex items-center justify-center text-[#8B183A]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'Cash on Delivery' })}
                  className={`p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                    formData.paymentMethod === 'Cash on Delivery' ? 'border-[#8B183A] bg-[#8B183A]/5 text-[#8B183A]' : 'border-gray-100 text-gray-500'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    formData.paymentMethod === 'Cash on Delivery' ? 'border-[#8B183A]' : 'border-gray-300'
                  }`}>
                    {formData.paymentMethod === 'Cash on Delivery' && <div className="w-3 h-3 bg-[#8B183A] rounded-full" />}
                  </div>
                  <span className="font-bold">Cash on Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'bKash' })}
                  className={`p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                    formData.paymentMethod === 'bKash' ? 'border-[#8B183A] bg-[#8B183A]/5 text-[#8B183A]' : 'border-gray-100 text-gray-500'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    formData.paymentMethod === 'bKash' ? 'border-[#8B183A]' : 'border-gray-300'
                  }`}>
                    {formData.paymentMethod === 'bKash' && <div className="w-3 h-3 bg-[#8B183A] rounded-full" />}
                  </div>
                  <span className="font-bold">bKash Payment</span>
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-gray-900">
                  <CartIcon className="w-6 h-6 scale-110 text-[#8B183A]" strokeWidth={10} />
                  Order Summary
                </h2>

                <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                  {cart.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="relative w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                        <Image src={item.product.featureImage || '/placeholder.png'} alt={item.product.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.product.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-gray-900 mt-2">৳{(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeFromCart(item.product.id, item.variantId)}
                        className="p-2 hover:bg-red-50 rounded-xl transition-colors self-start"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-dashed border-gray-200">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping Fee</span>
                    <span className="font-bold text-gray-900">৳{shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-black text-gray-900 pt-6 border-t border-dashed border-gray-200">
                    <span>Total</span>
                    <span className="text-[#8B183A]">৳{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8B183A] text-white py-5 rounded-full font-bold text-lg mt-10 hover:bg-[#721430] transition-all shadow-xl shadow-red-100"
                >
                  Place Order Now
                </button>

                <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <ShieldCheck className="w-4 h-4" />
                  Secure Checkout Powered by NeedieShop
                </div>
              </section>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
