import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthState, MockUserState, User, ContentAccess, AccessMode, PublicationStatus } from "@/types";
import { USER_BY_STATE } from "@/mocks/users";
import { MOCK_CONTENT_ACCESS, MOCK_TRANSACTIONS } from "@/mocks/transactions";

interface AuthContextValue extends AuthState {}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [mockState, setMockStateInternal] = useState<MockUserState>("GUEST");
  const [userOverride, setUserOverride] = useState<User | null>(null);
  const [contentAccess, setContentAccess] = useState<ContentAccess[]>(MOCK_CONTENT_ACCESS);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);

  const baseUser = USER_BY_STATE[mockState] ?? null;
  const currentUser: User | null = userOverride ?? baseUser;

  function setMockState(state: MockUserState) {
    setMockStateInternal(state);
    setUserOverride(null);
  }

  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.role === "ADMIN";
  const hasPremium = currentUser?.premium.status === "ACTIVE";

  function getAccess(contentId: string): ContentAccess | undefined {
    if (!currentUser) return undefined;
    return contentAccess.find(
      (a) => a.contentId === contentId && a.userId === currentUser.id && new Date(a.expiresAt) > new Date()
    );
  }

  function canWatch({ accessMode, publicationStatus, contentId }: { accessMode: AccessMode; publicationStatus: PublicationStatus; contentId: string }): boolean {
    if (publicationStatus !== "PUBLISHED") return false;
    if (accessMode === "FREE") return true;
    if (!currentUser) return false;
    if (hasPremium) return true;
    return !!getAccess(contentId);
  }

  function unlockContent(contentId: string, contentType: "MOVIE" | "EPISODE", price: number, durationHours: number, title: string): boolean {
    if (!currentUser) return false;
    if (currentUser.walletBalance < price) return false;

    const now = new Date().toISOString();
    const expires = new Date(Date.now() + durationHours * 3600 * 1000).toISOString();

    const newAccess: ContentAccess = {
      contentId, contentType, userId: currentUser.id,
      purchasedAt: now, expiresAt: expires,
      pricePaid: price, durationHours,
    };
    setContentAccess((prev) => [...prev.filter((a) => a.contentId !== contentId), newAccess]);

    const newTx = {
      id: `tx${Date.now()}`,
      userId: currentUser.id,
      type: contentType === "MOVIE" ? ("MOVIE_UNLOCK" as const) : ("EPISODE_UNLOCK" as const),
      status: "COMPLETED" as const,
      amount: -price,
      balanceBefore: currentUser.walletBalance,
      balanceAfter: currentUser.walletBalance - price,
      relatedContentId: contentId,
      relatedContentType: contentType,
      relatedContentTitle: title,
      purchasedDurationHours: durationHours,
      createdAt: now,
    };
    setTransactions((prev) => [newTx, ...prev]);

    setUserOverride({
      ...currentUser,
      walletBalance: currentUser.walletBalance - price,
    });
    return true;
  }

  function addFunds(amount: number) {
    if (!currentUser) return;
    const now = new Date().toISOString();
    const newTx = {
      id: `tx${Date.now()}`,
      userId: currentUser.id,
      type: "TOP_UP" as const,
      status: "COMPLETED" as const,
      amount,
      balanceBefore: currentUser.walletBalance,
      balanceAfter: currentUser.walletBalance + amount,
      createdAt: now,
    };
    setTransactions((prev) => [newTx, ...prev]);
    setUserOverride({ ...currentUser, walletBalance: currentUser.walletBalance + amount });
  }

  return (
    <AuthContext.Provider value={{ currentUser, mockState, setMockState, isAuthenticated, isAdmin, hasPremium, canWatch, unlockContent, addFunds, getAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
