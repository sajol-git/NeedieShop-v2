'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ArrowRight, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/lib/products';
import { useStore } from '@/store/useStore';

export default function HomeClient() {
  const { heroBanners, categories, products } = useStore();
  const featuredProducts = products.filter(p => p.isFeatured && p.status === 'published');
  const flashSaleProducts = products.filter(p => p.isFlashSale && p.status === 'published');
  const activeBanners = heroBanners.filter(b => b.status === 'Active');
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const bannerTimer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(bannerTimer);
  }, [activeBanners.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="pt-24 pb-20">
      {/* Hero Banner Slider */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl overflow-hidden aspect-[2.6/1] max-h-[500px] min-h-[200px] w-full">
          {activeBanners.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBanner}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Link href={activeBanners[currentBanner].link}>
                    <Image
                      src={activeBanners[currentBanner].image || '/placeholder.png'}
                      alt={activeBanners[currentBanner].title || 'Banner'}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>
              
              {/* Carousel Dots */}
              {activeBanners.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {activeBanners.map((banner, index) => (
                    <button
                      key={banner.id || `banner-${index}`}
                      onClick={() => setCurrentBanner(index)}
                      className={`w-8 h-2 rounded-full transition-all ${currentBanner === index ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <p className="text-gray-400">No active banners</p>
            </div>
          )}
        </div>
      </section>

      {/* Browse by Categories */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Browse by Categories</h2>
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {categories.length > 0 ? categories.map((category, index) => (
            <Link 
              key={category.id || `cat-${index}`} 
              href={`/category/${category.slug}`}
              className="flex flex-col items-center gap-4 min-w-[160px] group"
            >
              <div className="w-40 h-40 rounded-3xl bg-gray-100 flex items-center justify-center p-6 transition-transform group-hover:scale-105 overflow-hidden relative">
                {category.photo ? (
                  <Image 
                    src={category.photo || '/placeholder.png'} 
                    alt={category.name} 
                    fill 
                    className="object-cover transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                )}
              </div>
              <span className="text-sm font-semibold text-gray-900">{category.name}</span>
            </Link>
          )) : (
            <div className="text-gray-500 text-sm py-8 text-center w-full">No categories available</div>
          )}
        </div>
      </section>

      {/* Flash Sale */}
      {flashSaleProducts.length > 0 && (
        <section className="py-20 bg-gray-50/50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="flex items-center gap-2 text-red-500 font-semibold mb-2">
                  <Zap className="w-5 h-5 fill-current" />
                  <span>FLASH SALE</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Grab Them Fast</h2>
              </div>
              <div className="flex items-center gap-4 bg-red-50 px-6 py-3 rounded-full border border-red-100">
                <span className="text-red-900 font-medium">Ends in:</span>
            <div className="flex gap-2 text-red-600 font-mono font-bold text-lg">
              {[
                { label: 'hours', value: timeLeft.hours },
                { label: 'minutes', value: timeLeft.minutes },
                { label: 'seconds', value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="bg-white px-2 py-1 rounded-xl shadow-sm">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  {index < 2 && <span>:</span>}
                </div>
              ))}
            </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {flashSaleProducts.map((product, index) => (
                <ProductCard key={product.id || `flash-${index}`} product={product as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section id="featured" className="py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Collection</h2>
            <p className="text-gray-600">Handpicked premium gadgets for you.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id || `feat-${index}`} product={product as any} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
