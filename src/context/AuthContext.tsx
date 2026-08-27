import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi } from '../services/authService';
import { fetchAddressesApi, createAddressApi, updateAddressApi, deleteAddressApi, setDefaultAddressApi } from '../services/addressService';

export interface UserAddress {
  id: string;
  type: 'HOME' | 'WORK' | 'OTHER';
  fullName: string;
  phone: string;
  house: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface UserPreferences {
  emailNotifications: boolean;
  orderUpdates: boolean;
  promotionalEmails: boolean;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  avatar?: string;
  addresses: UserAddress[];
  preferences: UserPreferences;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  updateAddress: (id: string, address: Partial<UserAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

const LOCAL_STORAGE_USER_KEY = 'shoply_user';

const DEFAULT_MOCK_USER: UserProfile = {
  id: 'usr-101',
  firstName: 'Keshav',
  lastName: 'Khandelwal',
  name: 'Keshav Khandelwal',
  email: 'keshav@example.com',
  phone: '9876543210',
  addresses: [
    {
      id: 'addr-1',
      type: 'HOME',
      fullName: 'Keshav Khandelwal',
      phone: '9876543210',
      house: 'Flat 402, Block B',
      street: '123 Prime Heights, Green Park',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      isDefault: true
    },
    {
      id: 'addr-2',
      type: 'WORK',
      fullName: 'Keshav Khandelwal',
      phone: '9876543210',
      house: 'Suite 601, Cyber Tower',
      street: 'DLF Phase 3, MG Road',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      isDefault: false
    }
  ],
  preferences: {
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false
  }
};

function getRoleFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload.role || (Array.isArray(payload.roles) ? payload.roles[0] : null);
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      // Only restore user if a real JWT token exists
      const token = localStorage.getItem('token');
      if (!token || token === 'mock-jwt-token-dev') {
        // No valid token - clear stale user and start as logged out
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        localStorage.removeItem('token');
        return null;
      }
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (!saved) return null;
      const parsedUser = JSON.parse(saved);
      const tokenRole = getRoleFromToken(token);
      if (tokenRole) {
        parsedUser.role = tokenRole.toUpperCase();
      }
      return parsedUser;
    } catch {
      return null;
    }
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const tokenRole = getRoleFromToken(token)?.toUpperCase();
  const userRole = (user?.role || tokenRole || '').toUpperCase();

  // Strict verification: user object AND valid backend JWT token must both have ADMIN role
  const isAdmin = Boolean(
    user &&
    (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') &&
    (tokenRole === 'ADMIN' || tokenRole === 'ROLE_ADMIN')
  );

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
    } catch (e) {
      console.error('Failed to sync auth state', e);
    }
  }, [user]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const { user: resUser } = await loginApi({ email, password: pass });
      setUser(resUser);
      return true;
    } catch (err: any) {
      console.warn('Real backend login failed, trying fallback mock login if network error:', err);
      // If network error/unreachable backend, allow login for dev verification
      if (err.name === 'TypeError' || err.status === 0 || err.message?.includes('fetch')) {
        const parts = email.split('@')[0].split('.');
        const fName = parts[0] || 'Keshav';
        const lName = parts[1] || 'Khandelwal';
        const mockUser: UserProfile = {
          ...DEFAULT_MOCK_USER,
          id: `usr-${Date.now()}`,
          firstName: fName.charAt(0).toUpperCase() + fName.slice(1),
          lastName: lName.charAt(0).toUpperCase() + lName.slice(1),
          name: `${fName} ${lName}`,
          email
        };
        setUser(mockUser);
        localStorage.setItem('token', 'mock-jwt-token-dev');
        return true;
      }
      throw err;
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      const { user: resUser } = await registerApi({ name, email, password: pass });
      setUser(resUser);
      return true;
    } catch (err: any) {
      console.warn('Real backend register failed, trying fallback mock register if network error:', err);
      if (err.name === 'TypeError' || err.status === 0 || err.message?.includes('fetch')) {
        const nameParts = name.trim().split(' ');
        const fName = nameParts[0] || 'User';
        const lName = nameParts.slice(1).join(' ') || '';
        const mockUser: UserProfile = {
          ...DEFAULT_MOCK_USER,
          id: `usr-${Date.now()}`,
          firstName: fName,
          lastName: lName,
          name,
          email
        };
        setUser(mockUser);
        localStorage.setItem('token', 'mock-jwt-token-dev');
        return true;
      }
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return null;
      const fName = updated.firstName !== undefined ? updated.firstName : prev.firstName;
      const lName = updated.lastName !== undefined ? updated.lastName : prev.lastName;
      return {
        ...prev,
        ...updated,
        name: `${fName} ${lName}`.trim()
      };
    });
  };

  // Fetch remote addresses if token exists
  useEffect(() => {
    if (localStorage.getItem('token') && user) {
      fetchAddressesApi()
        .then((remoteAddrs) => {
          if (remoteAddrs && remoteAddrs.length > 0) {
            setUser((prev) => (prev ? { ...prev, addresses: remoteAddrs } : null));
          }
        })
        .catch(() => {});
    }
  }, []);

  const addAddress = (addressData: Omit<UserAddress, 'id'>) => {
    if (!user) return;
    const newAddr: UserAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
      isDefault: user.addresses.length === 0 ? true : addressData.isDefault || false
    };

    setUser((prev) => {
      if (!prev) return null;
      let updatedAddresses = [...prev.addresses];
      if (newAddr.isDefault) {
        updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
      }
      return { ...prev, addresses: [...updatedAddresses, newAddr] };
    });

    if (localStorage.getItem('token')) {
      createAddressApi(addressData).then((resAddr) => {
        if (resAddr && resAddr.id) {
          setUser((prev) => {
            if (!prev) return null;
            const updated = prev.addresses.map((a) => (a.id === newAddr.id ? resAddr : a));
            return { ...prev, addresses: updated };
          });
        }
      }).catch(() => {});
    }
  };

  const updateAddress = (id: string, updatedFields: Partial<UserAddress>) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return null;
      let updatedList = prev.addresses.map((a) => {
        if (a.id === id) {
          return { ...a, ...updatedFields };
        }
        return a;
      });

      if (updatedFields.isDefault) {
        updatedList = updatedList.map((a) => ({ ...a, isDefault: a.id === id }));
      }

      return { ...prev, addresses: updatedList };
    });

    if (localStorage.getItem('token')) {
      updateAddressApi(id, updatedFields).catch(() => {});
    }
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return null;
      const wasDefault = prev.addresses.find((a) => a.id === id)?.isDefault;
      const remaining = prev.addresses.filter((a) => a.id !== id);

      if (wasDefault && remaining.length > 0) {
        remaining[0].isDefault = true;
      }

      return { ...prev, addresses: remaining };
    });

    if (localStorage.getItem('token')) {
      deleteAddressApi(id).catch(() => {});
    }
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return null;
      const updated = prev.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id
      }));
      return { ...prev, addresses: updated };
    });

    if (localStorage.getItem('token')) {
      setDefaultAddressApi(id).catch(() => {});
    }
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          ...prefs
        }
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        updatePreferences
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
