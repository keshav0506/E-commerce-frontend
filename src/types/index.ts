export interface ProductReview {
  id: string;
  userName: string;
  userRating: number;
  date: string;
  comment: string;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[];
  badge?: string;
  description: string;
  volumes?: string[];
  inStock: boolean;
  stock?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  specifications?: ProductSpecification[];
  reviews?: ProductReview[];
  ratingDistribution?: RatingDistribution[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  bgColor?: string;
  heroBgGradient?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  itemCount?: number;
  status?: 'active' | 'inactive';
  createdAt?: string;
}

export interface HeroSlide {
  id: string;
  categoryId?: string;
  badge: string;
  headline: string;
  subtitle: string;
  ctaText: string;
  productImage: string;
  productName: string;
  options?: string[];
  bgGradient: string;
  textColor?: string;
  ctaBg?: string;
  ctaTextColor?: string;
  badgeBg?: string;
}

export interface PromotionBanner {
  id: string;
  badge: string;
  title: string;
  subtitle?: string;
  ctaText: string;
  image: string;
  bgClass: string;
  textColor: string;
}

export interface BenefitItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVolume?: string;
}

// ORDER MANAGEMENT TYPES
export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  image: string;
  quantity: number;
  priceAtPurchase: number;
  total: number;
}

export interface OrderCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface OrderShippingAddress {
  fullName: string;
  phone: string;
  house: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  type?: string;
}

export interface Order {
  id: string;
  customer: OrderCustomer;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  transactionId?: string;
  shippingAddress: OrderShippingAddress;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt?: string;
}

// CUSTOMER MANAGEMENT TYPES
export interface CustomerAddress {
  id: string;
  fullName: string;
  phone: string;
  house: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  type: string;
  isDefault?: boolean;
}

export interface CustomerUser {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'blocked';
  joinedDate: string;
  addresses: CustomerAddress[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ProductResponseDTO {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image?: string;
  status?: string;
  categoryId?: string | number;
  categoryName?: string;
  originalPrice?: number;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  badge?: string;
  volumes?: string[];
  inStock?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
}

export interface CategoryResponseDTO {
  id: string | number;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  bgColor?: string;
  status?: string;
  createdAt?: string;
  itemCount?: number;
}

export function mapProductResponseToProduct(dto: any): Product {
  if (!dto) {
    return {
      id: '',
      name: 'Unknown Product',
      categoryId: 'all',
      categoryName: 'General',
      price: 0,
      originalPrice: 0,
      discountPercent: 0,
      rating: 4.5,
      reviewCount: 0,
      image: '',
      description: '',
      inStock: false,
      stock: 0
    };
  }

  const stock = typeof dto.stock === 'number' ? dto.stock : (dto.inStock ? 10 : 0);
  const price = typeof dto.price === 'number' ? dto.price : Number(dto.price) || 0;
  const originalPrice = dto.originalPrice || (price > 0 ? Math.round(price * 1.2) : 0);
  const discountPercent = dto.discountPercent || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

  return {
    id: String(dto.id ?? ''),
    name: dto.name || 'Untitled Product',
    categoryId: String(dto.categoryId ?? dto.category?.id ?? 'all'),
    categoryName: dto.categoryName || dto.category?.name || 'General',
    price,
    originalPrice,
    discountPercent,
    rating: dto.rating ?? 4.5,
    reviewCount: dto.reviewCount ?? 12,
    image: dto.image || dto.images?.[0] || 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846340/ecommerce/products/re1p3tqmpjl4gdqngjf1.jpg',
    images: dto.images && dto.images.length > 0 ? dto.images : [dto.image].filter(Boolean),
    badge: dto.badge || (discountPercent > 0 ? `${discountPercent}% OFF` : undefined),
    description: dto.description || '',
    volumes: dto.volumes || ['Standard'],
    inStock: dto.inStock !== undefined ? Boolean(dto.inStock) : stock > 0,
    stock,
    isFeatured: dto.isFeatured ?? true,
    isNewArrival: dto.isNewArrival ?? false,
    specifications: dto.specifications || [],
    reviews: dto.reviews || [],
    ratingDistribution: dto.ratingDistribution || []
  };
}

export function mapCategoryResponseToCategory(dto: any): Category {
  if (!dto) {
    return {
      id: '',
      name: 'Unknown Category',
      slug: 'unknown',
      description: '',
      image: ''
    };
  }

  const name = dto.name || 'Category';
  const slug = dto.slug || name.toLowerCase().replace(/\s+/g, '-');
  return {
    id: String(dto.id ?? slug),
    name,
    slug,
    description: dto.description || '',
    image: dto.image || 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846339/ecommerce/products/uyxz3dd4ulop71zvaovj.jpg',
    bgColor: dto.bgColor || 'bg-rose-50',
    heroBgGradient: dto.heroBgGradient || 'from-rose-500 to-pink-600',
    heroTitle: dto.heroTitle || `Explore ${name}`,
    heroSubtitle: dto.heroSubtitle || `Discover curated ${name.toLowerCase()} products`,
    itemCount: dto.itemCount ?? 0,
    status: dto.status === 'inactive' ? 'inactive' : 'active',
    createdAt: dto.createdAt || new Date().toISOString()
  };
}

