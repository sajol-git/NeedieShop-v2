import { getProductBySlug, getProducts } from '@/lib/products';
import { Navbar } from '@/components/Navbar';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found - NeedieShop',
    };
  }

  return {
    title: `${product.title} - NeedieShop`,
    description: product.meta_data?.description || `Buy ${product.title} at NeedieShop. Premium quality gadgets and accessories.`,
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const allProducts = await getProducts();
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Navbar />
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-[#8B183A] font-bold">Back to Shop</Link>
      </div>
    );
  }

  const relatedProducts = allProducts.filter(p => p.slug !== slug && p.id !== slug).slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ProductDetailsClient 
        product={product} 
        relatedProducts={relatedProducts} 
      />
    </div>
  );
}
