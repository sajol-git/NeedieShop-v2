'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { 
  DashboardIcon, 
  TotalOrderIcon, 
  ShopIcon, 
  UserIcon, 
  SmsIcon, 
  SupportIcon,
  NeediePrimeIcon,
  HomeIcon
} from '@/components/icons';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname !== '/admin/login' && user?.role !== 'admin') {
      router.push('/admin/login');
    }
  }, [user, pathname, router]);

  // Close mobile menu on route change
  useEffect(() => {
    const timeout = setTimeout(() => setIsMobileMenuOpen(false), 0);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (user?.role !== 'admin') {
    return null; // or a loading spinner
  }

  const handleLogout = async () => {
    const { supabase } = await import('../../lib/supabase');
    await supabase.auth.signOut();
    setUser(null);
    router.push('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: DashboardIcon },
    { name: 'Orders', href: '/admin/orders', icon: TotalOrderIcon },
    { name: 'Products', href: '/admin/products', icon: ShopIcon },
    { name: 'Catalog', href: '/admin/catalog', icon: NeediePrimeIcon },
    { name: 'Customers', href: '/admin/customers', icon: UserIcon },
    { name: 'SMS', href: '/admin/sms', icon: SmsIcon },
    { name: 'CMS', href: '/admin/cms', icon: HomeIcon },
    { name: 'Settings', href: '/admin/settings', icon: SupportIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`w-72 bg-[#0B1120] text-white fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-20 px-6 shrink-0 border-b border-white/10">
          <span className="text-2xl font-black tracking-tight text-white">
            Admin<span className="text-[#8B183A]">Panel</span>
          </span>
          <button 
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8B183A] to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 mt-2">Main Menu</p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-medium transition-all group ${
                  isActive 
                    ? 'bg-[#8B183A] text-white shadow-lg shadow-[#8B183A]/25' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} strokeWidth={2} />
                  <span className="text-sm">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/10 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold transition-all text-white bg-white/5 hover:bg-red-500/20 hover:text-red-400 w-full group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen transition-all duration-300">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2.5 -ml-2 text-gray-600 hover:text-[#8B183A] hover:bg-red-50 rounded-xl transition-all"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight hidden sm:block">
                {navigation.find(n => n.href === pathname)?.name || 'Admin Dashboard'}
              </h1>
              <h1 className="text-xl font-black text-gray-900 tracking-tight sm:hidden">
                {navigation.find(n => n.href === pathname)?.name || 'Admin'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#8B183A] transition-colors bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
              View Store <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </header>
        <main className="p-4 sm:p-8 flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
