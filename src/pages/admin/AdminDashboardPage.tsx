import { Users, Film, Crown, Receipt, TrendingUp, Tv } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { MOCK_MOVIES, MOCK_SERIES } from "@/mocks/movies";
import { MOCK_USERS } from "@/mocks/users";
import { MOCK_TRANSACTIONS } from "@/mocks/transactions";

const revenueData = [
  { month: "Mar", revenue: 450000 },
  { month: "Apr", revenue: 620000 },
  { month: "May", revenue: 580000 },
  { month: "Jun", revenue: 790000 },
  { month: "Jul", revenue: 860000 },
  { month: "Aug", revenue: 1020000 },
  { month: "Sep", revenue: 940000 },
];

const topMovies = [
  { title: "Kantara", unlocks: 412 },
  { title: "Inception", unlocks: 387 },
  { title: "The Dark Knight", unlocks: 344 },
  { title: "Interstellar", unlocks: 291 },
  { title: "Avengers: Endgame", unlocks: 256 },
];

function StatCard({ icon: Icon, label, value, sub, color = "primary" }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; sub?: string; color?: string }) {
  const colors: Record<string, string> = {
    primary: "bg-primary/10 text-primary border-primary/20",
    amber: "bg-amber-900/30 text-amber-400 border-amber-700/30",
    emerald: "bg-emerald-900/30 text-emerald-400 border-emerald-700/30",
    blue: "bg-blue-900/30 text-blue-400 border-blue-700/30",
  };
  return (
    <div className="p-5 rounded-2xl border border-border bg-card">
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-muted-foreground text-xs mb-1">{label}</p>
      <p className="text-2xl font-black text-foreground">{value}</p>
      {sub && <p className="text-muted-foreground text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const totalUsers = MOCK_USERS.length;
  const premiumUsers = MOCK_USERS.filter((u) => u.premium.status === "ACTIVE").length;
  const totalMovies = MOCK_MOVIES.length;
  const totalSeries = MOCK_SERIES.length;
  const totalEpisodes = MOCK_SERIES.reduce((acc, s) => acc + s.seasons.reduce((a, s) => a + s.episodes.length, 0), 0);
  const totalTx = MOCK_TRANSACTIONS.length;
  const revenue = MOCK_TRANSACTIONS.filter((t) => t.amount > 0 && t.status === "COMPLETED").reduce((acc, t) => acc + t.amount, 0);

  const recentTx = MOCK_TRANSACTIONS.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Users" value={totalUsers} color="blue" />
        <StatCard icon={Crown} label="Premium Users" value={premiumUsers} sub={`${Math.round((premiumUsers / totalUsers) * 100)}% of users`} color="amber" />
        <StatCard icon={Film} label="Movies" value={totalMovies} />
        <StatCard icon={Tv} label="TV Series" value={totalSeries} sub={`${totalEpisodes} episodes`} color="emerald" />
        <StatCard icon={Receipt} label="Transactions" value={totalTx} />
        <StatCard icon={TrendingUp} label="Simulated Revenue" value={`${(revenue / 1000).toFixed(0)}K VND`} color="emerald" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Revenue chart */}
        <div className="p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-base font-bold text-foreground mb-4">Revenue (VND)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
              <Tooltip formatter={(v) => [`${Number(v).toLocaleString("vi-VN")} VND`, "Revenue"]} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: "var(--primary)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top movies */}
        <div className="p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-base font-bold text-foreground mb-4">Most Unlocked Movies</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topMovies} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="title" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="unlocks" fill="var(--primary)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-bold text-foreground">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["ID", "User", "Type", "Amount", "Status", "Date"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTx.map((tx) => (
                <tr key={tx.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{tx.id}</td>
                  <td className="px-4 py-3 text-foreground">{tx.userId}</td>
                  <td className="px-4 py-3 text-foreground capitalize">{tx.type.replace(/_/g, " ").toLowerCase()}</td>
                  <td className={`px-4 py-3 font-semibold ${tx.amount > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("vi-VN")} VND
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${tx.status === "COMPLETED" ? "bg-emerald-900/40 text-emerald-400" : tx.status === "FAILED" ? "bg-red-900/40 text-red-400" : "bg-amber-900/40 text-amber-400"}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(tx.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
