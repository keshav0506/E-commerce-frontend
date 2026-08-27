import type { Product, Category, PageResponse } from '../types';
import { mapProductResponseToProduct, mapCategoryResponseToCategory } from '../types';
import { apiFetch } from './api';

export interface FetchProductsParams {
  search?: string;
  categoryId?: string;
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * Fetch products (GET /api/products)
 * Strictly fetches from MySQL database via Spring Boot backend API.
 */
export async function fetchProducts(params: FetchProductsParams = {}): Promise<Product[]> {
  try {
    const queryParts: string[] = [];
    if (params.search && params.search.trim()) {
      queryParts.push(`search=${encodeURIComponent(params.search.trim())}`);
    }
    if (params.categoryId && params.categoryId !== 'all') {
      queryParts.push(`categoryId=${encodeURIComponent(params.categoryId)}`);
    }
    if (params.page !== undefined) {
      queryParts.push(`page=${params.page}`);
    }
    const size = params.size !== undefined ? params.size : 200;
    queryParts.push(`size=${size}`);
    if (params.sort) {
      queryParts.push(`sort=${encodeURIComponent(params.sort)}`);
    }

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    const res = await apiFetch<PageResponse<any> | any[]>(`/products${queryString}`);

    let rawList: any[] = [];
    if (res && typeof res === 'object' && 'content' in res && Array.isArray((res as PageResponse<any>).content)) {
      rawList = (res as PageResponse<any>).content;
    } else if (Array.isArray(res)) {
      rawList = res;
    }

    return rawList.map(mapProductResponseToProduct);
  } catch (error) {
    console.error('Error fetching products from backend:', error);
    return [];
  }
}

/**
 * Fetch single product by ID (GET /api/products/{id})
 */
export async function fetchProductById(id: string): Promise<Product | undefined> {
  try {
    const res = await apiFetch<any>(`/products/${id}`);
    if (!res) return undefined;
    return mapProductResponseToProduct(res);
  } catch (error) {
    console.error(`Error fetching product ${id} from backend:`, error);
    return undefined;
  }
}

/**
 * Fetch all categories (GET /api/categories)
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await apiFetch<any[] | PageResponse<any>>('/categories');
    let rawList: any[] = [];
    if (res && typeof res === 'object' && 'content' in res && Array.isArray((res as PageResponse<any>).content)) {
      rawList = (res as PageResponse<any>).content;
    } else if (Array.isArray(res)) {
      rawList = res;
    }
    return rawList.map(mapCategoryResponseToCategory);
  } catch (error) {
    console.error('Error fetching categories from backend:', error);
    return [];
  }
}
