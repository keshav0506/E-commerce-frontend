import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface SupplierRouteProps {
  children: React.ReactNode;
}

export const SupplierRoute: React.FC<SupplierRouteProps> = ({ children }) => {
  const { user, loading, isSupplier, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-sm font-medium text-slate-300">Authenticating Supplier Portal...</p>
        </div>
      </div>
    );
  }

  if (!user || (!isSupplier && !isAdmin)) {
    return <Navigate to="/login?role=supplier" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};
