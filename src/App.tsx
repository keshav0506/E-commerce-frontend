import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastNotification } from './components/ToastNotification';
import { ScrollToTop } from './components/ScrollToTop';
import { Loader2 } from 'lucide-react';

// Helper for lazy loading named exports
function lazyNamed<T extends Record<string, React.ComponentType<any>>, K extends keyof T>(
  loader: () => Promise<T>,
  name: K
) {
  return lazy(() => loader().then((m) => ({ default: m[name] })));
}

// Lazy-loaded customer storefront pages
const HomePage = lazyNamed(() => import('./pages/HomePage'), 'HomePage');
const ProductsPage = lazyNamed(() => import('./pages/ProductsPage'), 'ProductsPage');
const ProductDetailPage = lazyNamed(() => import('./pages/ProductDetailPage'), 'ProductDetailPage');
const CartPage = lazyNamed(() => import('./pages/CartPage'), 'CartPage');
const WishlistPage = lazyNamed(() => import('./pages/WishlistPage'), 'WishlistPage');
const LoginPage = lazyNamed(() => import('./pages/LoginPage'), 'LoginPage');
const RegisterPage = lazyNamed(() => import('./pages/RegisterPage'), 'RegisterPage');
const ForgotPasswordPage = lazyNamed(() => import('./pages/ForgotPasswordPage'), 'ForgotPasswordPage');
const ResetPasswordPage = lazyNamed(() => import('./pages/ResetPasswordPage'), 'ResetPasswordPage');
const CheckoutPage = lazyNamed(() => import('./pages/CheckoutPage'), 'CheckoutPage');
const OrderSuccessPage = lazyNamed(() => import('./pages/OrderSuccessPage'), 'OrderSuccessPage');
const AccountPage = lazyNamed(() => import('./pages/AccountPage'), 'AccountPage');
const SupplierStorefrontPage = lazyNamed(() => import('./pages/SupplierStorefrontPage'), 'SupplierStorefrontPage');

// Customer Support & Info Pages
const ContactPage = lazyNamed(() => import('./pages/ContactPage'), 'ContactPage');
const AboutPage = lazyNamed(() => import('./pages/AboutPage'), 'AboutPage');
const FaqPage = lazyNamed(() => import('./pages/FaqPage'), 'FaqPage');
const ShippingInfoPage = lazyNamed(() => import('./pages/ShippingInfoPage'), 'ShippingInfoPage');
const ReturnsPage = lazyNamed(() => import('./pages/ReturnsPage'), 'ReturnsPage');
const PrivacyPolicyPage = lazyNamed(() => import('./pages/PrivacyPolicyPage'), 'PrivacyPolicyPage');
const TermsPage = lazyNamed(() => import('./pages/TermsPage'), 'TermsPage');

// Supplier Portal Pages
const SupplierRoute = lazyNamed(() => import('./components/SupplierRoute'), 'SupplierRoute');
const SupplierLayout = lazyNamed(() => import('./components/SupplierLayout'), 'SupplierLayout');
const SupplierDashboard = lazyNamed(() => import('./pages/supplier/SupplierDashboard'), 'SupplierDashboard');
const SupplierProductsPage = lazyNamed(() => import('./pages/supplier/SupplierProductsPage'), 'SupplierProductsPage');
const SupplierAddProductPage = lazyNamed(() => import('./pages/supplier/SupplierAddProductPage'), 'SupplierAddProductPage');
const SupplierEditProductPage = lazyNamed(() => import('./pages/supplier/SupplierEditProductPage'), 'SupplierEditProductPage');
const SupplierPurchaseOrdersPage = lazyNamed(() => import('./pages/supplier/SupplierPurchaseOrdersPage'), 'SupplierPurchaseOrdersPage');
const SupplierPurchaseOrderDetailPage = lazyNamed(() => import('./pages/supplier/SupplierPurchaseOrderDetailPage'), 'SupplierPurchaseOrderDetailPage');
const SupplierShipmentsPage = lazyNamed(() => import('./pages/supplier/SupplierShipmentsPage'), 'SupplierShipmentsPage');
const SupplierInvoicesPage = lazyNamed(() => import('./pages/supplier/SupplierInvoicesPage'), 'SupplierInvoicesPage');
const SupplierProfilePage = lazyNamed(() => import('./pages/supplier/SupplierProfilePage'), 'SupplierProfilePage');
const SupplierApplyPage = lazyNamed(() => import('./pages/supplier/SupplierApplyPage'), 'SupplierApplyPage');

