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
