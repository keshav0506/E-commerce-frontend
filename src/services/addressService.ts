import { apiFetch } from './api';
import type { UserAddress } from '../context/AuthContext';

/**
 * Fetch addresses (GET /api/addresses)
 */
export async function fetchAddressesApi(): Promise<UserAddress[]> {
  const res = await apiFetch<any[]>('/addresses');
  if (!Array.isArray(res)) return [];
  return res.map((a) => ({
    id: String(a.id),
    type: a.type || 'HOME',
    fullName: a.fullName || a.name || '',
    phone: a.phone || '',
    house: a.house || a.houseNo || a.addressLine1 || '',
    street: a.street || a.addressLine2 || '',
    city: a.city || '',
    state: a.state || '',
    pincode: String(a.pincode || a.zipCode || ''),
    isDefault: Boolean(a.isDefault || a.default)
  }));
}

/**
 * Create new address (POST /api/addresses)
 */
export async function createAddressApi(addressData: Omit<UserAddress, 'id'>): Promise<UserAddress> {
  const res = await apiFetch<any>('/addresses', {
    method: 'POST',
    body: JSON.stringify(addressData)
  });
  return {
    id: String(res.id || `addr-${Date.now()}`),
    type: res.type || addressData.type || 'HOME',
    fullName: res.fullName || addressData.fullName,
    phone: res.phone || addressData.phone,
    house: res.house || addressData.house,
    street: res.street || addressData.street,
    city: res.city || addressData.city,
    state: res.state || addressData.state,
    pincode: String(res.pincode || addressData.pincode),
    isDefault: res.isDefault !== undefined ? res.isDefault : addressData.isDefault
  };
}

/**
 * Update address (PUT /api/addresses/{id})
 */
export async function updateAddressApi(id: string, addressData: Partial<UserAddress>): Promise<any> {
  return await apiFetch(`/addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(addressData)
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
