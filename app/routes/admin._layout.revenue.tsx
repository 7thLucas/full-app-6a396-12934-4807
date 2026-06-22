import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { MetricCard } from "~/components/ui/glass-card";
import { TrendingUp, Crown, Users } from "lucide-react";
import { monthlyRevenue } from "~/lib/store";

const platformRevenue = monthlyRevenue.map(m => ({
  month: m.month,
  subscriptions: Math.round(m.revenue * 0.08),
  totalPlatform: Math.round(m.revenue * 0.15),
}));

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

export default function AdminRevenuePage() {
  const totalPlatformRevenue = platformRevenue.reduce((s, m) => s + m.totalPlatform, 0);
  const totalSubscriptions = platformRevenue.reduce((s, m) => s + m.subscriptions, 0);
  const mrr = 1905 * 199 + 180 * 499 + 45 * 999;

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader title="Platform Revenue" subtitle="Monitor subscription and platform earnings" />

      <div className="grid grid-cols-3 gap-4">
        <MetricCard title="Total Platform Revenue" value={`₹${totalPlatformRevenue.toLocaleString("en-IN")}`} trend={{ value: 15, positive: true }} gradient="purple" icon={<TrendingUp className="w-4 h-4" />} />
        <MetricCard title="Monthly Recurring Revenue" value={`₹${(mrr / 1000).toFixed(0)}k`} trend={{ value: 8, positive: true }} gradient="cyan" icon={<Crown className="w-4 h-4" />} />
        <MetricCard title="Subscription Revenue" value={`₹${totalSubscriptions.toLocaleString("en-IN")}`} trend={{ value: 12, positive: true }} gradient="pink" icon={<Users className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Platform Revenue (6 Months)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={platformRevenue} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="platGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={1} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="totalPlatform" name="Platform Revenue" fill="url(#platGrad)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Subscription Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={platformRevenue} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="subscriptions" name="Subscriptions" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: "#06b6d4", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
}
