'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, CreditCard, Truck, Users, Save, Shield, Tag, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';

export default function AdminSettings() {
  const { 
    storeSettings, setStoreSettings,
    paymentSettings, setPaymentSettings,
    shippingZones, setShippingZones
  } = useStore();

  const [localStoreSettings, setLocalStoreSettings] = useState(storeSettings);
  const [localPaymentSettings, setLocalPaymentSettings] = useState(paymentSettings);
  const [localShippingZones, setLocalShippingZones] = useState(shippingZones);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setStoreSettings(localStoreSettings);
      await setPaymentSettings(localPaymentSettings);
      await setShippingZones(localShippingZones);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* General Settings */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
            <p className="text-sm text-gray-500">Manage your store&apos;s basic information.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input type="text" value={localStoreSettings.name} onChange={e => setLocalStoreSettings({...localStoreSettings, name: e.target.value})} className="w-full px-4 py-2 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
              <input type="email" value={localStoreSettings.email} onChange={e => setLocalStoreSettings({...localStoreSettings, email: e.target.value})} className="w-full px-4 py-2 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
              <input type="text" value={localStoreSettings.phone} onChange={e => setLocalStoreSettings({...localStoreSettings, phone: e.target.value})} className="w-full px-4 py-2 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select value={localStoreSettings.currency} onChange={e => setLocalStoreSettings({...localStoreSettings, currency: e.target.value})} className="w-full px-4 py-2 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                <option value="BDT (৳)">BDT (৳)</option>
                <option value="USD ($)">USD ($)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
              <textarea value={localStoreSettings.address} onChange={e => setLocalStoreSettings({...localStoreSettings, address: e.target.value})} className="w-full px-4 py-2 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-20"></textarea>
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-3xl font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Payment Settings */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
            <p className="text-sm text-gray-500">Configure accepted payment options and advance amounts.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
            <div>
              <h3 className="font-medium text-gray-900">Cash on Delivery (COD)</h3>
              <p className="text-sm text-gray-500">Allow customers to pay upon receiving the order.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={localPaymentSettings.codEnabled} onChange={e => setLocalPaymentSettings({...localPaymentSettings, codEnabled: e.target.checked})} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
            <div>
              <h3 className="font-medium text-gray-900">bKash Integration</h3>
              <p className="text-sm text-gray-500">Accept mobile payments via bKash.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={localPaymentSettings.bkashEnabled} onChange={e => setLocalPaymentSettings({...localPaymentSettings, bkashEnabled: e.target.checked})} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
            <h3 className="font-medium text-gray-900 mb-2">Advance Payment Amount (৳)</h3>
            <p className="text-sm text-gray-500 mb-4">Required advance amount for COD orders to prevent fake orders.</p>
            <input 
              type="number" 
              value={localPaymentSettings.advanceAmount} 
              onChange={e => setLocalPaymentSettings({...localPaymentSettings, advanceAmount: Number(e.target.value)})} 
              className="w-full max-w-xs px-4 py-2 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
        </div>
      </div>

      {/* Shipping Zones */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Shipping Zones</h2>
              <p className="text-sm text-gray-500">Manage delivery areas and fees.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {localShippingZones.map((zone) => (
            <div key={zone.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-2xl items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-gray-500 mb-1">Zone Name</label>
                <input type="text" value={zone.name} readOnly className="w-full px-4 py-2 rounded-3xl border border-gray-200 bg-gray-50 outline-none text-sm" />
              </div>
              <div className="w-full sm:w-32">
                <label className="block text-xs font-medium text-gray-500 mb-1">Fee (৳)</label>
                <input type="number" value={zone.fee} onChange={(e) => {
                  const newZones = localShippingZones.map(z => z.id === zone.id ? {...z, fee: Number(e.target.value)} : z);
                  setLocalShippingZones(newZones);
                }} className="w-full px-4 py-2 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
              </div>
              <div className="w-full sm:w-32">
                <label className="block text-xs font-medium text-gray-500 mb-1">Est. Days</label>
                <input type="text" value={zone.estimatedDays} onChange={(e) => {
                  const newZones = localShippingZones.map(z => z.id === zone.id ? {...z, estimatedDays: e.target.value} : z);
                  setLocalShippingZones(newZones);
                }} className="w-full px-4 py-2 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
