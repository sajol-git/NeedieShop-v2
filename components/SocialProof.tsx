'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const names = ['Rahim', 'Karim', 'Sadia', 'Nusrat', 'Fahim', 'Ayesha', 'Hasan', 'Mehzabin'];
const locations = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal'];

export function SocialProof() {
  const storeProducts = useStore((state) => state.products);
  const products = storeProducts.filter(p => p.status === 'published');

  useEffect(() => {
    if (products.length === 0) return;

    const showToast = () => {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const timeAgo = Math.floor(Math.random() * 59) + 1;

      toast.custom((t) => (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-gray-100 flex items-center gap-4 w-80 animate-in slide-in-from-bottom-5">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
            <Image src={randomProduct.image_url || '/placeholder.png'} alt={randomProduct.title} fill className="object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-sm font-bold text-gray-900">{randomName}</span>
              <span className="text-[10px] text-gray-500">from {randomLocation}</span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-1">Purchased <span className="font-bold text-[#8B183A]">{randomProduct.title}</span></p>
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Verified Buyer • {timeAgo}m ago</span>
            </div>
          </div>
        </div>
      ), {
        duration: 5000,
        position: 'bottom-left',
      });
    };

    // Initial delay before first toast
    const initialTimeout = setTimeout(showToast, 5000);

    // Subsequent toasts every 15-30 seconds
    const interval = setInterval(() => {
      showToast();
    }, Math.floor(Math.random() * 15000) + 15000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [products]);

  return null;
}
