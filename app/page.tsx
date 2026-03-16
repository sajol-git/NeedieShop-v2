'use client';

import { useStore, Product } from '@/store/useStore';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from '@/components/Navbar';
import { ShoppingCart, Zap, Star, ArrowRight, Headphones } from 'lucide-react';
import { useState, useEffect } from 'react';

const CATEGORIES = [
  { id: 'light', name: 'Light', image: 'https://picsum.photos/seed/light/200/200' },
  { id: 'fan', name: 'Fan', image: 'https://picsum.photos/seed/fan/200/200' },
  { id: 'power-bank', name: 'Power Bank', image: 'https://picsum.photos/seed/powerbank/200/200' },
  { id: 'tracker', name: 'Tracker Device', image: 'https://picsum.photos/seed/tracker/200/200' },
  { id: 'headphone', name: 'Headphone', image: 'https://picsum.photos/seed/headphone/200/200' },
  { id: 'smartwatch', name: 'Smartwatch', image: 'https://picsum.photos/seed/smartwatch/200/200' },
  { id: 'tws', name: 'TWS', image: 'https://picsum.photos/seed/tws/200/200' },
];

const BANNERS = [
  'https://picsum.photos/seed/banner1/1400/500',
  'https://picsum.photos/seed/banner2/1400/500',
  'https://picsum.photos/seed/banner3/1400/500',
];

import { ProductCard } from '@/components/ProductCard';

export default function Home() {
  const products = useStore((state) => state.products);
  const addToCart = useStore((state) => state.addToCart);
  
  const featuredProducts = products.filter(p => p.isFeatured);
  const flashSaleProducts = products.filter(p => p.isFlashSale);

  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(bannerTimer);
  }, []);

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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-20">
        {/* Hero Banner Slider */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="relative rounded-3xl overflow-hidden h-[300px] md:h-[500px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={BANNERS[currentBanner]}
                  alt="Banner"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Carousel Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {BANNERS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-8 h-2 rounded-full transition-all ${currentBanner === index ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
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
            {CATEGORIES.map((category) => (
              <Link 
                key={category.id} 
                href={`/category/${category.id}`}
                className="flex flex-col items-center gap-4 min-w-[160px] group"
              >
                <div className="w-40 h-40 rounded-3xl bg-gray-100 flex items-center justify-center p-6 transition-transform group-hover:scale-105">
                  {/* For the first 4, we just show text if no real image is available, but let's use the image for all */}
                  <div className="relative w-full h-full">
                    <Image 
                      src={category.image} 
                      alt={category.name} 
                      fill 
                      className="object-contain mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900">{category.name}</span>
              </Link>
            ))}
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
                    <span className="bg-white px-2 py-1 rounded-xl shadow-sm">{String(timeLeft.hours).padStart(2, '0')}</span>:
                    <span className="bg-white px-2 py-1 rounded-xl shadow-sm">{String(timeLeft.minutes).padStart(2, '0')}</span>:
                    <span className="bg-white px-2 py-1 rounded-xl shadow-sm">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {flashSaleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
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

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
