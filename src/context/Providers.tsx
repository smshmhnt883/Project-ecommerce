'use client';

import React, { ReactNode } from 'react';
import { ToastProvider } from './ToastContext';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { AddressProvider } from './AddressContext';
import { OrderProvider } from './OrderContext';
import { ReviewProvider } from './ReviewContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AddressProvider>
              <OrderProvider>
                <ReviewProvider>
                  {children}
                </ReviewProvider>
              </OrderProvider>
            </AddressProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
