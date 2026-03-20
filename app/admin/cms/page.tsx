'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Clock, LayoutGrid, Save, Trash2, Edit2, Settings } from 'lucide-react';
import { AddIcon } from '@/components/icons';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';
import { ImageUpload } from '@/components/ImageUpload';

export default function AdminCMS() {
  const { 
    heroBanners, setHeroBanners, 
    footerContent, setFooterContent,
    copyrightText, setCopyrightText 
  } = useStore();

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState('');

  const handleSaveBanner = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bannerData = {
      id: editingBanner?.id || Date.now(),
      title: formData.get('title') as string,
      image: bannerImageUrl || (formData.get('image') as string),
      link: formData.get('link') as string,
      status: formData.get('status') as 'Active' | 'Inactive',
    };

    try {
      if (editingBanner) {
        await setHeroBanners(heroBanners.map(b => b.id === editingBanner.id ? bannerData : b));
        toast.success('Banner updated');
      } else {
        await setHeroBanners([...heroBanners, bannerData]);
        toast.success('Banner added');
      }
      setIsBannerModalOpen(false);
      setEditingBanner(null);
    } catch (error) {
      toast.error('Failed to save banner');
    }
  };

  const handleDeleteBanner = async (id: number) => {
    try {
      await setHeroBanners(heroBanners.filter(b => b.id !== id));
      toast.success('Banner deleted');
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  const [loading, setLoading] = useState(false);

  const handleUpdateFooter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const content = {
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      facebook: formData.get('facebook') as string,
      instagram: formData.get('instagram') as string,
      youtube: formData.get('youtube') as string,
    };
    try {
      await setFooterContent(content);
      toast.success('Footer content updated');
    } catch (error) {
      toast.error('Failed to update footer content');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCopyright = async () => {
    setLoading(true);
    try {
      await setCopyrightText(copyrightText);
      toast.success('Copyright updated');
    } catch (error) {
      toast.error('Failed to update copyright');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
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
          <button 
            onClick={() => { setEditingBanner(null); setBannerImageUrl(''); setIsBannerModalOpen(true); }}
            className="flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm shadow-indigo-200"
          >
            <AddIcon className="w-4 h-4" />
            Add Banner
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {heroBanners.map((banner) => (
            <div key={banner.id} className="group relative border border-gray-100 rounded-2xl overflow-hidden hover:border-indigo-100 transition-all">
              <div className="aspect-[3/1] relative bg-gray-100">
                <Image 
                  src={banner.image || '/placeholder.png'} 
                  alt={banner.title} 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => { setEditingBanner(banner); setBannerImageUrl(banner.image); setIsBannerModalOpen(true); }}
                    className="p-2 bg-white text-gray-900 rounded-full hover:bg-indigo-600 hover:text-white transition-all transform scale-90 group-hover:scale-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="p-2 bg-white text-gray-900 rounded-full hover:bg-red-600 hover:text-white transition-all transform scale-90 group-hover:scale-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{banner.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    banner.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {banner.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{banner.link}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer & General CMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Footer Content */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Footer Content</h2>
              <p className="text-sm text-gray-500">Manage contact info and social links.</p>
            </div>
          </div>

          <form onSubmit={handleUpdateFooter} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
              <textarea 
                name="address"
                defaultValue={footerContent.address}
                className="w-full px-4 py-2 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-20 text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  name="phone"
                  type="text" 
                  defaultValue={footerContent.phone}
                  className="w-full px-4 py-2 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  name="email"
                  type="email" 
                  defaultValue={footerContent.email}
                  className="w-full px-4 py-2 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900 border-b pb-1">Social Links</h3>
              <div className="grid grid-cols-1 gap-3">
                <input name="facebook" defaultValue={footerContent.facebook} placeholder="Facebook URL" className="w-full px-4 py-2 rounded-2xl border border-gray-200 text-sm outline-none" />
                <input name="instagram" defaultValue={footerContent.instagram} placeholder="Instagram URL" className="w-full px-4 py-2 rounded-2xl border border-gray-200 text-sm outline-none" />
                <input name="youtube" defaultValue={footerContent.youtube} placeholder="Youtube URL" className="w-full px-4 py-2 rounded-2xl border border-gray-200 text-sm outline-none" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-2xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Footer Content'}
            </button>
          </form>
        </div>

        {/* Other CMS Settings */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Site Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={copyrightText} 
                    onChange={e => setCopyrightText(e.target.value)} 
                    className="flex-1 px-4 py-2 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                  />
                  <button 
                    onClick={handleSaveCopyright}
                    disabled={loading}
                    className="bg-gray-900 text-white px-4 py-2 rounded-2xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingBanner ? 'Edit Banner' : 'Add New Banner'}
            </h2>
            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title</label>
                <input name="title" defaultValue={editingBanner?.title} required className="w-full px-4 py-2 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input name="image" value={bannerImageUrl} onChange={(e) => setBannerImageUrl(e.target.value)} required className="flex-1 px-4 py-2 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500" />
                  <ImageUpload onUpload={setBannerImageUrl} buttonText="Upload" className="px-4 py-2 rounded-2xl" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Link</label>
                <input name="link" defaultValue={editingBanner?.link} required className="w-full px-4 py-2 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" defaultValue={editingBanner?.status || 'Active'} className="w-full px-4 py-2 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsBannerModalOpen(false)}
                  className="flex-1 px-6 py-2.5 rounded-2xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-2.5 rounded-2xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
