'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { motion } from 'motion/react';
import { DistrictDropdown } from '@/components/DistrictDropdown';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    code: '',
    email: '',
    address: '',
    district: ''
  });

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.phone) {
        toast.error('Please enter name and phone');
        return;
      }
      // Mock sending code
      toast.success('4-digit code sent to your phone');
      setStep(2);
    } else if (step === 2) {
      if (formData.code !== '1234') {
        toast.error('Invalid code. Use 1234 for demo.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!formData.email || !formData.address || !formData.district) {
        toast.error('Please fill all fields');
        return;
      }
      // Complete profile
      setUser({
        id: 'user_' + Date.now(),
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        role: 'user',
        isProfileCompleted: true
      });
      toast.success('Profile completed!');
      router.push('/account');
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
          {step === 1 && 'Complete Your Profile'}
          {step === 2 && 'Verify Phone'}
          {step === 3 && 'Additional Details'}
        </h1>

        {step === 1 && (
          <div className="space-y-4">
            <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-3xl border border-gray-200" />
            <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-3xl border border-gray-200" />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input type="text" placeholder="Enter 4-digit code" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full px-4 py-3 rounded-3xl border border-gray-200" />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-3xl border border-gray-200" />
            <input type="text" placeholder="Detailed Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 rounded-3xl border border-gray-200" />
            <DistrictDropdown value={formData.district} onChange={(district) => setFormData({...formData, district})} />
          </div>
        )}

        <button 
          onClick={handleNext}
          className="w-full bg-[#8B183A] text-white py-3 rounded-full font-semibold mt-6 hover:bg-[#6d122d] transition-colors"
        >
          {step === 3 ? 'Complete' : 'Next'}
        </button>
      </motion.div>
    </div>
  );
}
