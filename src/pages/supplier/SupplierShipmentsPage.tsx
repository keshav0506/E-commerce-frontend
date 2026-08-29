import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { getSupplierPurchaseOrdersApi } from '../../services/supplierService';
import type { PurchaseOrder } from '../../types/supplier';

export const SupplierShipmentsPage: React.FC = () => {
  const [shipments, setShipments] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getSupplierPurchaseOrdersApi({ size: 50 });
        const filtered = (res.content || []).filter(
          (po) => po.status === 'SHIPPED' || po.status === 'IN_TRANSIT' || po.status === 'DELIVERED'
        );
        setShipments(filtered);
      } catch (err: any) {
        setError(err.message || 'Failed to load shipments');
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, []);

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Shipment Log & Tracking</h1>
        <p className="text-xs text-slate-400 mt-1">
          Active consignments, dispatched batches, tracking AWB details, and carrier manifests.
        </p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p>Loading shipment records...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-400 text-xs">{error}</div>
        ) : shipments.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs space-y-2">
            <Truck className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No active shipments</p>
            <p>Once you dispatch purchase orders, consignment manifests will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">PO Number</th>
                  <th className="py-3.5 px-4">Carrier</th>
                  <th className="py-3.5 px-4">Tracking AWB</th>
                  <th className="py-3.5 px-4">Dispatched Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">View Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {shipments.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {po.poNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      {po.shippingCarrier || 'Standard Freight'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-purple-400">
                      {po.trackingNumber || 'PENDING-GEN'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(po.updatedAt || po.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          po.status === 'DELIVERED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/supplier/purchase-orders/${po.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
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
