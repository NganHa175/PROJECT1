import {
  p00, p01, p02, p03, p04, p05, p06, p07, p08,
  p09, p10, p11, p12, p13, p14, p15, p16, p17,
  p18, p19, p20, p21, p22, p23, p24, p25, p26,
  p27, p28, p29, p30, p31, p32, p33, p34, p35,
  c00, c03, c04, c05, c06, c07, c08, c09, c10,
  c11, c12, c13, c14, c15, c16, c17, c18, c19,
  ctaBg,
} from "@/app/images";

export const HERO_ROW_1 = [p00, p01, p02, p03, p04, p05, p06, p07, p08];
export const HERO_ROW_2 = [p09, p10, p11, p12, p13, p14, p15, p16, p17];
export const HERO_ROW_3 = [p18, p19, p20, p21, p22, p23, p24, p25, p26];
export const HERO_ROW_4 = [p27, p28, p29, p30, p31, p32, p33, p34, p35];

export const HOME_CATEGORIES = [
  { name: "Action", imgs: [c00, p18, p20, c03] },
  { name: "Adventure", imgs: [c04, c05, c06, c07] },
  { name: "Comedy", imgs: [c08, c09, c10, c11] },
  { name: "Drama", imgs: [c12, c13, c14, c15] },
  { name: "Horror", imgs: [c16, c17, c18, c19] },
];

export { ctaBg };

export const HOME_FEATURES = [
  { icon: "Compass", title: "Discover Movies", desc: "Browse trending movies, new releases, TV series, and carefully organized genres." },
  { icon: "Unlock", title: "Flexible Unlocking", desc: "Unlock individual movies or episodes using your CineVault Wallet for the displayed access period." },
  { icon: "Crown", title: "One Premium Plan", desc: "Access all published locked content while your Premium subscription remains active." },
  { icon: "Play", title: "Continue Watching", desc: "Resume movies and episodes from your latest saved playback position." },
  { icon: "Sparkles", title: "Personal Recommendations", desc: "Receive suggestions based on your watch history, favorites, and preferred genres." },
  { icon: "Wallet", title: "Secure Wallet", desc: "View your balance and transaction history before confirming any content purchase." },
];

export const HOME_FAQS = [
  { q: "What is CineVault?", a: "CineVault is a movie and TV-series platform where you can watch free content, temporarily unlock individual titles, or subscribe to one Premium plan." },
  { q: "How do I unlock a movie or episode?", a: "Add funds to your CineVault Wallet, select a locked title, review its price and access duration, and confirm the transaction." },
  { q: "How long does an individual unlock last?", a: "The access duration is displayed before payment and may vary by movie or episode. Your expiration date is available in your account." },
  { q: "What happens when my access expires?", a: "The content becomes locked again. Your previous transaction remains visible, and you may unlock the content again." },
  { q: "What does Premium include?", a: "Premium provides access to all published locked movies and episodes while your subscription remains active." },
  { q: "Can I unlock individual content without Premium?", a: "Yes. You can use your CineVault Wallet to unlock individual movies or episodes without subscribing." },
  { q: "Are completed transactions refundable?", a: "No. CineVault transactions are non-refundable, so the price and access duration are shown before confirmation." },
  { q: "How are movies recommended to me?", a: "Recommendations are generated from movie metadata, watch history, favorites, and the genres you interact with." },
];

export const PREMIUM_BENEFITS = [
  "One Premium plan",
  "Access to all published locked content",
  "Manual renewal",
  "Payment through CineVault Wallet",
  "Personalized recommendations",
];

export const WALLET_BENEFITS = [
  "No recurring payment",
  "Price shown before confirmation",
  "Time-limited access",
  "Complete transaction history",
  "Unlock only the content you want",
];
