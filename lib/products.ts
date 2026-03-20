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
  title: string;
  slug: string;
  status: 'draft' | 'published';
  description: string;
  meta_data?: {
    title?: string;
    description?: string;
  };
  discount_price: number;
  original_price?: number;
  is_featured?: boolean;
  is_flash_sale?: boolean;
  free_delivery: boolean;
  image_url: string;
  image_gallery: string[];
  category: string;
  brand: string;
  stock: number;
  created_at: string;
};

export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all products:', JSON.stringify(error, null, 2));
    return [];
  }

  return data as Product[];
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', JSON.stringify(error, null, 2));
    return [];
  }

  return data as Product[];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;

  return data as Product;
}

export async function getProductBySlug(slug: string) {
  // Try by slug first
  let { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  // If not found by slug, try by ID if it's a UUID
  if (!data && !error) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    if (isUUID) {
      const { data: idData, error: idError } = await supabase
        .from('products')
        .select('*')
        .eq('id', slug)
        .eq('status', 'published')
        .maybeSingle();
      
      data = idData;
      error = idError;
    }
  }

  if (error || !data) return null;

  return data as Product;
}
