import Link from 'next/link';
import { Menu, Search, Heart, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartDrawer } from './CartDrawer';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { AccountIcon, AddToBagIcon } from './icons';

export function Navbar() {
  const isCartOpen = useStore((state) => state.isCartOpen);
  const setIsCartOpen = useStore((state) => state.setIsCartOpen);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItems = useStore((state) => state.cart);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const router = useRouter();
  const pathname = usePathname();

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
          <div className="flex justify-between items-center h-16">
            {/* Left: Menu */}
            <button 
              className="p-2 text-gray-900 hover:text-[#8B183A] transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Center: Logo */}
            <Link href="/" className="flex items-center">
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

            {/* Right: Search & Cart */}
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-900 hover:text-[#8B183A] transition-colors">
                <Search className="w-6 h-6" />
              </button>
              <button 
                className="p-2 text-gray-900 hover:text-[#8B183A] transition-colors relative"
                onClick={() => setIsCartOpen(true)}
              >
                <Image 
                  src="https://res.cloudinary.com/byngla/image/upload/v1773672358/okvjhvnrrbk51kx5lf87.webp"
                  alt="Cart"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  referrerPolicy="no-referrer"
                />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#D31B27] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
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
                      className={`block text-lg font-bold transition-colors ${
                        pathname === link.href ? 'text-[#8B183A]' : 'text-gray-900'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-12 pt-12 border-t border-gray-100 space-y-6">
                  <Link 
                    href="/wishlist" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 text-gray-600 font-medium"
                  >
                    <Heart className="w-5 h-5" />
                    Wishlist
                  </Link>
                  {user ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#8B183A]/10 rounded-full flex items-center justify-center text-[#8B183A] font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{user.name}</span>
                          <span className="text-xs text-gray-500">{user.email}</span>
                        </div>
                      </div>
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
                      <AccountIcon className="w-5 h-5" />
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
