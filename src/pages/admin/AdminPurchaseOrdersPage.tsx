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
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      
      {/* PAGE HEADER BANNER */}
      <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
              Procurement & Inventory Inflow
            </span>
            <span className="text-xs text-gray-400 font-semibold">• B2B Supply Chain</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Procurement Purchase Orders
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Issue wholesale purchase orders to approved suppliers and manage consignment inventory fulfillment.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-98 text-white text-xs font-extrabold shadow-md shadow-rose-200 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Issue New Purchase Order</span>
        </button>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-gray-400 text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            <p className="font-bold">Loading purchase orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-gray-500 text-xs space-y-2">
            <div className="w-16 h-16 bg-white text-gray-400 rounded-2xl flex items-center justify-center mx-auto border border-gray-200/80 shadow-2xs">
              <ClipboardList className="w-8 h-8 text-rose-500" />
            </div>
            <p className="font-extrabold text-gray-900 text-sm">No purchase orders found</p>
            <p className="text-gray-400">Click "Issue New Purchase Order" to generate a procurement contract.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f3f4f6] text-gray-600 uppercase font-extrabold text-[10px] tracking-wider border-b border-gray-200/80">
                <tr>
                  <th className="py-3.5 px-5 font-bold">PO Number</th>
                  <th className="py-3.5 px-4 font-bold">Supplier Business</th>
                  <th className="py-3.5 px-4 font-bold">Issued Date</th>
                  <th className="py-3.5 px-4 font-bold">Total Amount</th>
                  <th className="py-3.5 px-4 font-bold">Fulfillment Status</th>
                  <th className="py-3.5 px-5 font-bold">Carrier / Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
                {orders.map((po) => {
                  const statusColors: Record<string, string> = {
                    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
                    ACCEPTED: 'bg-blue-50 text-blue-700 border-blue-200',
                    PROCESSING: 'bg-cyan-50 text-cyan-700 border-cyan-200',
                    SHIPPED: 'bg-purple-50 text-purple-700 border-purple-200',
                    IN_TRANSIT: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
                    CANCELLED: 'bg-gray-100 text-gray-700 border-gray-200',
                  };

                  return (
                    <tr key={po.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-4 px-5 font-mono font-extrabold text-gray-900">
                        {po.poNumber}
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-800">
                        {po.supplierBusinessName}
                      </td>
                      <td className="py-4 px-4 text-gray-500 font-medium">
                        {new Date(po.orderDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 font-mono font-black text-gray-900 text-sm">
                        ₹{Number(po.totalAmount).toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${statusColors[po.status] || 'bg-gray-100 text-gray-600'}`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-gray-600 font-mono text-[11px]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 space-y-6 text-left shadow-2xl max-h-[90vh] overflow-y-auto">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                New Procurement Order
              </span>
              <h2 className="text-xl font-extrabold text-gray-900 mt-2">
                Issue Wholesale Purchase Order
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Generate a formal purchase order to replenish stock with approved suppliers.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Select Approved Supplier
                </label>
                <select
                  required
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
                  className="w-full p-3.5 bg-[#f3f4f6] border border-gray-200/80 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:border-rose-500 cursor-pointer"
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Procurement Line Items
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    + Add Item Row
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#f3f4f6] p-3 rounded-2xl border border-gray-200/80">
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
                        className="flex-1 p-2.5 bg-white border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-900"
                      >
                        <option value={0}>-- Select Product --</option>
                        {productsList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (MRP: ₹{p.price})
                          </option>
                        ))}
                      </select>

                      <div className="w-24">
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
                          className="w-full p-2.5 bg-white border border-gray-200/80 rounded-xl text-xs font-bold text-gray-900 text-center"
                        />
                      </div>

                      <div className="w-28">
                        <input
                          type="number"
                          min={1}
                          placeholder="Unit ₹"
                          value={item.unitPrice}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[idx].unitPrice = Number(e.target.value);
                            setItems(newItems);
                          }}
                          className="w-full p-2.5 bg-white border border-gray-200/80 rounded-xl text-xs font-bold text-gray-900 text-right"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center p-4 bg-[#f3f4f6] rounded-2xl text-xs font-bold text-gray-900 border border-gray-200/80">
                  <span>Calculated Wholesale Subtotal:</span>
                  <span className="text-base text-rose-600 font-mono font-black">
                    ₹{calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Procurement Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Special fulfillment instructions or dock delivery details..."
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  className="w-full p-3.5 bg-[#f3f4f6] border border-gray-200/80 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all disabled:opacity-50 cursor-pointer"
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
