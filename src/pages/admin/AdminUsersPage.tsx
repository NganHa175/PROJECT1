import { useState } from "react";
import { Search, Lock, Unlock, Crown, ChevronRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { MOCK_USERS } from "@/mocks/users";
import { MOCK_TRANSACTIONS } from "@/mocks/transactions";
import type { User } from "@/types";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [premFilter, setPremFilter] = useState("");
  const [statuses, setStatuses] = useState<Record<string, "ACTIVE" | "LOCKED">>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filtered = MOCK_USERS.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter && u.role !== roleFilter) return false;
    if (premFilter && u.premium.status !== premFilter) return false;
    return true;
  });

  function toggleLock(u: User) {
    const current = statuses[u.id] ?? u.accountStatus;
    const next = current === "ACTIVE" ? "LOCKED" : "ACTIVE";
    setStatuses((p) => ({ ...p, [u.id]: next }));
    toast.success(`Account ${next === "LOCKED" ? "locked" : "unlocked"}`);
  }

  const userTx = selectedUser ? MOCK_TRANSACTIONS.filter((t) => t.userId === selectedUser.id) : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">User Management</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or email..." className="pl-9 pr-4 py-2 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:border-primary/50 w-56" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none">
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select value={premFilter} onChange={(e) => setPremFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none">
          <option value="">All Premium</option>
          <option value="ACTIVE">Premium Active</option>
          <option value="EXPIRED">Premium Expired</option>
          <option value="NONE">No Premium</option>
        </select>
        <span className="ml-auto text-sm text-muted-foreground self-center">{filtered.length} users</span>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Email", "Role", "Premium", "Status", "Balance", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const accStatus = statuses[u.id] ?? u.accountStatus;
                return (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary text-xs font-bold">{u.name[0]}</span>
                        </div>
                        <span className="text-foreground font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{u.email}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted text-foreground">{u.role}</span></td>
                    <td className="px-4 py-3">
                      {u.premium.status === "ACTIVE" ? (
                        <span className="flex items-center gap-1 text-xs text-amber-400"><Crown className="w-3 h-3" />Active</span>
                      ) : u.premium.status === "EXPIRED" ? (
                        <span className="text-xs text-muted-foreground">Expired</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${accStatus === "ACTIVE" ? "bg-emerald-900/40 text-emerald-400" : "bg-red-900/40 text-red-400"}`}>
                        {accStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground text-xs">{u.walletBalance.toLocaleString("vi-VN")} VND</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => toggleLock(u)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors" title={accStatus === "ACTIVE" ? "Lock account" : "Unlock account"}>
                          {accStatus === "ACTIVE" ? <Lock className="w-3.5 h-3.5 text-foreground" /> : <Unlock className="w-3.5 h-3.5 text-foreground" />}
                        </button>
                        <button onClick={() => setSelectedUser(u)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors" title="View details">
                          <ChevronRight className="w-3.5 h-3.5 text-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User detail drawer */}
      <Modal open={!!selectedUser} onClose={() => setSelectedUser(null)} title={selectedUser?.name ?? ""} size="md">
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Email", selectedUser.email],
                ["Role", selectedUser.role],
                ["Status", statuses[selectedUser.id] ?? selectedUser.accountStatus],
                ["Wallet", `${selectedUser.walletBalance.toLocaleString("vi-VN")} VND`],
                ["Premium", selectedUser.premium.status],
                ["Member Since", new Date(selectedUser.createdAt).toLocaleDateString()],
              ].map(([k, v]) => (
                <div key={k} className="p-3 rounded-xl bg-muted">
                  <p className="text-muted-foreground text-xs mb-0.5">{k}</p>
                  <p className="text-foreground font-medium text-sm">{v}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-foreground font-semibold text-sm mb-2">Recent Transactions</p>
              {userTx.length === 0 ? (
                <p className="text-muted-foreground text-sm">No transactions.</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {userTx.slice(0, 8).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-2 rounded-lg bg-muted text-xs">
                      <span className="text-muted-foreground">{tx.type.replace(/_/g, " ")} · {new Date(tx.createdAt).toLocaleDateString()}</span>
                      <span className={tx.amount > 0 ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                        {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("vi-VN")} VND
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
