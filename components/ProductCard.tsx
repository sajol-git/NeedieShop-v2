'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Product, useStore } from '@/store/useStore';
import { motion } from 'motion/react';
import { AddToBagIcon } from '@/components/icons/AddToBagIcon';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();
  const discount = product.original_price 
    ? Math.round(((product.original_price - product.discount_price) / product.original_price) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success('Added to bag');
  };

  return (
    <Link href={`/products/${product.slug || product.id}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500 p-1 block h-full"
      >
        <div className="block relative aspect-square bg-gray-50 rounded-xl overflow-hidden">
          <Image 
            src={product.image_url || '/placeholder.png'} 
            alt={product.title} 
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

          {/* Add to Bag Button */}
          <button 
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 shadow-lg hover:bg-[#8B183A] hover:text-white transition-all duration-300 z-10"
          >
            <AddToBagIcon className="w-5 h-5" strokeWidth={8} />
          </button>
        </div>

        <div className="px-2 py-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 leading-tight transition-colors group-hover:text-[#8B183A]">
              {product.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-gray-900">৳{product.discount_price.toLocaleString()}</span>
            {product.original_price && (
              <span className="text-sm text-gray-400 line-through font-medium">৳{product.original_price.toLocaleString()}</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
