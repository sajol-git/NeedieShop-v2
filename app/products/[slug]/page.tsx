import { getProductBySlug, getProducts } from '@/lib/products';
import { Navbar } from '@/components/Navbar';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} - NeedieShop`,
    description: `Buy ${slug} at NeedieShop. Premium quality gadgets and accessories.`,
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ProductDetailsClient slug={slug} />
    </div>
  );
}
