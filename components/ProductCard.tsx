'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { Product, useStore } from '@/store/useStore';
import { motion } from 'motion/react';
import { AddToBagIcon } from './icons/AddToBagIcon';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((state) => state.addToCart);
  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
    >
      <Link href={`/products/${product.id}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
        <Image 
          src={product.images[0]} 
          alt={product.name} 
          fill 
          className="object-contain p-6 group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-[#D31B27] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-red-500/20">
              Flash Sale
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="absolute bottom-4 right-4 w-10 h-10 bg-[#8B183A] text-white rounded-full flex items-center justify-center hover:bg-[#6d122d] transition-all shadow-lg shadow-[#8B183A]/30"
        >
          <AddToBagIcon className="w-5 h-5" />
        </button>
      </Link>

      <div className="p-6">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
          ))}
        </div>
        
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#8B183A] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-gray-900">৳{product.price.toLocaleString()}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-400 line-through font-medium">৳{product.compareAtPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
