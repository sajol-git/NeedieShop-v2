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

export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (name),
      brands (name),
      product_variants (*),
      product_specifications (*)
    `);

  if (error) {
    console.error('Error fetching all products:', error);
    return [];
  }

  return data.map(p => ({
    ...p,
    category: p.categories?.name || p.category || '',
    brand: p.brands?.name || p.brand || '',
    variants: p.product_variants || [],
    specifications: p.product_specifications || []
  })) as Product[];
}

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
  // Try by slug first
  let { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (name),
      brands (name),
      product_variants (*),
      product_specifications (*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  // If not found by slug, try by ID if it's a UUID
  if (!data && !error) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    if (isUUID) {
      const { data: idData, error: idError } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          brands (name),
          product_variants (*),
          product_specifications (*)
        `)
        .eq('id', slug)
        .eq('status', 'published')
        .maybeSingle();
      
      data = idData;
      error = idError;
    }
  }

  if (error || !data) return null;

  return {
    ...data,
    category: data.categories?.name || '',
    brand: data.brands?.name || '',
    variants: data.product_variants || [],
    specifications: data.product_specifications || []
  } as Product;
}
