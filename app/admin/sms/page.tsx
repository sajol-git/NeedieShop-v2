'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Send, Wallet, Loader2 } from 'lucide-react';

export default function AdminSMS() {
  const [balance, setBalance] = useState<any>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [sending, setSending] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/sms/balance')
      .then(res => res.json())
      .then(data => {
        setBalance(data);
        setLoadingBalance(false);
      })
      .catch(() => {
        toast.error('Failed to load balance');
        setLoadingBalance(false);
      });
  }, []);

  const handleSendSMS = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: phoneNumber, message }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        toast.success('SMS sent successfully!');
        setMessage('');
        setPhoneNumber('');
        // Refresh balance
        fetch('/api/sms/balance').then(res => res.json()).then(setBalance);
      } else {
        toast.error(data.message || 'Failed to send SMS');
      }
    } catch (error) {
      toast.error('Failed to send SMS');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">SMS Balance</h2>
            <p className="text-sm text-gray-500">Check your remaining SMS credits.</p>
          </div>
        </div>
        {loadingBalance ? (
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        ) : balance ? (
          <div className="text-2xl font-bold text-gray-900">{balance.remaining_credits} Credits Remaining</div>
        ) : (
          <p className="text-gray-500">Failed to load balance.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Send className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Send Marketing SMS</h2>
            <p className="text-sm text-gray-500">Send a custom message to a customer.</p>
          </div>
        </div>
        <form onSubmit={handleSendSMS} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="01XXXXXXXXX" required className="w-full px-4 py-2 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (Max 160 chars)</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} maxLength={160} required className="w-full px-4 py-2 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24" />
          </div>
          <button type="submit" disabled={sending} className="bg-indigo-600 text-white px-6 py-2.5 rounded-3xl font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 flex items-center gap-2">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send SMS
          </button>
        </form>
      </div>
    </div>
  );
}
