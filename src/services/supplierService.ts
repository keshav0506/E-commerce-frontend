import { apiFetch } from './api';
import type {
  SupplierProfile,
  SupplierApplyRequest,
  PurchaseOrder,
  SupplierDashboardMetrics,
  SupplierNotification,
  PurchaseOrderStatus,
  SupplierStatus,
  SupplierProduct,
  SupplierProductRequest
} from '../types/supplier';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
}

/**
 * Public Supplier Application (POST /api/suppliers/apply)
 */
export async function applySupplierApi(data: SupplierApplyRequest): Promise<SupplierProfile> {
  return await apiFetch<SupplierProfile>('/suppliers/apply', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get Authenticated Supplier Profile (GET /api/supplier/profile)
 */
export async function getSupplierProfileApi(): Promise<SupplierProfile> {
  return await apiFetch<SupplierProfile>('/supplier/profile');
}

/**
 * Update Authenticated Supplier Profile (PUT /api/supplier/profile)
 */
export async function updateSupplierProfileApi(data: Partial<SupplierProfile>): Promise<SupplierProfile> {
  return await apiFetch<SupplierProfile>('/supplier/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Get Supplier Dashboard Metrics (GET /api/supplier/dashboard)
 */
export async function getSupplierDashboardApi(): Promise<SupplierDashboardMetrics> {
  return await apiFetch<SupplierDashboardMetrics>('/supplier/dashboard');
}

/**
 * Get Supplier Purchase Orders (GET /api/supplier/purchase-orders)
 */
export async function getSupplierPurchaseOrdersApi(params?: {
  status?: PurchaseOrderStatus;
  search?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<PurchaseOrder>> {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.search) query.append('search', params.search);
  if (params?.page !== undefined) query.append('page', String(params.page));
  if (params?.size !== undefined) query.append('size', String(params.size));

  const endpoint = `/supplier/purchase-orders${query.toString() ? `?${query.toString()}` : ''}`;
  return await apiFetch<PageResponse<PurchaseOrder>>(endpoint);
}

/**
 * Get Purchase Order Details (GET /api/supplier/purchase-orders/:id)
 */
export async function getSupplierPurchaseOrderByIdApi(id: number | string): Promise<PurchaseOrder> {
  return await apiFetch<PurchaseOrder>(`/supplier/purchase-orders/${id}`);
}

/**
 * Accept Purchase Order (POST /api/supplier/purchase-orders/:id/accept)
 */
export async function acceptPurchaseOrderApi(id: number | string, notes?: string): Promise<PurchaseOrder> {
  return await apiFetch<PurchaseOrder>(`/supplier/purchase-orders/${id}/accept`, {
    method: 'POST',
    body: JSON.stringify({ notes }),
  });
}

/**
 * Reject Purchase Order (POST /api/supplier/purchase-orders/:id/reject)
 */
export async function rejectPurchaseOrderApi(id: number | string, reason: string): Promise<PurchaseOrder> {
  return await apiFetch<PurchaseOrder>(`/supplier/purchase-orders/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

/**
 * Start Packing / Processing Purchase Order (POST /api/supplier/purchase-orders/:id/process)
 */
export async function processPurchaseOrderApi(id: number | string, notes?: string): Promise<PurchaseOrder> {
  return await apiFetch<PurchaseOrder>(`/supplier/purchase-orders/${id}/process`, {
    method: 'POST',
    body: JSON.stringify({ notes }),
  });
}

/**
 * Ship Purchase Order (POST /api/supplier/purchase-orders/:id/ship)
 */
export async function shipPurchaseOrderApi(
  id: number | string,
  data: { carrier: string; trackingNumber: string; notes?: string }
): Promise<PurchaseOrder> {
  return await apiFetch<PurchaseOrder>(`/supplier/purchase-orders/${id}/ship`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Mark Delivery Completed (POST /api/supplier/purchase-orders/:id/deliver)
 */
export async function deliverPurchaseOrderApi(id: number | string, notes?: string): Promise<PurchaseOrder> {
  return await apiFetch<PurchaseOrder>(`/supplier/purchase-orders/${id}/deliver`, {
    method: 'POST',
    body: JSON.stringify({ notes }),
  });
}

/**
 * Get Supplier In-App Notifications (GET /api/supplier/notifications)
 */
export async function getSupplierNotificationsApi(): Promise<SupplierNotification[]> {
  return await apiFetch<SupplierNotification[]>('/supplier/notifications');
}

/**
 * Mark Notification Read (PUT /api/supplier/notifications/:id/read)
 */
export async function markNotificationReadApi(id: number | string): Promise<void> {
  await apiFetch<void>(`/supplier/notifications/${id}/read`, {
    method: 'PUT',
  });
}

// ==========================================
// SUPPLIER PRODUCT CATALOG MANAGEMENT APIS
// ==========================================

export async function getSupplierProductsApi(params?: {
  search?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<SupplierProduct>> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.page !== undefined) query.append('page', String(params.page));
  if (params?.size !== undefined) query.append('size', String(params.size));

  return await apiFetch<PageResponse<SupplierProduct>>(
    `/supplier/products${query.toString() ? `?${query.toString()}` : ''}`
  );
}

export async function createSupplierProductApi(data: SupplierProductRequest): Promise<SupplierProduct> {
  return await apiFetch<SupplierProduct>('/supplier/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getSupplierProductByIdApi(id: number | string): Promise<SupplierProduct> {
  return await apiFetch<SupplierProduct>(`/supplier/products/${id}`);
}

export async function updateSupplierProductApi(
  id: number | string,
  data: SupplierProductRequest
): Promise<SupplierProduct> {
  return await apiFetch<SupplierProduct>(`/supplier/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSupplierProductApi(id: number | string): Promise<void> {
  await apiFetch<void>(`/supplier/products/${id}`, {
    method: 'DELETE',
  });
}

export async function updateSupplierProductStockApi(
  id: number | string,
  stock: number
): Promise<SupplierProduct> {
  return await apiFetch<SupplierProduct>(`/supplier/products/${id}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ stock }),
  });
}

/**
 * Upload Product Image to Cloudinary (POST /api/images/upload)
 * Automatically uploads to Cloudinary (with local fallback if unconfigured).
 */
export async function uploadSupplierProductImageApi(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await apiFetch<any>('/images/upload', {
      method: 'POST',
      body: formData,
    });
    return res.imageUrl || res.url || res.secure_url || res;
  } catch (err) {
    // If upload fails or network is offline, fallback to local Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(err);
      reader.readAsDataURL(file);
    });
  }
}


// ==========================================
// ADMIN SUPPLIER MANAGEMENT APIS
// ==========================================

export async function getAdminSuppliersApi(params?: {
  status?: SupplierStatus;
  page?: number;
  size?: number;
}): Promise<PageResponse<SupplierProfile>> {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.page !== undefined) query.append('page', String(params.page));
  if (params?.size !== undefined) query.append('size', String(params.size));

  return await apiFetch<PageResponse<SupplierProfile>>(`/admin/suppliers${query.toString() ? `?${query.toString()}` : ''}`);
}

export async function updateAdminSupplierStatusApi(
  id: number | string,
  status: SupplierStatus,
  reason?: string
): Promise<SupplierProfile> {
  return await apiFetch<SupplierProfile>(`/admin/suppliers/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, reason }),
  });
}

export async function createAdminPurchaseOrderApi(data: {
  supplierId: number;
  expectedDeliveryDate?: string;
  notes?: string;
  items: { productId: number; quantity: number; unitPrice?: number }[];
}): Promise<PurchaseOrder> {
  return await apiFetch<PurchaseOrder>('/admin/purchase-orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAdminPurchaseOrdersApi(params?: {
  status?: PurchaseOrderStatus;
  supplierId?: number;
  page?: number;
  size?: number;
}): Promise<PageResponse<PurchaseOrder>> {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.supplierId) query.append('supplierId', String(params.supplierId));
  if (params?.page !== undefined) query.append('page', String(params.page));
  if (params?.size !== undefined) query.append('size', String(params.size));

  return await apiFetch<PageResponse<PurchaseOrder>>(`/admin/purchase-orders${query.toString() ? `?${query.toString()}` : ''}`);
}
