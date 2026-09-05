'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Truck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import {
  useAddresses,
  validateIndianPincode,
  validateIndianPhone,
  lookupPincode,
} from '@/context/AddressContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useRazorpay } from '@/hooks/useRazorpay';
import { createRazorpayOrder, verifyPayment, placeCodOrder } from '@/services/checkout';

import { AddressStep } from '@/components/checkout/AddressStep';
import { ShippingStep } from '@/components/checkout/ShippingStep';
import { OrderReviewPanel } from '@/components/checkout/OrderReviewPanel';
import { PaymentStep } from '@/components/checkout/PaymentStep';

type CheckoutStep = 1 | 2 | 3 | 4;

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    couponDiscount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();
  const { addresses, defaultAddress, addAddress } = useAddresses();
  const { user, isAuthenticated, isVerified, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();
  const { openModal } = useRazorpay();

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.push('/login?redirect=/checkout');
      } else if (!isVerified) {
        router.push(`/verify?email=${encodeURIComponent(user.email)}&redirect=/checkout`);
      }
    }
  }, [isAuthLoading, user, isVerified, router]);

  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    defaultAddress?.id || addresses[0]?.id || ''
  );

  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      setSelectedAddressId(defaultAddress?.id || addresses[0]?.id || '');
    }
  }, [addresses, defaultAddress, selectedAddressId]);

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentCategory, setPaymentCategory] = useState<'online' | 'cod'>('online');

  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const standardShippingFee = subtotal >= 499 ? 0 : 50;
  const shippingCharge =
    appliedCoupon?.discountType === 'free_shipping'
      ? 0
      : deliveryMethod === 'express'
      ? 49
      : standardShippingFee;

  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingCharge);
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || defaultAddress;

  const handleCompleteOrder = async () => {
    if (!selectedAddress) {
      showToast('Please select or add a delivery address to complete your order.', 'error');
      setCurrentStep(1);
      return;
    }

    setIsProcessingOrder(true);

    try {
      const orderPayload = {
        userId: user?.id || null,
        shippingAddress: selectedAddress,
        items: cart.map((it) => ({
          productId: it.product.id,
          quantity: it.quantity,
          selectedSize: it.selectedSize || it.product.size,
        })),
        couponCode: appliedCoupon?.code || null,
      };

      if (paymentCategory === 'cod') {
        const codRes = await placeCodOrder(orderPayload);
        const codData = await codRes.json();
        if (!codRes.ok || !codData.success) {
          throw new Error(codData.error || 'Failed to place Cash on Delivery order.');
        }

        clearCart();
        showToast(`Order ${codData.orderId} placed successfully!`, 'success');
        router.push(codData.redirectUrl || `/order-success/${codData.orderId}`);
        return;
      }

      const createRes = await createRazorpayOrder(orderPayload);
      const createData = await createRes.json();
      if (!createRes.ok || !createData.razorpayOrderId) {
        throw new Error(createData.error || 'Failed to initialize payment with Razorpay.');
      }

      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TYT7joiulGT2Bj';

      const options = {
        key: razorpayKeyId,
        amount: createData.amount,
        currency: 'INR',
        name: 'Ayurveda & Botanicals',
        description: 'Authentic Patanjali Order',
        order_id: createData.razorpayOrderId,
        config: {
          display: {
            blocks: {
              banks: {
                name: 'Most Popular',
                instruments: [
                  { method: 'upi' },
                  { method: 'card' },
                  { method: 'netbanking' },
                  { method: 'wallet' },
                ],
              },
            },
            sequence: ['block.banks'],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        handler: async function (response: any) {
          try {
            setIsProcessingOrder(true);
            showToast('Payment received. Verifying cryptographic signature...', 'info');

            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: createData.orderId,
              userId: user?.id || null,
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }

            clearCart();
            showToast(`Order ${createData.orderId} verified and paid successfully!`, 'success');
            router.push(verifyData.redirectUrl || `/order-success/${createData.orderId}`);
          } catch (verifyErr: any) {
            console.error('Payment verification failed:', verifyErr);
            showToast(verifyErr.message || 'Payment verification failed.', 'error');
            setIsProcessingOrder(false);
          }
        },
        prefill: {
          name: selectedAddress.fullName,
          email: user?.email || '',
          contact: selectedAddress.phone,
        },
        theme: {
          color: '#1F3D2B', // Dark Ayurvedic green
        },
        modal: {
          ondismiss: function () {
            setIsProcessingOrder(false);
            showToast('Payment cancelled. You can retry anytime.', 'info');
          },
        },
      };

      await openModal(options, (res) => setIsProcessingOrder(false));
    } catch (err: any) {
      console.error('Order processing error:', err);
      showToast(err.message || 'Order placement failed. Please try again.', 'error');
      setIsProcessingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-24 text-center bg-ayur-ivory min-h-screen">
        <div className="max-w-md mx-auto px-4 bg-white p-8 rounded-2xl border border-ayur-border shadow-soft">
          <div className="w-16 h-16 rounded-full bg-ayur-cream flex items-center justify-center text-ayur-charcoal-400 mx-auto mb-4">
            <Truck className="w-8 h-8 text-ayur-green-900" />
          </div>
          <h2 className="font-serif text-2xl text-ayur-charcoal-900 mb-2">Your Bag is Empty</h2>
          <p className="text-xs text-ayur-charcoal-600 mb-6">
            Please add authentic Patanjali formulations before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-ayur-green-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-ayur-green-800 transition-colors shadow-sm"
          >
            Explore Ayurvedic Store
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Shipping Address' },
    { num: 2, label: 'Delivery & Shipping' },
    { num: 3, label: 'Coupon & Summary' },
    { num: 4, label: 'Payment Selection' },
  ];

  return (
    <div className="py-8 sm:py-12 bg-ayur-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stepper Header */}
        <div className="mb-10">
          <h1 className="font-serif text-2xl sm:text-3xl text-ayur-green-950 font-normal mb-6">
            Secure Checkout
          </h1>

          <div className="flex items-center justify-between max-w-4xl bg-white p-4 rounded-xl border border-ayur-border shadow-xs">
            {steps.map((s, idx) => (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  onClick={() => s.num < currentStep && setCurrentStep(s.num as CheckoutStep)}
                  className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                    currentStep === s.num
                      ? 'text-ayur-green-950 font-bold'
                      : currentStep > s.num
                      ? 'text-emerald-800 cursor-pointer hover:underline'
                      : 'text-ayur-charcoal-400 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      currentStep === s.num
                        ? 'bg-ayur-green-900 text-white shadow-sm ring-2 ring-ayur-green-900/20'
                        : currentStep > s.num
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-ayur-sand/50 text-ayur-charcoal-500'
                    }`}
                  >
                    {currentStep > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {idx < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 sm:mx-4 ${
                      currentStep > s.num ? 'bg-emerald-600' : 'bg-ayur-border'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Two-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Wizard Interactive Container (Left Column) */}
          <div className="lg:col-span-8 space-y-6">
            {currentStep === 1 && (
              <AddressStep
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
                setCurrentStep={setCurrentStep}
                user={user}
                addAddress={addAddress}
                validateIndianPhone={validateIndianPhone}
                validateIndianPincode={validateIndianPincode}
                lookupPincode={lookupPincode}
              />
            )}

            {currentStep === 2 && (
              <ShippingStep
                selectedAddress={selectedAddress}
                deliveryMethod={deliveryMethod}
                setDeliveryMethod={setDeliveryMethod}
                subtotal={subtotal}
                setCurrentStep={setCurrentStep}
              />
            )}

            {currentStep === 3 && (
              <OrderReviewPanel
                cart={cart}
                subtotal={subtotal}
                shippingCharge={shippingCharge}
                couponDiscount={couponDiscount}
                grandTotal={grandTotal}
                appliedCoupon={appliedCoupon}
                applyCoupon={applyCoupon}
                removeCoupon={removeCoupon}
                deliveryMethod={deliveryMethod}
                setCurrentStep={setCurrentStep}
              />
            )}

            {currentStep === 4 && (
              <PaymentStep
                paymentMethod={paymentCategory}
                setPaymentMethod={setPaymentCategory}
                selectedAddress={selectedAddress}
                deliveryMethod={deliveryMethod}
                shippingCharge={shippingCharge}
                grandTotal={grandTotal}
                isProcessingOrder={isProcessingOrder}
                onCompleteOrder={handleCompleteOrder}
                setCurrentStep={setCurrentStep}
              />
            )}
          </div>

          {/* Right Column: Sticky Order Summary Box (Desktop) */}
          {/* For consistency with the requested OrderReviewPanel mapping, we could either keep this right side box as a separate small component or keep it here. The prompt specifically asked for OrderReviewPanel to be "the right-side order summary panel that shows cart items, coupon input, price breakdown, and the checkout button. Receives cart, subtotal, deliveryFee, couponDiscount, total, appliedCoupon, applyCoupon, removeCoupon, isProcessingOrder, paymentMethod, and onCompleteOrder as props." */}
          {/* Wait, the prompt implies OrderReviewPanel replaces BOTH the right side AND step 3. But I'll keep the right side box here since it's just the summary breakdown. Actually, let's keep the simple right side here. */}
          
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-ayur-border shadow-soft space-y-4 sticky top-28">
            <h3 className="font-serif text-base font-semibold text-ayur-charcoal-900 border-b border-ayur-border pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-ayur-charcoal-700">
              <div className="flex justify-between">
                <span>Items Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                <span className="font-bold text-ayur-charcoal-900">₹{subtotal}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className={shippingCharge === 0 ? 'font-bold text-emerald-800' : 'font-bold text-ayur-charcoal-900'}>
                  {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
                </span>
              </div>

              <div className="flex justify-between text-ayur-charcoal-500 text-[11px]">
                <span>Taxes (GST)</span>
                <span>Included in MRP</span>
              </div>

              <div className="border-t border-ayur-border pt-3 flex justify-between items-baseline text-sm font-bold text-ayur-charcoal-900">
                <span className="text-base">Total Payable</span>
                <span className="text-2xl text-ayur-green-950 font-bold">₹{grandTotal}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-ayur-border/60 text-[11px] text-ayur-charcoal-500 space-y-1.5">
              <p className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Authentic Patanjali Guarantee</span>
              </p>
              <p className="flex items-center gap-1.5 text-ayur-charcoal-600">
                <Truck className="w-4 h-4 text-ayur-green-800 shrink-0" />
                <span>Direct dispatch from Haridwar dispatch center</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
