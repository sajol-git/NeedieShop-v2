import { getProducts } from '@/lib/products';
import { Navbar } from '@/components/Navbar';
import HomeClient from '@/components/HomeClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NeedieShop - Premium Gadgets & Accessories',
  description: 'Shop the latest gadgets, wearables, and audio accessories at NeedieShop. Premium quality, fast delivery.',
  openGraph: {
    title: 'NeedieShop - Premium Gadgets & Accessories',
    description: 'Shop the latest gadgets, wearables, and audio accessories at NeedieShop.',
    images: ['https://picsum.photos/seed/shop/1200/630'],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HomeClient />
    </div>
  );
}
