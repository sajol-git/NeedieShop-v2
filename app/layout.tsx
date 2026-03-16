import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { Toaster } from 'sonner';
import { SocialProof } from '@/components/SocialProof';
import { FooterWrapper } from '@/components/FooterWrapper';
import { ChatWidget } from '@/components/ChatWidget';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Urbanist } from 'next/font/google';

const urbanist = Urbanist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NeedieShop - Premium Gadgets & Electronics',
  description: 'A premium, high-performance e-commerce platform tailored for the Bangladeshi market, specializing in gadgets, electronics, and lifestyle products.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={urbanist.className}>
      <body suppressHydrationWarning>
        {children}
        <MobileBottomNav />
        <FooterWrapper />
        {/* <ChatWidget /> */}
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#0B1120',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '1rem',
              fontSize: '0.875rem',
            },
            className: 'gadget-toast',
          }}
        />
      </body>
    </html>
  );
}
