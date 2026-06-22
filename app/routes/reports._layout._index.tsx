import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { monthlyRevenue, sampleCustomers, sampleProducts, sampleInvoices } from "~/lib/store";
import { useConfigurables } from "~/modules/configurables";
import { useState } from "react";

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

export default function ReportsPage() {
  const { config, loading } = useConfigurables();
  const [tab, setTab] = useState<"revenue" | "customer" | "inventory" | "gst">("revenue");
  const cs = loading ? "₹" : (config?.currencySymbol ?? "₹");

  const exportExcel = async (type: string) => {
    const { utils, writeFile } = await import("xlsx");
    let data: any[] = [];
    let filename = "report.xlsx";

    if (type === "revenue") {
      data = monthlyRevenue.map(m => ({ Month: m.month, Revenue: m.revenue, Expenses: m.expenses, Profit: m.profit }));
      filename = "revenue_report.xlsx";
    } else if (type === "customer") {
      data = sampleCustomers.map(c => ({ Name: c.name, Email: c.email, Phone: c.phone, State: c.state, "Total Purchases": c.totalPurchases }));
      filename = "customer_report.xlsx";
    } else if (type === "inventory") {
      data = sampleProducts.map(p => ({ Name: p.name, Category: p.category, "Stock": p.stock, "Cost Price": p.costPrice, "Selling Price": p.sellingPrice }));
      filename = "inventory_report.xlsx";
    }

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Report");
    writeFile(wb, filename);
  };

  const tabs = [
    { id: "revenue", label: "Revenue" },
    { id: "customer", label: "Customer" },
    { id: "inventory", label: "Inventory" },
    { id: "gst", label: "GST" },
  ] as const;

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader title="Reports" subtitle="Analyze and export business reports" />

      {/* Report Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Revenue Report", icon: <FileSpreadsheet className="w-5 h-5" />, type: "revenue", color: "from-purple-500 to-purple-700" },
          { label: "Customer Report", icon: <FileSpreadsheet className="w-5 h-5" />, type: "customer", color: "from-cyan-500 to-cyan-700" },
          { label: "Inventory Report", icon: <FileSpreadsheet className="w-5 h-5" />, type: "inventory", color: "from-pink-500 to-pink-700" },
          { label: "GST Report", icon: <FileText className="w-5 h-5" />, type: "gst", color: "from-amber-500 to-amber-700" },
        ].map(r => (
          <div key={r.type} className="metric-card p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white mb-3`}>
              {r.icon}
            </div>
            <p className="text-sm font-semibold text-foreground mb-3">{r.label}</p>
            <button
              onClick={() => exportExcel(r.type)}
              className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              <Download className="w-3 h-3" /> Export Excel
            </button>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted/30 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "revenue" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyRevenue} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4 }} />
                <Line type="monotone" dataKey="profit" name="Profit" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: "#06b6d4", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>
          <GlassCard className="p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Summary</h3>
            <div className="space-y-3">
              {monthlyRevenue.map(m => (
                <div key={m.month} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground w-8">{m.month}</span>
                  <div className="flex-1 mx-3 bg-muted/30 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                      style={{ width: `${(m.revenue / 85000 * 100).toFixed(0)}%` }} />
                  </div>
                  <span className="text-foreground font-medium w-20 text-right">{cs}{(m.revenue/1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {tab === "customer" && (
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Top Customers by Revenue</h3>
          <div className="space-y-4">
            {sampleCustomers.sort((a, b) => b.totalPurchases - a.totalPurchases).map((c, i) => (
              <div key={c.id} className="flex items-center gap-4">
                <span className="text-muted-foreground text-sm w-5">{i + 1}</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {c.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.state}</p>
                </div>
                <div className="flex-1 mx-4 bg-muted/30 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                    style={{ width: `${(c.totalPurchases / 70000 * 100).toFixed(0)}%` }} />
                </div>
                <span className="text-emerald-400 font-semibold text-sm">{cs}{c.totalPurchases.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {tab === "inventory" && (
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Inventory by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={["Electronics", "Accessories"].map(cat => ({
                category: cat,
                stock: sampleProducts.filter(p => p.category === cat).reduce((s, p) => s + p.stock, 0),
                value: sampleProducts.filter(p => p.category === cat).reduce((s, p) => s + p.stock * p.sellingPrice, 0),
              }))}
              margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="stock" name="Stock Count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {tab === "gst" && (
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">GST Collection by Month</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyRevenue} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="gst" name="GST Collected" fill="#ec4899" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      )}
    </div>
  );
}
