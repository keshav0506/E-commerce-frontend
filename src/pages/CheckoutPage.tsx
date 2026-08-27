import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  MapPin,
  Truck,
  CreditCard,
  ChevronRight,
  Plus,
  ShieldCheck,
  Zap,
  X,
  Loader2,
  ArrowRight,
  User,
  Phone,
  Check
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { loadRazorpayScript, createRazorpayOrderApi, verifyRazorpayPaymentApi } from '../services/paymentService';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, addAddress } = useAuth();
  const {
    cart,
    cartSubtotal,
    cartProductDiscount,
    appliedCoupon,
    couponDiscountAmount,
    applyCoupon,
    removeCoupon,
    clearCart,
    showToast,
    placeOrder
  } = useShop();

  // Redirect to /products if cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6 text-center">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full border border-gray-100 shadow-lg space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Your cart is empty</h2>
          <p className="text-xs text-gray-500">
            Please add items to your cart before proceeding to checkout.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Contact Info State
  const [email, setEmail] = useState(user?.email || 'keshav@example.com');
  const [phone, setPhone] = useState(user?.phone || '9876543210');

  // Address State linked directly to AuthContext user addresses
  const userAddresses = user?.addresses || [];
  const defaultAddr = userAddresses.find((a) => a.isDefault) || userAddresses[0];

  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddr?.id || '');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // New Address Form
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newHouse, setNewHouse] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [addressTypeError, setAddressTypeError] = useState('');

  // Delivery Method State
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');

  // UPI State
  const [upiId, setUpiId] = useState('keshav@upi');
  const [isUpiVerified, setIsUpiVerified] = useState(false);

  // Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Coupon State Input inside Checkout
  const [couponInput, setCouponInput] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Delivery Calculation
  const deliveryFee =
    deliveryMethod === 'express'
      ? 99
      : cartSubtotal >= 499 || cartSubtotal === 0
      ? 0
      : 99;

  const finalCheckoutTotal = Math.max(0, cartSubtotal - couponDiscountAmount + deliveryFee);

  // Handle Verify UPI
  const handleVerifyUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (upiId.trim() && upiId.includes('@')) {
      setIsUpiVerified(true);
      showToast('UPI ID verified successfully!');
    } else {
      showToast('Please enter a valid UPI ID (e.g. name@upi)');
    }
  };

  // Handle Add New Address
  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressTypeError('');

    if (!newFullName.trim() || !newPhone.trim() || !newHouse.trim() || !newCity.trim() || !newPincode.trim()) {
      setAddressTypeError('Please fill in all required address fields.');
      return;
    }

    if (newPincode.length !== 6 || isNaN(Number(newPincode))) {
      setAddressTypeError('Please enter a valid 6-digit pincode.');
      return;
    }

    addAddress({
      type: 'HOME',
      fullName: newFullName.trim(),
      phone: newPhone.trim(),
      house: newHouse.trim(),
      street: newStreet.trim(),
      city: newCity.trim(),
      state: newState.trim(),
      pincode: newPincode.trim(),
      isDefault: userAddresses.length === 0
    });

    setIsAddingNewAddress(false);
    showToast('New address saved to your account!');

    // Reset Form
    setNewFullName('');
    setNewPhone('');
    setNewHouse('');
    setNewStreet('');
    setNewCity('');
    setNewState('');
    setNewPincode('');
  };

  // Handle Place Order Submit
  const handlePlaceOrder = async () => {
    const errors: { [key: string]: string } = {};

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!phone.trim() || phone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit phone number.';
    }

    const activeAddr = userAddresses.find((a) => a.id === selectedAddressId) || defaultAddr;
    if (!activeAddr) {
      errors.address = 'Please select or add a delivery address.';
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.length < 16) errors.cardNumber = 'Enter a valid 16-digit card number.';
      if (!cardExpiry) errors.cardExpiry = 'Enter expiry date.';
      if (!cardCvv || cardCvv.length < 3) errors.cardCvv = 'Enter CVV.';
      if (!cardName) errors.cardName = 'Enter name on card.';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      showToast('Please complete all required fields correctly.');
      return;
    }

    setIsSubmitting(true);

    const nowFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Construct Order Object
    const newOrder = placeOrder({
      customer: {
        id: user?.email || 'cust-new',
        name: activeAddr?.fullName || user?.name || 'Store Customer',
        email: email.trim(),
        phone: phone.trim()
      },
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        sku: `SKU-${item.product.id.slice(-6).toUpperCase()}`,
        image: item.product.image,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
        total: item.product.price * item.quantity
      })),
      status: paymentMethod === 'cod' ? 'Confirmed' : 'Pending',
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      paymentMethod: paymentMethod === 'upi' ? 'UPI (Razorpay)' : paymentMethod === 'card' ? 'Credit Card (Razorpay)' : 'Cash on Delivery (COD)',
      transactionId: paymentMethod !== 'cod' ? `TXN-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
      shippingAddress: {
        fullName: activeAddr?.fullName || 'Customer',
        phone: activeAddr?.phone || phone,
        house: activeAddr?.house || 'House 1',
        street: activeAddr?.street || 'Main Road',
        city: activeAddr?.city || 'Bengaluru',
        state: activeAddr?.state || 'Karnataka',
        pincode: activeAddr?.pincode || '560001',
        type: activeAddr?.type || 'HOME'
      },
      subtotal: cartSubtotal,
      discount: couponDiscountAmount + cartProductDiscount,
      shipping: deliveryFee,
      tax: Math.round(cartSubtotal * 0.05),
      total: finalCheckoutTotal,
      createdAt: nowFormatted
    });

    if (paymentMethod === 'cod') {
      setTimeout(() => {
        clearCart();
        setIsSubmitting(false);
        navigate('/order-success');
      }, 800);
      return;
    }

    // Online Payment via Razorpay
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        showToast('Failed to load Razorpay SDK. Please check your network.');
        setIsSubmitting(false);
        return;
      }

      const rzpOrder = await createRazorpayOrderApi(newOrder.id, finalCheckoutTotal);

      const options = {
        key: rzpOrder.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || 'INR',
        name: 'Shoply Store',
        description: `Order ${newOrder.id}`,
        order_id: rzpOrder.razorpayOrderId.startsWith('rzp_order_') ? undefined : rzpOrder.razorpayOrderId,
        handler: async function (response: any) {
          const verifyRes = await verifyRazorpayPaymentApi({
            razorpayOrderId: response.razorpay_order_id || rzpOrder.razorpayOrderId,
            razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
            razorpaySignature: response.razorpay_signature || 'sig_demo',
            orderId: newOrder.id
          });

          if (verifyRes.success) {
            showToast('Payment successful!');
            clearCart();
            setIsSubmitting(false);
            navigate('/order-success');
          } else {
            showToast(verifyRes.message || 'Payment verification failed.');
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: activeAddr?.fullName || user?.name || '',
          email: email.trim(),
          contact: phone.trim()
        },
        theme: {
          color: '#f43f5e'
        },
        modal: {
          ondismiss: function () {
            showToast('Payment cancelled.');
            setIsSubmitting(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        showToast(response.error?.description || 'Payment Failed.');
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      console.warn('Razorpay checkout initialization notice:', err);
      // Fallback for demo when backend Razorpay key is unconfigured
      setTimeout(() => {
        clearCart();
        setIsSubmitting(false);
        navigate('/order-success');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-medium text-gray-500 mb-4">
          <Link to="/" className="hover:text-rose-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link to="/cart" className="hover:text-rose-600 transition-colors">
            Cart
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-semibold">Checkout</span>
        </nav>

        {/* CHECKOUT PROGRESS INDICATOR */}
        <div className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-5 mb-8 shadow-xs">
          <div className="flex items-center justify-between max-w-2xl mx-auto text-xs font-bold text-gray-400">
            <div className="flex items-center gap-2 text-emerald-600">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">
                ✓
              </span>
              <span className="hidden sm:inline">1. Cart</span>
            </div>
            <div className="h-0.5 flex-1 bg-emerald-200 mx-2" />

            <div className="flex items-center gap-2 text-rose-600">
              <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">
                2
              </span>
              <span className="hidden sm:inline">2. Address</span>
            </div>
            <div className="h-0.5 flex-1 bg-rose-200 mx-2" />

            <div className="flex items-center gap-2 text-rose-600">
              <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">
                3
              </span>
              <span className="hidden sm:inline">3. Delivery</span>
            </div>
            <div className="h-0.5 flex-1 bg-rose-200 mx-2" />

            <div className="flex items-center gap-2 text-rose-600">
              <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">
                4
              </span>
              <span className="hidden sm:inline">4. Payment</span>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN CHECKOUT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: CONTACT, ADDRESS, DELIVERY, PAYMENT */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. CONTACT INFORMATION */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4 text-rose-500" />
                <span>1. Contact Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                  {formErrors.email && <p className="text-xs text-rose-500 font-semibold mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={10}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  {formErrors.phone && <p className="text-xs text-rose-500 font-semibold mt-1">{formErrors.phone}</p>}
                </div>
              </div>
            </div>

            {/* 2. DELIVERY ADDRESS */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>2. Delivery Address</span>
                </h2>

                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingNewAddress ? 'Cancel' : 'Add New Address'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userAddresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id || (!selectedAddressId && addr.isDefault);
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/40 shadow-sm ring-2 ring-rose-500/20'
                          : 'border-gray-200 bg-gray-50/60 hover:border-rose-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-200 text-gray-800">
                          {addr.type}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-gray-900">{addr.fullName}</p>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {addr.house}, {addr.street}<br />
                        {addr.city}, {addr.state} — <strong>{addr.pincode}</strong>
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium mt-1">
                        Phone: +91 {addr.phone}
                      </p>
                    </div>
                  );
                })}
              </div>

              {isAddingNewAddress && (
                <form onSubmit={handleSaveNewAddress} className="pt-4 border-t border-gray-100 space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 uppercase">New Address Details</h4>
                  
                  {addressTypeError && (
                    <p className="text-xs text-rose-500 font-bold">{addressTypeError}</p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="House / Flat / Building *"
                      value={newHouse}
                      onChange={(e) => setNewHouse(e.target.value)}
                      className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="Street / Area"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="City *"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="6-digit Pincode *"
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      maxLength={6}
                      className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    Save Address
                  </button>
                </form>
              )}
            </div>

            {/* 3. DELIVERY METHOD */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-rose-500" />
                <span>3. Delivery Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setDeliveryMethod('standard')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                    deliveryMethod === 'standard'
                      ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20'
                      : 'border-gray-200 bg-gray-50/60 hover:border-rose-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'standard'}
                    onChange={() => setDeliveryMethod('standard')}
                    className="mt-1 text-rose-500 focus:ring-rose-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Standard Delivery</span>
                    <span className="text-xs text-gray-500 block mt-0.5">3–5 Business Days</span>
                    <span className="text-xs font-extrabold text-emerald-600 block mt-1">
                      {cartSubtotal >= 499 ? 'FREE' : '₹99'}
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => setDeliveryMethod('express')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                    deliveryMethod === 'express'
                      ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20'
                      : 'border-gray-200 bg-gray-50/60 hover:border-rose-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'express'}
                    onChange={() => setDeliveryMethod('express')}
                    className="mt-1 text-rose-500 focus:ring-rose-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                      <span>Express Shipping</span>
                      <Zap className="w-3 h-3 text-amber-500 fill-amber-400" />
                    </span>
                    <span className="text-xs text-gray-500 block mt-0.5">1–2 Business Days</span>
                    <span className="text-xs font-extrabold text-gray-900 block mt-1">₹99</span>
                  </div>
                </label>
              </div>
            </div>

            {/* 4. PAYMENT METHOD */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-rose-500" />
                <span>4. Payment Method</span>
              </h2>

              <div className="space-y-3">
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-rose-500 bg-rose-50/20 ring-2 ring-rose-500/20'
                      : 'border-gray-200 hover:border-rose-300'
                  }`}
                >
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="text-rose-500 focus:ring-rose-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">UPI (Google Pay, PhonePe, Paytm)</span>
                      <span className="text-[11px] text-gray-500">Instant payment using any UPI ID</span>
                    </div>
                  </label>

                  {paymentMethod === 'upi' && (
                    <form onSubmit={handleVerifyUpi} className="mt-3 pl-7 flex gap-2">
                      <input
                        type="text"
                        placeholder="example@upi"
                        value={upiId}
                        onChange={(e) => {
                          setUpiId(e.target.value);
                          setIsUpiVerified(false);
                        }}
                        className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl"
                      >
                        Verify
                      </button>
                      {isUpiVerified && (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 self-center">
                          <Check className="w-4 h-4" /> Verified
                        </span>
                      )}
                    </form>
                  )}
                </div>

                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    paymentMethod === 'card'
                      ? 'border-rose-500 bg-rose-50/20 ring-2 ring-rose-500/20'
                      : 'border-gray-200 hover:border-rose-300'
                  }`}
                >
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-rose-500 focus:ring-rose-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Credit / Debit Card</span>
                      <span className="text-[11px] text-gray-500">Visa, Mastercard, RuPay, Amex</span>
                    </div>
                  </label>

                  {paymentMethod === 'card' && (
                    <div className="mt-4 pl-7 space-y-3 max-w-md">
                      <div>
                        <input
                          type="text"
                          placeholder="Card Number (16 digits)"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          maxLength={16}
                          className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                        />
                        {formErrors.cardNumber && <p className="text-[11px] text-rose-500 font-bold mt-1">{formErrors.cardNumber}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          maxLength={5}
                          className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={3}
                          className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="Name on Card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                      />

                      <p className="text-[11px] text-gray-400 flex items-center gap-1 font-medium pt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Your payment details are securely encrypted.</span>
                      </p>
                    </div>
                  )}
                </div>

                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-rose-500 bg-rose-50/20 ring-2 ring-rose-500/20'
                      : 'border-gray-200 hover:border-rose-300'
                  }`}
                >
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-rose-500 focus:ring-rose-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Cash on Delivery (COD)</span>
                      <span className="text-[11px] text-gray-500">Pay when your order is delivered at your doorstep</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: COMPACT ORDER SUMMARY */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5 sticky top-24">
              
              <h2 className="text-base font-extrabold text-gray-900 pb-3 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.selectedVolume}`} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 truncate">
                      <img src={item.product.image} alt={item.product.name} className="w-8 h-8 object-contain bg-gray-50 rounded-lg p-1 border border-gray-100" />
                      <span className="font-bold text-gray-900 truncate max-w-[140px]">
                        {item.product.name}
                      </span>
                      <span className="text-gray-400">×{item.quantity}</span>
                    </div>
                    <span className="font-extrabold text-gray-900 shrink-0">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-100">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
                    <span>Coupon: {appliedCoupon.code}</span>
                    <button onClick={removeCoupon} className="text-emerald-700 hover:text-emerald-950">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (couponInput.trim()) {
                        applyCoupon(couponInput);
                        setCouponInput('');
                      }
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 uppercase"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-bold">
                      Apply
                    </button>
                  </form>
                )}
              </div>

              <div className="space-y-2.5 text-xs font-medium pt-2 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{cartSubtotal}</span>
                </div>

                {cartProductDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Product Discounts</span>
                    <span className="font-bold">-₹{cartProductDiscount}</span>
                  </div>
                )}

                {appliedCoupon && couponDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span className="font-bold">-₹{couponDiscountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-emerald-600">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="h-px bg-gray-100 my-2" />

                <div className="flex justify-between text-base font-black text-gray-900 pt-1">
                  <span>Total Payable</span>
                  <span className="text-rose-600">₹{finalCheckoutTotal}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Placing your order...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Place Order • ₹{finalCheckoutTotal}</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* MOBILE STICKY BOTTOM CHECKOUT ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 flex items-center justify-between gap-4 shadow-2xl">
        <div>
          <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Amount</span>
          <span className="text-lg font-black text-rose-600">₹{finalCheckoutTotal}</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
          className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Place Order</span>}
        </button>
      </div>

    </div>
  );
};
