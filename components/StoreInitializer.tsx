'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { supabase } from '@/lib/supabase';

export function StoreInitializer() {
  const init = useStore((state) => state.init);

  useEffect(() => {
    init();

    // Subscribe to orders for real-time updates (Admin Panel sync)
    const ordersSubscription = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', table: 'orders', schema: 'public' },
        () => {
          // Re-initialize to get full joined data
          init();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, [init]);

  return null;
}
