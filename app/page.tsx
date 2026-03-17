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

export default async function Home() {
  const products = await getProducts();
  
  const featuredProducts = products.filter(p => p.isFeatured);
  const flashSaleProducts = products.filter(p => p.isFlashSale);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HomeClient 
        featuredProducts={featuredProducts} 
        flashSaleProducts={flashSaleProducts} 
      />
    </div>
  );
}
