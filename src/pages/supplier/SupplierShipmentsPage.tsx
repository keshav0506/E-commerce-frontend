import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { getSupplierPurchaseOrdersApi } from '../../services/supplierService';
import { peekApiCache } from '../../services/api';
import type { PurchaseOrder } from '../../types/supplier';

export const SupplierShipmentsPage: React.FC = () => {
  const cachedPOs = peekApiCache<any>('/supplier/purchase-orders?size=50') || peekApiCache<any>('/supplier/purchase-orders');
  const initialShipments = (cachedPOs?.content || []).filter(
    (po: PurchaseOrder) => po.status === 'SHIPPED' || po.status === 'IN_TRANSIT' || po.status === 'DELIVERED'
  );

  const [shipments, setShipments] = useState<PurchaseOrder[]>(initialShipments);
  const [loading, setLoading] = useState(!cachedPOs);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipments = async () => {
      if (shipments.length === 0) setLoading(true);
      setError(null);
      try {
        const res = await getSupplierPurchaseOrdersApi({ size: 50 });
        const filtered = (res.content || []).filter(
          (po) => po.status === 'SHIPPED' || po.status === 'IN_TRANSIT' || po.status === 'DELIVERED'
        );
        setShipments(filtered);
      } catch (err: any) {
        if (shipments.length === 0) {
          setError(err.message || 'Failed to load shipments');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, []);

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <Truck className="w-7 h-7 text-rose-500" />
          <span>Shipment Log & Tracking</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Active consignments, dispatched batches, tracking AWB details, and carrier manifests.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-gray-400 text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            <p className="font-bold">Loading shipment records...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-500 text-xs">{error}</div>
        ) : shipments.length === 0 ? (
          <div className="p-16 text-center text-gray-400 text-xs space-y-2">
            <Truck className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-900">No active shipments</p>
            <p>Once you dispatch purchase orders, consignment manifests will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50/80 text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-5">PO Number</th>
                  <th className="py-3.5 px-5">Carrier</th>
                  <th className="py-3.5 px-5">Tracking AWB</th>
                  <th className="py-3.5 px-5">Dispatched Date</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">View Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {shipments.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-gray-900">
                      {po.poNumber}
                    </td>
                    <td className="py-4 px-5 font-semibold text-gray-700">
                      {po.shippingCarrier || 'Standard Freight'}
                    </td>
                    <td className="py-4 px-5 font-mono text-purple-600 font-bold">
                      {po.trackingNumber || 'PENDING-GEN'}
                    </td>
                    <td className="py-4 px-5 text-gray-500">
                      {new Date(po.updatedAt || po.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          po.status === 'DELIVERED'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-purple-50 text-purple-600 border-purple-100'
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        to={`/supplier/purchase-orders/${po.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-rose-50 text-gray-700 hover:text-rose-600 border border-gray-200 text-xs font-bold transition-colors"
                      >
                        Details
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
