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
  sku?: string;
  name: string;
  slug?: string;
  brand?: string;
  categoryId: string;
  categoryName: string;
  categorySlug?: string;
  price: number;
  originalPrice: number;
  discountPrice?: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[];
  badge?: string;
  description: string;
  shortDescription?: string;
  volumes?: string[];
  inStock: boolean;
  stock: number;
  lowStockThreshold?: number;
  isFeatured?: boolean;
  featured?: boolean;
  isNewArrival?: boolean;
  specifications?: ProductSpecification[];
  reviews?: ProductReview[];
  ratingDistribution?: RatingDistribution[];
  createdAt?: string;
  updatedAt?: string;
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
  categoryId: string;
  badge: string;
  headline: string;
  subtitle: string;
  ctaText: string;
  productImage: string;
  productName: string;
  options: string[];
  bgGradient: string;
  textColor: string;
  ctaBg: string;
  ctaTextColor: string;
  badgeBg: string;
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
  deliveryFee?: number;
  shipping?: number;
  tax?: number;
  discount: number;
  finalTotal?: number;
  total: number;
  createdAt: string;
  updatedAt?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

// CUSTOMER / USER TYPES
export interface CustomerUser {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'blocked' | 'inactive';
  joinedDate: string;
  totalOrders?: number;
  totalSpent?: number;
  addresses?: Array<{
    id: string;
    fullName: string;
    phone: string;
    house: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    type: 'HOME' | 'WORK' | 'OTHER';
    isDefault?: boolean;
  }>;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export interface ProductResponseDTO {
  id: string | number;
  sku?: string;
  name: string;
  slug?: string;
  brand?: string;
  description?: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  stock?: number;
  lowStockThreshold?: number;
  image: string;
  status?: string;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  categoryId?: string | number;
  categoryName?: string;
  categorySlug?: string;
  createdAt?: string;
  updatedAt?: string;
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
      sku: '',
      name: 'Unknown Product',
      slug: '',
      brand: 'Shoply',
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
      stock: 0,
      lowStockThreshold: 5,
      featured: false
    };
  }

  const stock = typeof dto.stock === 'number' ? dto.stock : (dto.inStock ? 10 : 0);
  const price = typeof dto.price === 'number' ? dto.price : Number(dto.price) || 0;
  const discountPrice = dto.discountPrice != null ? Number(dto.discountPrice) : undefined;
  
  // Original price is either discountPrice (if higher than current price) or calculated
  let originalPrice = dto.originalPrice;
  if (!originalPrice) {
    if (discountPrice && discountPrice > price) {
      originalPrice = discountPrice;
    } else if (price > 0) {
      originalPrice = Math.round(price * 1.25);
    } else {
      originalPrice = 0;
    }
  }

  const discountPercent = dto.discountPercent || 
    (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

  const lowStockThreshold = dto.lowStockThreshold != null ? dto.lowStockThreshold : 5;
  const featured = Boolean(dto.featured ?? dto.isFeatured ?? false);
  const name = dto.name || 'Untitled Product';
  const slug = dto.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return {
    id: String(dto.id ?? ''),
    sku: dto.sku || `SKU-${dto.id}`,
    name,
    slug,
    brand: dto.brand || 'Shoply',
    categoryId: String(dto.categoryId ?? dto.category?.id ?? 'all'),
    categoryName: dto.categoryName || dto.category?.name || 'General',
    categorySlug: dto.categorySlug || (dto.categoryName ? dto.categoryName.toLowerCase().replace(/\s+/g, '-') : undefined),
    price,
    originalPrice,
    discountPrice,
    discountPercent,
    rating: dto.rating != null ? Number(dto.rating) : 4.5,
    reviewCount: dto.reviewCount != null ? Number(dto.reviewCount) : 12,
    image: dto.image || dto.images?.[0] || 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846340/ecommerce/products/re1p3tqmpjl4gdqngjf1.jpg',
    images: dto.images && dto.images.length > 0 ? dto.images : [dto.image].filter(Boolean),
    badge: dto.badge || (discountPercent > 0 ? `${discountPercent}% OFF` : undefined),
    description: dto.description || '',
    shortDescription: dto.shortDescription || dto.description?.substring(0, 120),
    volumes: dto.volumes || ['Standard'],
    inStock: dto.inStock !== undefined ? Boolean(dto.inStock) : stock > 0,
    stock,
    lowStockThreshold,
    isFeatured: featured,
    featured,
    isNewArrival: dto.isNewArrival ?? false,
    specifications: dto.specifications || [],
    reviews: dto.reviews || [],
    ratingDistribution: dto.ratingDistribution || [],
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt
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
