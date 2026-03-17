'use client';

import { Product } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Star, Filter } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ProductCard } from '@/components/ProductCard';

interface CategoryClientProps {
  slug: string;
  categoryProducts: Product[];
}

export default function CategoryClient({ slug, categoryProducts }: CategoryClientProps) {
  const addToCart = useStore((state) => state.addToCart);

  return (
    <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 capitalize mb-4">{slug}</h1>
        <p className="text-gray-600">Explore our premium collection of {slug} products.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
              <Filter className="w-5 h-5" />
              Filters
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    Under ৳5,000
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    ৳5,000 - ৳10,000
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    Over ৳10,000
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Brands</h3>
                <div className="space-y-2">
                  {Array.from(new Set(categoryProducts.map(p => p.brand))).map(brand => (
                    <label key={brand} className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {categoryProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">We couldn&apos;t find any products in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
