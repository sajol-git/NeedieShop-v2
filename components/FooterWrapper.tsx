'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export function FooterWrapper() {
  const pathname = usePathname();
  
  // Disable footer in admin and account panels
  const isAdminPage = pathname.startsWith('/admin');
  const isAccountPage = pathname.startsWith('/account');
  
  if (isAdminPage || isAccountPage) return null;
  
  return <Footer />;
}
