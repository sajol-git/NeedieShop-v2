'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Sparkles, UploadCloud, Plus, Trash2, Check } from 'lucide-react';
import Image from 'next/image';
import { useStore, Product } from '@/store/useStore';
import { GoogleGenAI } from '@google/genai';
import { toast } from 'sonner';
import Link from 'next/link';
import slugify from 'slugify';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { ImageUpload } from '@/components/ImageUpload';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const { products, updateProduct, categories = [], brands = [] } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compareAtPrice: '',
    featureImage: '',
    gallery: [''],
    category: 'gadgets',
    brand: '',
    stock: '',
    status: 'draft' as 'draft' | 'published',
    isFeatured: false,
    isFlashSale: false,
  });

  useEffect(() => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug || '',
        description: product.description,
        price: product.price.toString(),
        compareAtPrice: product.compareAtPrice ? product.compareAtPrice.toString() : '',
        featureImage: product.featureImage || '',
        gallery: product.gallery && product.gallery.length > 0 ? product.gallery : [''],
        category: product.category,
        brand: product.brand,
        stock: product.stock.toString(),
        status: product.status || 'draft',
        isFeatured: product.isFeatured || false,
        isFlashSale: product.isFlashSale || false,
      });
    } else {
      toast.error('Product not found');
      router.push('/admin/products');
    }
  }, [productId, products, router]);

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

    const updatedProduct: Partial<Product> = {
      name: formData.name,
      slug: formData.slug || slugify(formData.name, { lower: true, strict: true }),
      status: formData.status,
      description: formData.description,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
      featureImage: formData.featureImage.trim(),
      gallery: formData.gallery.filter(img => img.trim() !== ''),
      category: formData.category,
      brand: formData.brand,
      stock: Number(formData.stock) || 0,
      isFeatured: formData.isFeatured,
      isFlashSale: formData.isFlashSale,
    };

    updateProduct(productId, updatedProduct);
    toast.success('Product updated successfully');
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
          <h1 className="text-2xl font-bold text-gray-900">Edit product</h1>
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
                  onChange={(e) => {
                    setFormData({
                      ...formData, 
                      name: e.target.value,
                      slug: slugify(e.target.value, { lower: true, strict: true })
                    });
                  }}
                  placeholder="Short sleeve t-shirt"
                  className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="short-sleeve-t-shirt"
                  disabled={formData.status === 'published'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500"
                />
                {formData.status === 'published' && (
                  <p className="text-xs text-gray-500 mt-1">Slug cannot be edited while published. Change status to draft to edit.</p>
                )}
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
                <div className="bg-white rounded-xl overflow-hidden border border-gray-300">
                  <ReactQuill 
                    theme="snow" 
                    value={formData.description} 
                    onChange={(val) => setFormData({...formData, description: val})} 
                    className="h-64 mb-12"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Media</h2>
            
            <div className="space-y-6">
              {/* Feature Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Feature Image (Main Photo)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={formData.featureImage}
                    onChange={(e) => setFormData({...formData, featureImage: e.target.value})}
                    placeholder="https://example.com/feature-image.jpg"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                  <ImageUpload onUpload={(url) => setFormData({...formData, featureImage: url})} buttonText="Upload" className="px-4 py-2 rounded-3xl" />
                </div>
                {formData.featureImage && (
                  <div className="mt-3 relative w-32 aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                    <Image 
                      src={formData.featureImage} 
                      alt="Feature Preview" 
                      fill 
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images (Up to 10)</label>
                <div className="space-y-3">
                  {formData.gallery.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input 
                        type="text" 
                        value={url}
                        onChange={(e) => {
                          const newGallery = [...formData.gallery];
                          newGallery[index] = e.target.value;
                          setFormData({...formData, gallery: newGallery});
                        }}
                        placeholder={`https://example.com/gallery-${index + 1}.jpg`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      />
                      <ImageUpload 
                        onUpload={(newUrl) => {
                          const newGallery = [...formData.gallery];
                          newGallery[index] = newUrl;
                          setFormData({...formData, gallery: newGallery});
                        }} 
                        buttonText="Upload" 
                        className="px-4 py-2 rounded-3xl" 
                      />
                      <button 
                        onClick={() => {
                          const newGallery = formData.gallery.filter((_, i) => i !== index);
                          setFormData({...formData, gallery: newGallery.length ? newGallery : ['']});
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {formData.gallery.length < 10 && (
                    <button 
                      onClick={() => setFormData({...formData, gallery: [...formData.gallery, '']})}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add gallery image URL
                    </button>
                  )}
                </div>
                
                {/* Image Preview Grid */}
                {formData.gallery.filter(url => url.trim() !== '').length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {formData.gallery.filter(url => url.trim() !== '').map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                        <Image 
                          src={url} 
                          alt={`Gallery Preview ${index}`} 
                          fill 
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
              onChange={(e) => setFormData({...formData, status: e.target.value as 'draft' | 'published'})}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
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
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <select 
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                >
                  {brands.map(brand => <option key={brand.id} value={brand.name}>{brand.name}</option>)}
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
