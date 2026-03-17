import { getProductById, getProducts } from '@/lib/products';
import { Navbar } from '@/components/Navbar';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.metaTitle || product.name} - NeedieShop`,
    description: product.metaDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.featureImage, ...product.gallery],
    },
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
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

  const relatedProducts = allProducts.filter(p => p.id !== id).slice(0, 8);

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
