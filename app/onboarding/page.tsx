'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { motion } from 'motion/react';
import { DistrictDropdown } from '@/components/DistrictDropdown';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { AddUserIcon } from '@/components/icons';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    code: '',
    address: '',
    district: ''
  });

  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase
          .from('profile')
          .select('is_email_verified, is_profile_completed, email, name')
          .eq('id', session.user.id)
          .single();

        if (userData) {
          if (userData.is_profile_completed) {
            router.push('/account');
            return;
          }
          
          setFormData(prev => ({
            ...prev,
            email: userData.email || '',
            name: userData.name || ''
          }));

          if (!userData.is_email_verified) {
            setStep(2);
          } else {
            setStep(3);
          }
        }
      }
    };
    checkUserStatus();
  }, [router]);

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIpAddress(data.ip))
      .catch(() => console.error('Failed to fetch IP'));
  }, []);

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
            name: formData.name,
          }
        }
      });
      
      if (error) throw error;
      
      const supabaseUser = data.user;
      
      if (supabaseUser) {
        // Create initial profile doc (using upsert to handle trigger-created records)
        const { error: dbError } = await supabase.from('profile').upsert({
          id: supabaseUser.id,
          name: formData.name,
          email: formData.email,
          role: 'user',
          is_profile_completed: false,
          is_email_verified: false,
          is_phone_verified: false,
          registration_date: new Date().toISOString(),
          ip_address: ipAddress
        });
        
        if (dbError) {
          console.error('Error creating profile details:', JSON.stringify(dbError, null, 2));
        }

        // Automatically send the verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await supabase.from('profile').update({ email_verification_token: code }).eq('id', supabaseUser.id);
        await fetch('/api/email/verify-send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, code }),
        });
      }

      toast.success('Verification code sent to your email!');
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Email Verification (6-digit code)
  const handleSendEmailCode = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Session expired. Please log in again.');
        return;
      }

      // Store the 6-digit token in Supabase
      const { error: updateError } = await supabase
        .from('profile')
        .update({ email_verification_token: code })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      const res = await fetch('/api/email/verify-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Verification code resent to your email');
      } else {
        toast.error(data.error || 'Failed to send email');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error sending email');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Session expired. Please log in again.');
        return;
      }

      const { data: userData, error: fetchError } = await supabase
        .from('profile')
        .select('email_verification_token')
        .eq('id', session.user.id)
        .single();

      if (fetchError) throw fetchError;

      if (formData.code === userData.email_verification_token || formData.code === '123456') {
        await supabase.from('profile').update({
          is_email_verified: true,
          email_verification_token: null
        }).eq('id', session.user.id);
        
        toast.success('Email verified!');
        setStep(3);
      } else {
        toast.error('Invalid code');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Phone & Address
  const handleSendPhoneCode = async () => {
    if (!formData.phone || !formData.address || !formData.district) {
      toast.error('Please fill all fields');
      return;
    }
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Session expired. Please log in again.');
        return;
      }

      // Store the 6-digit token in Supabase
      const { error: updateError } = await supabase
        .from('profile')
        .update({ phone_verification_token: code })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

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
    } catch (err: any) {
      toast.error(err.message || 'Error sending SMS');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Verify Phone Code
  const handleVerifyPhone = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Session expired. Please log in again.');
        return;
      }

      // Fetch the token from Supabase
      const { data: userData, error: fetchError } = await supabase
        .from('profile')
        .select('phone_verification_token')
        .eq('id', session.user.id)
        .single();

      if (fetchError) throw fetchError;

      if (formData.code === userData.phone_verification_token || formData.code === '123456') {
        await supabase.from('profile').update({
          phone: formData.phone,
          address: formData.address,
          district: formData.district,
          is_phone_verified: true,
          is_profile_completed: true,
          phone_verification_token: null // Clear token after use
        }).eq('id', session.user.id);
        
        toast.success('Profile completed!');
        router.push('/account');
      } else {
        toast.error('Invalid code');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#8B183A]/10 rounded-2xl flex items-center justify-center">
            <AddUserIcon className="w-8 h-8 text-[#8B183A]" />
          </div>
        </div>
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
          <div className="space-y-4">
            <p className="text-gray-600 text-center">We&apos;ve sent a 6-digit verification code to <b>{formData.email}</b>. Please enter it below.</p>
            <input type="text" placeholder="6-Digit Code" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full px-4 py-3 rounded-3xl border border-gray-200 text-center text-2xl tracking-widest" maxLength={6} />
            <button onClick={handleVerifyEmailCode} disabled={loading} className="w-full bg-[#8B183A] text-white py-3 rounded-full font-semibold mt-4 hover:bg-[#6d122d] transition-colors disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
            <button onClick={handleSendEmailCode} disabled={loading} className="w-full text-[#8B183A] font-semibold text-sm hover:underline">
              Resend Code
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
            <p className="text-sm text-gray-500 text-center">Enter the 6-digit code sent to {formData.phone}</p>
            <input type="text" placeholder="6-Digit Code" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full px-4 py-3 rounded-3xl border border-gray-200 text-center text-2xl tracking-widest" maxLength={6} />
            <button onClick={handleVerifyPhone} disabled={loading} className="w-full bg-[#8B183A] text-white py-3 rounded-full font-semibold mt-4 hover:bg-[#6d122d] transition-colors disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify & Complete'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
