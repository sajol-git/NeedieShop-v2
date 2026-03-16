'use client';

import { useState } from 'react';
import { Megaphone, MessageCircle, Tag, Clock, Send, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function AdminMarketing() {
  const [coupons, setCoupons] = useState([
    { id: 1, code: 'NEEDIE15', discount: '15%', usageLimit: 100, used: 45, status: 'Active' },
    { id: 2, code: 'WELCOME10', discount: '10%', usageLimit: 500, used: 490, status: 'Active' },
    { id: 3, code: 'FLASHSALE50', discount: '50%', usageLimit: 50, used: 50, status: 'Expired' },
  ]);

  const [abandonedCarts, setAbandonedCarts] = useState([
    { id: 1, phone: '01711000000', name: 'Rahim', total: 4500, time: '2 hours ago', status: 'Pending' },
    { id: 2, phone: '01822000000', name: 'Karim', total: 8900, time: '5 hours ago', status: 'Pending' },
    { id: 3, phone: '01933000000', name: 'Sadia', total: 3200, time: '1 day ago', status: 'Recovered' },
  ]);

  const handleSendWhatsApp = (id: number, phone: string) => {
    toast.success(`WhatsApp reminder sent to ${phone}`);
    setAbandonedCarts(carts => carts.map(c => c.id === id ? { ...c, status: 'Sent' } : c));
  };

  return (
    <div className="space-y-8">
      {/* WhatsApp Cart Recovery */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">WhatsApp Cart Recovery</h2>
              <p className="text-sm text-gray-500">Automated reminders for abandoned carts.</p>
            </div>
          </div>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg">
            Configure Automation
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Cart Value</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Abandoned</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {abandonedCarts.map((cart) => (
                <tr key={cart.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{cart.name}</div>
                    <div className="text-sm text-gray-500">{cart.phone}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">৳{cart.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cart.time}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cart.status === 'Recovered' ? 'bg-emerald-100 text-emerald-800' :
                      cart.status === 'Sent' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {cart.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleSendWhatsApp(cart.id, cart.phone)}
                      disabled={cart.status !== 'Pending'}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      Send Reminder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coupon Management */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Coupon Codes</h2>
              <p className="text-sm text-gray-500">Manage usage-limited discount codes.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm shadow-indigo-200">
            <Plus className="w-4 h-4" />
            Create Coupon
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-indigo-50 text-indigo-700 font-mono font-bold px-3 py-1 rounded-lg border border-indigo-100 tracking-wider">
                  {coupon.code}
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  coupon.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {coupon.status}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-semibold text-gray-900">{coupon.discount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Usage Limit</span>
                  <span className="font-medium text-gray-900">{coupon.used} / {coupon.usageLimit}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                  <div 
                    className={`h-1.5 rounded-full ${coupon.status === 'Active' ? 'bg-indigo-600' : 'bg-gray-400'}`} 
                    style={{ width: `${(coupon.used / coupon.usageLimit) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Web Push Notifications</h2>
            <p className="text-sm text-gray-500">Send instant alerts to your subscribers.</p>
          </div>
        </div>

        <form className="max-w-2xl space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Push notification scheduled!'); }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notification Title</label>
            <input type="text" required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., Flash Sale Starts Now!" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
            <textarea required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24" placeholder="Get up to 50% off on premium audio gear..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target URL</label>
            <input type="url" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://needieshop.bd/flash-sale" />
          </div>
          <div className="pt-2">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
