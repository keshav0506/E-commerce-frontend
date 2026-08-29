import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  Check,
  X,
  Edit2,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Camera,
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserAddress } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { changePasswordApi } from '../services/authService';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    isLoggedIn,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    updatePreferences
  } = useAuth();
  const { showToast, orders } = useShop();

  // Guard: Redirect to /login if not logged in
  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate('/login');
    }
  }, [isLoggedIn, user, navigate]);

  // Active Tab: 'profile' | 'addresses' | 'orders' | 'settings'
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'settings'>('profile');

  // Avatar Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Filter orders for the active user
  const userOrders = (orders || []).filter(
    (o) => !user?.email || o.customer?.email?.toLowerCase() === user.email.toLowerCase() || !o.customer?.email
  );

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be under 5MB.');
      return;
    }

    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      updateProfile({ avatar: base64 });
      setIsUploadingPhoto(false);
      showToast('Profile picture updated successfully!');
    };
    reader.onerror = () => {
      setIsUploadingPhoto(false);
      showToast('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  // Logout Modal State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // EDIT PROFILE STATE
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [profileErrors, setProfileErrors] = useState<{ [key: string]: string }>({});

  // ADDRESS FORM STATE (Add or Edit)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrType, setAddrType] = useState<'HOME' | 'WORK' | 'OTHER'>('HOME');
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrHouse, setAddrHouse] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);
  const [addressErrors, setAddressErrors] = useState<{ [key: string]: string }>({});

  // DELETE ADDRESS CONFIRMATION STATE
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);

  // CHANGE PASSWORD STATE
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string }>({});

  if (!user) return null;

  // Init Profile Form
  const handleOpenEditProfile = () => {
    setEditFirstName(user.firstName);
    setEditLastName(user.lastName);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setProfileErrors({});
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!editFirstName.trim()) errors.firstName = 'First name is required.';
    if (!editLastName.trim()) errors.lastName = 'Last name is required.';
    if (!editEmail.trim() || !/\S+@\S+\.\S+/.test(editEmail)) errors.email = 'Valid email is required.';
    if (!editPhone.trim() || editPhone.length < 10) errors.phone = 'Valid 10-digit phone number is required.';

    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;

    updateProfile({
      firstName: editFirstName.trim(),
      lastName: editLastName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim()
    });

    setIsEditingProfile(false);
    showToast('Profile updated successfully.');
  };

  // Init Address Form (Add or Edit)
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrType('HOME');
    setAddrName(user.name);
    setAddrPhone(user.phone);
    setAddrHouse('');
    setAddrStreet('');
    setAddrCity('');
    setAddrState('');
    setAddrPincode('');
    setAddrIsDefault(user.addresses.length === 0);
    setAddressErrors({});
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: UserAddress) => {
    setEditingAddressId(addr.id);
    setAddrType(addr.type);
    setAddrName(addr.fullName);
    setAddrPhone(addr.phone);
    setAddrHouse(addr.house);
    setAddrStreet(addr.street);
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrPincode(addr.pincode);
    setAddrIsDefault(addr.isDefault || false);
    setAddressErrors({});
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!addrName.trim()) errors.name = 'Full name is required.';
    if (!addrPhone.trim() || addrPhone.length < 10) errors.phone = 'Valid 10-digit phone number is required.';
    if (!addrHouse.trim()) errors.house = 'House/Flat is required.';
    if (!addrCity.trim()) errors.city = 'City is required.';
    if (!addrPincode.trim() || addrPincode.length !== 6 || isNaN(Number(addrPincode))) {
      errors.pincode = 'Valid 6-digit pincode is required.';
    }

    setAddressErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (editingAddressId) {
      updateAddress(editingAddressId, {
        type: addrType,
        fullName: addrName.trim(),
        phone: addrPhone.trim(),
        house: addrHouse.trim(),
        street: addrStreet.trim(),
        city: addrCity.trim(),
        state: addrState.trim(),
        pincode: addrPincode.trim(),
        isDefault: addrIsDefault
      });
      showToast('Address updated successfully.');
    } else {
      addAddress({
        type: addrType,
        fullName: addrName.trim(),
        phone: addrPhone.trim(),
        house: addrHouse.trim(),
        street: addrStreet.trim(),
        city: addrCity.trim(),
        state: addrState.trim(),
        pincode: addrPincode.trim(),
        isDefault: addrIsDefault
      });
      showToast('Address added successfully.');
    }

    setIsAddressModalOpen(false);
  };

  const handleDeleteAddressConfirm = (id: string) => {
    deleteAddress(id);
    setDeletingAddressId(null);
    showToast('Address removed.');
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddress(id);
    showToast('Default address updated.');
  };

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Change Password Submit
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!currentPassword) errors.current = 'Current password is required.';
    if (!newPassword || newPassword.length < 6) {
      errors.new = 'Must be at least 6 characters.';
    }
    if (newPassword !== confirmNewPassword) {
      errors.confirm = 'Passwords do not match.';
    }

    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setIsChangingPassword(true);
      const res = await changePasswordApi({
        currentPassword,
        newPassword
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      showToast(res.message || 'Password updated successfully.');
    } catch (err: any) {
      setPasswordErrors({ current: err.message || 'Failed to update password. Please check your current password.' });
      showToast(err.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    showToast('Logged out successfully.');
    navigate('/login');
  };

  // Get Initials for Avatar
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-medium text-gray-500 mb-4">
          <Link to="/" className="hover:text-rose-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-semibold">My Account</span>
        </nav>

        {/* ACCOUNT HEADER */}
        <div className="pb-6 border-b border-gray-100 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                My Account
              </h1>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                Verified Member
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Manage your profile, addresses and account preferences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
              Welcome back, {user.firstName}!
            </span>
          </div>
        </div>

        {/* MOBILE SECTION TABS (Pills Bar) */}
        <div className="lg:hidden flex items-center space-x-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
            { id: 'orders', label: 'My Orders', icon: Package, count: userOrders.length },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>

        {/* TWO-PART LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* DESKTOP LEFT SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-3 space-y-2">
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs space-y-1 sticky top-24">
              
              {/* User Identity Mini Card */}
              <div className="p-3 bg-[#f8f9fa] rounded-2xl flex items-center space-x-3 mb-3 border border-gray-100">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover shadow-xs border border-white"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-rose-500 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{user.name}</h4>
                  <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-rose-50 text-rose-600 font-extrabold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  <span>Profile Information</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-rose-50 text-rose-600 font-extrabold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4" />
                  <span>Saved Addresses</span>
                </div>
                <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                  {user.addresses.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-rose-50 text-rose-600 font-extrabold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>My Orders</span>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'orders' ? 'bg-rose-200 text-rose-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {userOrders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-rose-50 text-rose-600 font-extrabold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4" />
                  <span>Account Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <div className="h-px bg-gray-100 my-2" />

              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full text-left px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>

            </div>
          </aside>

          {/* RIGHT CONTENT AREA */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* SECTION 1: PROFILE INFORMATION */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-rose-500" />
                    <span>Personal Profile</span>
                  </h2>

                  {!isEditingProfile && (
                    <button
                      onClick={handleOpenEditProfile}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {/* Avatar Display with Live File Upload */}
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-white"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-rose-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
                        {initials}
                      </div>
                    )}
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="absolute bottom-0 right-0 p-2 bg-gray-900 hover:bg-black text-white rounded-full shadow-md cursor-pointer transition-transform group-hover:scale-110 flex items-center justify-center"
                      title="Upload profile picture"
                    >
                      {isUploadingPhoto ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Camera className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">{user.name}</h3>
                    <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        Account Verified
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                </div>

                {!isEditingProfile ? (
                  /* Profile Details Read View */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="p-4 bg-[#f8f9fa] rounded-2xl border border-gray-100">
                      <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">
                        First Name
                      </span>
                      <span className="text-sm font-bold text-gray-900 mt-1 block">
                        {user.firstName}
                      </span>
                    </div>

                    <div className="p-4 bg-[#f8f9fa] rounded-2xl border border-gray-100">
                      <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">
                        Last Name
                      </span>
                      <span className="text-sm font-bold text-gray-900 mt-1 block">
                        {user.lastName}
                      </span>
                    </div>

                    <div className="p-4 bg-[#f8f9fa] rounded-2xl border border-gray-100">
                      <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">
                        Email Address
                      </span>
                      <span className="text-sm font-bold text-gray-900 mt-1 block">
                        {user.email}
                      </span>
                    </div>

                    <div className="p-4 bg-[#f8f9fa] rounded-2xl border border-gray-100">
                      <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">
                        Phone Number
                      </span>
                      <span className="text-sm font-bold text-gray-900 mt-1 block">
                        {user.phone || 'Not provided'}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Profile Details Edit View */
                  <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={editFirstName}
                          onChange={(e) => setEditFirstName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                        />
                        {profileErrors.firstName && (
                          <p className="text-xs text-rose-500 font-bold mt-1">{profileErrors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={editLastName}
                          onChange={(e) => setEditLastName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                        />
                        {profileErrors.lastName && (
                          <p className="text-xs text-rose-500 font-bold mt-1">{profileErrors.lastName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                        />
                        {profileErrors.email && (
                          <p className="text-xs text-rose-500 font-bold mt-1">{profileErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          maxLength={10}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                        />
                        {profileErrors.phone && (
                          <p className="text-xs text-rose-500 font-bold mt-1">{profileErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-2xl transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-2xl shadow-md transition-colors cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}

            {/* SECTION 2: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-rose-500" />
                      <span>Saved Delivery Addresses</span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Add, update and manage default delivery addresses for rapid checkout.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddAddress}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {user.addresses.length === 0 ? (
                  <div className="text-center py-12 space-y-3 bg-[#f8f9fa] rounded-3xl border border-dashed border-gray-200">
                    <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800">No saved addresses</h3>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto">
                      Add an address to make checkout faster during your next order!
                    </p>
                    <button
                      onClick={handleOpenAddAddress}
                      className="inline-flex items-center gap-1.5 px-5 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                    >
                      <span>Add Address</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                          addr.isDefault
                            ? 'border-rose-300 bg-rose-50/20 shadow-xs'
                            : 'border-gray-100 bg-[#f8f9fa] hover:border-gray-200'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-gray-200/60 rounded-md text-gray-700">
                              {addr.type}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3" /> Default
                              </span>
                            )}
                          </div>

                          <div>
                            <h4 className="text-sm font-extrabold text-gray-900">{addr.fullName}</h4>
                            <p className="text-xs text-gray-500">{addr.phone}</p>
                          </div>

                          <p className="text-xs text-gray-600 leading-relaxed">
                            {addr.house}, {addr.street && `${addr.street}, `}
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-gray-200/50 flex items-center justify-between text-xs font-bold">
                          {!addr.isDefault ? (
                            <button
                              onClick={() => handleSetDefault(addr.id)}
                              className="text-rose-600 hover:text-rose-700 cursor-pointer"
                            >
                              Set as Default
                            </button>
                          ) : (
                            <span className="text-gray-300">Default Address</span>
                          )}

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleOpenEditAddress(addr)}
                              className="text-gray-500 hover:text-gray-800 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeletingAddressId(addr.id)}
                              className="text-rose-500 hover:text-rose-700 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* SECTION 3: MY ORDERS & PAST ORDERS */}
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-rose-500" />
                      <span>My Orders ({userOrders.length})</span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Review order details, shipments, invoices and past item purchases.
                    </p>
                  </div>

                  <Link
                    to="/products"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Continue Shopping</span>
                  </Link>
                </div>

                {userOrders.length === 0 ? (
                  <div className="text-center py-16 space-y-3 bg-[#f8f9fa] rounded-3xl border border-dashed border-gray-200">
                    <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-extrabold text-gray-800">No Past Orders Found</h3>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                      You have not placed any orders yet. Explore our fresh inventory and place your first order!
                    </p>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer mt-2"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => {
                      const isDelivered = order.status === 'Delivered';
                      const isCancelled = order.status === 'Cancelled';
                      const isShipped = order.status === 'Shipped';

                      return (
                        <div
                          key={order.id}
                          className="bg-[#f8f9fa] rounded-2xl p-5 sm:p-6 border border-gray-100 hover:border-gray-200 transition-all space-y-4"
                        >
                          {/* Order Card Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200/60 gap-2">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-rose-500 shadow-xs">
                                <Package className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-xs font-extrabold text-gray-900 flex items-center gap-2">
                                  <span>Order #{order.id}</span>
                                </h4>
                                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Placed on {order.createdAt}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                                  isDelivered
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : isCancelled
                                    ? 'bg-red-50 text-red-600 border border-red-200'
                                    : isShipped
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {isDelivered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                                {isShipped && <Truck className="w-3.5 h-3.5 text-blue-600" />}
                                {isCancelled && <AlertCircle className="w-3.5 h-3.5 text-red-600" />}
                                <span>{order.status}</span>
                              </span>

                              <span className="text-sm font-black text-gray-900">
                                ₹{(order.finalTotal || order.total || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Order Items Breakdown */}
                          <div className="space-y-3">
                            {(order.items || []).map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100"
                              >
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={item.image}
                                    alt={item.productName}
                                    className="w-12 h-12 rounded-lg object-cover border border-gray-100 bg-gray-50 shrink-0"
                                  />
                                  <div>
                                    <h5 className="text-xs font-bold text-gray-900 line-clamp-1">
                                      {item.productName}
                                    </h5>
                                    <p className="text-[11px] text-gray-400">
                                      Qty: {item.quantity} • SKU: {item.sku || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-bold text-gray-900">
                                    ₹{((item.priceAtPurchase || 0) * item.quantity).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Delivery Destination & Summary Footer */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 pt-2 gap-2">
                            <p className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span className="truncate max-w-xs sm:max-w-md">
                                Deliver to: {order.shippingAddress?.fullName || user.name}, {order.shippingAddress?.city || 'Local Area'}
                              </span>
                            </p>

                            <p className="text-[11px] font-semibold text-gray-400">
                              Payment: <span className="uppercase text-gray-700 font-bold">{order.paymentMethod || 'ONLINE'}</span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* SECTION 4: ACCOUNT SETTINGS */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-8"
              >
                {/* PREFERENCES */}
                <div className="space-y-4">
                  <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-100">
                    <Bell className="w-5 h-5 text-rose-500" />
                    <span>Notification Preferences</span>
                  </h2>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-2xl border border-gray-100 cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">Email Notifications</span>
                        <span className="text-[11px] text-gray-400">Receive receipt and account notifications</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={user.preferences.emailNotifications}
                        onChange={(e) => updatePreferences({ emailNotifications: e.target.checked })}
                        className="rounded text-rose-500 focus:ring-rose-500 h-5 w-5 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-2xl border border-gray-100 cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">Order Status Updates</span>
                        <span className="text-[11px] text-gray-400">Receive SMS/Email updates when order ships</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={user.preferences.orderUpdates}
                        onChange={(e) => updatePreferences({ orderUpdates: e.target.checked })}
                        className="rounded text-rose-500 focus:ring-rose-500 h-5 w-5 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-2xl border border-gray-100 cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">Promotional Offers & Sales</span>
                        <span className="text-[11px] text-gray-400">Receive coupons and discount alerts</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={user.preferences.promotionalEmails}
                        onChange={(e) => updatePreferences({ promotionalEmails: e.target.checked })}
                        className="rounded text-rose-500 focus:ring-rose-500 h-5 w-5 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* CHANGE PASSWORD */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2 pb-2">
                    <Lock className="w-5 h-5 text-rose-500" />
                    <span>Change Password</span>
                  </h2>

                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                        Current Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPass ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {passwordErrors.current && <p className="text-xs text-rose-500 font-bold mt-1">{passwordErrors.current}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                        New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {passwordErrors.new && <p className="text-xs text-rose-500 font-bold mt-1">{passwordErrors.new}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmNewPass ? 'text' : 'password'}
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmNewPass(!showConfirmNewPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {passwordErrors.confirm && <p className="text-xs text-rose-500 font-bold mt-1">{passwordErrors.confirm}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="px-6 py-2.5 bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                    >
                      {isChangingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

          </main>

        </div>

      </div>

      {/* ADD / EDIT ADDRESS MODAL */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddressModalOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase mb-1">Label</label>
                <div className="flex gap-2">
                  {(['HOME', 'WORK', 'OTHER'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAddrType(t)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        addrType === t ? 'bg-rose-500 text-white border-rose-500' : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={addrName}
                    onChange={(e) => setAddrName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                  />
                  {addressErrors.name && <p className="text-[11px] text-rose-500 font-bold mt-1">{addressErrors.name}</p>}
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    maxLength={10}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                  />
                  {addressErrors.phone && <p className="text-[11px] text-rose-500 font-bold mt-1">{addressErrors.phone}</p>}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="House / Flat / Building *"
                  value={addrHouse}
                  onChange={(e) => setAddrHouse(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                />
                {addressErrors.house && <p className="text-[11px] text-rose-500 font-bold mt-1">{addressErrors.house}</p>}
              </div>

              <input
                type="text"
                placeholder="Street / Area / Landmark"
                value={addrStreet}
                onChange={(e) => setAddrStreet(e.target.value)}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
              />

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="text"
                    placeholder="City *"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                  />
                  {addressErrors.city && <p className="text-[10px] text-rose-500 font-bold mt-1">{addressErrors.city}</p>}
                </div>

                <input
                  type="text"
                  placeholder="State"
                  value={addrState}
                  onChange={(e) => setAddrState(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                />

                <div>
                  <input
                    type="text"
                    placeholder="Pincode *"
                    value={addrPincode}
                    onChange={(e) => setAddrPincode(e.target.value)}
                    maxLength={6}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                  />
                  {addressErrors.pincode && <p className="text-[10px] text-rose-500 font-bold mt-1">{addressErrors.pincode}</p>}
                </div>
              </div>

              <label className="flex items-center space-x-2 text-xs font-bold text-gray-800 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-500 h-4 w-4"
                />
                <span>Set as default delivery address</span>
              </label>

              <div className="pt-3 border-t border-gray-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE ADDRESS CONFIRMATION DIALOG */}
      {deletingAddressId && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setDeletingAddressId(null)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl z-10 space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Delete this address?</h3>
              <p className="text-xs text-gray-500 mt-1">
                This address will be permanently removed from your saved addresses.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingAddressId(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAddressConfirm(deletingAddressId)}
                className="flex-1 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION DIALOG */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsLogoutModalOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl z-10 space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Are you sure you want to log out?</h3>
              <p className="text-xs text-gray-500 mt-1">
                You will need to sign in again to access your account details and express checkout.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
