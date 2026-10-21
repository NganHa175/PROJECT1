import { useState, useMemo } from "react";
import { Search, ChevronRight, AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { MOCK_TRANSACTIONS } from "@/mocks/transactions";
import { MOCK_USERS } from "@/mocks/users";
import type { WalletTransaction } from "@/types";
import { toast } from "sonner";

const TYPE_LABELS: Record<string, string> = {
  TOP_UP: "Top Up", MOVIE_UNLOCK: "Movie Unlock", EPISODE_UNLOCK: "Episode Unlock",
  SUBSCRIPTION_PAYMENT: "Premium Payment", ADMIN_ADJUSTMENT: "Admin Adjustment",
};

export default function AdminTransactionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detailTx, setDetailTx] = useState<WalletTransaction | null>(null);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustUser, setAdjustUser] = useState("");
  const [adjustDir, setAdjustDir] = useState<"increase" | "decrease">("increase");
  const [adjustAmt, setAdjustAmt] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((t) => {
      if (search && !t.id.includes(search) && !t.userId.includes(search)) return false;
      if (typeFilter && t.type !== typeFilter) return false;
      if (statusFilter && t.status !== statusFilter) return false;
      return true;
    });
  }, [search, typeFilter, statusFilter]);

  function handleAdjust() {
    if (!adjustUser || !adjustAmt || Number(adjustAmt) <= 0 || !adjustReason) { toast.error("Fill all fields"); return; }
    setProcessing(true);
    setTimeout(() => {
      toast.success(`Wallet adjusted for ${adjustUser}`);
      setAdjustOpen(false); setAdjustUser(""); setAdjustAmt(""); setAdjustReason(""); setAdjustDir("increase");
      setProcessing(false);
    }, 800);
  }

  const getUserName = (userId: string) => MOCK_USERS.find((u) => u.id === userId)?.name ?? userId;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">Transaction Management</h1>
        <Button onClick={() => setAdjustOpen(true)} variant="secondary">Admin Adjustment</Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Transaction ID or user..." className="pl-9 pr-4 py-2 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:border-primary/50 w-56" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none">
          <option value="">All Types</option>
          {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none">
          <option value="">All Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
          <option value="PENDING">Pending</option>
        </select>
        <span className="ml-auto text-sm text-muted-foreground self-center">{filtered.length} transactions</span>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-border">
                {["ID", "User", "Type", "Amount", "Balance After", "Status", "Date", ""].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr key={tx.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{tx.id}</td>
                  <td className="px-4 py-3 text-foreground text-sm">{getUserName(tx.userId)}</td>
                  <td className="px-4 py-3 text-foreground text-xs">{TYPE_LABELS[tx.type] ?? tx.type}</td>
                  <td className={`px-4 py-3 font-semibold text-sm ${tx.amount > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("vi-VN")} VND
                  </td>
                  <td className="px-4 py-3 text-foreground text-sm">{tx.balanceAfter.toLocaleString("vi-VN")} VND</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${tx.status === "COMPLETED" ? "bg-emerald-900/40 text-emerald-400" : tx.status === "FAILED" ? "bg-red-900/40 text-red-400" : "bg-amber-900/40 text-amber-400"}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDetailTx(tx)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
                      <ChevronRight className="w-3.5 h-3.5 text-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      <Modal open={!!detailTx} onClose={() => setDetailTx(null)} title="Transaction Details" size="sm">
        {detailTx && (
          <div className="space-y-3 text-sm">
            {[
              ["ID", detailTx.id], ["User", getUserName(detailTx.userId)], ["Type", TYPE_LABELS[detailTx.type]],
              ["Status", detailTx.status], ["Amount", `${detailTx.amount > 0 ? "+" : ""}${detailTx.amount.toLocaleString("vi-VN")} VND`],
              ["Balance Before", `${detailTx.balanceBefore.toLocaleString("vi-VN")} VND`],
              ["Balance After", `${detailTx.balanceAfter.toLocaleString("vi-VN")} VND`],
              detailTx.relatedContentTitle ? ["Content", detailTx.relatedContentTitle] : null,
              detailTx.purchasedDurationHours ? ["Duration", `${detailTx.purchasedDurationHours}h`] : null,
              detailTx.reason ? ["Reason", detailTx.reason] : null,
              ["Date", new Date(detailTx.createdAt).toLocaleString()],
            ].filter(Boolean).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <span className="text-muted-foreground">{k}</span>
                <span className="text-foreground font-medium text-right break-all">{v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Admin adjustment modal */}
      <Modal open={adjustOpen} onClose={() => setAdjustOpen(false)} title="Admin Wallet Adjustment" size="sm">
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-900/20 border border-amber-700/30 mb-5">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-amber-200 text-xs leading-relaxed">This will directly modify a user's wallet balance. No refund button is available — adjustments are for exceptional cases only.</p>
        </div>
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-2">User</label>
            <select value={adjustUser} onChange={(e) => setAdjustUser(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none">
              <option value="">Select user...</option>
              {MOCK_USERS.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-2">Direction</label>
            <div className="flex gap-2">
              {(["increase", "decrease"] as const).map((d) => (
                <button key={d} onClick={() => setAdjustDir(d)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${adjustDir === d ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-2">Amount (VND)</label>
            <input type="number" value={adjustAmt} onChange={(e) => setAdjustAmt(e.target.value)} placeholder="e.g. 10000" className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-primary/50 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-2">Reason</label>
            <textarea value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} placeholder="Reason for adjustment..." rows={2} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-primary/50 text-sm resize-none" />
          </div>
        </div>
        <div className="flex gap-3">
          <Button fullWidth variant="ghost" onClick={() => setAdjustOpen(false)}>Cancel</Button>
          <Button fullWidth loading={processing} onClick={handleAdjust}>Confirm Adjustment</Button>
        </div>
      </Modal>
    </div>
  );
}
