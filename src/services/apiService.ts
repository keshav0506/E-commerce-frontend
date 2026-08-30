import type { Product, Category, PageResponse } from '../types';
import { mapProductResponseToProduct, mapCategoryResponseToCategory } from '../types';
import { apiFetch } from './api';

export interface FetchProductsParams {
  search?: string;
  categoryId?: string;
  featured?: boolean;
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
    if (params.featured) {
      queryParts.push(`featured=true`);
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
 * Fetch products by category name, slug, or ID (GET /api/products/category/{category})
 */
export async function fetchProductsByCategory(category: string, params: FetchProductsParams = {}): Promise<Product[]> {
  try {
    const queryParts: string[] = [];
    const size = params.size !== undefined ? params.size : 200;
    queryParts.push(`size=${size}`);
    if (params.page !== undefined) {
      queryParts.push(`page=${params.page}`);
    }
    const queryString = `?${queryParts.join('&')}`;

    const res = await apiFetch<PageResponse<any> | any[]>(`/products/category/${encodeURIComponent(category)}${queryString}`);
    let rawList: any[] = [];
    if (res && typeof res === 'object' && 'content' in res && Array.isArray((res as PageResponse<any>).content)) {
      rawList = (res as PageResponse<any>).content;
    } else if (Array.isArray(res)) {
      rawList = res;
    }
    return rawList.map(mapProductResponseToProduct);
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
}

/**
 * Search products (GET /api/products/search?query=)
 */
export async function searchProducts(query: string, params: FetchProductsParams = {}): Promise<Product[]> {
  try {
    const queryParts: string[] = [`query=${encodeURIComponent(query.trim())}`];
    const size = params.size !== undefined ? params.size : 200;
    queryParts.push(`size=${size}`);
    if (params.page !== undefined) {
      queryParts.push(`page=${params.page}`);
    }
    const queryString = `?${queryParts.join('&')}`;

    const res = await apiFetch<PageResponse<any> | any[]>(`/products/search${queryString}`);
    let rawList: any[] = [];
    if (res && typeof res === 'object' && 'content' in res && Array.isArray((res as PageResponse<any>).content)) {
      rawList = (res as PageResponse<any>).content;
    } else if (Array.isArray(res)) {
      rawList = res;
    }
    return rawList.map(mapProductResponseToProduct);
  } catch (error) {
    console.error(`Error searching products for '${query}':`, error);
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
 * Fetch single product by slug (GET /api/products/slug/{slug})
 */
export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const res = await apiFetch<any>(`/products/slug/${encodeURIComponent(slug)}`);
    if (!res) return undefined;
    return mapProductResponseToProduct(res);
  } catch (error) {
    console.error(`Error fetching product by slug ${slug}:`, error);
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

/**
 * Fetch EMI Financing Plans for product (GET /api/products/{id}/emi-plans)
 */
export async function fetchEmiPlans(productId: string | number): Promise<any> {
  try {
    return await apiFetch<any>(`/products/${productId}/emi-plans`);
  } catch (error) {
    console.error(`Error fetching EMI plans for product ${productId}:`, error);
    return null;
  }
}

export interface PublicSupplierCatalogResponse {
  supplier: {
    id: number | string;
    businessName: string;
    businessEmail: string;
    category: string;
    city?: string;
    state?: string;
    status?: string;
  };
  products: {
    content: Product[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  };
  totalProducts: number;
}

/**
 * Fetch Public Supplier Storefront Catalog (GET /api/suppliers/{id}/public-catalog)
 */
export async function fetchPublicSupplierCatalog(
  supplierId: string | number,
  params: { search?: string; page?: number; size?: number } = {}
): Promise<PublicSupplierCatalogResponse | null> {
  try {
    const queryParts: string[] = [];
    if (params.search && params.search.trim()) {
      queryParts.push(`search=${encodeURIComponent(params.search.trim())}`);
    }
    if (params.page !== undefined) {
      queryParts.push(`page=${params.page}`);
    }
    const size = params.size !== undefined ? params.size : 12;
    queryParts.push(`size=${size}`);

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    const res = await apiFetch<any>(`/suppliers/${supplierId}/public-catalog${queryString}`);
    if (!res) return null;

    return {
      supplier: res.supplier,
      products: {
        content: (res.products?.content || []).map(mapProductResponseToProduct),
        totalElements: res.products?.totalElements || 0,
        totalPages: res.products?.totalPages || 0,
        size: res.products?.size || 12,
        number: res.products?.number || 0,
        first: res.products?.first ?? true,
        last: res.products?.last ?? true,
        empty: res.products?.empty ?? false
      },
      totalProducts: res.totalProducts || 0
    };
  } catch (error) {
    console.error(`Error fetching public supplier catalog for supplier ${supplierId}:`, error);
    return null;
  }
}

export interface WholesaleQuotePayload {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  quantity: number;
  notes?: string;
  productId?: number | string;
  productName?: string;
}

export interface WholesaleQuoteResult {
  id: number;
  referenceId: string;
  supplierBusinessName: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  quantity: number;
  status: string;
  createdAt: string;
  message: string;
}

/**
 * Submit a wholesale quote request to a supplier (POST /api/suppliers/{id}/quote)
 */
export async function submitWholesaleQuote(
  supplierId: string | number,
  payload: WholesaleQuotePayload
): Promise<WholesaleQuoteResult> {
  return await apiFetch<WholesaleQuoteResult>(`/suppliers/${supplierId}/quote`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
