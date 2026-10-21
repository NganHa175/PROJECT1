import { useState } from "react";
import { Crown, Check, Clock, AlertTriangle, Wallet } from "lucide-react";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";
import { PREMIUM_PRICE } from "@/mocks/movies";
import { PREMIUM_BENEFITS } from "@/mocks/homeData";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function SubscriptionPage() {
  const { currentUser, hasPremium, isAuthenticated, addFunds } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const balance = currentUser?.walletBalance ?? 0;
  const insufficient = balance < PREMIUM_PRICE;

  function handleSubscribe() {
    if (!isAuthenticated) { navigate("/login"); return; }
    setConfirmOpen(true);
  }

  function confirmSubscribe() {
    setProcessing(true);
    setTimeout(() => {
      toast.success("CineVault Premium activated! Enjoy unlimited access.");
      setConfirmOpen(false);
      setProcessing(false);
    }, 1000);
  }

  const subStatus = currentUser?.premium.status;
  const expDate = currentUser?.premium.expirationDate;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3">CineVault Premium</h1>
        <p className="text-muted-foreground text-base max-w-lg mx-auto">
          Access all published locked movies and episodes while your Premium subscription remains active.
        </p>
      </div>

      {/* Status card for logged-in users */}
      {isAuthenticated && subStatus && subStatus !== "NONE" && (
        <div className={`rounded-2xl border p-6 mb-8 flex items-start gap-4 ${subStatus === "ACTIVE" ? "border-amber-700/40 bg-amber-950/20" : "border-red-700/30 bg-red-950/20"}`}>
          <Crown className={`w-6 h-6 flex-shrink-0 mt-0.5 ${subStatus === "ACTIVE" ? "text-amber-400" : "text-red-400"}`} />
          <div>
            <p className={`font-semibold ${subStatus === "ACTIVE" ? "text-amber-300" : "text-red-300"}`}>
              {subStatus === "ACTIVE" ? "Premium Active" : "Premium Expired"}
            </p>
            {expDate && (
              <p className="text-muted-foreground text-sm flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                {subStatus === "ACTIVE" ? "Expires" : "Expired"} {new Date(expDate).toLocaleDateString()}
              </p>
            )}
            {subStatus === "ACTIVE" && (
              <p className="text-muted-foreground text-xs mt-1">Manual renewal required — no automatic charges.</p>
            )}
          </div>
        </div>
      )}

      {/* Premium card */}
      <div className="rounded-2xl border border-amber-700/40 bg-gradient-to-b from-amber-950/30 to-card p-8 md:p-10 relative overflow-hidden mx-auto max-w-md">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-500/5 -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-700/30 flex items-center justify-center">
            <Crown className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">CineVault Premium</h2>
            <p className="text-amber-400 text-xs font-semibold">ONE PLAN · MANUAL RENEWAL</p>
          </div>
        </div>

        <div className="mb-6">
          <span className="text-4xl font-black text-foreground">{PREMIUM_PRICE.toLocaleString("vi-VN")}</span>
          <span className="text-muted-foreground ml-1">VND / month</span>
        </div>

        <ul className="space-y-3 mb-8">
          {PREMIUM_BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <span className="w-5 h-5 rounded-full bg-amber-900/40 border border-amber-700/30 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-amber-400" />
              </span>
              {b}
            </li>
          ))}
        </ul>

        {isAuthenticated && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border mb-4 text-sm">
            <Wallet className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">Wallet:</span>
            <span className={`font-semibold ${insufficient ? "text-red-400" : "text-foreground"}`}>
              {balance.toLocaleString("vi-VN")} VND
            </span>
            {insufficient && <span className="text-red-400 text-xs ml-auto">Insufficient</span>}
          </div>
        )}

        <Button
          fullWidth
          size="lg"
          variant={hasPremium ? "secondary" : "primary"}
          onClick={handleSubscribe}
        >
          <Crown className="w-4 h-4" />
          {!isAuthenticated ? "Sign In to Subscribe" : hasPremium ? "Renew Premium" : "Get Premium"}
        </Button>

        {isAuthenticated && insufficient && (
          <Button fullWidth size="md" variant="ghost" className="mt-2" onClick={() => navigate("/wallet")}>
            Add Funds to Wallet
          </Button>
        )}

        <p className="text-muted-foreground text-xs text-center mt-4">
          No automatic renewal · Paid via CineVault Wallet · Non-refundable
        </p>
      </div>

      {/* Confirm dialog */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Premium Subscription" size="sm">
        {insufficient ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-400" />
            <p className="text-foreground font-semibold">Insufficient wallet balance</p>
            <p className="text-muted-foreground text-sm">You need {PREMIUM_PRICE.toLocaleString("vi-VN")} VND but only have {balance.toLocaleString("vi-VN")} VND.</p>
            <Button fullWidth onClick={() => { setConfirmOpen(false); navigate("/wallet"); }}>Add Funds</Button>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-4">
              You are about to subscribe to <strong className="text-foreground">CineVault Premium</strong> for {PREMIUM_PRICE.toLocaleString("vi-VN")} VND.
              Access will remain active for 1 month. This payment is non-refundable and will be deducted from your wallet.
            </p>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-foreground font-semibold">{PREMIUM_PRICE.toLocaleString("vi-VN")} VND</span>
            </div>
            <div className="flex justify-between text-sm border-t border-border pt-3 mb-6">
              <span className="text-muted-foreground">Remaining balance</span>
              <span className="text-foreground font-semibold">{(balance - PREMIUM_PRICE).toLocaleString("vi-VN")} VND</span>
            </div>
            <div className="flex gap-3">
              <Button fullWidth variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button fullWidth variant="primary" loading={processing} onClick={confirmSubscribe}>
                <Crown className="w-4 h-4" /> Confirm
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
