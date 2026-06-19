'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentOptions {
  templateId: string;
  templateName: string;
  funnelName?: string;
  funnelSlug?: string;
  funnelId?: string; // For renewals
  onSuccess?: (data: { funnelId: string; expiresAt: string; type: string }) => void;
  onError?: (error: string) => void;
}

export function useRazorpay() {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const initiatePayment = useCallback(async (options: PaymentOptions) => {
    setIsProcessing(true);

    try {
      // 1. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error('Failed to load payment gateway. Please refresh and try again.');
      }

      // 2. Create order on server
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: options.templateId,
          templateName: options.templateName,
          funnelId: options.funnelId,
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || 'Failed to create payment order');
      }

      const orderData = await orderRes.json();

      // 3. Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FunnelLink',
        description: `${options.templateName} — 30 Day Access`,
        order_id: orderData.orderId,
        theme: {
          color: '#4F46E5',
        },
        prefill: {},
        handler: async function (response: any) {
          // 4. Verify payment on server
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                templateId: options.templateId,
                templateName: options.templateName,
                funnelName: options.funnelName || options.templateName,
                funnelSlug: options.funnelSlug || `${options.templateId}-${Date.now()}`,
                funnelId: options.funnelId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              options.onSuccess?.(verifyData);
              // Navigate to editor for new purchases
              if (verifyData.type === 'purchase') {
                router.push(`/dashboard/funnels/${verifyData.funnelId}/edit`);
              } else {
                // Renewal — just reload
                router.refresh();
              }
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (err: any) {
            options.onError?.(err.message);
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      });

      rzp.on('payment.failed', function (response: any) {
        options.onError?.(response.error?.description || 'Payment failed');
        setIsProcessing(false);
      });

      rzp.open();
    } catch (error: any) {
      options.onError?.(error.message);
      setIsProcessing(false);
    }
  }, [loadRazorpayScript, router]);

  return { initiatePayment, isProcessing };
}
