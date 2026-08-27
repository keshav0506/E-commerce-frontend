import type { Product, Category, HeroSlide, PromotionBanner, PageResponse } from '../types';
import { mapProductResponseToProduct, mapCategoryResponseToCategory } from '../types';
import { PRODUCTS, CATEGORIES, HERO_SLIDES, PROMOTIONS } from '../data/mockData';
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
 * Supports search, categoryId, page, size, sort query parameters
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
    if (params.size !== undefined) {
      queryParts.push(`size=${params.size}`);
    }
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

    const mapped = rawList.map(mapProductResponseToProduct);
    // If backend returned empty list, use mock data as fallback
    if (mapped.length === 0) {
      console.info('Backend returned 0 products, using mock data.');
      return PRODUCTS;
    }
    return mapped;
  } catch (error) {
    console.warn('Backend products endpoint unreachable or failed, falling back to mock data:', error);
    return PRODUCTS;
  }
}

/**
 * Fetch single product by ID (GET /api/products/{id})
 */
export async function fetchProductById(id: string): Promise<Product | undefined> {
  const isNumeric = /^\d+$/.test(id);
  if (!isNumeric) {
    return PRODUCTS.find((p) => p.id === id);
  }

  try {
    const res = await apiFetch<any>(`/products/${id}`);
    if (!res) return undefined;
    return mapProductResponseToProduct(res);
  } catch (error) {
    console.warn(`Backend product ${id} endpoint unreachable or failed, falling back to mock data:`, error);
    return PRODUCTS.find((p) => p.id === id);
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
    const mapped = rawList.map(mapCategoryResponseToCategory);
    // If backend returned empty list, use mock data as fallback
    if (mapped.length === 0) {
      console.info('Backend returned 0 categories, using mock data.');
      return CATEGORIES;
    }
    return mapped;
  } catch (error) {
    console.warn('Backend categories endpoint unreachable or failed, falling back to mock data:', error);
    return CATEGORIES;
  }
}

/**
 * Fetch products filtered by category (GET /api/products?categoryId={id})
 */
export async function fetchProductsByCategory(categoryId: string): Promise<Product[]> {
  return fetchProducts({ categoryId });
}

/**
 * Fetch active promotional banners (GET /api/promotions)
 */
export async function fetchPromotions(): Promise<PromotionBanner[]> {
  try {
    const res = await apiFetch<PromotionBanner[]>('/promotions');
    if (Array.isArray(res)) return res;
    return PROMOTIONS;
  } catch {
    return PROMOTIONS;
  }
}

/**
 * Fetch hero carousel slides (GET /api/hero-slides)
 */
export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  try {
    const res = await apiFetch<HeroSlide[]>('/hero-slides');
    if (Array.isArray(res)) return res;
    return HERO_SLIDES;
  } catch {
    return HERO_SLIDES;
  }
}
