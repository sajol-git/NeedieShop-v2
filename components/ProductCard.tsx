'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { Product, useStore } from '@/store/useStore';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500 p-3"
    >
      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-gray-50 rounded-3xl overflow-hidden">
        <Image 
          src={product.featureImage} 
          alt={product.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-[#0B1120] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-lg">
              SALE
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            // Wishlist functionality could be added here
          }}
          className="absolute top-3 right-3 w-10 h-10 bg-white/80 backdrop-blur-md text-gray-400 rounded-full flex items-center justify-center hover:text-red-500 transition-all shadow-sm"
        >
          <Heart className="w-5 h-5" />
        </button>
      </Link>

      <div className="px-2 py-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-[#8B183A] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-gray-900">৳{product.price.toLocaleString()}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through font-medium">৳{product.compareAtPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
