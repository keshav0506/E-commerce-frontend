import { apiFetch } from './api';
import type { Order, OrderStatus, PaymentStatus } from '../types';

export interface OrderItemDTO {
  id?: string | number;
  productId: string | number;
  productName?: string;
  image?: string;
  price?: number;
  quantity: number;
  totalPrice?: number;
}

export interface CreateOrderRequestDTO {
  shippingAddress: any;
  items: { productId: string; quantity: number; selectedVolume?: string }[];
  paymentMethod: string;
  totalAmount?: number;
}

export function mapOrderResponseToOrder(res: any): Order {
  const statusMap: Record<string, OrderStatus> = {
    PENDING_PAYMENT: 'Pending',
    CONFIRMED: 'Confirmed',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
  };

  const status: OrderStatus = statusMap[res.status] || res.status || 'Pending';

  let paymentStatus: PaymentStatus = 'Pending';
  if (res.paymentStatus === 'PAID' || res.paymentStatus === 'Paid' || status === 'Confirmed' || status === 'Processing' || status === 'Shipped' || status === 'Delivered') {
    paymentStatus = 'Paid';
  } else if (res.paymentStatus === 'REFUNDED' || res.paymentStatus === 'Refunded') {
    paymentStatus = 'Refunded';
  } else if (res.paymentStatus === 'FAILED' || res.paymentStatus === 'Failed') {
    paymentStatus = 'Failed';
  }

  const items = Array.isArray(res.items || res.orderItems)
    ? (res.items || res.orderItems).map((item: any) => ({
        productId: String(item.productId || item.product?.id || item.id || ''),
        productName: item.productName || item.product?.name || 'Order Item',
        sku: item.sku || `SKU-${item.productId || item.id}`,
        image: item.image || item.product?.image || 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846340/ecommerce/products/re1p3tqmpjl4gdqngjf1.jpg',
        quantity: item.quantity || 1,
        priceAtPurchase: item.price || item.priceAtPurchase || item.totalPrice / (item.quantity || 1) || 0,
        total: item.totalPrice || item.total || (item.price || 0) * (item.quantity || 1)
      }))
    : [];

  return {
    id: String(res.id || `#ORD-${Date.now()}`),
    customer: {
      id: String(res.customer?.id || res.userId || 'cust-1'),
      name: res.customer?.name || res.customerName || 'Customer',
      email: res.customer?.email || res.customerEmail || '',
      phone: res.customer?.phone || res.phone || ''
    },
    items,
    status,
    paymentStatus,
    paymentMethod: res.paymentMethod || 'Online Payment',
    transactionId: res.transactionId || res.razorpayPaymentId || undefined,
    shippingAddress: res.shippingAddress || {
      fullName: res.customerName || 'Customer',
      phone: res.phone || '',
      house: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      type: 'HOME'
    },
    subtotal: res.subtotal || res.totalAmount || res.total || 0,
    discount: res.discount || 0,
    shipping: res.shipping || 0,
    tax: res.tax || 0,
    total: res.total || res.totalAmount || 0,
    createdAt: res.createdAt ? new Date(res.createdAt).toLocaleString('en-US') : new Date().toLocaleString('en-US'),
    updatedAt: res.updatedAt ? new Date(res.updatedAt).toLocaleString('en-US') : undefined
  };
}

/**
 * Place a new order (POST /api/orders)
 */
export async function createOrderApi(orderData: CreateOrderRequestDTO): Promise<Order> {
  const res = await apiFetch<any>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
  return mapOrderResponseToOrder(res);
}

/**
 * Fetch customer order history (GET /api/orders)
 */
export async function fetchCustomerOrdersApi(): Promise<Order[]> {
  const res = await apiFetch<any[]>('/orders');
  if (!Array.isArray(res)) return [];
  return res.map(mapOrderResponseToOrder);
}

/**
 * Fetch single order details (GET /api/orders/{id})
 */
export async function fetchOrderByIdApi(id: string): Promise<Order> {
  const res = await apiFetch<any>(`/orders/${id}`);
  return mapOrderResponseToOrder(res);
}

/**
 * Cancel an order (PUT /api/orders/{id}/cancel)
 */
export async function cancelOrderApi(id: string): Promise<any> {
  try {
    return await apiFetch(`/orders/${id}/cancel`, { method: 'PUT' });
  } catch {
    return await apiFetch(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'CANCELLED' })
    });
  }
}
