'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { ScanFace, Fingerprint, Sparkles, KeyRound, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setUser({
        id: 'user_' + Date.now(),
        name: email.split('@')[0],
        phone: '+880 1700 000000',
        email: email,
        role: 'user',
      });
      toast.success('Welcome back to NeedieShop!');
      router.push('/');
    } else {
      toast.error('Please enter both email and password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-red-100/50 border border-white/20 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-red-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-orange-50 rounded-full blur-3xl opacity-50"></div>

            <div className="relative z-10">
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8B183A] to-[#D31B27] rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 transform rotate-3">
                  <ScanFace className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                  Customer Access <Sparkles className="w-5 h-5 text-[#8B183A]" />
                </h1>
                <p className="text-gray-500 text-sm">Sign in to track orders and save favorites</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email Address</label>
                  <div className="relative">
                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-2 focus:ring-[#8B183A]/20 focus:border-[#8B183A] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5 ml-1 pr-1">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <a href="#" className="text-xs font-medium text-[#8B183A] hover:text-[#6d122d]">Forgot?</a>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-2 focus:ring-[#8B183A]/20 focus:border-[#8B183A] outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gray-900 text-white py-3.5 rounded-full font-semibold hover:bg-[#8B183A] transition-colors flex items-center justify-center gap-2 group mt-2"
                >
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <a href="#" className="font-semibold text-[#8B183A] hover:text-[#6d122d]">Create one</a>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/admin/login" className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1">
              <KeyRound className="w-3 h-3" /> Admin Portal
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
