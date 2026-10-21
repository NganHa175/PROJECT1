import { Link } from "react-router";
import { ctaBg } from "@/mocks/homeData";
import { Crown } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="py-12">
      <div className="relative rounded-3xl overflow-hidden border border-border">
        <img src={ctaBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-background/20" />
        <div className="relative z-10 px-8 md:px-16 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              Ready to Find Your<br className="hidden md:block" /> Next Favorite?
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg">
              Explore free titles, unlock individual movies with your Wallet, or enjoy the complete CineVault experience with Premium.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/movies" className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-primary text-white font-semibold text-base hover:bg-red-700 transition-colors gap-2">
              Explore CineVault
            </Link>
            <Link to="/subscription" className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-muted border border-border text-foreground font-semibold text-base hover:bg-muted/70 transition-colors gap-2">
              <Crown className="w-4 h-4" /> View Premium
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
