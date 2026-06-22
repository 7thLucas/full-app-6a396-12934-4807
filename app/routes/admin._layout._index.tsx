import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, TrendingUp, FileText, Crown, Bell, Shield, Activity } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import { MetricCard } from "~/components/ui/glass-card";
import { GlassCard } from "~/components/ui/glass-card";
import { Badge } from "~/components/ui/badge";
import { useAuth } from "~/modules/authentication/use-authentication";
import { monthlyRevenue } from "~/lib/store";

const platformRevenue = monthlyRevenue.map(m => ({
  ...m,
  platformRevenue: Math.round(m.revenue * 0.15),
  subscribers: Math.floor(150 + Math.random() * 50),
}));

const recentUsers = [
  { id: 1, name: "Rahul Sharma", email: "rahul@techcorp.in", plan: "Pro", joinDate: "2024-03-12", status: "active" },
  { id: 2, name: "Priya Patel", email: "priya@startup.in", plan: "Basic", joinDate: "2024-03-10", status: "active" },
  { id: 3, name: "Amit Kumar", email: "amit@business.in", plan: "Business", joinDate: "2024-03-08", status: "active" },
  { id: 4, name: "Sneha Reddy", email: "sneha@ventures.in", plan: "Free", joinDate: "2024-03-05", status: "active" },
  { id: 5, name: "Vikram Singh", email: "vikram@services.in", plan: "Pro", joinDate: "2024-03-01", status: "suspended" },
];

const planDist = [
  { plan: "Free", count: 1250, color: "text-slate-400" },
  { plan: "Basic", count: 430, color: "text-blue-400" },
  { plan: "Pro", count: 180, color: "gradient-text" },
  { plan: "Business", count: 45, color: "text-amber-400" },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs">
        <p className="text-foreground font-semibold mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}: ₹{entry.value?.toLocaleString("en-IN")}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const totalUsers = planDist.reduce((s, p) => s + p.count, 0);
  const totalMRR = planDist.reduce((s, p) => {
    const prices: Record<string, number> = { Free: 0, Basic: 199, Pro: 499, Business: 999 };
    return s + (prices[p.plan] ?? 0) * p.count;
  }, 0);

  return (
    <div className="animate-fade-in-up space-y-8">
      <PageHeader
        title="Admin Dashboard"
        subtitle={`Welcome back, ${user?.username ?? "Admin"}. Here's your platform overview.`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title="Total Users" value={totalUsers.toLocaleString()} trend={{ value: 12, positive: true }} gradient="purple" icon={<Users className="w-4 h-4" />} />
        <MetricCard title="Monthly Revenue" value={`₹${(totalMRR / 1000).toFixed(0)}k`} trend={{ value: 8, positive: true }} gradient="cyan" icon={<TrendingUp className="w-4 h-4" />} />
        <MetricCard title="Active Subscriptions" value={planDist.slice(1).reduce((s, p) => s + p.count, 0)} trend={{ value: 5, positive: true }} gradient="pink" icon={<Crown className="w-4 h-4" />} />
        <MetricCard title="Platform Health" value="99.9%" subtitle="Uptime" gradient="green" icon={<Activity className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Platform Revenue Chart */}
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Platform Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={platformRevenue} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="platRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="platformRevenue" name="Platform Revenue" stroke="#7c3aed" fill="url(#platRev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Subscription Distribution */}
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Subscription Distribution</h3>
          <div className="space-y-4">
            {planDist.map(p => {
              const pct = ((p.count / totalUsers) * 100).toFixed(1);
              return (
                <div key={p.plan}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-foreground font-medium">{p.plan}</span>
                    <span className="text-muted-foreground">{p.count} users ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Recent Users */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Recent Users</h3>
          <a href="/admin/users" className="text-xs text-primary hover:underline">View all →</a>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["User", "Plan", "Joined", "Status"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentUsers.map(u => (
              <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="text-foreground font-medium text-sm">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={u.plan === "Business" ? "warning" : u.plan === "Pro" ? "purple" : u.plan === "Basic" ? "info" : "default"}>
                    {u.plan}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{u.joinDate}</td>
                <td className="py-3 px-4">
                  <Badge variant={u.status === "active" ? "success" : "error"}>{u.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
