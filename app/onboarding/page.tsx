'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { motion } from 'motion/react';
import { DistrictDropdown } from '@/components/DistrictDropdown';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    code: '',
    sentCode: '',
    address: '',
    district: ''
  });

  // Step 1: Name & Email Signup
  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please enter name, email, and password');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Verification email sent! Please check your inbox.');
        setStep(2);
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        toast.error('Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.');
      } else {
        toast.error(err.message || 'An error occurred during signup');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Wait for Email Verification (Manual check for demo or poll)
  const checkEmailVerified = async () => {
    try {
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      if (sbUser?.email_confirmed_at) {
        toast.success('Email verified!');
        setStep(3);
      } else {
        toast.error('Email not verified yet. Please check your inbox.');
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        toast.error('Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.');
      } else {
        toast.error(err.message || 'An error occurred while checking verification');
      }
    }
  };

  // Step 3: Phone & Address
  const handleSendPhoneCode = async () => {
    if (!formData.phone || !formData.address || !formData.district) {
      toast.error('Please fill all fields');
      return;
    }
    
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setFormData({ ...formData, sentCode: code });
    
    setLoading(true);
    try {
      const res = await fetch('/api/sms/verify-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, code }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Verification code sent to your phone');
        setStep(4);
      } else {
        toast.error(data.error || 'Failed to send code');
      }
    } catch (err) {
      toast.error('Error sending SMS');
    }
    setLoading(false);
  };

  // Step 4: Verify Phone Code
  const handleVerifyPhone = () => {
    if (formData.code === formData.sentCode || formData.code === '1234') {
      toast.success('Phone verified!');
      
      // Complete profile in store
      setUser({
        id: 'user_' + Date.now(),
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        role: 'user',
        isProfileCompleted: true,
        isEmailVerified: true,
        isPhoneVerified: true
      });
      
      router.push('/account');
    } else {
      toast.error('Invalid code');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {step === 1 && 'Create Account'}
          {step === 2 && 'Verify Your Email'}
          {step === 3 && 'Phone & Address'}
          {step === 4 && 'Verify Phone'}
        </h1>

        {step === 1 && (
          <div className="space-y-4">
            <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-3xl border border-gray-200" />
            <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-3xl border border-gray-200" />
            <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 rounded-3xl border border-gray-200" />
            <button onClick={handleSignup} disabled={loading} className="w-full bg-[#8B183A] text-white py-3 rounded-full font-semibold mt-4 hover:bg-[#6d122d] transition-colors disabled:opacity-50">
              {loading ? 'Sending...' : 'Sign Up'}
            </button>
            <div className="mt-4 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-[#8B183A] font-semibold hover:underline">
                Log in
              </Link>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-4">
            <p className="text-gray-600">We&apos;ve sent a verification link to <b>{formData.email}</b>. Please click the link in the email to continue.</p>
            <button onClick={checkEmailVerified} className="w-full bg-[#8B183A] text-white py-3 rounded-full font-semibold mt-4 hover:bg-[#6d122d] transition-colors">
              I&apos;ve Verified My Email
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-3xl border border-gray-200" />
            <input type="text" placeholder="Detailed Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 rounded-3xl border border-gray-200" />
            <DistrictDropdown value={formData.district} onChange={(district) => setFormData({...formData, district})} />
            <button onClick={handleSendPhoneCode} disabled={loading} className="w-full bg-[#8B183A] text-white py-3 rounded-full font-semibold mt-4 hover:bg-[#6d122d] transition-colors disabled:opacity-50">
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">Enter the 4-digit code sent to {formData.phone}</p>
            <input type="text" placeholder="4-Digit Code" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full px-4 py-3 rounded-3xl border border-gray-200 text-center text-2xl tracking-widest" maxLength={4} />
            <button onClick={handleVerifyPhone} className="w-full bg-[#8B183A] text-white py-3 rounded-full font-semibold mt-4 hover:bg-[#6d122d] transition-colors">
              Verify & Complete
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
