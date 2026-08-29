import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ClipboardList,
  Plus,
  Loader2,
  Trash2
} from 'lucide-react';
import {
  getAdminPurchaseOrdersApi,
  createAdminPurchaseOrderApi,
  getAdminSuppliersApi
} from '../../services/supplierService';
import { fetchProducts } from '../../services/apiService';
import type { PurchaseOrder, SupplierProfile } from '../../types/supplier';
import type { Product } from '../../types';

export const AdminPurchaseOrdersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedSupplierId = searchParams.get('supplierId');

  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page] = useState(0);

  // New PO Modal
  const [showCreateModal, setShowCreateModal] = useState(Boolean(preselectedSupplierId));
  const [approvedSuppliers, setApprovedSuppliers] = useState<SupplierProfile[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | ''>(
    preselectedSupplierId ? Number(preselectedSupplierId) : ''
  );
  const [poNotes, setPoNotes] = useState('');
  const [items, setItems] = useState<{ productId: number; quantity: number; unitPrice: number }[]>([
    { productId: 0, quantity: 10, unitPrice: 100 }
  ]);
  const [creating, setCreating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAdminPurchaseOrdersApi({
        supplierId: preselectedSupplierId ? Number(preselectedSupplierId) : undefined,
        page,
        size: 15
      });
      setOrders(res.content || []);
    } catch (err) {
      console.error('Failed to fetch purchase orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  useEffect(() => {
    const loadModalData = async () => {
      try {
        const [suppRes, prods] = await Promise.all([
          getAdminSuppliersApi({ status: 'APPROVED', size: 50 }),
          fetchProducts({ size: 100 })
        ]);
        setApprovedSuppliers(suppRes.content || []);
        setProductsList(Array.isArray(prods) ? prods : []);

        if (suppRes.content && suppRes.content.length > 0 && !selectedSupplierId) {
          setSelectedSupplierId(suppRes.content[0].id);
        }
      } catch {}
    };
    loadModalData();
  }, []);

  const handleAddItemRow = () => {
    setItems([...items, { productId: Number(productsList[0]?.id || 0), quantity: 5, unitPrice: 100 }]);
  };

  const handleRemoveItemRow = (idx: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId) {
      alert('Please select an approved supplier.');
      return;
    }
    const validItems = items.filter((i) => i.productId > 0 && i.quantity > 0);
    if (validItems.length === 0) {
      alert('Please add at least one valid product line item.');
      return;
    }

    setCreating(true);
    try {
      await createAdminPurchaseOrderApi({
        supplierId: Number(selectedSupplierId),
        notes: poNotes,
        items: validItems
      });
      setShowCreateModal(false);
      setPoNotes('');
      setItems([{ productId: 0, quantity: 10, unitPrice: 100 }]);
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to issue purchase order');
    } finally {
      setCreating(false);
    }
  };

  const calculateTotal = () => {
    return items.reduce((acc, curr) => acc + (curr.quantity || 0) * (curr.unitPrice || 0), 0);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight dark:text-white">
            Procurement Purchase Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
            Issue wholesale purchase orders to approved suppliers and manage consignment fulfillment.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold shadow-md shadow-primary-600/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Issue New Purchase Order
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            <p>Loading purchase orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs space-y-2">
            <ClipboardList className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No purchase orders found</p>
            <p>Click "Issue New Purchase Order" to generate a procurement contract.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">PO Number</th>
                  <th className="py-3.5 px-4 font-semibold">Supplier Business</th>
                  <th className="py-3.5 px-4 font-semibold">Issued Date</th>
                  <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Carrier / Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
                {orders.map((po) => {
                  const statusColors: Record<string, string> = {
                    PENDING: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
                    ACCEPTED: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
                    PROCESSING: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400',
                    SHIPPED: 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400',
                    IN_TRANSIT: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400',
                    DELIVERED: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
                    REJECTED: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
                    CANCELLED: 'bg-slate-700/20 text-slate-600 border-slate-700/30 dark:text-slate-400',
                  };

                  return (
                    <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {po.poNumber}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {po.supplierBusinessName}
                      </td>
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                        {new Date(po.orderDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        ₹{Number(po.totalAmount).toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[po.status] || 'bg-slate-100 text-slate-600'}`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        {po.trackingNumber ? `${po.shippingCarrier || 'Freight'}: ${po.trackingNumber}` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Issue PO Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-left shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Issue Wholesale Purchase Order
            </h2>
            <form onSubmit={handleCreateSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Select Approved Supplier
                </label>
                <select
                  required
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="">-- Choose Supplier --</option>
                  {approvedSuppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.businessName} ({s.taxIdentifier}) - {s.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Procurement Line Items
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <select
                        value={item.productId}
                        onChange={(e) => {
                          const pId = Number(e.target.value);
                          const prod = productsList.find((p) => Number(p.id) === pId);
                          const newItems = [...items];
                          newItems[idx].productId = pId;
                          if (prod) {
                            newItems[idx].unitPrice = Math.round(prod.price * 0.75);
                          }
                          setItems(newItems);
                        }}
                        className="flex-1 p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                      >
                        <option value={0}>-- Select Product --</option>
                        {productsList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (MRP: ₹{p.price})
                          </option>
                        ))}
                      </select>

                      <div className="w-20">
                        <input
                          type="number"
                          min={1}
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[idx].quantity = Number(e.target.value);
                            setItems(newItems);
                          }}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white text-center"
                        />
                      </div>

                      <div className="w-24">
                        <input
                          type="number"
                          min={1}
                          placeholder="Wholesale ₹"
                          value={item.unitPrice}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[idx].unitPrice = Number(e.target.value);
                            setItems(newItems);
                          }}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white text-right"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white">
                  <span>Calculated Wholesale Subtotal:</span>
                  <span className="text-base text-primary-600 dark:text-primary-400 font-mono">
                    ₹{calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Procurement Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Special fulfillment instructions or dock delivery details..."
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold shadow-md shadow-primary-600/20 transition-all disabled:opacity-50"
                >
                  {creating ? 'Issuing...' : 'Issue Purchase Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
