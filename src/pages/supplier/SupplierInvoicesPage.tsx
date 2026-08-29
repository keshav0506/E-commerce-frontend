import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Receipt,
  CheckCircle2,
  Clock,
  Loader2,
  Printer
} from 'lucide-react';
import { getSupplierPurchaseOrdersApi } from '../../services/supplierService';
import { peekApiCache } from '../../services/api';
import type { PurchaseOrder } from '../../types/supplier';

export const SupplierInvoicesPage: React.FC = () => {
  const cachedPOs = peekApiCache<any>('/supplier/purchase-orders?size=50') || peekApiCache<any>('/supplier/purchase-orders');
  const [orders, setOrders] = useState<PurchaseOrder[]>(cachedPOs?.content || []);
  const [loading, setLoading] = useState(!cachedPOs);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (orders.length === 0) setLoading(true);
      try {
        const res = await getSupplierPurchaseOrdersApi({ size: 50 });
        setOrders(res.content || []);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const totalPayable = orders
    .filter((po) => po.status === 'DELIVERED')
    .reduce((acc, po) => acc + Number(po.totalAmount), 0);

  const pendingSettlement = orders
    .filter((po) => po.status === 'SHIPPED' || po.status === 'PROCESSING')
    .reduce((acc, po) => acc + Number(po.totalAmount), 0);

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <Receipt className="w-7 h-7 text-rose-500" />
          <span>Invoices & Settlement Ledger</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          B2B wholesale purchase invoices, verified payout summaries, and settlement reconciliation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-6 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Delivered & Settled Revenue</p>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              ₹{totalPayable.toLocaleString()}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Eligible for scheduled bank disbursement</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200/60 flex items-center justify-center text-emerald-500 shadow-2xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-6 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">In-Transit / Unsettled Pipeline</p>
            <div className="text-2xl font-black text-amber-600 mt-1">
              ₹{pendingSettlement.toLocaleString()}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Disbursed once warehouse delivery is verified</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200/60 flex items-center justify-center text-amber-500 shadow-2xs">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Invoice Statements List */}
      <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-gray-200/60">
          <h2 className="text-base font-extrabold text-gray-900">Purchase Order Invoices</h2>
        </div>

        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-gray-400 text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            <p className="font-bold">Loading invoices...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-gray-400 text-xs">
            <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">No invoices generated yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50/80 text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-5">Invoice / PO #</th>
                  <th className="py-3.5 px-5">Billing Date</th>
                  <th className="py-3.5 px-5">Wholesale Net Total</th>
                  <th className="py-3.5 px-5">Settlement Status</th>
                  <th className="py-3.5 px-5 text-right">Invoice Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {orders.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-gray-900">
                      INV-{po.poNumber}
                    </td>
                    <td className="py-4 px-5 text-gray-500">
                      {new Date(po.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-5 font-black text-gray-900 font-mono">
                      ₹{Number(po.totalAmount).toLocaleString()}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          po.status === 'DELIVERED'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}
                      >
                        {po.status === 'DELIVERED' ? 'SETTLED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        to={`/supplier/purchase-orders/${po.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-rose-50 text-gray-700 hover:text-rose-600 border border-gray-200 text-xs font-bold transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Print Invoice
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
