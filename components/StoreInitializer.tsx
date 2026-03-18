'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export function StoreInitializer() {
  const init = useStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return null;
}
