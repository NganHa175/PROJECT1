import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, Save, Lock, Unlock, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import { MOCK_MOVIES } from "@/mocks/movies";
import { MOCK_PRICE_PRESETS } from "@/mocks/transactions";
import type { PublicationStatus, AccessMode, PriceSource } from "@/types";
import { toast } from "sonner";

export default function AdminMovieEditorPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const movie = MOCK_MOVIES.find((m) => m.id === movieId);

  const [form, setForm] = useState({
    publicationStatus: (movie?.publicationStatus ?? "PUBLISHED") as PublicationStatus,
    playbackUrl: movie?.playbackUrl ?? "",
    trailerUrl: movie?.trailerYoutubeId ? `https://youtube.com/watch?v=${movie.trailerYoutubeId}` : "",
    accessMode: (movie?.accessMode ?? "FREE") as AccessMode,
    priceSource: (movie?.priceSource ?? "PRESET_1") as PriceSource,
    customPrice: String(movie?.customPrice ?? ""),
    unlockDurationHours: String(movie?.unlockDurationHours ?? 24),
  });

  const presets = MOCK_PRICE_PRESETS.filter((p) => p.isActive);

  function resolvedPrice() {
    if (form.priceSource === "PRESET_1") return presets[0]?.amount ?? 0;
    if (form.priceSource === "PRESET_2") return presets[1]?.amount ?? 0;
    return Number(form.customPrice) || 0;
  }

  function handleSave() {
    if (form.accessMode === "LOCKED" && resolvedPrice() <= 0) { toast.error("Set a valid price for locked content"); return; }
    toast.success("Movie settings saved");
    navigate("/admin/content");
  }

  if (!movie) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Movie not found.</p>
        <button onClick={() => navigate("/admin/content")} className="text-primary hover:underline text-sm mt-2">Back to Content</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Content
      </button>

      <div className="flex items-start gap-4 mb-8">
        <img src={movie.posterUrl} alt={movie.title} className="w-20 rounded-xl object-cover aspect-[2/3] border border-border flex-shrink-0" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">{movie.title}</h1>
          <p className="text-muted-foreground text-sm">{movie.releaseYear} · {movie.director}</p>
          <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{movie.overview}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Publication */}
        <div className="p-5 rounded-2xl border border-border bg-card">
          <h2 className="text-sm font-bold text-foreground mb-3">Publication</h2>
          <div className="flex gap-2">
            {(["PUBLISHED", "HIDDEN"] as const).map((s) => (
              <button key={s} onClick={() => setForm((f) => ({ ...f, publicationStatus: s }))} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${form.publicationStatus === s ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                {s === "PUBLISHED" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Playback */}
        <div className="p-5 rounded-2xl border border-border bg-card">
          <h2 className="text-sm font-bold text-foreground mb-3">Playback & Trailer</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Playback URL</label>
              <input value={form.playbackUrl} onChange={(e) => setForm((f) => ({ ...f, playbackUrl: e.target.value }))} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-primary/50 text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Trailer YouTube URL</label>
              <input value={form.trailerUrl} onChange={(e) => setForm((f) => ({ ...f, trailerUrl: e.target.value }))} placeholder="https://youtube.com/watch?v=..." className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-primary/50 text-sm" />
            </div>
          </div>
        </div>

        {/* Access */}
        <div className="p-5 rounded-2xl border border-border bg-card">
          <h2 className="text-sm font-bold text-foreground mb-3">Access Settings</h2>
          <div className="flex gap-2 mb-4">
            {(["FREE", "LOCKED"] as const).map((a) => (
              <button key={a} onClick={() => setForm((f) => ({ ...f, accessMode: a }))} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${form.accessMode === a ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                {a === "FREE" ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {a}
              </button>
            ))}
          </div>

          {form.accessMode === "LOCKED" && (
            <div className="space-y-3 pt-3 border-t border-border">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Price Source</label>
                <div className="flex flex-wrap gap-2">
                  {([
                    { label: presets[0] ? `${presets[0].name} (${presets[0].amount.toLocaleString("vi-VN")} VND)` : "Default Price 1", value: "PRESET_1" as PriceSource },
                    { label: presets[1] ? `${presets[1].name} (${presets[1].amount.toLocaleString("vi-VN")} VND)` : "Default Price 2", value: "PRESET_2" as PriceSource },
                    { label: "Custom Price", value: "CUSTOM" as PriceSource },
                  ]).map(({ label, value }) => (
                    <button key={value} onClick={() => setForm((f) => ({ ...f, priceSource: value }))} disabled={value === "PRESET_2" && !presets[1]} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${form.priceSource === value ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {form.priceSource === "CUSTOM" && (
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Custom Price (VND)</label>
                  <input type="number" value={form.customPrice} onChange={(e) => setForm((f) => ({ ...f, customPrice: e.target.value }))} placeholder="e.g. 5000" className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-primary/50 text-sm" />
                </div>
              )}
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Unlock Duration</label>
                <input type="number" value={form.unlockDurationHours} onChange={(e) => setForm((f) => ({ ...f, unlockDurationHours: e.target.value }))} placeholder="Hours" className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-primary/50 text-sm" />
                <p className="text-muted-foreground text-xs mt-1">{Number(form.unlockDurationHours) >= 24 ? `${Math.round(Number(form.unlockDurationHours) / 24)} day${Math.round(Number(form.unlockDurationHours) / 24) !== 1 ? "s" : ""}` : `${form.unlockDurationHours} hours`}</p>
              </div>

              {/* Preview */}
              <div className="pt-3 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Preview: User-facing locked card</p>
                <div className="relative w-28 rounded-xl overflow-hidden border border-border">
                  <img src={movie.posterUrl} alt="" className="w-full aspect-[2/3] object-cover opacity-60" />
                  <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-1">
                    <Lock className="w-5 h-5 text-white" />
                    <span className="text-white text-xs font-semibold bg-black/50 px-2 py-0.5 rounded-full">
                      {resolvedPrice().toLocaleString("vi-VN")} VND
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={handleSave}><Save className="w-4 h-4" /> Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
