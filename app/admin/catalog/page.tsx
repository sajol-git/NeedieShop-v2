'use client';

import { useState } from 'react';
import { Tag, Plus, Trash2, Edit2, Search, Image as ImageIcon } from 'lucide-react';
import { TotalOrderIcon } from '@/components/icons';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';
import Image from 'next/image';
import slugify from 'slugify';
import { ImageUpload } from '@/components/ImageUpload';

export default function AdminCatalog() {
  const { categories, addCategory, deleteCategory, brands, addBrand, deleteBrand } = useStore();
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryPhoto, setNewCategoryPhoto] = useState('');
  
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandPhoto, setNewBrandPhoto] = useState('');

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingBrand, setIsAddingBrand] = useState(false);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const slug = slugify(newCategoryName, { lower: true, strict: true });
    
    if (categories.some(c => c.slug === slug)) {
      toast.error('Category already exists');
      return;
    }
    
    setIsAddingCategory(true);
    try {
      await addCategory({
        id: crypto.randomUUID(),
        name: newCategoryName.trim(),
        slug,
        photo: newCategoryPhoto.trim()
      });
      setNewCategoryName('');
      setNewCategoryPhoto('');
      toast.success('Category added successfully');
    } catch (error) {
      toast.error('Failed to add category');
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success('Category removed');
    } catch (error) {
      toast.error('Failed to remove category');
    }
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) return;
    const slug = slugify(newBrandName, { lower: true, strict: true });
    
    if (brands.some(b => b.slug === slug)) {
      toast.error('Brand already exists');
      return;
    }
    
    setIsAddingBrand(true);
    try {
      await addBrand({
        id: crypto.randomUUID(),
        name: newBrandName.trim(),
        slug,
        photo: newBrandPhoto.trim()
      });
      setNewBrandName('');
      setNewBrandPhoto('');
      toast.success('Brand added successfully');
    } catch (error) {
      toast.error('Failed to add brand');
    } finally {
      setIsAddingBrand(false);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    try {
      await deleteBrand(id);
      toast.success('Brand removed');
    } catch (error) {
      toast.error('Failed to remove brand');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catalog Management</h1>
          <p className="text-gray-500">Manage your product categories and brands.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
              <p className="text-sm text-gray-500">{categories.length} categories defined</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <input 
              type="text" 
              value={newCategoryName} 
              onChange={e => setNewCategoryName(e.target.value)} 
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
              placeholder="Category Name" 
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="url" 
                value={newCategoryPhoto} 
                onChange={e => setNewCategoryPhoto(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                placeholder="Photo URL (Cloudinary)" 
              />
              <div className="flex gap-2 w-full sm:w-auto">
                <ImageUpload onUpload={(url) => setNewCategoryPhoto(url)} buttonText="Upload" className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl" />
                <button 
                  onClick={handleAddCategory}
                  className="flex-1 sm:flex-none bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-transparent hover:border-purple-100 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                    {cat.photo ? (
                      <Image src={cat.photo} alt={cat.name} fill className="object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-gray-400 m-auto mt-2.5" />
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 block">{cat.name}</span>
                    <span className="text-xs text-gray-400 block">/{cat.slug}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="text-center py-10 text-gray-400 italic">
                No categories found.
              </div>
            )}
          </div>
        </div>

        {/* Brands Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <TotalOrderIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Brands</h2>
              <p className="text-sm text-gray-500">{brands.length} brands defined</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <input 
              type="text" 
              value={newBrandName} 
              onChange={e => setNewBrandName(e.target.value)} 
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
              placeholder="Brand Name" 
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="url" 
                value={newBrandPhoto} 
                onChange={e => setNewBrandPhoto(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleAddBrand()}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                placeholder="Photo URL (Cloudinary)" 
              />
              <div className="flex gap-2 w-full sm:w-auto">
                <ImageUpload onUpload={(url) => setNewBrandPhoto(url)} buttonText="Upload" className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl" />
                <button 
                  onClick={handleAddBrand}
                  className="flex-1 sm:flex-none bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 space-y-2">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-transparent hover:border-orange-100 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                    {brand.photo ? (
                      <Image src={brand.photo} alt={brand.name} fill className="object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-gray-400 m-auto mt-2.5" />
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 block">{brand.name}</span>
                    <span className="text-xs text-gray-400 block">/{brand.slug}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteBrand(brand.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {brands.length === 0 && (
              <div className="text-center py-10 text-gray-400 italic">
                No brands found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
