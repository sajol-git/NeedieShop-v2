'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Crown, ShieldCheck, KeyRound, Ghost, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@needieshop.bd' && password === 'admin123') {
      setUser({
        id: 'admin_1',
        name: 'Super Admin',
        phone: '+880 1700 000000',
        email: 'admin@needieshop.bd',
        role: 'admin',
      });
      toast.success('Welcome back, Admin!');
      router.push('/admin');
    } else {
      toast.error('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dark theme decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-900/40 rounded-full blur-3xl opacity-50 mix-blend-screen"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-900/40 rounded-full blur-3xl opacity-50 mix-blend-screen"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-gray-700/50">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transform -rotate-3">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              Admin Portal <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </h1>
            <p className="text-gray-400 text-sm">Secure access for staff only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Admin Email</label>
              <div className="relative">
                <Ghost className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@needieshop.bd"
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-gray-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1 pr-1">
                <label className="block text-sm font-medium text-gray-300">Master Password</label>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-gray-600"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 group mt-4 shadow-lg shadow-indigo-600/20"
            >
              Authenticate
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Demo Credentials: admin@needieshop.bd / admin123
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-1">
            <ArrowRight className="w-3 h-3 rotate-180" /> Back to Store
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
