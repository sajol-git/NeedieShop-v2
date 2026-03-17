import { getProducts } from '@/lib/products';
import { Navbar } from '@/components/Navbar';
import CategoryClient from '@/components/CategoryClient';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} - NeedieShop`,
    description: `Shop the best ${slug} products at NeedieShop. Premium quality gadgets and accessories.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Navbar />
      <CategoryClient slug={slug} />
    </div>
  );
}
