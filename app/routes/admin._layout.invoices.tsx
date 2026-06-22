import { Search } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { Badge } from "~/components/ui/badge";
import { sampleInvoices } from "~/lib/store";

export default function AdminInvoicesPage() {
  const [search, setSearch] = useState("");

  const filtered = sampleInvoices.filter(i =>
    i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    i.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const STATUS_COLORS = {
    draft: "default" as const,
    sent: "info" as const,
    paid: "success" as const,
    overdue: "error" as const,
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader title="All Invoices" subtitle="View all invoices across the platform" />

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Invoices", value: sampleInvoices.length, color: "gradient-text" },
          { label: "Total Value", value: `₹${sampleInvoices.reduce((s,i) => s + i.totalAmount, 0).toFixed(0)}`, color: "text-emerald-400" },
          { label: "Paid", value: sampleInvoices.filter(i => i.status === "paid").length, color: "text-cyan-400" },
          { label: "Pending", value: sampleInvoices.filter(i => i.status !== "paid").length, color: "text-amber-400" },
        ].map(m => (
          <div key={m.label} className="metric-card p-4 text-center">
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..."
              className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Invoice #", "Customer", "Date", "Amount", "GST", "Status"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-primary font-mono text-xs">{inv.invoiceNumber}</td>
                <td className="py-3 px-4 text-foreground">{inv.customerName}</td>
                <td className="py-3 px-4 text-muted-foreground">{inv.date}</td>
                <td className="py-3 px-4 text-foreground font-semibold">₹{inv.totalAmount.toFixed(2)}</td>
                <td className="py-3 px-4 text-amber-400">₹{inv.totalGst.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <Badge variant={STATUS_COLORS[inv.status]}>{inv.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
