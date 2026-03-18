import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Product } from '@/lib/products';

export type { Product };

export type CartItem = {
  product: Product;
  variantId?: string;
  quantity: number;
};

export type OrderStatusUpdate = {
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  message: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  shippingFee: number;
  advancePayment: number;
  dueAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  customerInfo: {
    name: string;
    phone: string;
    address: string;
    zone: 'Inside Dhaka' | 'Outside Dhaka';
    ipAddress?: string;
  };
  trackingNumber?: string;
  trackingHistory: OrderStatusUpdate[];
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  photo?: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  photo?: string;
};

type StoreState = {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  cart: CartItem[];
  orders: Order[];
  user: { 
    id: string; 
    name: string; 
    phone: string; 
    email: string; 
    role: 'user' | 'admin' | 'suspect'; 
    isProfileCompleted: boolean; 
    isEmailVerified: boolean; 
    isPhoneVerified: boolean;
    registrationDate: string;
    ipAddress?: string;
  } | null;
  isCartOpen: boolean;
  offerBanners: string[];
  copyrightText: string;
  heroBanners: { id: number; title: string; image: string; link: string; status: 'Active' | 'Inactive' }[];
  footerContent: {
    address: string;
    phone: string;
    email: string;
    facebook: string;
    instagram: string;
    youtube: string;
  };
  
  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => Promise<void>;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setCategories: (categories: Category[]) => void;
  setBrands: (brands: Brand[]) => void;
  setOfferBanners: (banners: string[]) => void;
  setCopyrightText: (text: string) => Promise<void>;
  setHeroBanners: (banners: StoreState['heroBanners']) => void;
  setFooterContent: (content: StoreState['footerContent']) => Promise<void>;
  
  addToCart: (product: Product, variantId?: string, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (isCartOpen: boolean) => void;
  
  setUser: (user: StoreState['user']) => void;
  init: () => Promise<void>;
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      products: [],
      categories: [],
      brands: [],
      cart: [],
      orders: [],
      user: null,
      isCartOpen: false,
      offerBanners: [],
      copyrightText: '',
      heroBanners: [],
      footerContent: {
        address: '',
        phone: '',
        email: '',
        facebook: '',
        instagram: '',
        youtube: '',
      },

      setProducts: (products) => set({ products }),
      addProduct: async (product) => {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase.from('products').insert({
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          meta_title: product.metaTitle,
          meta_description: product.metaDescription,
          price: product.price,
          compare_at_price: product.compareAtPrice,
          feature_image: product.featureImage,
          gallery: product.gallery,
          category: product.category,
          brand: product.brand,
          stock: product.stock,
          status: product.status,
          is_featured: product.isFeatured,
          is_flash_sale: product.isFlashSale,
        });
        if (error) throw error;
        set((state) => ({ products: [...state.products, product] }));
      },
      setOrders: (orders) => set({ orders }),
      addOrder: async (order) => {
        const { supabase } = await import('@/lib/supabase');
        
        // 1. Insert Order
        const { error: orderError } = await supabase.from('orders').insert({
          id: order.id,
          total: order.total,
          subtotal: order.subtotal,
          shipping_fee: order.shippingFee,
          advance_payment: order.advancePayment,
          due_amount: order.dueAmount,
          status: order.status,
          customer_name: order.customerInfo.name,
          customer_phone: order.customerInfo.phone,
          customer_address: order.customerInfo.address,
          customer_zone: order.customerInfo.zone,
          ip_address: order.customerInfo.ipAddress,
        });

        if (orderError) throw orderError;

        // 2. Insert Order Items
        const orderItems = order.items.map(item => ({
          order_id: order.id,
          product_id: item.product.id,
          variant_id: item.variantId,
          quantity: item.quantity,
          price: item.product.price
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
        if (itemsError) throw itemsError;

        // 3. Insert Initial Tracking History
        const { error: trackingError } = await supabase.from('order_tracking_history').insert({
          order_id: order.id,
          status: order.status,
          message: order.trackingHistory[0].message
        });
        if (trackingError) throw trackingError;

        set((state) => ({ orders: [order, ...state.orders] }));
      },
      updateOrderStatus: async (id, status) => {
        const { supabase } = await import('@/lib/supabase');
        
        const messages = {
          Pending: 'Order placed successfully.',
          Processing: 'Our team is preparing your order.',
          Shipped: 'Your order has been handed over to the courier.',
          Delivered: 'Order delivered successfully.',
          Cancelled: 'Order has been cancelled.',
        };

        // 1. Update Order Status
        const { error: orderError } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', id);
        
        if (orderError) throw orderError;

        // 2. Add Tracking History
        const { error: trackingError } = await supabase
          .from('order_tracking_history')
          .insert({
            order_id: id,
            status,
            message: messages[status]
          });
        
        if (trackingError) throw trackingError;

        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id === id) {
              return {
                ...o,
                status,
                trackingHistory: [
                  ...o.trackingHistory,
                  {
                    status,
                    date: new Date().toISOString(),
                    message: messages[status],
                  },
                ],
              };
            }
            return o;
          }),
        }));
      },
      updateProduct: async (id, updates) => {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase.from('products').update(updates).eq('id', id);
        if (error) throw error;
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },
      deleteProduct: async (id) => {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },
      setCategories: (categories) => set({ categories }),
      setBrands: (brands) => set({ brands }),
      setOfferBanners: (offerBanners) => set({ offerBanners }),
      setCopyrightText: async (copyrightText) => {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase
          .from('settings')
          .upsert({ key: 'copyright_text', value: copyrightText }, { onConflict: 'key' });
        if (error) throw error;
        set({ copyrightText });
      },
      setHeroBanners: (heroBanners) => set({ heroBanners }),
      setFooterContent: async (footerContent) => {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase
          .from('settings')
          .upsert({ key: 'footer_content', value: footerContent }, { onConflict: 'key' });
        if (error) throw error;
        set({ footerContent });
      },

      addToCart: (product, variantId, quantity = 1) => set((state) => {
        const existingItemIndex = state.cart.findIndex(
          (item) => item.product.id === product.id && item.variantId === variantId
        );

        if (existingItemIndex > -1) {
          const newCart = [...state.cart];
          newCart[existingItemIndex].quantity += quantity;
          return { cart: newCart };
        }

        return { cart: [...state.cart, { product, variantId, quantity }] };
      }),
      removeFromCart: (productId, variantId) => set((state) => ({
        cart: state.cart.filter((item) => !(item.product.id === productId && item.variantId === variantId)),
      })),
      updateCartQuantity: (productId, variantId, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item.product.id === productId && item.variantId === variantId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        ),
      })),
      clearCart: () => set({ cart: [] }),
      setIsCartOpen: (isCartOpen) => set({ isCartOpen }),

      setUser: (user) => set({ user }),

      init: async () => {
        const { supabase } = await import('@/lib/supabase');
        
        // Fetch Categories
        const { data: categories } = await supabase.from('categories').select('*');
        if (categories) set({ categories });

        // Fetch Brands
        const { data: brands } = await supabase.from('brands').select('*');
        if (brands) set({ brands });

        // Fetch Products
        const { getProducts } = await import('@/lib/products');
        const products = await getProducts();
        set({ products });

        // Fetch Orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select(`
            *,
            items:order_items(
              *,
              product:products(*)
            ),
            trackingHistory:order_tracking_history(*)
          `)
          .order('created_at', { ascending: false });

        if (ordersData) {
          const formattedOrders: Order[] = ordersData.map(o => ({
            id: o.id,
            total: Number(o.total),
            subtotal: Number(o.subtotal),
            shippingFee: Number(o.shipping_fee),
            advancePayment: Number(o.advance_payment),
            dueAmount: Number(o.due_amount),
            status: o.status,
            customerInfo: {
              name: o.customer_name,
              phone: o.customer_phone,
              address: o.customer_address,
              zone: o.customer_zone,
              ipAddress: o.ip_address,
            },
            trackingNumber: o.tracking_number,
            trackingHistory: o.trackingHistory.map((th: any) => ({
              status: th.status,
              date: th.created_at,
              message: th.message
            })),
            items: o.items.map((item: any) => ({
              product: item.product,
              variantId: item.variant_id,
              quantity: item.quantity
            })),
            createdAt: o.created_at
          }));
          set({ orders: formattedOrders });
        }

        // Fetch Banners
        const { data: banners } = await supabase.from('banners').select('*').eq('status', 'Active');
        if (banners) {
          set({ 
            heroBanners: banners.filter(b => b.type === 'hero'),
            offerBanners: banners.filter(b => b.type === 'offer').map(b => b.image)
          });
        }

        // Fetch Settings
        const { data: settings } = await supabase.from('settings').select('*');
        if (settings) {
          const footer = settings.find(s => s.key === 'footer_content')?.value;
          const copyright = settings.find(s => s.key === 'copyright_text')?.value;
          if (footer) set({ footerContent: footer });
          if (copyright) set({ copyrightText: copyright });
        }
      }
    }),
    {
      name: 'needieshop-storage',
    }
  )
);
