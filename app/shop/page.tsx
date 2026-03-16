'use client';

import { useStore, Product } from '@/store/useStore';
import { Navbar } from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Star, Heart, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, Lock, Headphones } from 'lucide-react';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { ProductCard } from '@/components/ProductCard';

function ShopContent() {
  const products = useStore((state) => state.products);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery) || 
    product.brand.toLowerCase().includes(searchQuery) ||
    product.category.toLowerCase().includes(searchQuery)
  );

  return (
    <main className="pt-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-900">Shop</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div className="flex items-baseline gap-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Explore All Products'}
          </h1>
          <span className="text-sm text-gray-400">({filteredProducts.length} Found)</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            Sort By
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-10 mb-16">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-500 text-lg">No products found matching your search.</p>
            <Link href="/shop" className="text-[#8B183A] font-bold mt-4 inline-block">View all products</Link>
          </div>
        ) : (
          <>
            {filteredProducts.slice(0, 2).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            
            {/* Help Card */}
            <div className="bg-[#0B1120] rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center text-white">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Headphones className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Need Help?</h3>
              <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">Our experts are ready to help you find the perfect gadget.</p>
              <button className="bg-white text-black px-4 py-2 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-bold hover:bg-gray-200 transition-colors">
                Chat with us
              </button>
            </div>

            {filteredProducts.slice(2).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mb-20">
        <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:border-gray-300 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">1</button>
        <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">2</button>
        <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">3</button>
        <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">4</button>
        <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:border-gray-300 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* SEO Section */}
      <section className="bg-gray-50 rounded-3xl p-12 mb-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop Electronics Online in Bangladesh</h2>
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            Discover the extensive range of authentic gadgets at NeedieShop. From the newest
            smartphones and laptops to smart home devices and premium audio gear, we have everything
            you need to stay connected and productive.
          </p>
          <p>
            Our collection features genuine products from world-renowned brands like Apple, Samsung,
            Xiaomi, Sony, and more. Enjoy competitive prices, official warranties, and fast delivery across all
            64 districts of Bangladesh.
          </p>
        </div>
      </section>
    </main>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />
      <Suspense fallback={<div className="pt-24 text-center">Loading products...</div>}>
        <ShopContent />
      </Suspense>
    </div>
  );
}
