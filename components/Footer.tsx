'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Lock, Smartphone } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function Footer() {
  return (
    <footer className="bg-[#0B1120] text-white pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand & Newsletter */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center">
              <div className="relative h-10 w-40">
                <Image 
                  src="https://res.cloudinary.com/byngla/image/upload/v1764928332/webstore/rezxlvheluvbsrbted8o.png"
                  alt="NeedieShop"
                  fill
                  className="object-contain brightness-0 invert"
                  referrerPolicy="no-referrer"
                />
              </div>
            </Link>
            <p className="text-gray-400 text-sm">Your premium destination for the latest gadgets and electronics.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 bg-white/5 border border-white/10 rounded-3xl px-4 py-3 text-sm focus:outline-none focus:border-[#8B183A] transition-colors"
              />
              <button className="bg-[#D31B27] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#b51721] transition-colors">
                Join
              </button>
            </div>
          </div>

          {/* Top Gadgets */}
          <div>
            <h3 className="text-lg font-bold mb-6">Top Gadgets</h3>
            <ul className="space-y-4">
              <li><Link href="/category/smartphones" className="text-sm text-gray-400 hover:text-white transition-colors">Smartphones</Link></li>
              <li><Link href="/category/laptops" className="text-sm text-gray-400 hover:text-white transition-colors">Laptops</Link></li>
              <li><Link href="/category/audio" className="text-sm text-gray-400 hover:text-white transition-colors">Audio & Headphones</Link></li>
              <li><Link href="/category/wearables" className="text-sm text-gray-400 hover:text-white transition-colors">Wearables</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/track-order" className="text-sm text-gray-400 hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/returns" className="text-sm text-gray-400 hover:text-white transition-colors">Returns & Warranty</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 shrink-0 text-[#8B183A]" />
                <span className="text-sm">House : 25, Road No: 2, Block A, Mirpur-1, Dhaka 1216</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 shrink-0 text-[#8B183A]" />
                <span className="text-sm">info@needieshop.bd</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 shrink-0 text-[#8B183A]" />
                <span className="text-sm">+880 1700 000000</span>
              </li>
            </ul>
            <div className="mt-6 flex gap-4">
              <Link href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#8B183A] transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#8B183A] transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#8B183A] transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="#" className="block">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" width={120} height={40} className="h-10 w-auto" />
              </Link>
              <Link href="#" className="block">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" width={120} height={40} className="h-10 w-auto" />
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} NeedieShop. All right Reserve NeedieShop.
          </p>
        </div>
      </div>
    </footer>
  );
}
