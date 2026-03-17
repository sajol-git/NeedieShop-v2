'use client';

import { useState } from 'react';
import { Tag, Plus, Trash2, Edit2, Search } from 'lucide-react';
import { TotalOrderIcon } from '@/components/icons';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';

export default function AdminCatalog() {
  const { categories, setCategories, brands, setBrands } = useStore();
  const [newCategory, setNewCategory] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim())) {
      toast.error('Category already exists');
      return;
    }
    setCategories([...categories, newCategory.trim()]);
    setNewCategory('');
    toast.success('Category added successfully');
  };

  const handleDeleteCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
    toast.success('Category removed');
  };

  const handleAddBrand = () => {
    if (!newBrand.trim()) return;
    if (brands.includes(newBrand.trim())) {
      toast.error('Brand already exists');
      return;
    }
    setBrands([...brands, newBrand.trim()]);
    setNewBrand('');
    toast.success('Brand added successfully');
  };

  const handleDeleteBrand = (brand: string) => {
    setBrands(brands.filter(b => b !== brand));
    toast.success('Brand removed');
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

          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={newCategory} 
              onChange={e => setNewCategory(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
              placeholder="Add new category..." 
            />
            <button 
              onClick={handleAddCategory}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 space-y-2">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-transparent hover:border-purple-100 transition-all group">
                <span className="font-medium text-gray-700">{cat}</span>
                <button 
                  onClick={() => handleDeleteCategory(cat)}
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

          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={newBrand} 
              onChange={e => setNewBrand(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleAddBrand()}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
              placeholder="Add new brand..." 
            />
            <button 
              onClick={handleAddBrand}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-transparent hover:border-orange-100 transition-all group">
                <span className="font-medium text-gray-700">{brand}</span>
                <button 
                  onClick={() => handleDeleteBrand(brand)}
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
