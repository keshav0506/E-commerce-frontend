import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

interface AdminRouteProps {
  children?: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isLoggedIn, isAdmin } = useAuth();
  const { showToast } = useShop();
  const location = useLocation();
  const toastFired = useRef(false);

  useEffect(() => {
    if (!toastFired.current) {
      if (!isLoggedIn) {
        showToast('Please log in with an Admin account to access the Admin Panel.');
        toastFired.current = true;
      } else if (!isAdmin) {
        showToast('Access Denied: You do not have administrator permissions.');
        toastFired.current = true;
      }
    }
  }, [isLoggedIn, isAdmin, showToast]);

  if (!isLoggedIn) {
    // Redirect unauthenticated visitors to login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAdmin) {
    // Redirect regular customers back to the storefront home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
