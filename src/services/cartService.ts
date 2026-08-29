import { apiFetch } from './api';
import type { CartItem, Product } from '../types';
import { mapProductResponseToProduct } from '../types';

export interface CartItemResponseDTO {
  id?: string | number;
  productId?: string | number;
  product?: any;
  quantity: number;
  selectedVolume?: string;
  price?: number;
}

export interface CartResponseDTO {
  id?: string | number;
  items?: CartItemResponseDTO[];
}

export function mapCartItemResponseToCartItem(dto: CartItemResponseDTO, fallbackProducts: Product[] = []): CartItem {
  let product: Product;
  if (dto.product) {
    product = mapProductResponseToProduct(dto.product);
  } else {
    const prodIdStr = String(dto.productId || dto.id || '');
    const found = fallbackProducts.find((p) => p.id === prodIdStr);
    product = found || {
      id: prodIdStr,
      name: dto.product?.name || 'Cart Item',
      categoryId: 'all',
      categoryName: 'General',
      price: dto.price || 0,
      originalPrice: dto.price || 0,
      discountPercent: 0,
      rating: 4.5,
      reviewCount: 0,
      image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846340/ecommerce/products/re1p3tqmpjl4gdqngjf1.jpg',
      description: '',
      inStock: true,
      stock: 10
    };
  }

  return {
    product,
    quantity: dto.quantity || 1,
    selectedVolume: dto.selectedVolume || 'Standard'
  };
}

/**
 * Fetch cart from backend (GET /api/cart)
 */
export async function fetchCartApi(fallbackProducts: Product[] = []): Promise<CartItem[]> {
  try {
    const res = await apiFetch<CartResponseDTO | CartItemResponseDTO[]>('/cart');
    let rawItems: CartItemResponseDTO[] = [];
    if (res && typeof res === 'object' && 'items' in res && Array.isArray((res as CartResponseDTO).items)) {
      rawItems = (res as CartResponseDTO).items || [];
    } else if (Array.isArray(res)) {
      rawItems = res;
    }
    return rawItems.map((item) => mapCartItemResponseToCartItem(item, fallbackProducts));
  } catch (error: any) {
    if (error?.status !== 401) {
      console.warn('Cart API fetch warning/fallback:', error);
    }
    return [];
  }
}

/**
 * Add item to cart (POST /api/cart/items)
 */
export async function addToCartApi(productId: string, quantity: number = 1, selectedVolume?: string): Promise<any> {
  return await apiFetch('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity, selectedVolume })
  });
}

/**
 * Update cart item quantity (PUT /api/cart/items/{id})
 */
export async function updateCartItemQuantityApi(itemIdOrProductId: string, quantity: number, selectedVolume?: string): Promise<any> {
  return await apiFetch(`/cart/items/${itemIdOrProductId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity, selectedVolume })
  });
}

/**
 * Remove item from cart (DELETE /api/cart/items/{id})
 */
export async function removeCartItemApi(itemIdOrProductId: string): Promise<any> {
  return await apiFetch(`/cart/items/${itemIdOrProductId}`, {
    method: 'DELETE'
  });
}

/**
 * Clear cart (DELETE /api/cart)
 */
export async function clearCartApi(): Promise<any> {
  return await apiFetch('/cart', {
    method: 'DELETE'
  });
}
