'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isVerified, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (!isVerified) {
        router.push(
          `/verify?email=${encodeURIComponent(user.email)}&redirect=${encodeURIComponent(pathname)}`
        );
      }
    }
  }, [user, isAuthenticated, isVerified, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-ayur-ivory">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-ayur-green-900 animate-spin" />
          <p className="text-xs text-ayur-charcoal-600 font-medium">Verifying Ayurvedic Account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
