import React, { createContext, useContext, useState, useEffect } from 'react';

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
  avatar?: string;
  addresses: UserAddress[];
  preferences: UserPreferences;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_MOCK_USER;
    } catch {
      return DEFAULT_MOCK_USER;
    }
  });

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

  const login = async (email: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
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
        resolve(true);
      }, 800);
    });
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
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
        resolve(true);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
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
