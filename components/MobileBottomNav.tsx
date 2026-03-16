'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Truck, LayoutGrid } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AddToBagIcon, AccountIcon } from './icons';

export function MobileBottomNav() {
  const pathname = usePathname();
  const isCartOpen = useStore((state) => state.isCartOpen);
  const cartCount = useStore((state) => state.cart.reduce((acc, item) => acc + item.quantity, 0));

  // Hide on specific pages: Product Details, Checkout, Account (Login/Register), Admin
  const isProductPage = /^\/products\/[^/]+$/.test(pathname);
  const isCheckoutPage = pathname.startsWith('/checkout');
  const isAccountPage = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/account');
  const isAdminPage = pathname.startsWith('/admin');

  if (isCartOpen || isProductPage || isCheckoutPage || isAccountPage || isAdminPage) return null;

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Shop', href: '/shop', icon: LayoutGrid },
    { name: 'Checkout', href: '/checkout', icon: AddToBagIcon, count: cartCount },
    { name: 'Track', href: '/track-order', icon: Truck },
    { name: 'Account', href: '/login', icon: AccountIcon },
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
                <Icon className="w-5 h-5" />
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
            <Link key={item.name} href={item.href} className="relative p-3 group">
              {item.name === 'Bag' ? (
                <Image src="/cart-icon.png" alt="Bag" width={20} height={20} className="w-5 h-5" />
              ) : (
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              )}
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
