import { apiFetch } from './api';
import type { Product } from '../types';
import { mapProductResponseToProduct } from '../types';

export interface WishlistItemDTO {
  id: number;
  productId: number;
  productName: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  status: string;
  categoryId?: number;
  categoryName?: string;
  addedAt?: string;
}

export interface WishlistResponseDTO {
  items: WishlistItemDTO[];
  productIds: number[];
  totalCount: number;
}

/**
 * Fetch current user's Wishlist from Spring Boot backend (GET /api/wishlist)
 */
export async function fetchWishlistApi(): Promise<{ items: Product[]; productIds: string[] }> {
  try {
    const res = await apiFetch<WishlistResponseDTO>('/wishlist');
    if (!res || !Array.isArray(res.items)) {
      return { items: [], productIds: [] };
    }

    const items: Product[] = res.items.map((item) =>
      mapProductResponseToProduct({
        id: item.productId,
        name: item.productName,
        description: item.description,
        price: item.price,
        stock: item.stock,
        image: item.image,
        status: item.status,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
      })
    );

    const productIds = res.productIds.map(String);
    return { items, productIds };
  } catch (error) {
    console.warn('Failed to fetch wishlist from backend:', error);
    throw error;
  }
}

/**
 * Toggle product in Wishlist (POST /api/wishlist/toggle/{productId})
 */
export async function toggleWishlistApi(productId: string | number): Promise<{ items: Product[]; productIds: string[] }> {
  const numericId = typeof productId === 'string' ? productId.replace(/\D/g, '') || productId : productId;
  const res = await apiFetch<WishlistResponseDTO>(`/wishlist/toggle/${numericId}`, {
    method: 'POST',
  });

  if (!res || !Array.isArray(res.items)) {
    return { items: [], productIds: [] };
  }

  const items: Product[] = res.items.map((item) =>
    mapProductResponseToProduct({
      id: item.productId,
      name: item.productName,
      description: item.description,
      price: item.price,
      stock: item.stock,
      image: item.image,
      status: item.status,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
    })
  );

  const productIds = res.productIds.map(String);
  return { items, productIds };
}

/**
 * Remove product from Wishlist (DELETE /api/wishlist/{productId})
 */
export async function removeFromWishlistApi(productId: string | number): Promise<{ items: Product[]; productIds: string[] }> {
  const numericId = typeof productId === 'string' ? productId.replace(/\D/g, '') || productId : productId;
  const res = await apiFetch<WishlistResponseDTO>(`/wishlist/${numericId}`, {
    method: 'DELETE',
  });

  if (!res || !Array.isArray(res.items)) {
    return { items: [], productIds: [] };
  }

  const items: Product[] = res.items.map((item) =>
    mapProductResponseToProduct({
      id: item.productId,
      name: item.productName,
      description: item.description,
      price: item.price,
      stock: item.stock,
      image: item.image,
      status: item.status,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
    })
  );

  const productIds = res.productIds.map(String);
  return { items, productIds };
}

/**
 * Clear user's Wishlist (DELETE /api/wishlist)
 */
export async function clearWishlistApi(): Promise<void> {
  await apiFetch<void>('/wishlist', {
    method: 'DELETE',
  });
}
