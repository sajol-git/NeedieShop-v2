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
  const { heroBanners, categories, products, brands, offerBanners } = useStore();
  const featuredProducts = products.filter(p => p.is_featured && p.status === 'published');
  const flashSaleProducts = products.filter(p => p.is_flash_sale && p.status === 'published');
  const activeBanners = (Array.isArray(heroBanners) ? heroBanners : []).filter(b => b.status === 'Active');
  
  const displayOfferBanners = Array.isArray(offerBanners) && offerBanners.length > 0 
    ? offerBanners 
    : [
        { title: 'Exclusive for Man', subtitle: '2022-23', image: 'https://picsum.photos/seed/man/600/300', link: '#' },
        { title: 'Exclusive for Woman', subtitle: '2022-23', image: 'https://picsum.photos/seed/woman/600/300', link: '#' },
        { title: 'Exclusive for Kids', subtitle: '2022-23', image: 'https://picsum.photos/seed/kids/600/300', link: '#' },
      ];
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

        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {categories.length > 0 ? categories.map((category, index) => (
            <Link 
              key={category.id || `cat-${index}`} 
              href={`/category/${category.slug}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500 p-1 block min-w-[120px] w-[120px] sm:min-w-[140px] sm:w-[140px] shrink-0"
            >
              <div className="block relative aspect-square bg-gray-50 rounded-xl overflow-hidden">
                {category.photo ? (
                  <Image 
                    src={category.photo} 
                    alt={category.name} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="px-1 py-2 text-center">
                <span className="text-xs font-bold text-gray-900 group-hover:text-[#8B183A] transition-colors">{category.name}</span>
              </div>
            </Link>
          )) : (
            <div className="text-gray-500 text-sm py-8 text-center w-full">No categories available</div>
          )}
        </div>
      </section>

      {/* Winter Collection Banners */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayOfferBanners.map((banner, i) => (
            <Link key={i} href={banner.link || '#'} className="relative rounded-3xl overflow-hidden aspect-[2/1] md:aspect-[1.5/1] group">
              <Image src={banner.image || '/placeholder.png'} alt={banner.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/20 flex flex-col justify-center p-8">
                <h3 className="text-white text-2xl font-bold">{banner.title}</h3>
                <p className="text-white">{banner.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trendy Collections */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Trendy Collections</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featuredProducts.slice(0, 3).map((product, index) => (
            <ProductCard key={product.id || `trendy-${index}`} product={product as any} />
          ))}
        </div>
      </section>

      {/* Most Popular */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Most Popular</h2>
          <Link href="/shop" className="text-[#8B183A] font-bold">Show More</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.slice(0, 6).map((product, index) => (
            <ProductCard key={product.id || `popular-${index}`} product={product as any} />
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      {flashSaleProducts.length > 0 && (
        <section className="py-20 bg-gray-50/50 mb-20">
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

      {/* Popular Brands */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Brands</h2>
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {brands.length > 0 ? brands.map((brand, index) => (
            <Link 
              key={brand.id || `brand-${index}`} 
              href={`/brand/${brand.slug}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500 p-1 block min-w-[120px] w-[120px] sm:min-w-[140px] sm:w-[140px] shrink-0"
            >
              <div className="block relative aspect-square bg-gray-50 rounded-xl overflow-hidden">
                {brand.photo ? (
                  <Image 
                    src={brand.photo} 
                    alt={brand.name} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 font-bold text-center text-[10px]">{brand.name}</span>
                  </div>
                )}
              </div>
              <div className="px-1 py-2 text-center">
                <span className="text-xs font-bold text-gray-900 group-hover:text-[#8B183A] transition-colors">{brand.name}</span>
              </div>
            </Link>
          )) : (
            <div className="text-gray-500 text-sm py-8 text-center w-full">No brands available</div>
          )}
        </div>
      </section>
    </main>
  );
}
