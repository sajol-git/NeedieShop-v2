'use client';

import { Product } from '@/lib/products';
import Link from 'next/link';
import { SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, Headphones, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';

import { useStore } from '@/store/useStore';

const ITEMS_PER_PAGE = 12;

export default function ShopClient() {
  const { products: allProducts } = useStore();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const categories = useMemo(() => Array.from(new Set(allProducts.map(p => p.category))), [allProducts]);
  const brands = useMemo(() => Array.from(new Set(allProducts.map(p => p.brand))), [allProducts]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery) || 
                            product.brand.toLowerCase().includes(searchQuery) ||
                            product.category.toLowerCase().includes(searchQuery);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      
      return matchesSearch && matchesCategory && matchesBrand;
    });

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return result;
  }, [allProducts, searchQuery, selectedCategories, selectedBrands, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-baseline gap-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Explore All Products'}
          </h1>
          <span className="text-sm text-gray-400">({filteredAndSortedProducts.length} Found)</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showFilters ? 'bg-gray-800 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          
          <div className="relative group">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-full px-4 py-2 pr-10 text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedCategories.includes(category) 
                      ? 'bg-black text-white' 
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Brands</h3>
            <div className="flex flex-wrap gap-2">
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedBrands.includes(brand) 
                      ? 'bg-black text-white' 
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 mb-16">
        {currentProducts.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            <button 
              onClick={() => {
                setSelectedCategories([]);
                setSelectedBrands([]);
                setSortBy('newest');
              }}
              className="text-[#8B183A] font-bold mt-4 inline-block"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {currentProducts.map((product, index) => {
              if (currentPage === 1 && index === 2) {
                return (
                  <div key="help-card" className="contents">
                    <div className="bg-[#0B1120] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center text-white">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                        <Headphones className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2">Need Help?</h3>
                      <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">Our experts are ready to help you find the perfect gadget.</p>
                      <button className="bg-white text-black px-4 py-2 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-bold hover:bg-gray-200 transition-colors">
                        Chat with us
                      </button>
                    </div>
                    <ProductCard product={product as any} />
                  </div>
                );
              }
              return <ProductCard key={product.id} product={product as any} />;
            })}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mb-20">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                currentPage === i + 1 
                  ? 'bg-black text-white font-bold' 
                  : 'border border-gray-100 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
