import { useState } from "react";
import { Plus, ArrowUpRight, ArrowDownLeft, TrendingUp, Receipt, Info } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_TRANSACTIONS } from "@/mocks/transactions";
import type { WalletTransaction } from "@/types";
import { toast } from "sonner";

const TOP_UP_AMOUNTS = [20000, 50000, 100000];

const TYPE_LABELS: Record<string, string> = {
  TOP_UP: "Top Up",
  MOVIE_UNLOCK: "Movie Unlock",
  EPISODE_UNLOCK: "Episode Unlock",
  SUBSCRIPTION_PAYMENT: "Premium Payment",
  ADMIN_ADJUSTMENT: "Admin Adjustment",
};

export default function WalletPage() {
  const { currentUser, addFunds, isAuthenticated } = useAuth();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [filter, setFilter] = useState("");
  const [detailTx, setDetailTx] = useState<WalletTransaction | null>(null);
  const [processing, setProcessing] = useState(false);

  const balance = currentUser?.walletBalance ?? 0;
  const transactions = currentUser
    ? MOCK_TRANSACTIONS.filter((t) => t.userId === currentUser.id)
    : [];
  const filtered = filter ? transactions.filter((t) => t.type === filter) : transactions;

  function handleAddFunds() {
    const amt = selectedAmount ?? (customAmount ? Number(customAmount) : 0);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    setProcessing(true);
    setTimeout(() => {
      addFunds(amt);
      toast.success(`${amt.toLocaleString("vi-VN")} VND added to your wallet!`);
      setAddOpen(false);
      setSelectedAmount(null);
      setCustomAmount("");
      setProcessing(false);
    }, 800);
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Sign in to view your Wallet</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">My Wallet</h1>

      {/* Balance card */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2" />
        <p className="text-muted-foreground text-sm mb-1">Current Balance</p>
        <p className="text-4xl font-black text-foreground mb-4">{balance.toLocaleString("vi-VN")} <span className="text-xl text-muted-foreground font-medium">VND</span></p>
        <Button onClick={() => setAddOpen(true)} variant="primary" size="lg">
          <Plus className="w-4 h-4" /> Add Funds
        </Button>
      </div>

      {/* Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-lg font-bold text-foreground">Transaction History</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-1.5 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none">
            <option value="">All Types</option>
            {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center gap-3">
            <Receipt className="w-12 h-12 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((tx) => {
              const isCredit = tx.amount > 0;
              return (
                <button key={tx.id} onClick={() => setDetailTx(tx)} className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors text-left">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isCredit ? "bg-emerald-900/40 border border-emerald-700/30" : "bg-red-900/20 border border-red-700/20"}`}>
                    {isCredit ? <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> : <ArrowUpRight className="w-4 h-4 text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-semibold text-sm">{TYPE_LABELS[tx.type] ?? tx.type}</p>
                    {tx.relatedContentTitle && <p className="text-muted-foreground text-xs truncate">{tx.relatedContentTitle}</p>}
                    <p className="text-muted-foreground text-xs">{new Date(tx.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-bold text-sm ${isCredit ? "text-emerald-400" : "text-red-400"}`}>
                      {isCredit ? "+" : ""}{tx.amount.toLocaleString("vi-VN")} VND
                    </p>
                    <p className="text-muted-foreground text-xs">{tx.status}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Funds modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Funds" size="sm">
        <p className="text-muted-foreground text-sm mb-4">Select an amount or enter a custom value.</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {TOP_UP_AMOUNTS.map((amt) => (
            <button key={amt} onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
              className={`py-3 rounded-xl border text-sm font-semibold transition-colors ${selectedAmount === amt ? "bg-primary text-white border-primary" : "bg-muted border-border text-foreground hover:border-primary/50"}`}>
              {(amt / 1000).toFixed(0)}K VND
            </button>
          ))}
        </div>
        <div className="mb-6">
          <label className="text-xs font-semibold text-muted-foreground block mb-2">Custom amount (VND)</label>
          <input type="number" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }} placeholder="e.g. 75000" className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-primary/50 text-sm" />
        </div>
        <p className="text-xs text-muted-foreground italic mb-4">This is a mock payment — no real charge is made.</p>
        <Button fullWidth onClick={handleAddFunds} loading={processing} disabled={!selectedAmount && !customAmount}>
          Confirm Top Up
        </Button>
      </Modal>

      {/* Transaction detail modal */}
      <Modal open={!!detailTx} onClose={() => setDetailTx(null)} title="Transaction Details" size="sm">
        {detailTx && (
          <div className="space-y-3 text-sm">
            {[
              ["ID", detailTx.id],
              ["Type", TYPE_LABELS[detailTx.type]],
              ["Status", detailTx.status],
              ["Amount", `${detailTx.amount > 0 ? "+" : ""}${detailTx.amount.toLocaleString("vi-VN")} VND`],
              ["Balance Before", `${detailTx.balanceBefore.toLocaleString("vi-VN")} VND`],
              ["Balance After", `${detailTx.balanceAfter.toLocaleString("vi-VN")} VND`],
              detailTx.relatedContentTitle ? ["Content", detailTx.relatedContentTitle] : null,
              detailTx.purchasedDurationHours ? ["Duration", `${detailTx.purchasedDurationHours}h`] : null,
              detailTx.reason ? ["Reason", detailTx.reason] : null,
              ["Date", new Date(detailTx.createdAt).toLocaleString()],
            ].filter(Boolean).map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground font-medium text-right">{value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
