'use client';

import { useStore, Product } from '@/store/useStore';
import { Navbar } from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ShoppingCart, Star, Filter } from 'lucide-react';
import { use } from 'react';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const products = useStore((state) => state.products);
  const addToCart = useStore((state) => state.addToCart);

  const categoryProducts = products.filter(p => p.category.toLowerCase() === slug.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Navbar />
      
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
                  <ProductCard key={product.id} product={product} onAdd={() => addToCart(product, product.variants[0]?.id)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: Product, onAdd: () => void }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
    >
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
        <Image 
          src={product.images[0]} 
          alt={product.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {product.compareAtPrice && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
          </div>
        )}
      </Link>
      <div className="p-6 flex-1 flex flex-col">
        <div className="text-xs font-medium text-indigo-600 mb-2 uppercase tracking-wider">{product.brand}</div>
        <Link href={`/products/${product.id}`} className="mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-4 mt-auto">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.8)</span>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-gray-900">৳{product.price.toLocaleString()}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">৳{product.compareAtPrice.toLocaleString()}</span>
            )}
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); onAdd(); }}
            className="p-3 bg-gray-900 text-white rounded-full hover:bg-indigo-600 transition-colors shadow-md hover:shadow-indigo-200"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
