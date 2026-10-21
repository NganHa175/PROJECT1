import type { User } from "@/types";

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Minh Tran",
    email: "minh@example.com",
    avatar: undefined,
    role: "USER",
    accountStatus: "ACTIVE",
    walletBalance: 52000,
    premium: { status: "NONE" },
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "u2",
    name: "Linh Nguyen",
    email: "linh@example.com",
    avatar: undefined,
    role: "USER",
    accountStatus: "ACTIVE",
    walletBalance: 120000,
    premium: {
      status: "ACTIVE",
      startDate: "2026-08-01T00:00:00Z",
      expirationDate: "2026-10-01T00:00:00Z",
    },
    createdAt: "2025-03-20T10:00:00Z",
  },
  {
    id: "u3",
    name: "Admin CineVault",
    email: "admin@cinevault.vn",
    avatar: undefined,
    role: "ADMIN",
    accountStatus: "ACTIVE",
    walletBalance: 0,
    premium: { status: "NONE" },
    createdAt: "2024-12-01T10:00:00Z",
  },
  {
    id: "u4",
    name: "Hung Le",
    email: "hung@example.com",
    avatar: undefined,
    role: "USER",
    accountStatus: "LOCKED",
    walletBalance: 5000,
    premium: { status: "EXPIRED", startDate: "2026-06-01T00:00:00Z", expirationDate: "2026-08-01T00:00:00Z" },
    createdAt: "2025-06-10T10:00:00Z",
  },
];

export const GUEST_USER: User | null = null;

export const USER_BY_STATE = {
  GUEST: null,
  USER: MOCK_USERS[0],
  PREMIUM: MOCK_USERS[1],
  ADMIN: MOCK_USERS[2],
} as const;
