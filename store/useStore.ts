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
    address?: string;
    district?: string;
    addresses?: { id: string; label: string; address: string; isDefault: boolean }[];
    points?: number;
  } | null;
  isCartOpen: boolean;
  offerBanners: { title: string; image: string; link: string }[];
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
  storeSettings: {
    name: string;
    email: string;
    phone: string;
    address: string;
    currency: string;
  };
  paymentSettings: {
    codEnabled: boolean;
    bkashEnabled: boolean;
    nagadEnabled: boolean;
    advanceAmount: number;
  };
  shippingZones: { id: number; name: string; fee: number; estimatedDays: string }[];
  coupons: { id: number; code: string; discount: string; usageLimit: number; used: number; status: 'Active' | 'Expired' }[];
  
  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => Promise<void>;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  setBrands: (brands: Brand[]) => void;
  addBrand: (brand: Brand) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  setOfferBanners: (banners: StoreState['offerBanners']) => Promise<void>;
  setCopyrightText: (text: string) => Promise<void>;
  setHeroBanners: (banners: StoreState['heroBanners']) => Promise<void>;
  setFooterContent: (content: StoreState['footerContent']) => Promise<void>;
  setStoreSettings: (settings: StoreState['storeSettings']) => Promise<void>;
  setPaymentSettings: (settings: StoreState['paymentSettings']) => Promise<void>;
  setShippingZones: (zones: StoreState['shippingZones']) => Promise<void>;
  setCoupons: (coupons: StoreState['coupons']) => Promise<void>;
  
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
    (set, get) => ({
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
      storeSettings: {
        name: 'NeedieShop',
        email: 'support@needieshop.bd',
        phone: '+880 1700 000000',
        address: 'Dhaka, Bangladesh',
        currency: 'BDT (৳)',
      },
      paymentSettings: {
        codEnabled: true,
        bkashEnabled: true,
        nagadEnabled: true,
        advanceAmount: 200,
      },
      shippingZones: [
        { id: 1, name: 'Inside Dhaka', fee: 60, estimatedDays: '1-2' },
        { id: 2, name: 'Outside Dhaka', fee: 120, estimatedDays: '3-5' },
      ],
      coupons: [],

      setProducts: (products) => set({ products }),
      addProduct: async (product) => {
        const { supabase } = await import('@/lib/supabase');
        
        let error;
        // Try inserting with slug first
        const res1 = await supabase.from('products').insert({
          id: product.id,
          title: product.title,
          slug: product.slug,
          description: product.description,
          meta_data: product.meta_data,
          discount_price: product.discount_price,
          free_delivery: product.free_delivery,
          image_url: product.image_url,
          image_gallery: product.image_gallery,
          category: product.category,
          brand: product.brand,
          stock: product.stock,
          status: product.status,
        });
        
        error = res1.error;

        // If it fails because slug column doesn't exist (42703), try without slug
        if (error && error.code === '42703') {
          const res2 = await supabase.from('products').insert({
            id: product.id,
            title: product.title,
            description: product.description,
            meta_data: product.meta_data,
            discount_price: product.discount_price,
            free_delivery: product.free_delivery,
            image_url: product.image_url,
            image_gallery: product.image_gallery,
            category: product.category,
            brand: product.brand,
            stock: product.stock,
            status: product.status,
          });
          error = res2.error;
        }

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
          price: item.product.discount_price
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
        
        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.meta_data !== undefined) dbUpdates.meta_data = updates.meta_data;
        if (updates.discount_price !== undefined) dbUpdates.discount_price = updates.discount_price;
        if (updates.free_delivery !== undefined) dbUpdates.free_delivery = updates.free_delivery;
        if (updates.image_url !== undefined) dbUpdates.image_url = updates.image_url;
        if (updates.image_gallery !== undefined) dbUpdates.image_gallery = updates.image_gallery;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
        if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
        if (updates.status !== undefined) dbUpdates.status = updates.status;

        let error;
        const res1 = await supabase.from('products').update(dbUpdates).eq('id', id);
        error = res1.error;

        if (error && error.code === '42703' && dbUpdates.slug !== undefined) {
          delete dbUpdates.slug;
          const res2 = await supabase.from('products').update(dbUpdates).eq('id', id);
          error = res2.error;
        }

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
      addCategory: async (category) => {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase.from('categories').insert(category);
        if (error) throw error;
        set((state) => ({ categories: [...state.categories, category] }));
      },
      deleteCategory: async (id) => {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        set((state) => ({ categories: state.categories.filter(c => c.id !== id) }));
      },
      setBrands: (brands) => set({ brands }),
      addBrand: async (brand) => {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase.from('brands').insert(brand);
        if (error) throw error;
        set((state) => ({ brands: [...state.brands, brand] }));
      },
      deleteBrand: async (id) => {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase.from('brands').delete().eq('id', id);
        if (error) throw error;
        set((state) => ({ brands: state.brands.filter(b => b.id !== id) }));
      },
      setOfferBanners: async (offerBanners) => {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase
          .from('settings')
          .upsert({ key: 'offer_banners', value: offerBanners }, { onConflict: 'key' });
        if (error) throw error;
        set({ offerBanners });
      },
      setCopyrightText: async (copyrightText) => {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase
          .from('settings')
          .upsert({ key: 'copyright_text', value: copyrightText }, { onConflict: 'key' });
        if (error) throw error;
        set({ copyrightText });
      },
      setHeroBanners: async (heroBanners) => {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase
          .from('settings')
          .upsert({ key: 'hero_banners', value: heroBanners }, { onConflict: 'key' });
        if (error) throw error;
        set({ heroBanners });
      },
      setFooterContent: async (footerContent) => {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase
          .from('settings')
          .upsert({ key: 'footer_content', value: footerContent }, { onConflict: 'key' });
        if (error) throw error;
        set({ footerContent });
      },
      setStoreSettings: async (storeSettings) => {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase
          .from('settings')
          .upsert({ key: 'store_settings', value: storeSettings }, { onConflict: 'key' });
        if (error) throw error;
        set({ storeSettings });
      },
      setPaymentSettings: async (paymentSettings) => {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase
          .from('settings')
          .upsert({ key: 'payment_settings', value: paymentSettings }, { onConflict: 'key' });
        if (error) throw error;
        set({ paymentSettings });
      },
      setShippingZones: async (shippingZones) => {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase
          .from('settings')
          .upsert({ key: 'shipping_zones', value: Array.isArray(shippingZones) ? shippingZones : [] }, { onConflict: 'key' });
        if (error) throw error;
        set({ shippingZones: Array.isArray(shippingZones) ? shippingZones : [] });
      },
      setCoupons: async (coupons) => {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase
          .from('settings')
          .upsert({ key: 'coupons', value: coupons }, { onConflict: 'key' });
        if (error) throw error;
        set({ coupons });
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
        try {
          const { supabase } = await import('@/lib/supabase');
          
          // 1. Check for existing session
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: userData } = await supabase
              .from('profile')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (userData) {
              set({
                user: {
                  id: userData.id,
                  name: userData.name || 'User',
                  phone: userData.phone || '',
                  email: userData.email || '',
                  role: userData.role || 'user',
                  isProfileCompleted: userData.is_profile_completed || false,
                  isEmailVerified: userData.is_email_verified || false,
                  isPhoneVerified: userData.is_phone_verified || false,
                  registrationDate: userData.registration_date || userData.created_at,
                  address: userData.address || '',
                  district: userData.district || '',
                }
              });
            }
          }

          // 2. Fetch Categories
          const { data: categoriesData } = await supabase.from('categories').select('*');
          if (categoriesData) {
            const categories = categoriesData.map(c => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              photo: c.image_url
            }));
            set({ categories });
          }

          // 3. Fetch Brands
          const { data: brandsData } = await supabase.from('brands').select('*');
          if (brandsData) {
            const brands = brandsData.map(b => ({
              id: b.id,
              name: b.name,
              slug: b.slug,
              photo: b.image_url
            }));
            set({ brands });
          }

          // 4. Fetch Products
          const { getAllProducts } = await import('@/lib/products');
          const products = await getAllProducts();
          set({ products });

          // 5. Fetch Orders
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
                product: item.product as Product,
                variantId: item.variant_id,
                quantity: item.quantity
              })),
              createdAt: o.created_at
            }));
            set({ orders: formattedOrders });
          }

          // 6. Fetch Settings
          const { data: settings } = await supabase.from('settings').select('*');
          if (settings) {
            const footer = settings.find(s => s.key === 'footer_content')?.value;
            const copyright = settings.find(s => s.key === 'copyright_text')?.value;
            const storeSettings = settings.find(s => s.key === 'store_settings')?.value;
            const paymentSettings = settings.find(s => s.key === 'payment_settings')?.value;
            const shippingZones = settings.find(s => s.key === 'shipping_zones')?.value;
            const coupons = settings.find(s => s.key === 'coupons')?.value;
            const heroBanners = settings.find(s => s.key === 'hero_banners')?.value;
            const offerBanners = settings.find(s => s.key === 'offer_banners')?.value;
            
            if (footer) set({ footerContent: footer });
            if (copyright) set({ copyrightText: copyright });
            if (storeSettings) set({ storeSettings });
            if (paymentSettings) set({ paymentSettings });
            if (shippingZones) set({ shippingZones: Array.isArray(shippingZones) ? shippingZones : [] });
            if (coupons) set({ coupons });
            if (Array.isArray(heroBanners)) set({ heroBanners });
            if (Array.isArray(offerBanners)) set({ offerBanners });
          }

          // 7. Subscribe to Realtime Updates for Settings
          supabase
            .channel('settings_changes')
            .on('postgres_changes', { event: '*', table: 'settings', schema: 'public' }, (payload) => {
              const { key, value } = payload.new as any;
              if (key === 'footer_content') set({ footerContent: value });
              if (key === 'copyright_text') set({ copyrightText: value });
              if (key === 'store_settings') set({ storeSettings: value });
              if (key === 'payment_settings') set({ paymentSettings: value });
              if (key === 'shipping_zones') set({ shippingZones: Array.isArray(value) ? value : [] });
              if (key === 'coupons') set({ coupons: value });
              if (key === 'hero_banners' && Array.isArray(value)) set({ heroBanners: value });
              if (key === 'offer_banners' && Array.isArray(value)) set({ offerBanners: value });
            })
            .subscribe();
        } catch (error) {
          console.error('Error during store initialization:', error);
        }
      }
    }),
    {
      name: 'needieshop-storage',
    }
  )
);
