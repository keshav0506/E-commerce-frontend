import { apiFetch } from './api';

export interface CreatePaymentOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId?: string;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  orderStatus?: string;
}

/**
 * Load Razorpay Checkout SDK Script
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Create payment order in Spring Boot backend (POST /api/payments/create-order)
 */
export async function createRazorpayOrderApi(orderId: string, amount: number): Promise<CreatePaymentOrderResponse> {
  try {
    const res = await apiFetch<any>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount })
    });
    return {
      razorpayOrderId: res.razorpayOrderId || res.orderId || res.id,
      amount: res.amount || amount * 100,
      currency: res.currency || 'INR',
      keyId: res.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID
    };
  } catch {
    return {
      razorpayOrderId: `rzp_order_${Date.now()}`,
      amount: amount * 100,
      currency: 'INR',
      keyId: import.meta.env.VITE_RAZORPAY_KEY_ID
    };
  }
}

/**
 * Verify payment with Spring Boot backend (POST /api/payments/verify)
 */
export async function verifyRazorpayPaymentApi(paymentData: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
  try {
    const res = await apiFetch<any>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
    return {
      success: res.success !== undefined ? res.success : true,
      message: res.message || 'Payment verified successfully',
      orderStatus: res.orderStatus || 'CONFIRMED'
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Payment verification failed'
    };
  }
}
