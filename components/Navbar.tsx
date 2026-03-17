'use client';

import Link from 'next/link';
import { 
  Menu, Search, Heart, X, 
  Crown, Headphones, LogOut, MapPin, User as LucideUser 
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartDrawer } from './CartDrawer';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { UserIcon, AddUserIcon, AddToBagIcon, CartIcon, HomeIcon, DashboardIcon, TrackOrderIcon } from './icons';

export function Navbar() {
  const isCartOpen = useStore((state) => state.isCartOpen);
  const setIsCartOpen = useStore((state) => state.setIsCartOpen);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItems = useStore((state) => state.cart);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const orders = useStore((state) => state.orders);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const router = useRouter();
  const pathname = usePathname();

  const userOrders = useMemo(() => 
    orders.filter(o => o.customerInfo.phone === user?.phone),
    [orders, user?.phone]
  );
  
  const completedOrdersCount = useMemo(() => 
    userOrders.filter(o => o.status === 'Delivered').length,
    [userOrders]
  );

  const primeTier = useMemo(() => {
    if (completedOrdersCount >= 10) return { name: 'Royal', benefit: 'Lifetime Free Delivery', color: 'text-amber-600', bg: 'bg-amber-50' };
    if (completedOrdersCount >= 5) return { name: 'Enthusiast', benefit: '10% Off (Up to 200tk)', color: 'text-indigo-600', bg: 'bg-indigo-50' };
    if (completedOrdersCount >= 2) return { name: 'Pro', benefit: 'Free Delivery (Next 3 Orders)', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    return null;
  }, [completedOrdersCount]);

  const handleLogout = () => {
    setUser(null);
    router.push('/login');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Track Order', href: '/track-order' },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Logo & Desktop Links */}
            <div className="flex items-center gap-8">
              <button 
                className="lg:hidden p-2 text-gray-900 hover:text-[#8B183A] transition-colors"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link href="/" className="flex items-center shrink-0">
                <div className="relative h-8 w-32 sm:h-10 sm:w-40">
                  <Image 
                    src="https://res.cloudinary.com/byngla/image/upload/v1764928332/webstore/rezxlvheluvbsrbted8o.png"
                    alt="ShopKing"
                    fill
                    className="object-contain"
                    priority
                    referrerPolicy="no-referrer"
                  />
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`text-sm font-bold transition-colors whitespace-nowrap ${
                      pathname === link.href ? 'text-[#8B183A]' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Center: Functional Search Box (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-md mx-4">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const query = formData.get('search') as string;
                  if (query.trim()) {
                    router.push(`/shop?search=${encodeURIComponent(query)}`);
                  }
                }}
                className="relative w-full"
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  name="search"
                  type="text" 
                  placeholder="Search products..." 
                  className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-transparent rounded-full text-sm outline-none focus:bg-white focus:border-gray-200 transition-all"
                />
              </form>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button className="lg:hidden p-2 text-gray-900 hover:text-[#8B183A] transition-colors">
                <Search className="w-6 h-6" />
              </button>
              
              <Link 
                href={user ? "/account" : "/login"} 
                className="p-1 text-gray-900 hover:text-[#8B183A] transition-colors"
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 scale-110" />
                </div>
              </Link>

              <button 
                className="p-1 text-gray-900 hover:text-[#8B183A] transition-colors relative"
                onClick={() => setIsCartOpen(true)}
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  <CartIcon className="w-6 h-6 scale-110" />
                </div>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#D31B27] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-gray-100">
                <div className="relative h-8 w-32">
                  <Image 
                    src="https://res.cloudinary.com/byngla/image/upload/v1764928332/webstore/rezxlvheluvbsrbted8o.png"
                    alt="NEEDIESHOP"
                    fill
                    className="object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-6">
                <div className="space-y-6">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 text-lg font-bold transition-colors ${
                        pathname === link.href ? 'text-[#8B183A]' : 'text-gray-900'
                      }`}
                    >
                      <div className="w-10 h-10 flex items-center justify-center shrink-0">
                        {link.name === 'Home' && <HomeIcon className="w-6 h-6" />}
                        {link.name === 'Track Order' && <TrackOrderIcon className="w-6 h-6 scale-110" />}
                        {link.name === 'Shop' && <Search className="w-6 h-6" />}
                      </div>
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-12 pt-12 border-t border-gray-100 space-y-6">
                  {/* Wishlist link removed */}
                  {user ? (
                    <>
                      <Link 
                        href="/account"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3"
                      >
                        <div className="w-10 h-10 bg-[#8B183A]/10 rounded-full flex items-center justify-center text-[#8B183A] font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{user.name}</span>
                          <span className="text-xs text-gray-500">My Account</span>
                        </div>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full py-3 bg-gray-100 text-gray-900 rounded-full font-bold hover:bg-gray-200 transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link 
                      href="/login" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 text-gray-600 font-medium"
                    >
                      <div className="w-10 h-10 flex items-center justify-center shrink-0">
                        <UserIcon className="w-6 h-6 scale-110" />
                      </div>
                      Login / Register
                    </Link>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const query = formData.get('search') as string;
                    if (query.trim()) {
                      router.push(`/shop?search=${encodeURIComponent(query)}`);
                      setIsMenuOpen(false);
                    }
                  }}
                  className="relative w-full"
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    name="search"
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-3xl text-sm outline-none"
                  />
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
