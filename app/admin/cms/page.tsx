'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Type,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function CMSPage() {
  const { heroBanners, setHeroBanners, offerBanners, setOfferBanners } = useStore();
  const [activeTab, setActiveTab] = useState<'hero' | 'offer'>('hero');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    link: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  // Offer Banners local state (assuming 3 banners)
  const [localOfferBanners, setLocalOfferBanners] = useState<{ title: string; image: string; link: string }[]>(
    Array.isArray(offerBanners) && offerBanners.length > 0 
      ? (typeof offerBanners[0] === 'string' 
          ? offerBanners.map(img => ({ title: '', image: img, link: '' }))
          : offerBanners as any)
      : [
          { title: 'Exclusive for Man', image: 'https://picsum.photos/seed/man/600/300', link: '#' },
          { title: 'Exclusive for Woman', image: 'https://picsum.photos/seed/woman/600/300', link: '#' },
          { title: 'Exclusive for Kids', image: 'https://picsum.photos/seed/kids/600/300', link: '#' },
        ]
  );

  const handleSaveOfferBanners = async () => {
    try {
      await setOfferBanners(localOfferBanners);
      toast.success('Offer banners updated successfully');
    } catch (error) {
      toast.error('Failed to update offer banners');
    }
  };

  const handleAdd = async () => {
    if (!formData.title || !formData.image) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newBanner = {
      id: Date.now(),
      ...formData
    };

    try {
      await setHeroBanners([...heroBanners, newBanner]);
      toast.success('Banner added successfully');
      setIsAdding(false);
      setFormData({ title: '', image: '', link: '', status: 'Active' });
    } catch (error) {
      toast.error('Failed to add banner');
    }
  };

  const handleUpdate = async (id: number) => {
    const updatedBanners = heroBanners.map(b => 
      b.id === id ? { ...b, ...formData } : b
    );

    try {
      await setHeroBanners(updatedBanners);
      toast.success('Banner updated successfully');
      setEditingId(null);
    } catch (error) {
      toast.error('Failed to update banner');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      await setHeroBanners(heroBanners.filter(b => b.id !== id));
      toast.success('Banner deleted successfully');
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  const toggleStatus = async (id: number) => {
    const updatedBanners = heroBanners.map(b => 
      b.id === id ? { ...b, status: b.status === 'Active' ? 'Inactive' : 'Active' } : b
    );

    try {
      await setHeroBanners(updatedBanners);
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const moveBanner = async (index: number, direction: 'up' | 'down') => {
    const newBanners = [...heroBanners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newBanners.length) return;
    
    [newBanners[index], newBanners[targetIndex]] = [newBanners[targetIndex], newBanners[index]];
    
    try {
      await setHeroBanners(newBanners);
    } catch (error) {
      toast.error('Failed to reorder banners');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">CMS Management</h2>
          <p className="text-sm text-gray-500 font-medium">Manage your homepage content and banners</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('hero')}
          className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'hero' ? 'border-[#8B183A] text-[#8B183A]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Hero Banners
        </button>
        <button
          onClick={() => setActiveTab('offer')}
          className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'offer' ? 'border-[#8B183A] text-[#8B183A]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Offer Banners
        </button>
      </div>

      {activeTab === 'hero' ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Hero Banners</h3>
              <p className="text-sm text-gray-500">Manage your homepage slider banners</p>
            </div>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 bg-[#8B183A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#70122e] transition-all shadow-lg shadow-[#8B183A]/20"
              >
                <Plus className="w-5 h-5" />
                Add New Banner
              </button>
            )}
          </div>

          {isAdding && (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">New Hero Banner</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Type className="w-4 h-4" /> Banner Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B183A]/20 focus:border-[#8B183A] transition-all"
                    placeholder="Summer Collection 2024"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" /> Redirect Link
                  </label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B183A]/20 focus:border-[#8B183A] transition-all"
                    placeholder="/category/summer-collection"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B183A]/20 focus:border-[#8B183A] transition-all"
                    placeholder="https://example.com/banner.jpg"
                  />
                  <p className="text-xs text-gray-400">Recommended size: 1920x740px or 2.6:1 aspect ratio</p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="bg-[#8B183A] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#70122e] transition-all shadow-lg shadow-[#8B183A]/20"
                >
                  Save Banner
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {heroBanners.length > 0 ? (
              heroBanners.map((banner, index) => (
                <div 
                  key={banner.id} 
                  className={`bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden transition-all ${editingId === banner.id ? 'ring-2 ring-[#8B183A]' : ''}`}
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Banner Preview */}
                    <div className="lg:w-1/3 relative aspect-[2.6/1] lg:aspect-auto bg-gray-100">
                      <Image
                        src={banner.image || '/placeholder.png'}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          banner.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {banner.status}
                        </span>
                      </div>
                    </div>

                    {/* Banner Info */}
                    <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                      {editingId === banner.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={formData.title}
                              onChange={e => setFormData({ ...formData, title: e.target.value })}
                              className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm"
                              placeholder="Title"
                            />
                            <input
                              type="text"
                              value={formData.link}
                              onChange={e => setFormData({ ...formData, link: e.target.value })}
                              className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm"
                              placeholder="Link"
                            />
                            <input
                              type="text"
                              value={formData.image}
                              onChange={e => setFormData({ ...formData, image: e.target.value })}
                              className="w-full md:col-span-2 px-4 py-2 rounded-xl border border-gray-200 text-sm"
                              placeholder="Image URL"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:text-gray-600">
                              <X className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleUpdate(banner.id)} className="p-2 text-emerald-500 hover:text-emerald-600">
                              <Save className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-xl font-black text-gray-900">{banner.title}</h4>
                              <p className="text-sm text-gray-500 font-medium flex items-center gap-2 mt-1">
                                <LinkIcon className="w-3 h-3" /> {banner.link || 'No link'}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => moveBanner(index, 'up')}
                                disabled={index === 0}
                                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                              >
                                <MoveUp className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => moveBanner(index, 'down')}
                                disabled={index === heroBanners.length - 1}
                                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                              >
                                <MoveDown className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleStatus(banner.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                  banner.status === 'Active' 
                                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {banner.status === 'Active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                {banner.status === 'Active' ? 'Active' : 'Inactive'}
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingId(banner.id);
                                  setFormData({
                                    title: banner.title,
                                    image: banner.image,
                                    link: banner.link,
                                    status: banner.status
                                  });
                                }}
                                className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(banner.id)}
                                className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-20 rounded-3xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Banners Found</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">Add your first hero banner to start showcasing your collections on the homepage.</p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="mt-6 flex items-center gap-2 bg-[#8B183A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#70122e] transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Add First Banner
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Offer Banners</h3>
            <p className="text-sm text-gray-500">Manage the 3 banners below categories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {localOfferBanners.map((banner, index) => (
              <div key={index} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="relative aspect-[2/1] rounded-2xl overflow-hidden bg-gray-100 mb-4">
                  <Image src={banner.image || '/placeholder.png'} alt={banner.title} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</label>
                    <input
                      type="text"
                      value={banner.title}
                      onChange={e => {
                        const newBanners = [...localOfferBanners];
                        newBanners[index].title = e.target.value;
                        setLocalOfferBanners(newBanners);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm"
                      placeholder="Banner Title"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Image URL</label>
                    <input
                      type="text"
                      value={banner.image}
                      onChange={e => {
                        const newBanners = [...localOfferBanners];
                        newBanners[index].image = e.target.value;
                        setLocalOfferBanners(newBanners);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm"
                      placeholder="Image URL"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Link</label>
                    <input
                      type="text"
                      value={banner.link}
                      onChange={e => {
                        const newBanners = [...localOfferBanners];
                        newBanners[index].link = e.target.value;
                        setLocalOfferBanners(newBanners);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm"
                      placeholder="Redirect Link"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveOfferBanners}
              className="bg-[#8B183A] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#70122e] transition-all shadow-lg shadow-[#8B183A]/20 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save All Offer Banners
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
