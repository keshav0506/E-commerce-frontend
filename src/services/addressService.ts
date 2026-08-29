import { apiFetch } from './api';
import type { UserAddress } from '../context/AuthContext';

/**
 * Fetch addresses (GET /api/addresses)
 */
export async function fetchAddressesApi(): Promise<UserAddress[]> {
  try {
    const res = await apiFetch<any[]>('/addresses');
    if (!Array.isArray(res)) return [];
    return res.map((a) => {
      const addressLine = a.addressLine || '';
      const parts = addressLine.split(',');
      const house = parts[0] || addressLine;
      const street = parts.slice(1).join(',').trim() || '';

      return {
        id: String(a.id),
        type: a.type || 'HOME',
        fullName: a.fullName || a.name || '',
        phone: a.phone || '',
        house: a.house || house,
        street: a.street || street,
        city: a.city || '',
        state: a.state || '',
        pincode: String(a.postalCode || a.pincode || a.zipCode || ''),
        isDefault: Boolean(a.isDefault || a.default)
      };
    });
  } catch (err) {
    console.warn('Failed to fetch remote addresses:', err);
    return [];
  }
}

/**
 * Create new address (POST /api/addresses)
 */
export async function createAddressApi(addressData: Omit<UserAddress, 'id'>): Promise<UserAddress> {
  const cleanPhone = (addressData.phone || '').replace(/\D/g, '');
  const validPhone = cleanPhone.length >= 10 ? cleanPhone.slice(-10) : '9876543210';
  const cleanPin = (addressData.pincode || '').replace(/\D/g, '');
  const validPin = cleanPin.length >= 6 ? cleanPin.slice(-6) : '110001';

  const addressLine = [addressData.house, addressData.street].filter(Boolean).join(', ').trim() || 'Main Address';

  const payload = {
    fullName: addressData.fullName || 'User',
    phone: validPhone,
    addressLine,
    city: addressData.city || 'City',
    state: addressData.state || 'State',
    postalCode: validPin,
    country: 'India',
    isDefault: Boolean(addressData.isDefault)
  };

  const res = await apiFetch<any>('/addresses', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return {
    id: String(res.id || `addr-${Date.now()}`),
    type: addressData.type || 'HOME',
    fullName: res.fullName || addressData.fullName,
    phone: res.phone || addressData.phone,
    house: addressData.house || addressLine,
    street: addressData.street || '',
    city: res.city || addressData.city,
    state: res.state || addressData.state,
    pincode: String(res.postalCode || addressData.pincode),
    isDefault: res.isDefault !== undefined ? res.isDefault : addressData.isDefault
  };
}

/**
 * Update address (PUT /api/addresses/{id})
 */
export async function updateAddressApi(id: string, addressData: Partial<UserAddress>): Promise<any> {
  const cleanPhone = addressData.phone ? addressData.phone.replace(/\D/g, '') : undefined;
  const validPhone = cleanPhone && cleanPhone.length >= 10 ? cleanPhone.slice(-10) : undefined;
  const cleanPin = addressData.pincode ? addressData.pincode.replace(/\D/g, '') : undefined;
  const validPin = cleanPin && cleanPin.length >= 6 ? cleanPin.slice(-6) : undefined;

  const addressLine = [addressData.house, addressData.street].filter(Boolean).join(', ').trim();

  const payload: any = {
    country: 'India'
  };
  if (addressData.fullName) payload.fullName = addressData.fullName;
  if (validPhone) payload.phone = validPhone;
  if (addressLine) payload.addressLine = addressLine;
  if (addressData.city) payload.city = addressData.city;
  if (addressData.state) payload.state = addressData.state;
  if (validPin) payload.postalCode = validPin;
  if (addressData.isDefault !== undefined) payload.isDefault = addressData.isDefault;

  return await apiFetch(`/addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

/**
 * Delete address (DELETE /api/addresses/{id})
 */
export async function deleteAddressApi(id: string): Promise<any> {
  return await apiFetch(`/addresses/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Set default address (PUT /api/addresses/{id}/default)
 */
export async function setDefaultAddressApi(id: string): Promise<any> {
  try {
    return await apiFetch(`/addresses/${id}/default`, {
      method: 'PUT'
    });
  } catch {
    return await apiFetch(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isDefault: true })
    });
  }
}
