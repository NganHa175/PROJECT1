// ── User ─────────────────────────────────────────────────────────────────────
export type UserRole = "USER" | "ADMIN";
export type AccountStatus = "ACTIVE" | "LOCKED";
export type PremiumStatus = "ACTIVE" | "EXPIRED" | "NONE";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  accountStatus: AccountStatus;
  walletBalance: number; // VND
  premium: {
    status: PremiumStatus;
    startDate?: string;
    expirationDate?: string;
  };
  createdAt: string;
}

// ── Content Access ────────────────────────────────────────────────────────────
export type AccessMode = "FREE" | "LOCKED";
export type PublicationStatus = "PUBLISHED" | "HIDDEN";
export type PriceSource = "PRESET_1" | "PRESET_2" | "CUSTOM";

export interface ContentAccess {
  contentId: string;
  contentType: "MOVIE" | "EPISODE";
  userId: string;
  purchasedAt: string;
  expiresAt: string;
  pricePaid: number;
  durationHours: number;
}

// ── Price Presets ─────────────────────────────────────────────────────────────
export interface PricePreset {
  id: string;
  name: string;
  amount: number; // VND
  isActive: boolean;
}

// ── Movie ─────────────────────────────────────────────────────────────────────
export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  overview: string;
  posterUrl: string;
  backdropUrl?: string;
  genres: string[];
  releaseYear: number;
  runtimeMinutes: number;
  director: string;
  cast: CastMember[];
  voteAverage: number;
  popularity: number;
  trailerYoutubeId?: string;
  playbackUrl?: string;
  publicationStatus: PublicationStatus;
  accessMode: AccessMode;
  priceSource: PriceSource;
  customPrice?: number;
  resolvedPrice: number; // VND
  unlockDurationHours: number;
  isFeatured?: boolean;
}

export interface CastMember {
  name: string;
  role: string;
  photoUrl?: string;
}

// ── Series ────────────────────────────────────────────────────────────────────
export interface Series {
  id: string;
  title: string;
  originalTitle?: string;
  overview: string;
  posterUrl: string;
  backdropUrl?: string;
  genres: string[];
  releaseYear: number;
  director: string;
  cast: CastMember[];
  voteAverage: number;
  popularity: number;
  trailerYoutubeId?: string;
  publicationStatus: PublicationStatus;
  defaultAccessMode: AccessMode;
  defaultPriceSource: PriceSource;
  defaultCustomPrice?: number;
  defaultUnlockDurationHours: number;
  seasons: Season[];
  isFeatured?: boolean;
}

export interface Season {
  id: string;
  seriesId: string;
  seasonNumber: number;
  title: string;
  overview?: string;
  airDate?: string;
  publicationStatus: PublicationStatus;
  defaultAccessMode: AccessMode;
  defaultPriceSource: PriceSource;
  defaultCustomPrice?: number;
  defaultUnlockDurationHours: number;
  episodes: Episode[];
}

export type EpisodeSettingSource = "SEASON" | "OVERRIDE";

export interface Episode {
  id: string;
  seriesId: string;
  seasonId: string;
  episodeNumber: number;
  title: string;
  overview: string;
  thumbnailUrl?: string;
  durationMinutes: number;
  publicationStatus: PublicationStatus;
  accessMode: AccessMode;
  priceSource: PriceSource;
  customPrice?: number;
  resolvedPrice: number;
  unlockDurationHours: number;
  settingSource: EpisodeSettingSource;
}

// ── Wallet & Transactions ─────────────────────────────────────────────────────
export type TransactionType =
  | "TOP_UP"
  | "MOVIE_UNLOCK"
  | "EPISODE_UNLOCK"
  | "SUBSCRIPTION_PAYMENT"
  | "ADMIN_ADJUSTMENT";

export type TransactionStatus = "COMPLETED" | "FAILED" | "PENDING";

export interface WalletTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number; // positive = credit, negative = debit
  balanceBefore: number;
  balanceAfter: number;
  relatedContentId?: string;
  relatedContentType?: "MOVIE" | "EPISODE";
  relatedContentTitle?: string;
  purchasedDurationHours?: number;
  reason?: string; // for ADMIN_ADJUSTMENT
  createdAt: string;
}

// ── Watch History & Favorites ─────────────────────────────────────────────────
export interface WatchHistory {
  id: string;
  userId: string;
  contentId: string;
  contentType: "MOVIE" | "EPISODE";
  contentTitle: string;
  posterUrl: string;
  progressSeconds: number;
  totalSeconds: number;
  lastWatchedAt: string;
  episodeInfo?: { seriesTitle: string; season: number; episode: number };
}

export interface Favorite {
  id: string;
  userId: string;
  contentId: string;
  contentType: "MOVIE" | "SERIES";
  title: string;
  posterUrl: string;
  addedAt: string;
}

// ── Recommendation ────────────────────────────────────────────────────────────
export interface Recommendation {
  contentId: string;
  contentType: "MOVIE" | "SERIES";
  title: string;
  posterUrl: string;
  score: number;
  reason: string;
}

// ── Auth Context ──────────────────────────────────────────────────────────────
export type MockUserState = "GUEST" | "USER" | "PREMIUM" | "ADMIN";

export interface AuthState {
  currentUser: User | null;
  mockState: MockUserState;
  setMockState: (state: MockUserState) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasPremium: boolean;
  canWatch: (content: { accessMode: AccessMode; publicationStatus: PublicationStatus; contentId: string }) => boolean;
  unlockContent: (contentId: string, contentType: "MOVIE" | "EPISODE", price: number, durationHours: number, title: string) => boolean;
  addFunds: (amount: number) => void;
  getAccess: (contentId: string) => ContentAccess | undefined;
}
