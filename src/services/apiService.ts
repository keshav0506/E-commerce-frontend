import type { Product, Category, HeroSlide, PromotionBanner } from '../types';
import { PRODUCTS, CATEGORIES, HERO_SLIDES, PROMOTIONS } from '../data/mockData';

// Set to true when Spring Boot backend is connected
const USE_REAL_API = false;
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Fetch all products (GET /api/products)
 */
export async function fetchProducts(): Promise<Product[]> {
  if (USE_REAL_API) {
    const res = await fetch(`${API_BASE_URL}/products`);
    return await res.json();
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(PRODUCTS), 50);
  });
}

/**
 * Fetch single product by ID (GET /api/products/{id})
 */
export async function fetchProductById(id: string): Promise<Product | undefined> {
  if (USE_REAL_API) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    return await res.json();
  }
  return new Promise((resolve) => {
    const product = PRODUCTS.find((p) => p.id === id);
    setTimeout(() => resolve(product), 50);
  });
}

/**
 * Fetch all categories (GET /api/categories)
 */
export async function fetchCategories(): Promise<Category[]> {
  if (USE_REAL_API) {
    const res = await fetch(`${API_BASE_URL}/categories`);
    return await res.json();
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(CATEGORIES), 50);
  });
}

/**
 * Fetch products filtered by category (GET /api/products/category/{category})
 */
export async function fetchProductsByCategory(categoryId: string): Promise<Product[]> {
  if (USE_REAL_API) {
    const res = await fetch(`${API_BASE_URL}/products/category/${categoryId}`);
    return await res.json();
  }
  return new Promise((resolve) => {
    if (!categoryId || categoryId === 'all') {
      setTimeout(() => resolve(PRODUCTS), 50);
    } else {
      const filtered = PRODUCTS.filter((p) => p.categoryId === categoryId);
      setTimeout(() => resolve(filtered), 50);
    }
  });
}

/**
 * Fetch active promotional banners (GET /api/promotions)
 */
export async function fetchPromotions(): Promise<PromotionBanner[]> {
  if (USE_REAL_API) {
    const res = await fetch(`${API_BASE_URL}/promotions`);
    return await res.json();
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(PROMOTIONS), 50);
  });
}

/**
 * Fetch hero carousel slides (GET /api/hero-slides)
 */
export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  if (USE_REAL_API) {
    const res = await fetch(`${API_BASE_URL}/hero-slides`);
    return await res.json();
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(HERO_SLIDES), 50);
  });
}
