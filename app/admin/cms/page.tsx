'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Clock, LayoutGrid, Save, Plus, Trash2, Edit2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';

export default function AdminCMS() {
  const [banners, setBanners] = useState([
    { id: 1, title: 'Summer Gadget Fest', image: 'https://picsum.photos/seed/banner1/1200/400', link: '/category/gadgets', status: 'Active' },
    { id: 2, title: 'Audio Week', image: 'https://picsum.photos/seed/banner2/1200/400', link: '/category/audio', status: 'Inactive' },
  ]);

  const [flashSale, setFlashSale] = useState({
    title: 'Midnight Tech Drop',
    endTime: '2026-03-20T23:59',
    status: 'Active',
    discount: 'Up to 60% OFF'
  });

  const { offerBanners, setOfferBanners, copyrightText, setCopyrightText } = useStore();

  return (
    <div className="space-y-8">
      {/* Hero Banners */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Hero Banners</h2>
              <p className="text-sm text-gray-500">Manage homepage carousel banners.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm shadow-indigo-200">
            <Plus className="w-4 h-4" />
            Add Banner
          </button>
        </div>

        <div className="space-y-4">
          {banners.map((banner) => (
            <div key={banner.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 border border-gray-100 rounded-2xl hover:border-indigo-100 transition-colors">
              <div className="w-full sm:w-48 h-32 sm:h-16 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                <Image 
                  src={banner.image} 
                  alt={banner.title} 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 w-full">
                <h3 className="font-medium text-gray-900">{banner.title}</h3>
                <p className="text-sm text-gray-500 truncate">Link: {banner.link}</p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  banner.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {banner.status}
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Sale Timer */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Flash Sale Settings</h2>
              <p className="text-sm text-gray-500">Configure the homepage countdown timer.</p>
            </div>
          </div>
        </div>

        <form className="max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); toast.success('Flash sale settings saved!'); }}>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
            <input type="text" value={flashSale.title} onChange={e => setFlashSale({...flashSale, title: e.target.value})} className="w-full px-4 py-2 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
            <input type="datetime-local" value={flashSale.endTime} onChange={e => setFlashSale({...flashSale, endTime: e.target.value})} className="w-full px-4 py-2 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Text</label>
            <input type="text" value={flashSale.discount} onChange={e => setFlashSale({...flashSale, discount: e.target.value})} className="w-full px-4 py-2 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="md:col-span-2 pt-2">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-3xl font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </form>
      </div>

      {/* Featured Categories */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Featured Categories</h2>
              <p className="text-sm text-gray-500">Manage categories displayed on the homepage.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm shadow-indigo-200">
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="border border-gray-100 rounded-2xl p-4 text-center hover:border-indigo-100 transition-colors group relative">
              <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full mb-3 overflow-hidden relative">
                <Image 
                  src={category.image} 
                  alt={category.name} 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-medium text-gray-900">{category.name}</h3>
              <p className="text-xs text-gray-500 mt-1">Order: {category.order}</p>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                <button className="p-1.5 bg-white text-gray-600 hover:text-indigo-600 shadow-sm rounded-md border border-gray-100">
                  <Edit2 className="w-3 h-3" />
                </button>
                <button className="p-1.5 bg-white text-gray-600 hover:text-red-600 shadow-sm rounded-md border border-gray-100">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
