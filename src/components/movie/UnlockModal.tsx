import { useState } from "react";
import { Lock, AlertTriangle, Check, Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface UnlockModalProps {
  open: boolean;
  onClose: () => void;
  contentId: string;
  contentType: "MOVIE" | "EPISODE";
  title: string;
  price: number;
  durationHours: number;
}

export default function UnlockModal({ open, onClose, contentId, contentType, title, price, durationHours }: UnlockModalProps) {
  const { currentUser, unlockContent } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const balance = currentUser?.walletBalance ?? 0;
  const remaining = balance - price;
  const insufficient = balance < price;

  function handleUnlock() {
    setProcessing(true);
    setTimeout(() => {
      const ok = unlockContent(contentId, contentType, price, durationHours, title);
      if (ok) {
        setSuccess(true);
        toast.success(`"${title}" unlocked! Access for ${durationHours}h.`);
        setTimeout(() => { setSuccess(false); onClose(); }, 1500);
      } else {
        toast.error("Unlock failed. Insufficient balance.");
      }
      setProcessing(false);
    }, 700);
  }

  const durationLabel = durationHours >= 24 ? `${Math.round(durationHours / 24)} day${Math.round(durationHours / 24) !== 1 ? "s" : ""}` : `${durationHours} hours`;

  return (
    <Modal open={open} onClose={onClose} title="Unlock Content" size="sm">
      {success ? (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-14 h-14 rounded-full bg-emerald-900/40 border border-emerald-700/40 flex items-center justify-center">
            <Check className="w-7 h-7 text-emerald-400" />
          </div>
          <p className="text-foreground font-semibold text-center">Unlocked!</p>
          <p className="text-muted-foreground text-sm text-center">You can now watch "{title}"</p>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-semibold leading-tight">{title}</p>
              <p className="text-muted-foreground text-xs mt-0.5">Access for {durationLabel}</p>
            </div>
          </div>

          <div className="space-y-2 mb-5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price</span>
              <span className="text-foreground font-semibold">{price.toLocaleString("vi-VN")} VND</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Your balance</span>
              <span className={insufficient ? "text-red-400 font-semibold" : "text-foreground font-semibold"}>
                {balance.toLocaleString("vi-VN")} VND
              </span>
            </div>
            {!insufficient && (
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-muted-foreground">After purchase</span>
                <span className="text-foreground font-semibold">{remaining.toLocaleString("vi-VN")} VND</span>
              </div>
            )}
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-900/20 border border-amber-700/30 mb-5">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-amber-200 text-xs leading-relaxed">
              You are about to unlock this content for {price.toLocaleString("vi-VN")} VND. Access will remain active for {durationLabel}. This transaction is non-refundable.
            </p>
          </div>

          {insufficient ? (
            <div className="space-y-2">
              <p className="text-red-400 text-xs text-center mb-3">Insufficient wallet balance.</p>
              <Button fullWidth onClick={() => { onClose(); navigate("/wallet"); }} variant="secondary">
                <Plus className="w-4 h-4" /> Add Funds
              </Button>
              <Button fullWidth variant="ghost" onClick={onClose}>Cancel</Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button variant="ghost" fullWidth onClick={onClose}>Cancel</Button>
              <Button variant="primary" fullWidth onClick={handleUnlock} loading={processing}>
                Confirm Unlock
              </Button>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
