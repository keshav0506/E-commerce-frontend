import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Category, CartItem, Order, OrderStatus, CustomerUser } from '../types';
import { fetchCategories, fetchProducts } from '../services/apiService';
import { fetchCartApi, addToCartApi, updateCartItemQuantityApi, removeCartItemApi, clearCartApi } from '../services/cartService';
import { fetchWishlistApi, toggleWishlistApi, removeFromWishlistApi, clearWishlistApi } from '../services/wishlistService';
import { createOrderApi, cancelOrderApi, fetchCustomerOrdersApi } from '../services/orderService';
import { createProductApi, updateProductApi, deleteProductApi, createCategoryApi, updateCategoryApi, deleteCategoryApi, updateOrderStatusApi } from '../services/adminService';

interface CouponInfo {
  code: string;
  discountType: 'percentage' | 'flat';
  value: number;
}

interface ShopContextType {
  isLoading: boolean;
  apiError: string | null;
  refetchProducts: () => Promise<void>;
  categories: Category[];
  activeCategories: Category[];
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVolume?: string) => void;
  removeFromCart: (productId: string, selectedVolume?: string) => void;
  updateQuantity: (productId: string, delta: number, selectedVolume?: string) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
  cartTotalCount: number;
  cartSubtotal: number;
  cartProductDiscount: number;
  cartDeliveryFee: number;
  appliedCoupon: CouponInfo | null;
  couponDiscountAmount: number;
  cartFinalTotal: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;

  // Instant Buy / Direct Checkout Isolated Session
  instantCheckoutItem: CartItem | null;
  startInstantCheckout: (product: Product, quantity?: number, selectedVolume?: string) => void;
  clearInstantCheckout: () => void;

  // Admin Product CRUD Operations
  createProduct: (newProduct: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Admin Category CRUD Operations
  createCategory: (newCategory: Omit<Category, 'id' | 'itemCount'>) => void;
  updateCategory: (id: string, updatedFields: Partial<Category>) => void;
  deleteCategory: (id: string) => boolean;
  toggleCategoryStatus: (id: string) => void;
  getCategoryProductCount: (categoryId: string) => number;

  // Admin Order Management Operations
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => boolean;
  cancelOrder: (orderId: string) => boolean;
  placeOrder: (orderData: Omit<Order, 'id'>) => Order;

  // Admin Customer Management Operations
  customers: CustomerUser[];
  toggleCustomerStatus: (customerId: string) => void;
  getCustomerOrders: (customerEmail: string) => Order[];
  getCustomerStats: (customerEmail: string) => { totalOrders: number; totalSpent: number };
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const LOCAL_STORAGE_CART_KEY = 'shoply_cart';
const LOCAL_STORAGE_WISHLIST_KEY = 'shoply_wishlist';
const LOCAL_STORAGE_CUSTOM_PRODUCTS_KEY = 'shoply_custom_products';
const LOCAL_STORAGE_DELETED_PRODUCTS_KEY = 'shoply_deleted_products';
const LOCAL_STORAGE_CUSTOM_CATEGORIES_KEY = 'shoply_custom_categories';
const LOCAL_STORAGE_ADMIN_ORDERS_KEY = 'shoply_admin_orders';
const LOCAL_STORAGE_ADMIN_CUSTOMERS_KEY = 'shoply_admin_customers';
const SESSION_STORAGE_INSTANT_KEY = 'shoply_instant_checkout';

// INITIAL REASONABLE MOCK CUSTOMERS
const INITIAL_MOCK_CUSTOMERS: CustomerUser[] = [
  {
    id: 'cust-1',
    name: 'Keshav Khandelwal',
    firstName: 'Keshav',
    lastName: 'Khandelwal',
    email: 'keshav@example.com',
    phone: '9876543210',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    joinedDate: 'Jan 15, 2026',
    addresses: [
      { id: 'addr-1', fullName: 'Keshav Khandelwal', phone: '9876543210', house: 'Flat 402, Sunshine Heights', street: 'MG Road, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038', type: 'HOME', isDefault: true }
    ]
  },
  {
    id: 'cust-2',
    name: 'Priya Verma',
    firstName: 'Priya',
    lastName: 'Verma',
    email: 'priya.v@example.com',
    phone: '9812345678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    joinedDate: 'Feb 10, 2026',
    addresses: [
      { id: 'addr-2', fullName: 'Priya Verma', phone: '9812345678', house: 'House No. 12, Park Street', street: 'Sector 15', city: 'Gurugram', state: 'Haryana', pincode: '122001', type: 'WORK', isDefault: true }
    ]
  },
  {
    id: 'cust-3',
    name: 'Rahul Sharma',
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.s@example.com',
    phone: '9765432109',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    joinedDate: 'Mar 04, 2026',
    addresses: [
      { id: 'addr-3', fullName: 'Rahul Sharma', phone: '9765432109', house: 'B-204, Royal Palms', street: 'Aarey Milk Colony', city: 'Mumbai', state: 'Maharashtra', pincode: '400065', type: 'HOME', isDefault: true }
    ]
  },
  {
    id: 'cust-4',
    name: 'Amit Patel',
    firstName: 'Amit',
    lastName: 'Patel',
    email: 'amit.patel@example.com',
    phone: '9654321098',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    joinedDate: 'Apr 18, 2026',
    addresses: [
      { id: 'addr-4', fullName: 'Amit Patel', phone: '9654321098', house: 'Plot 45, CG Road', street: 'Navrangpura', city: 'Ahmedabad', state: 'Gujarat', pincode: '380009', type: 'HOME', isDefault: true }
    ]
  },
  {
    id: 'cust-5',
    name: 'Sneha Kapoor',
    firstName: 'Sneha',
    lastName: 'Kapoor',
    email: 'sneha.k@example.com',
    phone: '9543210987',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    joinedDate: 'May 22, 2026',
    addresses: [
      { id: 'addr-5', fullName: 'Sneha Kapoor', phone: '9543210987', house: 'Flat 101, Lakeview Apts', street: 'Bani Park', city: 'Jaipur', state: 'Rajasthan', pincode: '302016', type: 'HOME', isDefault: true }
    ]
  },
  {
    id: 'cust-6',
    name: 'Vikram Singh',
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram@example.com',
    phone: '9432109876',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    joinedDate: 'Jun 12, 2026',
    addresses: [
      { id: 'addr-6', fullName: 'Vikram Singh', phone: '9432109876', house: 'House 88, Civil Lines', street: 'Mall Road', city: 'Kanpur', state: 'Uttar Pradesh', pincode: '208001', type: 'HOME', isDefault: true }
    ]
  },
  {
    id: 'cust-7',
    name: 'Ananya Roy',
    firstName: 'Ananya',
    lastName: 'Roy',
    email: 'ananya.roy@example.com',
    phone: '9321098765',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    status: 'blocked',
    joinedDate: 'Jul 01, 2026',
    addresses: [
      { id: 'addr-7', fullName: 'Ananya Roy', phone: '9321098765', house: 'Flat 5B, Salt Lake', street: 'Sector V', city: 'Kolkata', state: 'West Bengal', pincode: '700091', type: 'HOME', isDefault: true }
    ]
  }
];

// INITIAL REASONABLE MOCK ORDERS
const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: '#ORD-2026-00124',
    customer: { id: 'cust-1', name: 'Keshav Khandelwal', email: 'keshav@example.com', phone: '9876543210' },
    items: [
      { productId: 'prod-1', productName: 'Berry Blast Juice', sku: 'SKU-000001', image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846790/ecommerce/products/foq3pj2h2qmtckbuwu0o.jpg', quantity: 2, priceAtPurchase: 199, total: 398 },
      { productId: 'prod-19', productName: 'Aethelgard Studio Headphones', sku: 'SKU-000003', image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846770/ecommerce/products/yn4qovboszpxtefr7yjo.jpg', quantity: 1, priceAtPurchase: 2999, total: 2999 }
    ],
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI (Google Pay)',
    transactionId: 'TXN-948201',
    shippingAddress: { fullName: 'Keshav Khandelwal', phone: '9876543210', house: 'Flat 402, Sunshine Heights', street: 'MG Road, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038', type: 'HOME' },
    subtotal: 3397,
    discount: 298,
    shipping: 0,
    tax: 149,
    total: 3248,
    createdAt: 'Aug 10, 2026 10:32 AM',
    updatedAt: 'Aug 10, 2026 04:15 PM'
  },
  {
    id: '#ORD-2026-00123',
    customer: { id: 'cust-2', name: 'Priya Verma', email: 'priya.v@example.com', phone: '9812345678' },
    items: [
      { productId: 'prod-6', productName: 'Chipotle Lime Nachos', sku: 'SKU-000002', image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846783/ecommerce/products/sonwmknronpjyv4qoxdb.jpg', quantity: 3, priceAtPurchase: 99, total: 297 }
    ],
    status: 'Processing',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN-839205',
    shippingAddress: { fullName: 'Priya Verma', phone: '9812345678', house: 'House No. 12, Park Street', street: 'Sector 15', city: 'Gurugram', state: 'Haryana', pincode: '122001', type: 'WORK' },
    subtotal: 297,
    discount: 50,
    shipping: 99,
    tax: 35,
    total: 381,
    createdAt: 'Aug 10, 2026 11:45 AM',
    updatedAt: 'Aug 10, 2026 12:10 PM'
  },
  {
    id: '#ORD-2026-00122',
    customer: { id: 'cust-3', name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '9765432109' },
    items: [
      { productId: 'prod-25', productName: 'Apex White Leather Sneaker', sku: 'SKU-000004', image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846776/ecommerce/products/vmw38u1w7d7nbxbmer9m.jpg', quantity: 1, priceAtPurchase: 1899, total: 1899 }
    ],
    status: 'Shipped',
    paymentStatus: 'Paid',
    paymentMethod: 'Debit Card',
    transactionId: 'TXN-729104',
    shippingAddress: { fullName: 'Rahul Sharma', phone: '9765432109', house: 'B-204, Royal Palms', street: 'Aarey Milk Colony', city: 'Mumbai', state: 'Maharashtra', pincode: '400065', type: 'HOME' },
    subtotal: 1899,
    discount: 200,
    shipping: 0,
    tax: 180,
    total: 1879,
    createdAt: 'Aug 09, 2026 02:15 PM',
    updatedAt: 'Aug 10, 2026 09:30 AM'
  },
  {
    id: '#ORD-2026-00121',
    customer: { id: 'cust-4', name: 'Amit Patel', email: 'amit.patel@example.com', phone: '9654321098' },
    items: [
      { productId: 'prod-1', productName: 'Berry Blast Juice', sku: 'SKU-000001', image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846790/ecommerce/products/foq3pj2h2qmtckbuwu0o.jpg', quantity: 6, priceAtPurchase: 199, total: 1194 }
    ],
    status: 'Confirmed',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI (Paytm)',
    transactionId: 'TXN-618093',
    shippingAddress: { fullName: 'Amit Patel', phone: '9654321098', house: 'Plot 45, CG Road', street: 'Navrangpura', city: 'Ahmedabad', state: 'Gujarat', pincode: '380009', type: 'HOME' },
    subtotal: 1194,
    discount: 100,
    shipping: 0,
    tax: 45,
    total: 1139,
    createdAt: 'Aug 09, 2026 04:50 PM',
    updatedAt: 'Aug 09, 2026 05:00 PM'
  },
  {
    id: '#ORD-2026-00120',
    customer: { id: 'cust-5', name: 'Sneha Kapoor', email: 'sneha.k@example.com', phone: '9543210987' },
    items: [
      { productId: 'prod-28', productName: 'Apex Pro OLED Smartwatch', sku: 'SKU-000003', image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846812/ecommerce/products/mcbgbgucqnd293rjid65.jpg', quantity: 1, priceAtPurchase: 3499, total: 3499 }
    ],
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash on Delivery (COD)',
    shippingAddress: { fullName: 'Sneha Kapoor', phone: '9543210987', house: 'Flat 101, Lakeview Apts', street: 'Bani Park', city: 'Jaipur', state: 'Rajasthan', pincode: '302016', type: 'HOME' },
    subtotal: 3499,
    discount: 200,
    shipping: 0,
    tax: 125,
    total: 3424,
    createdAt: 'Aug 08, 2026 08:10 PM',
    updatedAt: 'Aug 08, 2026 08:10 PM'
  },
  {
    id: '#ORD-2026-00119',
    customer: { id: 'cust-6', name: 'Vikram Singh', email: 'vikram@example.com', phone: '9432109876' },
    items: [
      { productId: 'prod-6', productName: 'Chipotle Lime Nachos', sku: 'SKU-000002', image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846783/ecommerce/products/sonwmknronpjyv4qoxdb.jpg', quantity: 2, priceAtPurchase: 99, total: 198 }
    ],
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    paymentMethod: 'UPI (PhonePe)',
    transactionId: 'TXN-507982',
    shippingAddress: { fullName: 'Vikram Singh', phone: '9432109876', house: 'House 88, Civil Lines', street: 'Mall Road', city: 'Kanpur', state: 'Uttar Pradesh', pincode: '208001', type: 'HOME' },
    subtotal: 198,
    discount: 0,
    shipping: 99,
    tax: 20,
    total: 317,
    createdAt: 'Aug 07, 2026 01:20 PM',
    updatedAt: 'Aug 07, 2026 02:00 PM'
  }
];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Orders State with LocalStorage Persistence
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ADMIN_ORDERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_MOCK_ORDERS;
    } catch {
      return INITIAL_MOCK_ORDERS;
    }
  });

  // Customers State with LocalStorage Persistence
  const [customers, setCustomers] = useState<CustomerUser[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ADMIN_CUSTOMERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_MOCK_CUSTOMERS;
    } catch {
      return INITIAL_MOCK_CUSTOMERS;
    }
  });

  // Cart State with LocalStorage Persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State with LocalStorage Persistence
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponInfo | null>(null);

  // Instant Checkout Session (Isolated from regular persistent Cart)
  const [instantCheckoutItem, setInstantCheckoutItem] = useState<CartItem | null>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_INSTANT_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const loadInitialData = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const [baseCats, baseProds] = await Promise.all([
        fetchCategories(),
        fetchProducts({ size: 200 })
      ]);

      if (baseCats.length === 0 && baseProds.length === 0) {
        setApiError('Unable to connect to the backend server. Please verify the service is running.');
      } else {
        setApiError(null);
      }

      // Load custom category updates
      try {
        const customCatsJson = localStorage.getItem(LOCAL_STORAGE_CUSTOM_CATEGORIES_KEY);
        const customCats: Category[] = customCatsJson ? JSON.parse(customCatsJson) : [];

        let mergedCats = baseCats.map((c) => {
          const override = customCats.find((cc) => cc.id === c.id || cc.slug === c.slug);
          return override ? { ...c, ...override } : { ...c, status: c.status || 'active', createdAt: c.createdAt || 'Aug 10, 2026' };
        });

        const extraCats = customCats.filter((cc) => !baseCats.some((bc) => bc.id === cc.id || bc.slug === cc.slug));
        mergedCats = [...mergedCats, ...extraCats];

        setCategories(mergedCats);
      } catch {
        setCategories(baseCats.map((c) => ({ ...c, status: 'active', createdAt: 'Aug 10, 2026' })));
      }

      // Clean legacy localStorage caches and use ONLY unique products from database
      try {
        localStorage.removeItem(LOCAL_STORAGE_CUSTOM_PRODUCTS_KEY);
        localStorage.removeItem(LOCAL_STORAGE_DELETED_PRODUCTS_KEY);
      } catch {}

      const uniqueProducts: Product[] = [];
      const seenKeys = new Set<string>();
      for (const p of baseProds) {
        const key = p.sku || p.name.toLowerCase().trim();
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          uniqueProducts.push(p);
        }
      }
      setProducts(uniqueProducts);

      // Load Wishlist from backend (authenticated or guest session)
      try {
        const { productIds } = await fetchWishlistApi();
        if (productIds && productIds.length > 0) {
          setWishlist(productIds);
        }
      } catch (e) {
        // Silent fallback
      }
    } catch (err: any) {
      console.error('Failed to load initial data:', err);
      setApiError(err.message || 'Failed to fetch catalog from backend');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Persist Orders to LocalStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ADMIN_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, [orders]);

  // Persist Customers to LocalStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ADMIN_CUSTOMERS_KEY, JSON.stringify(customers));
    } catch (e) {
      console.error('Failed to save customers', e);
    }
  }, [customers]);

  const persistCategories = (cats: Category[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_CATEGORIES_KEY, JSON.stringify(cats));
    } catch (e) {
      console.error('Failed to save categories', e);
    }
  };

  // Sync Cart & Wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist]);

  // Load initial remote cart for authenticated user or guest device
  useEffect(() => {
    if (products.length > 0) {
      fetchCartApi(products)
        .then((remoteItems) => {
          if (remoteItems && remoteItems.length > 0) {
            setCart(remoteItems);
          }
        })
        .catch(() => {});
    }
  }, [products]);

  // Load initial customer orders if token exists
  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchCustomerOrdersApi()
        .then((remoteOrders) => {
          if (remoteOrders && remoteOrders.length > 0) {
            setOrders((prev) => {
              const combined = [...remoteOrders, ...prev.filter((p) => !remoteOrders.some((r) => r.id === p.id))];
              return combined;
            });
          }
        })
        .catch(() => {});
    }
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product: Product, quantity = 1, selectedVolume?: string) => {
    const vol = selectedVolume || product.volumes?.[0] || 'Standard';

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVolume === vol
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedVolume: vol }];
    });

    showToast(`Added ${quantity}x ${product.name} to cart!`);

    if (localStorage.getItem('token')) {
      addToCartApi(product.id, quantity, vol).catch((err: any) => {
        if (err.message) showToast(err.message);
      });
    }
  };

  const removeFromCart = (productId: string, selectedVolume?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && (selectedVolume ? item.selectedVolume === selectedVolume : true))
      )
    );
    showToast('Item removed from cart');

    if (localStorage.getItem('token')) {
      removeCartItemApi(productId).catch((err: any) => {
        if (err.message) showToast(err.message);
      });
    }
  };

  const updateQuantity = (productId: string, delta: number, selectedVolume?: string) => {
    let shouldRemove = false;
    let targetNewQty = 1;

    setCart((prev) => {
      const targetItem = prev.find(
        (item) =>
          item.product.id === productId &&
          (!selectedVolume || item.selectedVolume === selectedVolume)
      );

      if (targetItem && targetItem.quantity + delta <= 0) {
        shouldRemove = true;
        return prev.filter(
          (item) =>
            !(
              item.product.id === productId &&
              (!selectedVolume || item.selectedVolume === selectedVolume)
            )
        );
      }

      return prev.map((item) => {
        if (
          item.product.id === productId &&
          (!selectedVolume || item.selectedVolume === selectedVolume)
        ) {
          const newQty = item.quantity + delta;
          targetNewQty = newQty;
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });

    if (shouldRemove) {
      showToast('Item removed from cart');
      if (localStorage.getItem('token')) {
        removeCartItemApi(productId).catch((err: any) => {
          if (err.message) showToast(err.message);
        });
      }
    } else if (localStorage.getItem('token')) {
      updateCartItemQuantityApi(productId, targetNewQty, selectedVolume).catch((err: any) => {
        if (err.message) showToast(err.message);
      });
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);

    if (localStorage.getItem('token')) {
      clearCartApi().catch((err: any) => {
        if (err.message) showToast(err.message);
      });
    }
  };

  const startInstantCheckout = (product: Product, quantity = 1, selectedVolume?: string) => {
    const vol = selectedVolume || product.volumes?.[0] || 'Standard';
    const item: CartItem = { product, quantity, selectedVolume: vol };
    setInstantCheckoutItem(item);
    try {
      sessionStorage.setItem(SESSION_STORAGE_INSTANT_KEY, JSON.stringify(item));
    } catch (e) {
      console.error('Failed to save instant checkout item', e);
    }
  };

  const clearInstantCheckout = () => {
    setInstantCheckoutItem(null);
    try {
      sessionStorage.removeItem(SESSION_STORAGE_INSTANT_KEY);
    } catch (e) {
      console.error('Failed to remove instant checkout item', e);
    }
  };

  const toggleWishlist = (productId: string | number) => {
    const targetId = String(productId);
    const exists = wishlist.some((id) => String(id) === targetId);
    const updated = exists ? wishlist.filter((id) => String(id) !== targetId) : [...wishlist, targetId];
    setWishlist(updated);
    showToast(exists ? 'Removed from Wishlist' : 'Added to Wishlist!');

    const token = localStorage.getItem('token');
    if (token && token !== 'mock-jwt-token-dev') {
      toggleWishlistApi(targetId).then((res) => {
        if (res?.productIds && Array.isArray(res.productIds)) {
          setWishlist(res.productIds.map(String));
        }
      }).catch((err: any) => {
        console.warn('Backend wishlist toggle sync error:', err);
      });
    }
  };

  const removeFromWishlist = (productId: string | number) => {
    const targetId = String(productId);
    setWishlist((prev) => prev.filter((id) => String(id) !== targetId));
    showToast('Removed from Wishlist');

    const token = localStorage.getItem('token');
    if (token && token !== 'mock-jwt-token-dev') {
      removeFromWishlistApi(targetId).then((res) => {
        if (res?.productIds && Array.isArray(res.productIds)) {
          setWishlist(res.productIds.map(String));
        }
      }).catch((err: any) => {
        console.warn('Backend wishlist remove sync error:', err);
      });
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared');

    const token = localStorage.getItem('token');
    if (token && token !== 'mock-jwt-token-dev') {
      clearWishlistApi().catch((err: any) => {
        console.warn('Backend wishlist clear sync error:', err);
      });
    }
  };

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SAVE10') {
      setAppliedCoupon({ code: 'SAVE10', discountType: 'percentage', value: 10 });
      showToast('Coupon SAVE10 applied! (10% OFF)');
      return true;
    } else if (cleanCode === 'WELCOME100') {
      setAppliedCoupon({ code: 'WELCOME100', discountType: 'flat', value: 100 });
      showToast('Coupon WELCOME100 applied! (₹100 OFF)');
      return true;
    } else {
      showToast('Invalid coupon code');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // ADMIN PRODUCT CRUD OPERATIONS
  const createProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...newProductData,
      id: `prod-${Date.now()}`
    };

    setProducts((prev) => {
      const updated = [newProd, ...prev];
      try {
        const savedCustomJson = localStorage.getItem(LOCAL_STORAGE_CUSTOM_PRODUCTS_KEY);
        const savedCustom: Product[] = savedCustomJson ? JSON.parse(savedCustomJson) : [];
        localStorage.setItem(LOCAL_STORAGE_CUSTOM_PRODUCTS_KEY, JSON.stringify([newProd, ...savedCustom]));
      } catch (e) {
        console.error('Failed to persist new product', e);
      }
      return updated;
    });

    if (localStorage.getItem('token')) {
      createProductApi(newProductData)
        .then((remoteProd) => {
          if (remoteProd && remoteProd.id) {
            setProducts((prev) => prev.map((p) => (p.id === newProd.id ? remoteProd : p)));
          }
        })
        .catch((err: any) => {
          if (err?.message) showToast(err.message);
        });
    }

    showToast('Product created successfully.');
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
      try {
        const savedCustomJson = localStorage.getItem(LOCAL_STORAGE_CUSTOM_PRODUCTS_KEY);
        const savedCustom: Product[] = savedCustomJson ? JSON.parse(savedCustomJson) : [];
        const existingIdx = savedCustom.findIndex((cp) => cp.id === id);
        let newCustom = [...savedCustom];
        const targetProd = updated.find((p) => p.id === id);
        if (targetProd) {
          if (existingIdx > -1) {
            newCustom[existingIdx] = targetProd;
          } else {
            newCustom.push(targetProd);
          }
          localStorage.setItem(LOCAL_STORAGE_CUSTOM_PRODUCTS_KEY, JSON.stringify(newCustom));
        }
      } catch (e) {
        console.error('Failed to persist product update', e);
      }
      return updated;
    });

    if (localStorage.getItem('token')) {
      updateProductApi(id, updatedFields).catch((err: any) => {
        if (err?.message) showToast(err.message);
      });
    }

    showToast('Product updated successfully.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        const deletedIdsJson = localStorage.getItem(LOCAL_STORAGE_DELETED_PRODUCTS_KEY);
        const deletedIds: string[] = deletedIdsJson ? JSON.parse(deletedIdsJson) : [];
        if (!deletedIds.includes(id)) {
          localStorage.setItem(LOCAL_STORAGE_DELETED_PRODUCTS_KEY, JSON.stringify([...deletedIds, id]));
        }
      } catch (e) {
        console.error('Failed to persist product deletion', e);
      }
      return updated;
    });

    if (localStorage.getItem('token')) {
      deleteProductApi(id).catch((err: any) => {
        if (err?.message) showToast(err.message);
      });
    }

    showToast('Product deleted successfully.');
  };

  // ADMIN CATEGORY CRUD OPERATIONS
  const getCategoryProductCount = (categoryId: string): number => {
    return products.filter((p) => p.categoryId === categoryId).length;
  };

  const createCategory = (newCategoryData: Omit<Category, 'id' | 'itemCount'>) => {
    const slug = newCategoryData.slug || newCategoryData.name.toLowerCase().replace(/\s+/g, '-');
    const newCat: Category = {
      ...newCategoryData,
      id: `cat-${slug}`,
      slug,
      status: newCategoryData.status || 'active',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    setCategories((prev) => {
      const updated = [...prev, newCat];
      persistCategories(updated);
      return updated;
    });

    if (localStorage.getItem('token')) {
      createCategoryApi(newCategoryData)
        .then((remoteCat) => {
          if (remoteCat && remoteCat.id) {
            setCategories((prev) => prev.map((c) => (c.id === newCat.id ? remoteCat : c)));
          }
        })
        .catch((err: any) => {
          if (err?.message) showToast(err.message);
        });
    }

    showToast('Category created successfully.');
  };

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
      persistCategories(updated);
      return updated;
    });

    if (localStorage.getItem('token')) {
      updateCategoryApi(id, updatedFields).catch((err: any) => {
        if (err?.message) showToast(err.message);
      });
    }

    showToast('Category updated successfully.');
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories((prev) => {
      const updated = prev.map((c) => {
        if (c.id === id) {
          const newStatus: 'active' | 'inactive' = c.status === 'inactive' ? 'active' : 'inactive';
          showToast(`Category status changed to ${newStatus}.`);
          if (localStorage.getItem('token')) {
            updateCategoryApi(id, { status: newStatus }).catch((err: any) => {
              if (err?.message) showToast(err.message);
            });
          }
          return { ...c, status: newStatus };
        }
        return c;
      });
      persistCategories(updated);
      return updated;
    });
  };

  const deleteCategory = (id: string): boolean => {
    const count = getCategoryProductCount(id);
    if (count > 0) {
      showToast(`Cannot delete category with ${count} assigned products.`);
      return false;
    }

    setCategories((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      persistCategories(updated);
      return updated;
    });

    if (localStorage.getItem('token')) {
      deleteCategoryApi(id).catch((err: any) => {
        if (err?.message) showToast(err.message);
      });
    }

    showToast('Category deleted successfully.');
    return true;
  };

  // ADMIN ORDER OPERATIONS WITH WORKFLOW & TRANSITION RULES
  const isValidOrderTransition = (current: OrderStatus, next: OrderStatus): boolean => {
    if (current === next) return true;
    if (current === 'Cancelled') return false;
    if (current === 'Delivered') return false;

    if (current === 'Pending') return next === 'Confirmed' || next === 'Cancelled';
    if (current === 'Confirmed') return next === 'Processing' || next === 'Cancelled';
    if (current === 'Processing') return next === 'Shipped' || next === 'Cancelled';
    if (current === 'Shipped') return next === 'Delivered';

    return false;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus): boolean => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return false;

    if (!isValidOrderTransition(targetOrder.status, newStatus)) {
      showToast('This order cannot move to this status.');
      return false;
    }

    const nowFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const isCOD = o.paymentMethod.toLowerCase().includes('cash');
          let updatedPayStatus = o.paymentStatus;
          if (newStatus === 'Delivered' && isCOD) {
            updatedPayStatus = 'Paid';
          } else if (newStatus === 'Cancelled' && o.paymentStatus === 'Paid') {
            updatedPayStatus = 'Refunded';
          }
          return {
            ...o,
            status: newStatus,
            paymentStatus: updatedPayStatus,
            updatedAt: nowFormatted
          };
        }
        return o;
      })
    );

    if (localStorage.getItem('token')) {
      updateOrderStatusApi(orderId, newStatus).catch((err: any) => {
        if (err?.message) showToast(err.message);
      });
    }

    showToast('Order status updated successfully.');
    return true;
  };

  const cancelOrder = (orderId: string): boolean => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return false;

    if (targetOrder.status === 'Cancelled') {
      showToast('Order is already cancelled.');
      return false;
    }

    if (targetOrder.status === 'Shipped' || targetOrder.status === 'Delivered') {
      showToast('Shipped or Delivered orders cannot be cancelled.');
      return false;
    }

    if (localStorage.getItem('token')) {
      cancelOrderApi(orderId).catch((err: any) => {
        if (err?.message) showToast(err.message);
      });
    }

    return updateOrderStatus(orderId, 'Cancelled');
  };

  const placeOrder = (newOrderData: Omit<Order, 'id'>): Order => {
    const newOrder: Order = {
      ...newOrderData,
      id: `#ORD-2026-00${125 + orders.length}`
    };

    setOrders((prev) => [newOrder, ...prev]);

    if (localStorage.getItem('token')) {
      createOrderApi({
        shippingAddress: newOrderData.shippingAddress,
        items: newOrderData.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        paymentMethod: newOrderData.paymentMethod,
        totalAmount: newOrderData.total
      }).then((createdRemoteOrder) => {
        if (createdRemoteOrder && createdRemoteOrder.id) {
          setOrders((prev) => prev.map((o) => (o.id === newOrder.id ? createdRemoteOrder : o)));
        }
      }).catch((err: any) => {
        if (err?.message) showToast(err.message);
      });
    }

    // Also ensure customer record exists or updates in customer store
    setCustomers((prev) => {
      const existing = prev.find((c) => c.email.toLowerCase() === newOrder.customer.email.toLowerCase());
      if (existing) {
        return prev;
      }
      const newCust: CustomerUser = {
        id: `cust-${Date.now()}`,
        name: newOrder.customer.name,
        email: newOrder.customer.email,
        phone: newOrder.customer.phone,
        status: 'active',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        addresses: [
          {
            id: `addr-${Date.now()}`,
            ...newOrder.shippingAddress,
            type: (newOrder.shippingAddress.type as 'HOME' | 'WORK' | 'OTHER') || 'HOME',
            isDefault: true
          }
        ]
      };
      return [newCust, ...prev];
    });

    return newOrder;
  };

  // ADMIN CUSTOMER OPERATIONS
  const toggleCustomerStatus = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newStatus: 'active' | 'blocked' = c.status === 'active' ? 'blocked' : 'active';
          showToast(`Customer account status changed to ${newStatus}.`);
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  const getCustomerOrders = (customerEmail: string): Order[] => {
    return orders.filter((o) => o.customer.email.toLowerCase() === customerEmail.toLowerCase());
  };

  const getCustomerStats = (customerEmail: string) => {
    const custOrders = getCustomerOrders(customerEmail);
    const validOrders = custOrders.filter((o) => o.status !== 'Cancelled');
    const totalOrders = custOrders.length;
    const totalSpent = validOrders.reduce((sum, o) => sum + o.total, 0);
    return { totalOrders, totalSpent };
  };

  // Calculations & Category Resolution with Derived Product Counts
  const categoriesWithDerivedCounts = categories.map((cat) => ({
    ...cat,
    itemCount: getCategoryProductCount(cat.id)
  }));

  const activeCategoriesWithDerivedCounts = categoriesWithDerivedCounts.filter(
    (c) => c.status !== 'inactive'
  );

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategoryId === 'all' || p.categoryId === selectedCategoryId;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const cartProductDiscount = cart.reduce((sum, item) => {
    const itemOriginal = item.product.originalPrice || item.product.price;
    const diff = Math.max(0, itemOriginal - item.product.price);
    return sum + diff * item.quantity;
  }, 0);

  const cartDeliveryFee = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 99;

  let couponDiscountAmount = 0;
  if (appliedCoupon && cartSubtotal > 0) {
    if (appliedCoupon.discountType === 'percentage') {
      couponDiscountAmount = Math.round((cartSubtotal * appliedCoupon.value) / 100);
    } else {
      couponDiscountAmount = Math.min(cartSubtotal, appliedCoupon.value);
    }
  }

  const cartFinalTotal = Math.max(0, cartSubtotal - couponDiscountAmount + cartDeliveryFee);

  return (
    <ShopContext.Provider
      value={{
        isLoading,
        apiError,
        refetchProducts: loadInitialData,
        categories: categoriesWithDerivedCounts,
        activeCategories: activeCategoriesWithDerivedCounts,
        selectedCategoryId,
        setSelectedCategoryId,
        products,
        filteredProducts,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        toastMessage,
        showToast,
        cartTotalCount,
        cartSubtotal,
        cartProductDiscount,
        cartDeliveryFee,
        appliedCoupon,
        couponDiscountAmount,
        cartFinalTotal,
        applyCoupon,
        removeCoupon,
        clearCart,
        instantCheckoutItem,
        startInstantCheckout,
        clearInstantCheckout,
        createProduct,
        updateProduct,
        deleteProduct,
        createCategory,
        updateCategory,
        deleteCategory,
        toggleCategoryStatus,
        getCategoryProductCount,
        orders,
        updateOrderStatus,
        cancelOrder,
        placeOrder,
        customers,
        toggleCustomerStatus,
        getCustomerOrders,
        getCustomerStats
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