// Admin Portal Pages
const AdminRoute = lazyNamed(() => import('./components/AdminRoute'), 'AdminRoute');
const AdminLayout = lazyNamed(() => import('./components/AdminLayout'), 'AdminLayout');
const AdminDashboard = lazyNamed(() => import('./pages/admin/AdminDashboard'), 'AdminDashboard');
const AdminProductsPage = lazyNamed(() => import('./pages/admin/AdminProductsPage'), 'AdminProductsPage');
const AdminAddProductPage = lazyNamed(() => import('./pages/admin/AdminAddProductPage'), 'AdminAddProductPage');
const AdminEditProductPage = lazyNamed(() => import('./pages/admin/AdminEditProductPage'), 'AdminEditProductPage');
const AdminCategoriesPage = lazyNamed(() => import('./pages/admin/AdminCategoriesPage'), 'AdminCategoriesPage');
const AdminAddCategoryPage = lazyNamed(() => import('./pages/admin/AdminAddCategoryPage'), 'AdminAddCategoryPage');
const AdminEditCategoryPage = lazyNamed(() => import('./pages/admin/AdminEditCategoryPage'), 'AdminEditCategoryPage');
const AdminOrdersPage = lazyNamed(() => import('./pages/admin/AdminOrdersPage'), 'AdminOrdersPage');
const AdminOrderDetailsPage = lazyNamed(() => import('./pages/admin/AdminOrderDetailsPage'), 'AdminOrderDetailsPage');
const AdminCustomersPage = lazyNamed(() => import('./pages/admin/AdminCustomersPage'), 'AdminCustomersPage');
const AdminCustomerDetailsPage = lazyNamed(() => import('./pages/admin/AdminCustomerDetailsPage'), 'AdminCustomerDetailsPage');
const AdminSuppliersPage = lazyNamed(() => import('./pages/admin/AdminSuppliersPage'), 'AdminSuppliersPage');
const AdminPurchaseOrdersPage = lazyNamed(() => import('./pages/admin/AdminPurchaseOrdersPage'), 'AdminPurchaseOrdersPage');

// Page Loading Suspense Fallback
const PageFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4" role="status" aria-live="polite">
    <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
    <span className="sr-only">Loading page content...</span>
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ShopProvider>
          <div className="min-h-screen flex flex-col bg-[#fcfcfc] text-gray-900 font-sans selection:bg-rose-500 selection:text-white">
            <Suspense fallback={<PageFallback />}>
              <Routes>
                {/* SUPPLIER ONBOARDING (PUBLIC FORM) */}
                <Route path="/supplier/apply" element={<SupplierApplyPage />} />

                {/* SUPPLIER PORTAL (PROTECTED BY SUPPLIER ROUTE GUARD) */}
                <Route
                  path="/supplier"
                  element={
                    <SupplierRoute>
                      <SupplierLayout />
                    </SupplierRoute>
                  }
                >
                  <Route index element={<SupplierDashboard />} />
                  <Route path="products" element={<SupplierProductsPage />} />
                  <Route path="products/new" element={<SupplierAddProductPage />} />
                  <Route path="products/:id/edit" element={<SupplierEditProductPage />} />
                  <Route path="purchase-orders" element={<SupplierPurchaseOrdersPage />} />
                  <Route path="purchase-orders/:id" element={<SupplierPurchaseOrderDetailPage />} />
                  <Route path="shipments" element={<SupplierShipmentsPage />} />
                  <Route path="invoices" element={<SupplierInvoicesPage />} />
                  <Route path="profile" element={<SupplierProfilePage />} />
                </Route>

                {/* ADMIN ROUTES (PROTECTED BY ADMIN ROUTE GUARD) */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="products/new" element={<AdminAddProductPage />} />
                  <Route path="products/:id/edit" element={<AdminEditProductPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="categories/new" element={<AdminAddCategoryPage />} />
                  <Route path="categories/:id/edit" element={<AdminEditCategoryPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                  <Route path="customers/:id" element={<AdminCustomerDetailsPage />} />
                  <Route path="suppliers" element={<AdminSuppliersPage />} />
                  <Route path="purchase-orders" element={<AdminPurchaseOrdersPage />} />
                </Route>

                {/* CUSTOMER STOREFRONT ROUTES (WITH PERSISTENT NAVBAR & FOOTER) */}
                <Route
                  path="*"
                  element={
                    <div className="flex-1 flex flex-col min-h-screen">
                      <Navbar />
                      <div className="flex-1">
                        <Suspense fallback={<PageFallback />}>
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/products" element={<ProductsPage />} />
                            <Route path="/products/:id" element={<ProductDetailPage />} />
                            <Route path="/supplier-store/:id" element={<SupplierStorefrontPage />} />
                            <Route path="/suppliers/:id/products" element={<SupplierStorefrontPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/wishlist" element={<WishlistPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/order-success" element={<OrderSuccessPage />} />
                            <Route path="/account" element={<AccountPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/reset-password" element={<ResetPasswordPage />} />

                            {/* Customer Support & Information Routes */}
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/faq" element={<FaqPage />} />
                            <Route path="/shipping" element={<ShippingInfoPage />} />
                            <Route path="/returns" element={<ReturnsPage />} />
                            <Route path="/privacy" element={<PrivacyPolicyPage />} />
                            <Route path="/terms" element={<TermsPage />} />
                          </Routes>
                        </Suspense>
                      </div>
                      <Footer />
                    </div>
                  }
                />
              </Routes>
            </Suspense>

            {/* Global Drawers, Modals & Toast */}
            <CartDrawer />
            <QuickViewModal />
            <ToastNotification />
          </div>
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
