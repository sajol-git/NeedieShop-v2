'use client';

import { Headphones, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed right-6 bottom-28 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {showPrompt && !isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 flex items-center gap-3 mb-2"
          >
            <div className="w-10 h-10 bg-[#8B183A] rounded-full flex items-center justify-center text-white shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">Need Help? Chat with us!</span>
              <span className="text-xs text-gray-500">We&apos;re online and ready to help</span>
            </div>
            <button 
              onClick={() => setShowPrompt(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#0B1120] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.25)] hover:bg-[#1a2333] transition-all active:scale-95 border-4 border-white"
      >
        {isOpen ? <X className="w-7 h-7" /> : <Headphones className="w-7 h-7" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
          >
            <div className="bg-[#0B1120] p-6 text-white">
              <h3 className="text-lg font-bold">NeedieShop Support</h3>
              <p className="text-xs text-gray-400">Typically replies in a few minutes</p>
            </div>
            <div className="flex-1 p-6 bg-gray-50 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Headphones className="w-8 h-8 text-[#8B183A]" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Start a Conversation</h4>
              <p className="text-sm text-gray-500 mb-6">Hi there! How can we help you today?</p>
              <button className="bg-[#8B183A] text-white px-8 py-3 rounded-full font-bold hover:bg-[#a01c43] transition-colors">
                Send us a message
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
