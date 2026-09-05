'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, OrderStage, TrackingStep, CartItem, Address, PaymentMethod } from '@/types';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { insforge } from '@/lib/insforge';
import { PRODUCTS } from '@/lib/data/products';

export * from '@/services/orders';
import { generateTrackingTimeline } from '@/services/orders';

interface OrderContextType {
  orders: Order[];
  placeOrder: (orderParams: {
    items: CartItem[];
    subtotal: number;
    discount: number;
    couponCode?: string;
    shipping: number;
    deliveryMethod: 'standard' | 'express';
    total: number;
    shippingAddress: Address;
    paymentMethod: PaymentMethod | 'demo';
    paymentDetails?: {
      upiId?: string;
      cardLast4?: string;
      bankName?: string;
      walletName?: string;
    };
  }) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  // Brand-new customer starts with strictly empty orders (NO demo orders)
  const [orders, setOrders] = useState<Order[]>([]);
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Sync with InsForge orders when user is authenticated
  useEffect(() => {
    const userId = user?.id;
    if (!isAuthenticated || !userId) {
      setOrders([]);
      return;
    }

    async function fetchUserOrders() {
      try {
        const { data: dbOrders, error } = await insforge.database
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && dbOrders && dbOrders.length > 0) {
          const loadedOrders: Order[] = await Promise.all(
            dbOrders.map(async (o: any) => {
              const { data: itemsData } = await insforge.database
                .from('order_items')
                .select('*')
                .eq('order_id', o.id);

              const items = (itemsData || []).map((it: any) => {
                const prod = PRODUCTS.find((p) => p.id === it.product_id) || {
                  id: it.product_id,
                  name: it.product_name_snapshot,
                  slug: 'product',
                  category: 'Wellness',
                  categorySlug: 'wellness',
                  concernSlugs: [],
                  description: '',
                  shortDescription: '',
                  price: Number(it.unit_price),
                  mrp: Number(it.unit_price) * 1.1,
                  discount: 10,
                  images: [it.product_image_snapshot],
                  thumbnail: it.product_image_snapshot,
                  sku: `PAT-${it.product_id}`,
                  size: it.selected_size || 'Standard',
                  stock: 100,
                  inStock: true,
                  rating: 4.8,
                  reviewCount: 50,
                  featured: false,
                  bestseller: false,
                  ingredients: [],
                  benefits: [],
                  usage: '',
                  manufacturer: {
                    name: 'Patanjali Ayurved Limited',
                    address: 'Haridwar, Uttarakhand',
                    license: 'A-2878/99',
                    shelfLife: '24 Months',
                    countryOfOrigin: 'India',
                  },
                };

                return {
                  product: prod,
                  quantity: it.quantity,
                  price: Number(it.unit_price),
                  selectedSize: it.selected_size || prod.size,
                };
              });

              const orderDate = new Date(o.created_at);
              const formattedDate = orderDate.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const estDate = new Date(orderDate.getTime() + 5 * 24 * 3600 * 1000).toLocaleDateString(
                'en-IN',
                {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }
              );

              return {
                id: o.id,
                userId: o.user_id,
                items,
                subtotal: Number(o.subtotal),
                discount: Number(o.discount || 0),
                couponCode: o.coupon_code || undefined,
                shipping: Number(o.shipping_fee || 0),
                tax: Number(o.tax || 0),
                total: Number(o.total),
                shippingAddress: o.shipping_address_snapshot,
                deliveryMethod: 'standard',
                paymentMethod: o.payment_method || 'demo',
                paymentStatus: o.payment_status || 'pending',
                paymentDetails: {
                  walletName: 'Demo Checkout (Pending)',
                },
                orderStatus: o.order_status || 'placed',
                trackingTimeline: generateTrackingTimeline(
                  o.order_status || 'placed',
                  o.created_at
                ),
                createdAt: formattedDate,
                estimatedDelivery: estDate,
              };
            })
          );

          setOrders(loadedOrders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.warn('InsForge order fetching error:', err);
      }
    }

    fetchUserOrders();
  }, [isAuthenticated, user?.id]);

  const placeOrder = async (orderParams: {
    items: CartItem[];
    subtotal: number;
    discount: number;
    couponCode?: string;
    shipping: number;
    deliveryMethod: 'standard' | 'express';
    total: number;
    shippingAddress: Address;
    paymentMethod: PaymentMethod | 'demo';
    paymentDetails?: {
      upiId?: string;
      cardLast4?: string;
      bankName?: string;
      walletName?: string;
    };
  }): Promise<Order> => {
    const orderId = `PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const isoDate = now.toISOString();

    const formattedDate = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const estDeliveryDays = orderParams.deliveryMethod === 'express' ? 3 : 5;
    const estDeliveryDate = new Date(
      now.getTime() + estDeliveryDays * 24 * 3600 * 1000
    ).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const recalculatedSubtotal = orderParams.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const recalculatedTotal = Math.max(
      0,
      recalculatedSubtotal - orderParams.discount + orderParams.shipping
    );

    const orderItems = orderParams.items.map((it) => ({
      product: it.product,
      quantity: it.quantity,
      price: it.product.price,
      selectedSize: it.selectedSize || it.product.size,
    }));

    const newOrder: Order = {
      id: orderId,
      userId: user?.id || 'guest',
      items: orderItems,
      subtotal: recalculatedSubtotal,
      discount: orderParams.discount,
      couponCode: orderParams.couponCode,
      shipping: orderParams.shipping,
      tax: 0,
      total: recalculatedTotal,
      shippingAddress: orderParams.shippingAddress,
      deliveryMethod: orderParams.deliveryMethod,
      paymentMethod: (orderParams.paymentMethod as PaymentMethod) || 'upi',
      paymentStatus: 'pending',
      paymentDetails: orderParams.paymentDetails || {
        walletName: 'Simulated Gateway / Cash on Delivery',
      },
      orderStatus: 'placed',
      trackingTimeline: generateTrackingTimeline('placed', isoDate),
      createdAt: formattedDate,
      estimatedDelivery: estDeliveryDate,
    };

    // Save to InsForge orders table if authenticated
    if (isAuthenticated && user?.id) {
      try {
        await insforge.database.from('orders').insert({
          id: orderId,
          user_id: user.id,
          order_number: orderId,
          subtotal: recalculatedSubtotal,
          discount: orderParams.discount,
          shipping_fee: orderParams.shipping,
          tax: 0,
          total: recalculatedTotal,
          payment_status: 'pending',
          payment_method: orderParams.paymentMethod || 'upi',
          order_status: 'placed',
          shipping_address_snapshot: orderParams.shippingAddress,
          coupon_code: orderParams.couponCode || null,
        });

        // Insert order items snapshots
        for (const it of orderItems) {
          await insforge.database.from('order_items').insert({
            order_id: orderId,
            product_id: it.product.id,
            product_name_snapshot: it.product.name,
            product_image_snapshot: it.product.thumbnail || it.product.images[0],
            quantity: it.quantity,
            unit_price: it.price,
            total_price: it.price * it.quantity,
            selected_size: it.selectedSize,
          });
        }
      } catch (err) {
        console.warn('InsForge order creation error:', err);
      }
    }

    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Order ${orderId} placed successfully!`, 'success');
    return newOrder;
  };

  const getOrderById = (id: string): Order | undefined => {
    const found = orders.find((o) => o.id === id || o.id.toLowerCase() === id.toLowerCase());
    // Ensure that if user is logged in, they can only access their own order
    if (found && isAuthenticated && user?.id) {
      if (found.userId && found.userId !== user.id) {
        return undefined; // unauthorized access blocked
      }
    }
    return found;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}

export const useOrders = useOrder;
