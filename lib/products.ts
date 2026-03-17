export type Category = {
  id: string;
  name: string;
  slug: string;
  photo: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  photo: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  status: 'draft' | 'published';
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  price: number;
  compareAtPrice?: number;
  featureImage: string;
  gallery: string[];
  category: string;
  brand: string;
  stock: number;
  variants: { id: string; name: string; price: number; stock: number }[];
  specifications: { name: string; value: string }[];
  isFeatured: boolean;
  isFlashSale: boolean;
  flashSaleEndTime?: string;
  relatedProducts: string[];
};

export const initialProducts: Product[] = [];

export async function getProducts() {
  // In a real app, this would fetch from a database.
  // For now, we return the initial products.
  return initialProducts;
}

export async function getProductById(id: string) {
  return initialProducts.find(p => p.id === id);
}

export async function getProductBySlug(slug: string) {
  return initialProducts.find(p => p.slug === slug);
}
