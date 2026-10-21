import { useState } from "react";
import { Plus, Edit, Trash2, AlertTriangle, Check } from "lucide-react";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { MOCK_PRICE_PRESETS } from "@/mocks/transactions";
import type { PricePreset } from "@/types";
import { toast } from "sonner";

export default function AdminPricingPage() {
  const [presets, setPresets] = useState<PricePreset[]>(MOCK_PRICE_PRESETS);
  const [editTarget, setEditTarget] = useState<PricePreset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PricePreset | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", amount: "" });

  const active = presets.filter((p) => p.isActive);
  const maxReached = active.length >= 2;

  function savePreset() {
    if (!form.name || !form.amount || Number(form.amount) <= 0) { toast.error("Enter a valid name and amount"); return; }
    if (editTarget) {
      setPresets((p) => p.map((x) => x.id === editTarget.id ? { ...x, name: form.name, amount: Number(form.amount) } : x));
      toast.success("Preset updated");
    } else {
      if (maxReached) { toast.error("Maximum 2 active presets reached"); return; }
      setPresets((p) => [...p, { id: `pp${Date.now()}`, name: form.name, amount: Number(form.amount), isActive: true }]);
      toast.success("Preset created");
    }
    setEditTarget(null);
    setAddOpen(false);
    setForm({ name: "", amount: "" });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setPresets((p) => p.filter((x) => x.id !== deleteTarget.id));
    toast.success("Preset deleted. Existing content retains its latest price as a custom price.");
    setDeleteTarget(null);
  }

  function openEdit(p: PricePreset) { setEditTarget(p); setForm({ name: p.name, amount: String(p.amount) }); setAddOpen(true); }
  function openAdd() { setEditTarget(null); setForm({ name: "", amount: "" }); setAddOpen(true); }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Pricing Settings</h1>
        <Button onClick={openAdd} disabled={maxReached} title={maxReached ? "Maximum 2 active presets reached" : undefined}>
          <Plus className="w-4 h-4" /> Add Price Preset
        </Button>
      </div>

      {maxReached && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-900/20 border border-amber-700/30 mb-6">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-amber-200 text-sm">Maximum of 2 active price presets reached. Delete one before adding another.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {presets.map((preset) => (
          <div key={preset.id} className={`rounded-2xl border bg-card p-6 ${preset.isActive ? "border-primary/30" : "border-border opacity-60"}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-foreground font-bold text-lg">{preset.name}</p>
                {preset.isActive && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(preset)} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
                  <Edit className="w-4 h-4 text-foreground" />
                </button>
                <button onClick={() => setDeleteTarget(preset)} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-red-900/30 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </div>
            <p className="text-3xl font-black text-foreground">{preset.amount.toLocaleString("vi-VN")} <span className="text-base font-medium text-muted-foreground">VND</span></p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-base font-bold text-foreground mb-3">Price Selector Logic</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          When editing a movie or episode, admins can select from <strong className="text-foreground">Default Price 1</strong>, <strong className="text-foreground">Default Price 2</strong>, or a <strong className="text-foreground">Custom Price</strong>. Changing a preset amount does not retroactively change completed transactions — those retain their original price snapshot.
        </p>
      </div>

      {/* Add/Edit modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={editTarget ? "Edit Price Preset" : "Add Price Preset"} size="sm">
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-2">Preset Name</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Default Price 1" className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-primary/50 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-2">Amount (VND)</label>
            <input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="e.g. 3000" className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-primary/50 text-sm" />
          </div>
        </div>
        <div className="flex gap-3">
          <Button fullWidth variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button fullWidth onClick={savePreset}>{editTarget ? "Save Changes" : "Create Preset"}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Price Preset"
        description={`Delete "${deleteTarget?.name}"? Existing content will retain its latest amount as a custom price. Previously completed transactions keep their original price snapshots.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
