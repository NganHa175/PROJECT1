import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, Save, Lock, Unlock, Eye, EyeOff, AlertTriangle, Edit } from "lucide-react";
import Button from "@/components/ui/Button";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { MOCK_SERIES } from "@/mocks/movies";
import { MOCK_PRICE_PRESETS } from "@/mocks/transactions";
import type { Episode, PublicationStatus, AccessMode, PriceSource, EpisodeSettingSource } from "@/types";
import { toast } from "sonner";

export default function AdminSeasonEditorPage() {
  const { seriesId, seasonId } = useParams<{ seriesId: string; seasonId: string }>();
  const navigate = useNavigate();

  const series = MOCK_SERIES.find((s) => s.id === seriesId);
  const season = series?.seasons.find((s) => s.id === seasonId);
  const presets = MOCK_PRICE_PRESETS.filter((p) => p.isActive);

  const [applyConfirmMode, setApplyConfirmMode] = useState<"future" | "inheriting" | "all" | null>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>(season?.episodes ?? []);
  const [editingEp, setEditingEp] = useState<Episode | null>(null);
  const [epForm, setEpForm] = useState({ accessMode: "FREE" as AccessMode, priceSource: "PRESET_1" as PriceSource, customPrice: "", unlockDurationHours: "24", publicationStatus: "PUBLISHED" as PublicationStatus });

  const [seasonForm, setSeasonForm] = useState({
    defaultAccessMode: season?.defaultAccessMode ?? "FREE" as AccessMode,
    defaultPriceSource: season?.defaultPriceSource ?? "PRESET_1" as PriceSource,
    defaultCustomPrice: String(season?.defaultCustomPrice ?? ""),
    defaultUnlockDurationHours: String(season?.defaultUnlockDurationHours ?? 24),
    publicationStatus: season?.publicationStatus ?? "PUBLISHED" as PublicationStatus,
  });

  if (!series || !season) {
    return <div className="text-center py-16"><p className="text-muted-foreground">Season not found.</p></div>;
  }

  function openEditEp(ep: Episode) {
    setEditingEp(ep);
    setEpForm({ accessMode: ep.accessMode, priceSource: ep.priceSource, customPrice: String(ep.customPrice ?? ""), unlockDurationHours: String(ep.unlockDurationHours), publicationStatus: ep.publicationStatus });
  }

  function saveEpisode() {
    if (!editingEp) return;
    setEpisodes((prev) => prev.map((e) => e.id === editingEp.id ? {
      ...e, ...epForm, resolvedPrice: epForm.priceSource === "PRESET_1" ? presets[0]?.amount ?? 0 : epForm.priceSource === "PRESET_2" ? presets[1]?.amount ?? 0 : Number(epForm.customPrice), settingSource: "OVERRIDE" as EpisodeSettingSource,
    } : e));
    setEditingEp(null);
    toast.success("Episode updated");
  }

  function applyToAll(mode: "future" | "inheriting" | "all") {
    setEpisodes((prev) => prev.map((e) => {
      if (mode === "future") return e;
      if (mode === "inheriting" && e.settingSource !== "SEASON") return e;
      return {
        ...e, accessMode: seasonForm.defaultAccessMode, priceSource: seasonForm.defaultPriceSource, unlockDurationHours: Number(seasonForm.defaultUnlockDurationHours),
        resolvedPrice: seasonForm.defaultPriceSource === "PRESET_1" ? presets[0]?.amount ?? 0 : seasonForm.defaultPriceSource === "PRESET_2" ? presets[1]?.amount ?? 0 : Number(seasonForm.defaultCustomPrice),
        settingSource: "SEASON" as EpisodeSettingSource,
      };
    }));
    toast.success("Season defaults applied");
    setApplyDialogOpen(false);
    setApplyConfirmMode(null);
  }

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold text-foreground mb-1">{series.title}</h1>
      <p className="text-muted-foreground text-sm mb-6">{season.title} · {season.episodes.length} episodes</p>

      {/* Season defaults */}
      <div className="p-5 rounded-2xl border border-border bg-card mb-6">
        <h2 className="text-sm font-bold text-foreground mb-4">Season Default Settings</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Default Access</label>
            <div className="flex gap-2">
              {(["FREE", "LOCKED"] as const).map((a) => (
                <button key={a} onClick={() => setSeasonForm((f) => ({ ...f, defaultAccessMode: a }))} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-colors ${seasonForm.defaultAccessMode === a ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {a === "FREE" ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}{a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Default Unlock Duration (hours)</label>
            <input type="number" value={seasonForm.defaultUnlockDurationHours} onChange={(e) => setSeasonForm((f) => ({ ...f, defaultUnlockDurationHours: e.target.value }))} className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none" />
          </div>
        </div>
        <Button onClick={() => setApplyDialogOpen(true)} variant="secondary" size="sm">Apply to All Episodes</Button>
      </div>

      {/* Episode table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                {["#", "Title", "Status", "Access", "Price", "Duration", "Source", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {episodes.map((ep) => (
                <tr key={ep.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground text-xs">{ep.episodeNumber}</td>
                  <td className="px-4 py-3 text-foreground font-medium text-xs max-w-[160px] truncate">{ep.title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${ep.publicationStatus === "PUBLISHED" ? "bg-emerald-900/40 text-emerald-400" : "bg-amber-900/30 text-amber-400"}`}>{ep.publicationStatus}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${ep.accessMode === "FREE" ? "bg-blue-900/30 text-blue-400" : "bg-muted text-muted-foreground"}`}>{ep.accessMode}</span>
                  </td>
                  <td className="px-4 py-3 text-foreground text-xs">{ep.accessMode === "LOCKED" ? `${ep.resolvedPrice.toLocaleString("vi-VN")} VND` : "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{ep.unlockDurationHours}h</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${ep.settingSource === "SEASON" ? "bg-muted text-muted-foreground" : "bg-primary/15 text-primary"}`}>{ep.settingSource}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEditEp(ep)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
                      <Edit className="w-3.5 h-3.5 text-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply dialog */}
      <Modal open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} title="Apply Season Defaults" size="sm">
        <p className="text-muted-foreground text-sm mb-4">Choose how to apply the season default settings:</p>
        <div className="space-y-2 mb-6">
          {[
            { mode: "future" as const, label: "Apply only to future episodes", desc: "Existing episodes are not changed." },
            { mode: "inheriting" as const, label: "Update episodes inheriting season settings", desc: "Only episodes with source = SEASON are updated." },
            { mode: "all" as const, label: "Override all episodes", desc: "All episodes, including manually edited ones, will be overridden.", warning: true },
          ].map(({ mode, label, desc, warning }) => (
            <button key={mode} onClick={() => setApplyConfirmMode(mode)} className={`w-full text-left p-3 rounded-xl border transition-colors ${applyConfirmMode === mode ? "border-primary bg-primary/10" : "border-border bg-muted hover:border-primary/40"}`}>
              <p className="text-foreground text-sm font-medium flex items-center gap-2">
                {warning && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}{label}
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <Button fullWidth variant="ghost" onClick={() => setApplyDialogOpen(false)}>Cancel</Button>
          <Button fullWidth disabled={!applyConfirmMode} onClick={() => applyConfirmMode && applyToAll(applyConfirmMode)}>Apply</Button>
        </div>
      </Modal>

      {/* Episode edit modal */}
      <Modal open={!!editingEp} onClose={() => setEditingEp(null)} title={`Edit Episode ${editingEp?.episodeNumber}`} size="sm">
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Publication Status</label>
            <div className="flex gap-2">
              {(["PUBLISHED", "HIDDEN"] as const).map((s) => (
                <button key={s} onClick={() => setEpForm((f) => ({ ...f, publicationStatus: s }))} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-colors ${epForm.publicationStatus === s ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {s === "PUBLISHED" ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}{s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Access Mode</label>
            <div className="flex gap-2">
              {(["FREE", "LOCKED"] as const).map((a) => (
                <button key={a} onClick={() => setEpForm((f) => ({ ...f, accessMode: a }))} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-colors ${epForm.accessMode === a ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {a === "FREE" ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}{a}
                </button>
              ))}
            </div>
          </div>
          {epForm.accessMode === "LOCKED" && (
            <>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Price Source</label>
                <select value={epForm.priceSource} onChange={(e) => setEpForm((f) => ({ ...f, priceSource: e.target.value as PriceSource }))} className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none">
                  {presets[0] && <option value="PRESET_1">{presets[0].name} ({presets[0].amount.toLocaleString("vi-VN")} VND)</option>}
                  {presets[1] && <option value="PRESET_2">{presets[1].name} ({presets[1].amount.toLocaleString("vi-VN")} VND)</option>}
                  <option value="CUSTOM">Custom Price</option>
                </select>
              </div>
              {epForm.priceSource === "CUSTOM" && (
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Custom Price (VND)</label>
                  <input type="number" value={epForm.customPrice} onChange={(e) => setEpForm((f) => ({ ...f, customPrice: e.target.value }))} className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none" />
                </div>
              )}
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Unlock Duration (hours)</label>
                <input type="number" value={epForm.unlockDurationHours} onChange={(e) => setEpForm((f) => ({ ...f, unlockDurationHours: e.target.value }))} className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none" />
              </div>
            </>
          )}
        </div>
        <div className="flex gap-3">
          <Button fullWidth variant="ghost" onClick={() => setEditingEp(null)}>Cancel</Button>
          <Button fullWidth onClick={saveEpisode}><Save className="w-4 h-4" /> Save Episode</Button>
        </div>
      </Modal>
    </div>
  );
}
