'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, MapPin, CreditCard, Truck, Banknote, ShieldCheck } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { useCart } from '@/context/CartContext';
import { insforge } from '@/lib/insforge';
import { Order } from '@/types';
import { PRODUCTS } from '@/lib/data/products';

export default function OrderSuccessDynamicPage({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const { getOrderById, orders } = useOrders();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(() => getOrderById(params.orderId) || null);
  const [isLoading, setIsLoading] = useState(!order);
  const hasClearedRef = useRef(false);

  // Guarantee active cart count resets to 0 once upon reaching the success screen
  useEffect(() => {
    if (!hasClearedRef.current) {
      hasClearedRef.current = true;
      clearCart();
    }
  }, [clearCart]);

  useEffect(() => {
    const existing = getOrderById(params.orderId);
    if (existing) {
      setOrder(existing);
      setIsLoading(false);
      return;
    }

    async function fetchFromDb() {
      try {
        // 1. Try server API route first for privileged, robust fetch
        const apiRes = await fetch(`/api/checkout/order-details?orderId=${encodeURIComponent(params.orderId)}`);
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          if (apiData.order) {
            setOrder(apiData.order);
            setIsLoading(false);
            return;
          }
        }

        // 2. Direct DB fallback
        const { data: dbOrder, error } = await insforge.database
          .from('orders')
          .select('*')
          .eq('id', params.orderId)
          .single();

        if (error || !dbOrder) {
          setIsLoading(false);
          return;
        }

        const { data: itemsData } = await insforge.database
          .from('order_items')
          .select('*')
          .eq('order_id', params.orderId);

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

        const orderDate = new Date(dbOrder.created_at);
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

        setOrder({
          id: dbOrder.id,
          userId: dbOrder.user_id,
          items,
          subtotal: Number(dbOrder.subtotal),
          discount: Number(dbOrder.discount || 0),
          couponCode: dbOrder.coupon_code || undefined,
          shipping: Number(dbOrder.shipping_fee || 0),
          tax: Number(dbOrder.tax || 0),
          total: Number(dbOrder.total),
          shippingAddress: dbOrder.shipping_address_snapshot,
          deliveryMethod: 'standard',
          paymentMethod: dbOrder.payment_method || 'ONLINE_RAZORPAY',
          paymentStatus: dbOrder.payment_status || 'PAID',
          status: dbOrder.status,
          razorpayOrderId: dbOrder.razorpay_order_id,
          razorpayPaymentId: dbOrder.razorpay_payment_id,
          paymentDetails: {},
          orderStatus: dbOrder.order_status || 'placed',
          trackingTimeline: [],
          createdAt: formattedDate,
          estimatedDelivery: estDate,
        });
      } catch (err) {
        console.warn('Error fetching order directly:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFromDb();
  }, [params.orderId, getOrderById, orders]);

  if (isLoading) {
    return (
      <div className="py-24 text-center bg-ayur-ivory min-h-screen">
        <div className="w-12 h-12 border-4 border-ayur-green-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="font-serif text-xl text-ayur-charcoal-900">Loading Order Confirmation...</h2>
        <p className="text-xs text-ayur-charcoal-500 mt-1">Retrieving receipt details from Haridwar dispatch system.</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center bg-ayur-ivory min-h-screen">
        <div className="max-w-md mx-auto px-4 bg-white p-8 rounded-2xl border border-ayur-border shadow-soft">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <h2 className="font-serif text-2xl text-ayur-charcoal-900 mb-2">Order Confirmed</h2>
          <p className="text-xs text-ayur-charcoal-600 mb-6 leading-relaxed">
            Your order <span className="font-mono font-bold text-ayur-green-950">{params.orderId}</span> has been securely placed and saved to your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/account/orders"
              onClick={() => router.push('/account/orders')}
              className="px-6 py-2.5 bg-ayur-green-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-ayur-green-800 transition-colors shadow-sm cursor-pointer relative z-10"
            >
              View Order History
            </Link>
            <Link
              href="/shop"
              onClick={() => router.push('/shop')}
              className="px-6 py-2.5 bg-white border border-ayur-border text-ayur-charcoal-800 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-ayur-cream transition-colors cursor-pointer relative z-10"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOnlinePayment =
    order.paymentMethod === 'ONLINE_RAZORPAY' ||
    order.paymentMethod === 'online' ||
    order.paymentStatus === 'PAID' ||
    order.status === 'PAID';

  const isCod =
    order.paymentMethod === 'COD' ||
    order.paymentMethod === 'cod' ||
    order.paymentStatus === 'PENDING_ON_DELIVERY';

  return (
    <div className="py-12 sm:py-16 bg-ayur-ivory min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Confirmed Banner */}
        <div className="bg-white rounded-2xl border border-ayur-border p-6 sm:p-10 shadow-soft text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            Order Confirmed & Placed
          </span>

          <h1 className="font-serif text-2xl sm:text-4xl text-ayur-green-950 font-normal mt-3 mb-2">
            Thank you for your order!
          </h1>

          <p className="text-xs sm:text-sm text-ayur-charcoal-600 max-w-md mx-auto leading-relaxed">
            Your authentic Patanjali Ayurvedic formulations have been scheduled for dispatch at our Haridwar logistics center.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 text-xs font-mono bg-ayur-ivory px-4 py-2.5 rounded-lg border border-ayur-border">
            <span>
              Order Reference ID: <strong className="text-ayur-green-950 font-bold">{order.id}</strong>
            </span>
            <span className="text-ayur-border">•</span>
            <span>Date: {order.createdAt}</span>
            <span className="text-ayur-border">•</span>
            <span className="text-emerald-800 font-semibold">
              Est. Delivery: {order.estimatedDelivery}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/account/orders/${order.id}`}
              onClick={() => router.push(`/account/orders/${order.id}`)}
              className="w-full sm:w-auto px-6 py-3.5 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer relative z-10"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order Status</span>
            </Link>
            <Link
              href="/account/orders"
              onClick={() => router.push('/account/orders')}
              className="w-full sm:w-auto px-6 py-3.5 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer relative z-10"
            >
              <span>View Order History</span>
            </Link>
            <Link
              href="/shop"
              onClick={() => router.push('/shop')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-ayur-cream text-ayur-green-950 border border-ayur-border rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors text-center cursor-pointer relative z-10"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Details Receipt Card */}
        <div className="bg-white rounded-2xl border border-ayur-border p-6 sm:p-8 shadow-soft space-y-6">
          <h2 className="font-serif text-base font-semibold text-ayur-charcoal-900 border-b border-ayur-border pb-3">
            Order Receipt & Delivery Summary
          </h2>

          {/* Delivery & Payment block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-ayur-ivory rounded-xl border border-ayur-border">
              <div className="flex items-center gap-1.5 font-bold text-ayur-charcoal-900 uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5 text-ayur-green-800" />
                <span>Shipping Address</span>
              </div>
              <p className="font-semibold text-ayur-charcoal-900">{order.shippingAddress?.fullName}</p>
              <p className="text-ayur-charcoal-600 mt-0.5">{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && (
                <p className="text-ayur-charcoal-600">{order.shippingAddress.addressLine2}</p>
              )}
              <p className="text-ayur-charcoal-600">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
              <p className="text-ayur-charcoal-600 mt-1">Mobile: +91 {order.shippingAddress?.phone}</p>
            </div>

            <div className="p-4 bg-ayur-ivory rounded-xl border border-ayur-border">
              <div className="flex items-center gap-1.5 font-bold text-ayur-charcoal-900 uppercase tracking-wider mb-2">
                {isCod ? (
                  <Banknote className="w-3.5 h-3.5 text-ayur-green-800" />
                ) : (
                  <CreditCard className="w-3.5 h-3.5 text-ayur-green-800" />
                )}
                <span>Payment & Logistics</span>
              </div>

              {/* Explicit Payment Status */}
              <div className="space-y-1.5">
                <p className="text-ayur-charcoal-800">
                  Payment Method:{' '}
                  <span className="font-bold text-ayur-green-950">
                    {isCod ? 'Cash on Delivery (COD)' : 'Paid via Razorpay'}
                  </span>
                </p>

                <div className="pt-1">
                  {isOnlinePayment ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Payment Status: Paid via Razorpay</span>
                    </span>
                  ) : isCod ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded font-semibold text-[11px]">
                      <Banknote className="w-3.5 h-3.5 text-amber-700" />
                      <span>Payment Status: Cash on Delivery (Due on Delivery)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold text-[11px]">
                      <span>Payment Status: Recorded</span>
                    </span>
                  )}
                </div>

                <p className="text-ayur-charcoal-600 pt-1">
                  Shipping: {order.shipping === 0 ? 'Free Pan-India Delivery' : `Standard Delivery (₹${order.shipping})`}
                </p>

                {order.razorpayPaymentId && (
                  <p className="text-[11px] font-mono text-ayur-charcoal-500">
                    Payment ID: {order.razorpayPaymentId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Ordered items list */}
          <div className="border border-ayur-border rounded-xl divide-y divide-ayur-border overflow-hidden">
            <div className="p-3 bg-ayur-cream/50 font-semibold text-xs text-ayur-charcoal-800">
              Purchased Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </div>
            {order.items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="p-3 sm:p-4 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.thumbnail || item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded object-cover border border-ayur-border bg-white"
                  />
                  <div>
                    <p className="font-semibold text-ayur-charcoal-900">{item.product.name}</p>
                    <p className="text-ayur-charcoal-500">
                      Pack: {item.selectedSize} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-ayur-charcoal-900">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="pt-2 border-t border-ayur-border/80 space-y-1.5 text-xs text-ayur-charcoal-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-ayur-charcoal-900">₹{order.subtotal}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                <span>-₹{order.discount}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
            </div>

            <div className="flex justify-between text-base font-bold text-ayur-green-950 pt-2 border-t border-ayur-border">
              <span>Total Paid / Due</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
