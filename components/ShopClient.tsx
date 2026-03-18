'use client';

import { Product } from '@/lib/products';
import Link from 'next/link';
import { SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, Headphones } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';

import { useStore } from '@/store/useStore';

export default function ShopClient() {
  const { products: allProducts, categories, brands } = useStore();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const categoryFilter = searchParams.get('category') || '';
  const brandFilter = searchParams.get('brand') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const filteredProducts = allProducts.filter(product => 
    (searchQuery === '' || product.name.toLowerCase().includes(searchQuery) || product.brand.toLowerCase().includes(searchQuery) || product.category.toLowerCase().includes(searchQuery)) &&
    (categoryFilter === '' || product.category === categoryFilter) &&
    (brandFilter === '' || product.brand === brandFilter)
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 mb-16">
        {paginatedProducts.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-500 text-lg">No products found matching your search.</p>
            <Link href="/shop" className="text-[#8B183A] font-bold mt-4 inline-block">View all products</Link>
          </div>
        ) : (
          paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mb-20">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:border-gray-300 transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i} 
              onClick={() => handlePageChange(i + 1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${currentPage === i + 1 ? 'bg-black text-white' : 'border border-gray-100 text-gray-600 hover:bg-gray-50'}`}
            >
              {i + 1}
            </button>
          ))}
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:border-gray-300 transition-colors disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

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
