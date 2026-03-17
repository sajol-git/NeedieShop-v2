'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, UploadCloud, Plus, Trash2, Check } from 'lucide-react';
import { useStore, type Product } from '@/store/useStore';
import { GoogleGenAI } from '@google/genai';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

export default function AddProductPage() {
  const router = useRouter();
  const { addProduct, categories = [], brands = [] } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    price: '',
    compareAtPrice: '',
    images: [''],
    category: '',
    brand: '',
    stock: '',
    status: 'Active',
    isFeatured: false,
    isFlashSale: false,
  });

  useEffect(() => {
    if (categories && categories.length > 0 && brands && brands.length > 0) {
      setFormData(prev => ({
        ...prev,
        category: categories[0],
        brand: brands[0]
      }));
    }
  }, [categories, brands]);

  const generateDescription = async () => {
    if (!formData.name || !formData.category) {
      toast.error('Please enter a product name and category first.');
      return;
    }

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const prompt = `Write a compelling, premium e-commerce product description for a ${formData.category} product named "${formData.name}". Include key features and benefits. Keep it concise (around 3-4 sentences) and engaging.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      if (response.text) {
        setFormData(prev => ({ ...prev, description: response.text || '' }));
        toast.success('Description generated successfully!');
      }
    } catch (error) {
      console.error('Error generating description:', error);
      toast.error('Failed to generate description. Please check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      toast.error('Name and price are required');
      return;
    }

    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
      images: formData.images.filter(img => img.trim() !== ''),
      category: formData.category,
      brand: formData.brand,
      stock: Number(formData.stock) || 0,
      isFeatured: formData.isFeatured,
      isFlashSale: formData.isFlashSale,
      variants: [],
      specifications: [],
      relatedProducts: [],
    };

    addProduct(newProduct);
    toast.success('Product added successfully');
    router.push('/admin/products');
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/products"
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add product</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/products"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Discard
          </Link>
          <button 
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors shadow-sm"
          >
            Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Description */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Short sleeve t-shirt"
                  className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title (SEO)</label>
                <input 
                  type="text" 
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                  placeholder="SEO Title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <button 
                    onClick={generateDescription}
                    disabled={isGenerating}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                  </button>
                </div>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description (SEO)</label>
                <textarea 
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y"
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Media</h2>
            <div className="space-y-3">
              {formData.images.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input 
                    type="text" 
                    value={url}
                    onChange={(e) => {
                      const newImages = [...formData.images];
                      newImages[index] = e.target.value;
                      setFormData({...formData, images: newImages});
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                  <button 
                    onClick={() => {
                      const newImages = formData.images.filter((_, i) => i !== index);
                      setFormData({...formData, images: newImages});
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setFormData({...formData, images: [...formData.images, '']})}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add another image URL
              </button>
            </div>
            
            {/* Image Preview Grid */}
            {formData.images.filter(url => url.trim() !== '').length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {formData.images.filter(url => url.trim() !== '').map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                    <Image 
                      src={url} 
                      alt={`Preview ${index}`} 
                      fill 
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compare at price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
                  <input 
                    type="number" 
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({...formData, compareAtPrice: e.target.value})}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Inventory</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input 
                type="number" 
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Status</h2>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Product Organization */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Product organization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <select 
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                >
                  {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Visibility</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                    className="peer appearance-none w-5 h-5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 checked:bg-indigo-600 checked:border-indigo-600 transition-colors cursor-pointer"
                  />
                  <Check className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Featured Product</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={formData.isFlashSale}
                    onChange={(e) => setFormData({...formData, isFlashSale: e.target.checked})}
                    className="peer appearance-none w-5 h-5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 checked:bg-indigo-600 checked:border-indigo-600 transition-colors cursor-pointer"
                  />
                  <Check className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Flash Sale</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}