'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Crown, ShieldCheck, KeyRound, Ghost, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user is admin in profile table
        const { data: userData, error: userError } = await supabase
          .from('profile')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError || userData?.role !== 'admin') {
          await supabase.auth.signOut();
          throw new Error(`Unauthorized access. Admin privileges required. Error: ${userError?.message || 'Role is not admin'}`);
        }

        setUser({
          id: userData.id,
          name: userData.name || 'Admin',
          phone: userData.phone || '',
          email: userData.email || '',
          role: 'admin',
          isProfileCompleted: true,
          isEmailVerified: true,
          isPhoneVerified: true,
          registrationDate: userData.created_at,
        });
        toast.success('Welcome back, Admin!');
        router.push('/admin');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dark theme decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B183A]/20 rounded-full blur-3xl opacity-50 mix-blend-screen"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8B183A]/10 rounded-full blur-3xl opacity-50 mix-blend-screen"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-gray-700/50">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8B183A] to-red-900 rounded-2xl flex items-center justify-center shadow-lg shadow-[#8B183A]/30 transform -rotate-3">
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
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-[#8B183A] focus:border-[#8B183A] outline-none transition-all text-white placeholder-gray-600"
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
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-[#8B183A] focus:border-[#8B183A] outline-none transition-all text-white placeholder-gray-600"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B183A] text-white py-3.5 rounded-xl font-semibold hover:bg-[#8B183A]/90 transition-colors flex items-center justify-center gap-2 group mt-4 shadow-lg shadow-[#8B183A]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Authenticate'}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
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
