import { db } from '@/firebase';
import { collection, getDocs, query, where, limit, getDoc, doc } from 'firebase/firestore';

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
  try {
    const q = query(collection(db, 'products'), where('status', '==', 'published'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Product);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Product;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return null;
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data() as Product;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}
