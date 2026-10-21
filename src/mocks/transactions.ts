import type { WalletTransaction, WatchHistory, Favorite, PricePreset, ContentAccess } from "@/types";

export const MOCK_PRICE_PRESETS: PricePreset[] = [
  { id: "pp1", name: "Default Price 1", amount: 3000, isActive: true },
  { id: "pp2", name: "Default Price 2", amount: 7000, isActive: true },
];

export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  { id: "tx1", userId: "u1", type: "TOP_UP", status: "COMPLETED", amount: 50000, balanceBefore: 2000, balanceAfter: 52000, createdAt: "2026-09-10T14:30:00Z" },
  { id: "tx2", userId: "u1", type: "MOVIE_UNLOCK", status: "COMPLETED", amount: -3000, balanceBefore: 55000, balanceAfter: 52000, relatedContentId: "m3", relatedContentType: "MOVIE", relatedContentTitle: "The Dark Knight", purchasedDurationHours: 48, createdAt: "2026-09-11T09:15:00Z" },
  { id: "tx3", userId: "u1", type: "EPISODE_UNLOCK", status: "COMPLETED", amount: -3000, balanceBefore: 52000, balanceAfter: 49000, relatedContentId: "ep4", relatedContentType: "EPISODE", relatedContentTitle: "MADMAX (Stranger Things S2E1)", purchasedDurationHours: 24, createdAt: "2026-09-11T20:00:00Z" },
  { id: "tx4", userId: "u2", type: "TOP_UP", status: "COMPLETED", amount: 100000, balanceBefore: 20000, balanceAfter: 120000, createdAt: "2026-08-28T11:00:00Z" },
  { id: "tx5", userId: "u2", type: "SUBSCRIPTION_PAYMENT", status: "COMPLETED", amount: -99000, balanceBefore: 120000, balanceAfter: 21000, createdAt: "2026-08-31T10:00:00Z" },
  { id: "tx6", userId: "u1", type: "MOVIE_UNLOCK", status: "FAILED", amount: -7000, balanceBefore: 3000, balanceAfter: 3000, relatedContentId: "m17", relatedContentType: "MOVIE", relatedContentTitle: "Avatar: The Way of Water", purchasedDurationHours: 72, createdAt: "2026-09-12T08:30:00Z" },
  { id: "tx7", userId: "u4", type: "ADMIN_ADJUSTMENT", status: "COMPLETED", amount: 5000, balanceBefore: 0, balanceAfter: 5000, reason: "Compensation for service disruption", createdAt: "2026-09-05T15:00:00Z" },
  { id: "tx8", userId: "u1", type: "TOP_UP", status: "COMPLETED", amount: 20000, balanceBefore: 0, balanceAfter: 20000, createdAt: "2026-09-01T12:00:00Z" },
];

export const MOCK_CONTENT_ACCESS: ContentAccess[] = [
  { contentId: "m3", contentType: "MOVIE", userId: "u1", purchasedAt: "2026-09-11T09:15:00Z", expiresAt: "2026-09-13T09:15:00Z", pricePaid: 3000, durationHours: 48 },
  { contentId: "ep4", contentType: "EPISODE", userId: "u1", purchasedAt: "2026-09-11T20:00:00Z", expiresAt: "2026-09-12T20:00:00Z", pricePaid: 3000, durationHours: 24 },
];

export const MOCK_WATCH_HISTORY: WatchHistory[] = [
  { id: "wh1", userId: "u1", contentId: "m2", contentType: "MOVIE", contentTitle: "Inception", posterUrl: "", progressSeconds: 4320, totalSeconds: 8880, lastWatchedAt: "2026-09-12T21:00:00Z" },
  { id: "wh2", userId: "u1", contentId: "ep1", contentType: "EPISODE", contentTitle: "The Vanishing of Will Byers", posterUrl: "", progressSeconds: 1800, totalSeconds: 2940, lastWatchedAt: "2026-09-11T19:30:00Z", episodeInfo: { seriesTitle: "Stranger Things", season: 1, episode: 1 } },
  { id: "wh3", userId: "u1", contentId: "m7", contentType: "MOVIE", contentTitle: "RRR", posterUrl: "", progressSeconds: 10620, totalSeconds: 11220, lastWatchedAt: "2026-09-10T23:00:00Z" },
  { id: "wh4", userId: "u2", contentId: "m1", contentType: "MOVIE", contentTitle: "Kantara", posterUrl: "", progressSeconds: 9000, totalSeconds: 9000, lastWatchedAt: "2026-09-09T18:00:00Z" },
];

export const MOCK_FAVORITES: Favorite[] = [
  { id: "fav1", userId: "u1", contentId: "m1", contentType: "MOVIE", title: "Kantara", posterUrl: "", addedAt: "2026-09-08T10:00:00Z" },
  { id: "fav2", userId: "u1", contentId: "s1", contentType: "SERIES", title: "Stranger Things", posterUrl: "", addedAt: "2026-09-07T15:00:00Z" },
  { id: "fav3", userId: "u1", contentId: "m2", contentType: "MOVIE", title: "Inception", posterUrl: "", addedAt: "2026-09-05T09:00:00Z" },
  { id: "fav4", userId: "u2", contentId: "m6", contentType: "MOVIE", title: "Avengers: Endgame", posterUrl: "", addedAt: "2026-09-01T11:00:00Z" },
];
