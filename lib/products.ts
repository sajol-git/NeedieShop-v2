import { supabase } from './supabase';

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

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (name),
      brands (name),
      product_variants (*),
      product_specifications (*)
    `)
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data.map(p => ({
    ...p,
    category: p.categories?.name || '',
    brand: p.brands?.name || '',
    variants: p.product_variants || [],
    specifications: p.product_specifications || []
  })) as Product[];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (name),
      brands (name),
      product_variants (*),
      product_specifications (*)
    `)
    .eq('id', id)
    .single();

  if (error) return null;

  return {
    ...data,
    category: data.categories?.name || '',
    brand: data.brands?.name || '',
    variants: data.product_variants || [],
    specifications: data.product_specifications || []
  } as Product;
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (name),
      brands (name),
      product_variants (*),
      product_specifications (*)
    `)
    .eq('slug', slug)
    .single();

  if (error) return null;

  return {
    ...data,
    category: data.categories?.name || '',
    brand: data.brands?.name || '',
    variants: data.product_variants || [],
    specifications: data.product_specifications || []
  } as Product;
}
