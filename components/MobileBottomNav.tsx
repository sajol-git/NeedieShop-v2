'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutGrid } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { HomeIcon, CartIcon, UserIcon, TrackOrderIcon } from './icons';

export function MobileBottomNav() {
  const pathname = usePathname();
  const isCartOpen = useStore((state) => state.isCartOpen);
  const user = useStore((state) => state.user);
  const cartCount = useStore((state) => state.cart.reduce((acc, item) => acc + item.quantity, 0));

  // Hide on specific pages: Product Details, Checkout, Account (Login/Register), Admin
  const isProductPage = /^\/products\/[^/]+$/.test(pathname);
  const isCheckoutPage = pathname.startsWith('/checkout');
  const isAccountPage = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/account');
  const isAdminPage = pathname.startsWith('/admin');

  if (isCartOpen || isProductPage || isCheckoutPage || isAccountPage || isAdminPage) return null;

  const navItems = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Shop', href: '/shop', icon: LayoutGrid },
    { name: 'Checkout', href: '/checkout', icon: CartIcon, count: cartCount },
    { name: 'Track', href: '/track-order', icon: TrackOrderIcon },
    { name: 'Account', href: user ? '/account' : '/login', icon: UserIcon },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-8 right-8 z-50">
      <div className="bg-white/90 backdrop-blur-xl rounded-full border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-2 py-1 flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          if (isActive) {
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className="flex items-center gap-2 bg-[#0B1120] text-white px-4 py-2 rounded-full transition-all duration-300 shadow-lg shadow-gray-200"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <Icon className={`w-6 h-6 ${['Account', 'Checkout', 'Track'].includes(item.name) ? 'scale-110' : ''}`} />
                </div>
                <span className="text-xs font-bold tracking-tight">
                  {item.name}
                </span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B183A] text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          }

          return (
            <Link key={item.name} href={item.href} className="relative p-1 group">
              <div className="w-10 h-10 flex items-center justify-center">
                {item.name === 'Bag' ? (
                  <Image src="/cart-icon.png" alt="Bag" width={24} height={24} className="w-6 h-6" />
                ) : (
                  <Icon className={`w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors ${['Account', 'Checkout', 'Track'].includes(item.name) ? 'scale-110' : ''}`} />
                )}
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#8B183A] text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
