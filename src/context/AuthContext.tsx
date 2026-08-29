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
  login: (email: string, pass: string) => Promise<boolean>;
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
    if (!isFirebaseConfigured()) {
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

  const login = async (email: string, pass: string): Promise<boolean> => {
    if (isFirebaseConfigured()) {
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
      } catch (err: any) {
        console.error('Firebase login error:', err);
        throw new Error(formatFirebaseAuthError(err));
      }
    }

    // Direct Spring Boot fallback
    try {
      const { user: resUser } = await loginApi({ email, password: pass });
      setUser(resUser);
      return true;
    } catch (err: any) {
      console.warn('Real backend login failed, trying fallback mock login if network error:', err);
      if (err.name === 'TypeError' || err.status === 0 || err.message?.includes('fetch')) {
        const parts = email.split('@')[0].split('.');
        const fName = parts[0] || 'User';
        const lName = parts[1] || '';
        const mockUser: UserProfile = {
          ...DEFAULT_MOCK_USER,
          id: `usr-${Date.now()}`,
          firstName: fName.charAt(0).toUpperCase() + fName.slice(1),
          lastName: lName ? lName.charAt(0).toUpperCase() + lName.slice(1) : '',
          name: `${fName} ${lName}`.trim(),
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
    if (isFirebaseConfigured()) {
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
    if (!isFirebaseConfigured()) {
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
      if (isFirebaseConfigured()) {
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
        loading,
        isLoggedIn: !!user,
        isAdmin,
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
