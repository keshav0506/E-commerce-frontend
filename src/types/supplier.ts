export type Role = 'CUSTOMER' | 'SUPPLIER' | 'ADMIN';

export type SupplierStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export type PurchaseOrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';

export interface SupplierProfile {
  id: number;
  userId: number;
  name: string;
  email: string;
  businessName: string;
  businessEmail: string;
  phone: string;
  businessAddress: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  taxIdentifier: string;
  category: string;
  status: SupplierStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierApplyRequest {
  name: string;
  email: string;
  password: string;
  businessName: string;
  businessEmail: string;
  phone: string;
  businessAddress: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  taxIdentifier: string;
  category?: string;
}

export interface PurchaseOrderItem {
  id: number;
  productId: number;
  productName: string;
  productSku?: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplierId: number;
  supplierBusinessName: string;
  supplierEmail: string;
  status: PurchaseOrderStatus;
  orderDate: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  totalAmount: number;
  shippingCarrier?: string;
  trackingNumber?: string;
  supplierNotes?: string;
  rejectionReason?: string;
  totalItemsCount: number;
  items: PurchaseOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface SupplierNotification {
  id: number;
  supplierId: number;
  title: string;
  message: string;
  type: string;
  targetUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SupplierDashboardMetrics {
  pendingOrders: number;
  acceptedOrders: number;
  ordersToShip: number;
  inTransit: number;
  completedSupplies: number;
  rejectedOrders: number;
  totalPurchaseOrders: number;
  totalRevenue: number;
  onTimeDeliveryRate: number;
  fulfillmentRate: number;
  recentPurchaseOrders: PurchaseOrder[];
  recentNotifications: SupplierNotification[];
}
