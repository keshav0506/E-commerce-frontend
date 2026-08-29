import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AccountPage } from './pages/AccountPage';

// Customer Support & Company Info Pages
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { FaqPage } from './pages/FaqPage';
import { ShippingInfoPage } from './pages/ShippingInfoPage';
import { ReturnsPage } from './pages/ReturnsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

// Supplier Imports
import { SupplierRoute } from './components/SupplierRoute';
import { SupplierLayout } from './components/SupplierLayout';
import { SupplierDashboard } from './pages/supplier/SupplierDashboard';
import { SupplierProductsPage } from './pages/supplier/SupplierProductsPage';
import { SupplierAddProductPage } from './pages/supplier/SupplierAddProductPage';
import { SupplierEditProductPage } from './pages/supplier/SupplierEditProductPage';
import { SupplierPurchaseOrdersPage } from './pages/supplier/SupplierPurchaseOrdersPage';
import { SupplierPurchaseOrderDetailPage } from './pages/supplier/SupplierPurchaseOrderDetailPage';
import { SupplierShipmentsPage } from './pages/supplier/SupplierShipmentsPage';
import { SupplierInvoicesPage } from './pages/supplier/SupplierInvoicesPage';
import { SupplierProfilePage } from './pages/supplier/SupplierProfilePage';
import { SupplierApplyPage } from './pages/supplier/SupplierApplyPage';
import { SupplierStorefrontPage } from './pages/SupplierStorefrontPage';

// Admin Imports
import { AdminRoute } from './components/AdminRoute';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminAddProductPage } from './pages/admin/AdminAddProductPage';
import { AdminEditProductPage } from './pages/admin/AdminEditProductPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminAddCategoryPage } from './pages/admin/AdminAddCategoryPage';
import { AdminEditCategoryPage } from './pages/admin/AdminEditCategoryPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminOrderDetailsPage } from './pages/admin/AdminOrderDetailsPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCustomerDetailsPage } from './pages/admin/AdminCustomerDetailsPage';
import { AdminSuppliersPage } from './pages/admin/AdminSuppliersPage';
import { AdminPurchaseOrdersPage } from './pages/admin/AdminPurchaseOrdersPage';

import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastNotification } from './components/ToastNotification';
import { ScrollToTop } from './components/ScrollToTop';

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ShopProvider>
          <div className="min-h-screen flex flex-col bg-[#fcfcfc] text-gray-900 font-sans selection:bg-rose-500 selection:text-white">
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
                    </div>
                    <Footer />
                  </div>
                }
              />
            </Routes>

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
