'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Command, Hexagon, Inbox, VenetianMask, SlidersHorizontal, Sparkles, Layers, LogOut, Menu, X, Tag, MessageSquare } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { TotalOrderIcon } from '@/components/icons';

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
    { name: 'Dashboard', href: '/admin', icon: Command },
    { name: 'Orders', href: '/admin/orders', icon: TotalOrderIcon },
    { name: 'Products', href: '/admin/products', icon: Hexagon },
    { name: 'Catalog', href: '/admin/catalog', icon: Tag },
    { name: 'Customers', href: '/admin/customers', icon: VenetianMask },
    { name: 'Marketing', href: '/admin/marketing', icon: Sparkles },
    { name: 'SMS', href: '/admin/sms', icon: MessageSquare },
    { name: 'CMS', href: '/admin/cms', icon: Layers },
    { name: 'Settings', href: '/admin/settings', icon: SlidersHorizontal },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4 shrink-0">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            NeedieShop Admin
          </span>
          <button 
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-red-600 hover:bg-red-50 w-full"
          >
            <LogOut className="w-6 h-6" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen transition-all duration-200">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-indigo-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 truncate">
              {navigation.find(n => n.href === pathname)?.name || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold shrink-0">
              A
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
