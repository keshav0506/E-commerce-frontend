import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { formatFirebaseAuthError } from '../lib/firebaseErrors';
import { loginApi, registerApi, firebaseSyncApi } from '../services/authService';
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
  firebaseUid?: string;
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
  loading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isSupplier: boolean;
  login: (email: string, pass: string, requestedRole?: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
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

  const isAdmin = Boolean(
    user && (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN')
  );

  const isSupplier = Boolean(
    user && (userRole === 'SUPPLIER' || userRole === 'ROLE_SUPPLIER')
  );

  // Sync state to local storage
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

  // Firebase onAuthStateChanged listener to persist across refreshes
  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          localStorage.setItem('token', idToken);
          const { user: syncedUser } = await firebaseSyncApi({
            idToken,
            name: firebaseUser.displayName || undefined,
            email: firebaseUser.email || undefined
          });
          setUser(syncedUser);
        } catch (err) {
          console.warn('Backend Firebase sync error during state restore:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string, requestedRole?: string): Promise<boolean> => {
    // 1. Direct Spring Boot Multi-Role Authentication with zero-trust role verification
    try {
      const { user: resUser } = await loginApi({ email, password: pass, role: requestedRole });
      setUser(resUser);
      return true;
    } catch (err: any) {
      // If backend threw an explicit error (invalid credentials, wrong role, pending approval), bubble it up
      if (err?.message && !err.message.includes('fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }

      // 2. Firebase authentication fallback for Customers if backend network offline
      if (isFirebaseConfigured() && auth && (!requestedRole || requestedRole.toUpperCase() === 'CUSTOMER')) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, pass);
          const idToken = await userCredential.user.getIdToken();
          localStorage.setItem('token', idToken);

          const { user: resUser } = await firebaseSyncApi({
            idToken,
            email: userCredential.user.email || email,
            name: userCredential.user.displayName || undefined
          });
          setUser(resUser);
          return true;
        } catch (firebaseErr: any) {
          console.error('Firebase login error:', firebaseErr);
          throw new Error(formatFirebaseAuthError(firebaseErr));
        }
      }
      throw err;
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    if (isFirebaseConfigured() && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await updateFirebaseProfile(userCredential.user, { displayName: name });
        const idToken = await userCredential.user.getIdToken();
        localStorage.setItem('token', idToken);

        const { user: resUser } = await firebaseSyncApi({
          idToken,
          email: userCredential.user.email || email,
          name
        });
        setUser(resUser);
        return true;
      } catch (err: any) {
        console.error('Firebase register error:', err);
        throw new Error(formatFirebaseAuthError(err));
      }
    }

    // Direct Spring Boot fallback
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

  const loginWithGoogle = async (): Promise<boolean> => {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error('Firebase credentials are not configured in .env.local yet. Please configure Firebase to use Google Sign-In.');
    }

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('token', idToken);

      const { user: resUser } = await firebaseSyncApi({
        idToken,
        email: userCredential.user.email || undefined,
        name: userCredential.user.displayName || undefined
      });
      setUser(resUser);
      return true;
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      throw new Error(formatFirebaseAuthError(err));
    }
  };

  const logout = async () => {
    try {
      if (isFirebaseConfigured() && auth) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn('Firebase signOut error:', e);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
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

  // Fetch remote addresses if token exists and user is loaded
  useEffect(() => {
    if (!loading && user && localStorage.getItem('token')) {
      fetchAddressesApi()
        .then((remoteAddrs) => {
          if (remoteAddrs && Array.isArray(remoteAddrs)) {
            setUser((prev) => (prev ? { ...prev, addresses: remoteAddrs } : null));
          }
        })
        .catch(() => {});
    }
  }, [loading, user?.id]);

  const addAddress = async (addressData: Omit<UserAddress, 'id'>) => {
    const isFirst = !user || !user.addresses || user.addresses.length === 0;
    const isDef = isFirst ? true : Boolean(addressData.isDefault);

    const tempAddr: UserAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
      isDefault: isDef
    };

    setUser((prev) => {
      if (!prev) return null;
      const prevList = prev.addresses || [];
      const sanitized = isDef
        ? prevList.map((a) => ({ ...a, isDefault: false }))
        : [...prevList];
      return { ...prev, addresses: [...sanitized, tempAddr] };
    });

    if (localStorage.getItem('token')) {
      try {
        const resAddr = await createAddressApi({ ...addressData, isDefault: isDef });
        if (resAddr && resAddr.id) {
          setUser((prev) => {
            if (!prev) return null;
            const updated = (prev.addresses || []).map((a) => (a.id === tempAddr.id ? resAddr : a));
            return { ...prev, addresses: updated };
          });
        }
      } catch (err) {
        console.warn('Backend address sync error, kept in local state:', err);
      }
    }
  };

  const updateAddress = async (id: string, updatedFields: Partial<UserAddress>) => {
    setUser((prev) => {
      if (!prev) return null;
      let updatedList = (prev.addresses || []).map((a) => {
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
      try {
        await updateAddressApi(id, updatedFields);
      } catch (err) {
        console.warn('Backend address update error:', err);
      }
    }
  };

  const deleteAddress = async (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const wasDefault = (prev.addresses || []).find((a) => a.id === id)?.isDefault;
      const remaining = (prev.addresses || []).filter((a) => a.id !== id);

      if (wasDefault && remaining.length > 0) {
        remaining[0].isDefault = true;
      }

      return { ...prev, addresses: remaining };
    });

    if (localStorage.getItem('token')) {
      try {
        await deleteAddressApi(id);
      } catch (err) {
        console.warn('Backend address delete error:', err);
      }
    }
  };

  const setDefaultAddress = async (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = (prev.addresses || []).map((a) => ({
        ...a,
        isDefault: a.id === id
      }));
      return { ...prev, addresses: updated };
    });

    if (localStorage.getItem('token')) {
      try {
        await setDefaultAddressApi(id);
      } catch (err) {
        console.warn('Backend setDefaultAddress error:', err);
      }
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
        loading,
        isLoggedIn: !!user,
        isAdmin,
        isSupplier,
        login,
        register,
        loginWithGoogle,
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
