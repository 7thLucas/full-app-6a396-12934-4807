import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Users, Package, FileText, Receipt, Activity, AlertTriangle, ArrowUpRight } from "lucide-react";
import { MetricCard } from "~/components/ui/glass-card";
import { PageHeader } from "~/components/ui/page-header";
import { useAuth } from "~/modules/authentication/use-authentication";
import { useConfigurables } from "~/modules/configurables";
import { monthlyRevenue, sampleCustomers, sampleProducts, sampleInvoices } from "~/lib/store";
import { Link } from "react-router";

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs">
        <p className="text-foreground font-semibold mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}: ₹{entry.value.toLocaleString("en-IN")}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { config, loading } = useConfigurables();
  const currencySymbol = loading ? "₹" : (config?.currencySymbol ?? "₹");

  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalProfit = monthlyRevenue.reduce((s, m) => s + m.profit, 0);
  const totalGst = monthlyRevenue.reduce((s, m) => s + m.gst, 0);
  const lowStockItems = sampleProducts.filter(p => p.stock <= p.lowStockThreshold);
  const healthScore = 87;

  const recentActivity = [
    { id: 1, text: "Invoice INV-2024-0003 paid by Priya Patel", time: "2h ago", color: "text-emerald-400" },
    { id: 2, text: "New customer Vikram Singh added", time: "4h ago", color: "text-cyan-400" },
    { id: 3, text: "Low stock alert: Mechanical Keyboard (3 left)", time: "6h ago", color: "text-amber-400" },
    { id: 4, text: "Invoice INV-2024-0002 sent to Amit Kumar", time: "1d ago", color: "text-purple-400" },
    { id: 5, text: "Stock updated: USB-C Hub +20 units", time: "2d ago", color: "text-blue-400" },
  ];

  return (
    <div className="animate-fade-in-up space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.username ?? "User"}`}
        subtitle="Here's what's happening with your business today"
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={`${currencySymbol}${totalRevenue.toLocaleString("en-IN")}`}
          subtitle="Last 6 months"
          trend={{ value: 12.5, positive: true }}
          gradient="purple"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          title="Net Profit"
          value={`${currencySymbol}${totalProfit.toLocaleString("en-IN")}`}
          subtitle="Last 6 months"
          trend={{ value: 8.3, positive: true }}
          gradient="cyan"
          icon={<ArrowUpRight className="w-4 h-4" />}
        />
        <MetricCard
          title="GST Collected"
          value={`${currencySymbol}${totalGst.toLocaleString("en-IN")}`}
          subtitle="Last 6 months"
          trend={{ value: 5.1, positive: true }}
          gradient="pink"
          icon={<Receipt className="w-4 h-4" />}
        />
        <MetricCard
          title="Business Health"
          value={`${healthScore}/100`}
          subtitle="Composite score"
          trend={{ value: 3.2, positive: true }}
          gradient="green"
          icon={<Activity className="w-4 h-4" />}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Customers"
          value={sampleCustomers.length}
          subtitle="Active accounts"
          gradient="purple"
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          title="Products"
          value={sampleProducts.length}
          subtitle="In catalog"
          gradient="cyan"
          icon={<Package className="w-4 h-4" />}
        />
        <MetricCard
          title="Invoices"
          value={sampleInvoices.length}
          subtitle="This month"
          gradient="pink"
          icon={<FileText className="w-4 h-4" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#7c3aed" fill="url(#revGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#06b6d4" fill="url(#expGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Profit Chart */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Profit</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyRevenue} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={1} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="profit" name="Profit" fill="url(#profitGrad)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row: Activity + Low Stock */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map(a => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-foreground">Low Stock Alerts</h3>
          </div>
          {lowStockItems.length === 0 ? (
            <p className="text-muted-foreground text-sm">All products are well-stocked!</p>
          ) : (
            <div className="space-y-3">
              {lowStockItems.map(p => (
                <div key={p.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 text-sm font-semibold">{p.stock} left</span>
                    <p className="text-xs text-muted-foreground">min {p.lowStockThreshold}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link to="/inventory" className="mt-4 block text-xs text-primary hover:underline">
            View all inventory →
          </Link>
        </div>
      </div>
    </div>
  );
}
