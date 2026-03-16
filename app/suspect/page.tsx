'use client';

import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function SuspectScreen() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-gray-800 p-8 rounded-3xl shadow-2xl border border-red-500/30 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
        
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <ShieldAlert className="w-10 h-10 text-red-500 relative z-10" />
          <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Access Restricted</h1>
        
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 text-left flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-200 leading-relaxed">
            Your account has been flagged for suspicious activity or policy violations. Access to NeedieShop has been temporarily restricted.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            If you believe this is an error, please contact our support team to resolve the issue.
          </p>
          <a 
            href="mailto:support@needieshop.bd"
            className="block w-full bg-white text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </a>
          <Link 
            href="/"
            className="block w-full bg-gray-800 text-gray-400 py-3 rounded-xl font-medium hover:text-white transition-colors border border-gray-700 hover:border-gray-600"
          >
            Return to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
