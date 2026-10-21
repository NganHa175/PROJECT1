import { createBrowserRouter, Navigate } from "react-router";
import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@/layouts/AdminLayout";
import HomePage from "@/pages/public/HomePage";
import MoviesPage from "@/pages/public/MoviesPage";
import SeriesPage from "@/pages/public/SeriesPage";
import SearchPage from "@/pages/public/SearchPage";
import MovieDetailPage from "@/pages/public/MovieDetailPage";
import SeriesDetailPage from "@/pages/public/SeriesDetailPage";
import WatchPage from "@/pages/user/WatchPage";
import WalletPage from "@/pages/user/WalletPage";
import SubscriptionPage from "@/pages/user/SubscriptionPage";
import FavoritesPage from "@/pages/user/FavoritesPage";
import HistoryPage from "@/pages/user/HistoryPage";
import ProfilePage from "@/pages/user/ProfilePage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminContentPage from "@/pages/admin/AdminContentPage";
import AdminPricingPage from "@/pages/admin/AdminPricingPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminTransactionsPage from "@/pages/admin/AdminTransactionsPage";
import AdminMovieEditorPage from "@/pages/admin/AdminMovieEditorPage";
import AdminSeasonEditorPage from "@/pages/admin/AdminSeasonEditorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "movies", Component: MoviesPage },
      { path: "series", Component: SeriesPage },
      { path: "search", Component: SearchPage },
      { path: "movie/:movieId", Component: MovieDetailPage },
      { path: "series/:seriesId", Component: SeriesDetailPage },
      { path: "watch/movie/:movieId", Component: WatchPage },
      { path: "watch/episode/:episodeId", Component: WatchPage },
      { path: "wallet", Component: WalletPage },
      { path: "subscription", Component: SubscriptionPage },
      { path: "favorites", Component: FavoritesPage },
      { path: "history", Component: HistoryPage },
      { path: "profile", Component: ProfilePage },
      { path: "login", element: <Navigate to="/" replace /> },
      { path: "register", element: <Navigate to="/" replace /> },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboardPage },
      { path: "content", Component: AdminContentPage },
      { path: "movies/:movieId", Component: AdminMovieEditorPage },
      { path: "series/:seriesId", Component: AdminContentPage },
      { path: "series/:seriesId/seasons/:seasonId", Component: AdminSeasonEditorPage },
      { path: "pricing", Component: AdminPricingPage },
      { path: "users", Component: AdminUsersPage },
      { path: "transactions", Component: AdminTransactionsPage },
    ],
  },
]);
