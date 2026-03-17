import { getProducts } from '@/lib/products';
import { Navbar } from '@/components/Navbar';
import ShopClient from '@/components/ShopClient';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Shop All Products - NeedieShop',
  description: 'Browse our full collection of premium gadgets, audio gear, and wearables. Authentic products with fast delivery in Bangladesh.',
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />
      <Suspense fallback={<div className="pt-24 text-center">Loading products...</div>}>
        <ShopClient />
      </Suspense>
    </div>
  );
}
