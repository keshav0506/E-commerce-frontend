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
import type { PurchaseOrder } from '../../types/supplier';

export const SupplierInvoicesPage: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
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
        <h1 className="text-2xl font-black text-white tracking-tight">Invoices & Settlement Ledger</h1>
        <p className="text-xs text-slate-400 mt-1">
          B2B wholesale purchase invoices, verified payout summaries, and settlement reconciliation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Delivered & Settled Revenue</p>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              ₹{totalPayable.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Eligible for scheduled bank disbursement</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">In-Transit / Unsettled Pipeline</p>
            <div className="text-2xl font-black text-amber-400 mt-1">
              ₹{pendingSettlement.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Disbursed once warehouse delivery is verified</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Invoice Statements List */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800/80">
          <h2 className="text-base font-bold text-white">Purchase Order Invoices</h2>
        </div>

        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p>Loading invoices...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs">
            <Receipt className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p>No invoices generated yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Invoice / PO #</th>
                  <th className="py-3.5 px-4">Billing Date</th>
                  <th className="py-3.5 px-4">Wholesale Net Total</th>
                  <th className="py-3.5 px-4">Settlement Status</th>
                  <th className="py-3.5 px-4 text-right">Invoice Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {orders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      INV-{po.poNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(po.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white font-mono">
                      ₹{Number(po.totalAmount).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          po.status === 'DELIVERED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {po.status === 'DELIVERED' ? 'SETTLED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/supplier/purchase-orders/${po.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                      >
                        <Printer className="w-3 h-3" />
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
