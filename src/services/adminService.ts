import { apiFetch } from './api';
import type { Product, Category, Order } from '../types';
import { mapProductResponseToProduct, mapCategoryResponseToCategory } from '../types';
import { mapOrderResponseToOrder } from './orderService';

/**
 * Admin: Upload image via Spring Boot backend to Cloudinary (POST /api/images/upload)
 * Falls back to local DataURL preview if Cloudinary credentials are not configured.
 */
export async function uploadProductImageApi(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await apiFetch<any>('/images/upload', {
      method: 'POST',
      body: formData
    });
    return res.imageUrl || res.url || res.secure_url || res;
  } catch {
    // If backend Cloudinary credentials are dummy or unconfigured, fallback to Base64 Data URL for instant preview
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Admin: Create Product (POST /api/products)
 */
export async function createProductApi(productData: any): Promise<Product> {
  const res = await apiFetch<any>('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  });
  return mapProductResponseToProduct(res);
}

/**
 * Admin: Update Product (PUT /api/products/{id})
 */
export async function updateProductApi(id: string, productData: any): Promise<Product> {
  const res = await apiFetch<any>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  });
  return mapProductResponseToProduct(res);
}

/**
 * Admin: Delete Product (DELETE /api/products/{id})
 */
export async function deleteProductApi(id: string): Promise<any> {
  return await apiFetch(`/products/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Admin: Create Category (POST /api/categories)
 */
export async function createCategoryApi(categoryData: any): Promise<Category> {
  const res = await apiFetch<any>('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData)
  });
  return mapCategoryResponseToCategory(res);
}

/**
 * Admin: Update Category (PUT /api/categories/{id})
 */
export async function updateCategoryApi(id: string, categoryData: any): Promise<Category> {
  const res = await apiFetch<any>(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData)
  });
  return mapCategoryResponseToCategory(res);
}

/**
 * Admin: Delete Category (DELETE /api/categories/{id})
 */
export async function deleteCategoryApi(id: string): Promise<any> {
  return await apiFetch(`/categories/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Admin: Fetch All Orders (GET /api/orders/admin or /api/admin/orders)
 */
export async function fetchAdminOrdersApi(): Promise<Order[]> {
  try {
    const res = await apiFetch<any[]>('/orders/admin');
    if (Array.isArray(res)) return res.map(mapOrderResponseToOrder);
    return [];
  } catch {
    const res = await apiFetch<any[]>('/admin/orders');
    if (Array.isArray(res)) return res.map(mapOrderResponseToOrder);
    return [];
  }
}

/**
 * Admin: Update Order Status (PUT /api/orders/{id}/status)
 */
export async function updateOrderStatusApi(orderId: string, status: string): Promise<any> {
  try {
    return await apiFetch(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  } catch {
    return await apiFetch(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }
}
