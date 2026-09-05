'use client';

import { useState } from 'react';
import { loadRazorpayScript } from '@/lib/razorpay';
import { useToast } from '@/context/ToastContext';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  config?: any;
  handler: (response: any) => Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export function useRazorpay() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { showToast } = useToast();

  const loadScript = async () => {
    if (isScriptLoaded) return true;
    const loaded = await loadRazorpayScript();
    setIsScriptLoaded(loaded);
    return loaded;
  };

  const openModal = async (options: RazorpayOptions, onPaymentFailed: (res: any) => void) => {
    const loaded = await loadScript();
    if (!loaded) {
      showToast('Could not load Razorpay payment gateway. Please check your internet connection and try again.', 'error');
      return;
    }

    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      console.error('Razorpay payment failed:', response.error);
      showToast(
        response.error?.description || 'Payment failed. Please try another method.',
        'error'
      );
      onPaymentFailed(response);
    });

    rzp.open();
  };

  return { isScriptLoaded, loadScript, openModal };
}
