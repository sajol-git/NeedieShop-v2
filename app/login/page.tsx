'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScanFace, Sparkles, Phone, ArrowRight, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

export default function CustomerLogin() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) toast.error(error.message);
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        toast.error('Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.');
      } else {
        toast.error(err.message || 'An error occurred during login');
      }
    }
  };

  const handlePhoneLogin = () => {
    toast.info('Phone sign-in flow coming soon.');
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

              <div className="space-y-4">
                <button 
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3.5 rounded-full font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Image 
                    src="https://www.google.com/favicon.ico" 
                    alt="Google" 
                    width={16} 
                    height={16} 
                    className="w-4 h-4" 
                    referrerPolicy="no-referrer"
                  />
                  Sign in with Google
                </button>

                <button 
                  onClick={handlePhoneLogin}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3.5 rounded-full font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Sign in with Phone
                </button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link href="/onboarding" className="text-[#8B183A] font-semibold hover:underline">
                  Sign up
                </Link>
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
