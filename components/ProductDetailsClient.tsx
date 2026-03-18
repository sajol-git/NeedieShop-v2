'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Zap, 
  MessageCircle, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Share2,
  Heart
} from 'lucide-react';
import { AddToBagIcon } from '@/components/icons';
import { toast } from 'sonner';
import { QuickOrderModal } from '@/components/QuickOrderModal';
import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/store/useStore';
import { Product } from '@/lib/products';

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailsClient({ product, relatedProducts }: ProductDetailsClientProps) {
  const { categories, addToCart } = useStore();
  
  const router = useRouter();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(product?.variants?.[0]?.id);
  const [activeImage, setActiveImage] = useState(0);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'videos' | 'reviews' | 'shipping'>('details');
  const [showStickyNav, setShowStickyNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowStickyNav(true);
      } else {
        setShowStickyNav(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-[#8B183A] font-bold">Back to Shop</Link>
      </div>
    );
  }

  const category = categories.find(c => c.name === product.category);
  const categorySlug = category ? category.slug : product.category.toLowerCase();

  const allImages = [product.featureImage, ...product.gallery];

  const handleAddToCart = () => {
    addToCart(product as any, selectedVariantId, quantity);
    toast.success('Added to cart!');
  };

  const handleOrderNow = () => {
    addToCart(product as any, selectedVariantId, quantity);
    router.push('/checkout');
  };

  const handleWhatsAppOrder = () => {
    const message = `Hi, I want to order ${product.name}.\nQuantity: ${quantity}\nPrice: ৳${product.price}\nLink: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/8801311030261?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <main className="pt-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/shop" className="hover:text-gray-900 transition-colors">Shop</Link>
        <span className="text-gray-300">›</span>
        <Link href={`/category/${categorySlug}`} className="hover:text-gray-900 transition-colors">{product.category}</Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
            <Image 
              src={allImages[activeImage]} 
              alt={product.name} 
              fill 
              className="object-cover"
              priority
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {allImages.map((img, index) => (
              <button 
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                  activeImage === index ? 'border-[#8B183A]' : 'border-transparent bg-gray-50'
                }`}
              >
                <Image src={img} alt={`${product.name} ${index}`} fill className="object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col pt-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <div className="text-3xl font-bold text-gray-900 mb-6">৳{product.price.toLocaleString()}</div>
          
          <div className="flex items-center gap-1 mb-10">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400" />
            ))}
          </div>

          {/* Color Selection (Variants) */}
          {product.variants.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-lg font-bold text-gray-900">Color:</span>
                <div className="flex gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`px-6 py-2 rounded-full border font-medium text-sm transition-all ${
                        selectedVariantId === v.id 
                        ? 'border-gray-900 bg-gray-900 text-white' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-6 mb-10">
            <span className="text-lg font-bold text-gray-900">Quantity:</span>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-bold text-gray-900 min-w-[20px] text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Actions */}
          <div className="space-y-4">
            <button 
              onClick={handleOrderNow}
              className="w-full flex items-center justify-center gap-3 bg-[#D31B27] text-white py-4 rounded-full font-bold text-lg hover:bg-[#b51721] transition-colors shadow-lg shadow-red-100"
            >
              <Zap className="w-5 h-5 fill-current" />
              Order Now
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-3 bg-[#94A3B8] text-white py-4 rounded-full font-bold text-lg hover:bg-[#64748B] transition-colors shadow-lg shadow-slate-200"
              >
                <AddToBagIcon className="w-6 h-6" />
                Add to Bag
              </button>
              <button 
                onClick={handleWhatsAppOrder}
                className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-full font-bold text-lg hover:bg-[#1ebc5a] transition-colors shadow-lg shadow-green-100"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <section className="mb-20">
        <div className="flex flex-wrap gap-4 mb-10">
          {(['details', 'videos', 'reviews', 'shipping'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-3 rounded-full text-sm font-bold capitalize transition-all border ${
                activeTab === tab 
                ? 'bg-[#0B1120] text-white border-[#0B1120]' 
                : 'bg-white text-gray-900 border-gray-100 hover:border-gray-300'
              }`}
            >
              {tab === 'shipping' ? 'Shipping & Return' : tab}
            </button>
          ))}
        </div>

        <div className="border border-gray-100 rounded-3xl p-8 md:p-12">
          {activeTab === 'details' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">Product Details</h2>
              <div 
                className="text-gray-600 leading-relaxed text-lg max-w-4xl prose prose-indigo"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
              
              {product.specifications.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.specifications.map((spec, i) => (
                      <div key={i} className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500">{spec.name}</span>
                        <span className="text-gray-900 font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Other tabs content... */}
        </div>
      </section>

      {/* Related Products Section */}
      <section className="mb-20">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">Related Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </section>

      {/* Sticky Bottom Nav */}
      <AnimatePresence>
        {showStickyNav && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-4 right-4 z-[60] md:hidden"
          >
            <div className="bg-[#0B1120]/95 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl p-4 flex gap-3">
              <button 
                onClick={() => setIsQuickOrderOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#D31B27] text-white py-4 rounded-full font-bold text-sm shadow-xl shadow-red-900/20"
              >
                <Zap className="w-4 h-4 fill-current" />
                Quick Order
              </button>
              <button 
                onClick={handleWhatsAppOrder}
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-full font-bold text-sm shadow-xl shadow-green-900/20"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <QuickOrderModal 
        isOpen={isQuickOrderOpen} 
        onClose={() => setIsQuickOrderOpen(false)} 
        product={product as any}
        selectedVariantId={selectedVariantId}
        quantity={quantity}
      />
    </main>
  );
}
