import { apiFetch } from './api';

export interface ReviewItem {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  owner: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductReviewsSummary {
  productId: number;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
  ratingPercentages: Record<number, number>;
  reviews: ReviewItem[];
  userHasReviewed: boolean;
  userReview: ReviewItem | null;
}

export interface ReviewSubmitData {
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export const fetchProductReviewsApi = async (productId: string | number): Promise<ProductReviewsSummary> => {
  const isNumeric = /^\d+$/.test(String(productId));
  if (!isNumeric) {
    return {
      productId: Number(productId) || 1,
      averageRating: 4.8,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      ratingPercentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      reviews: [],
      userHasReviewed: false,
      userReview: null,
    };
  }

  return await apiFetch<ProductReviewsSummary>(`/products/${productId}/reviews`, {
    method: 'GET',
  });
};

export const submitProductReviewApi = async (
  productId: string | number,
  data: ReviewSubmitData
): Promise<ReviewItem> => {
  return await apiFetch<ReviewItem>(`/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const deleteProductReviewApi = async (productId: string | number): Promise<void> => {
  await apiFetch<void>(`/products/${productId}/reviews`, {
    method: 'DELETE',
  });
};

/**
 * Upload a single image file to Cloudinary via the backend and return the CDN URL.
 * Uses multipart/form-data — no base64 needed.
 */
export const uploadReviewImageApi = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiFetch<{ imageUrl: string }>('/images/upload', {
    method: 'POST',
    body: formData,
  });
  return res.imageUrl;
};
