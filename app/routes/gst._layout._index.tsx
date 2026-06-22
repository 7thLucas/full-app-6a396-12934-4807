import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { Badge } from "~/components/ui/badge";
import { sampleInvoices, monthlyRevenue } from "~/lib/store";
import { useConfigurables } from "~/modules/configurables";

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

const gstMonthly = monthlyRevenue.map(m => ({
  ...m,
  cgst: (m.gst / 2).toFixed(0),
  sgst: (m.gst / 2).toFixed(0),
  igst: 0,
}));

export default function GSTPage() {
  const { config, loading } = useConfigurables();
  const cs = loading ? "₹" : (config?.currencySymbol ?? "₹");

  const totalCgst = sampleInvoices.reduce((s, i) => s + i.totalCgst, 0);
  const totalSgst = sampleInvoices.reduce((s, i) => s + i.totalSgst, 0);
  const totalIgst = sampleInvoices.reduce((s, i) => s + i.totalIgst, 0);
  const totalGst = totalCgst + totalSgst + totalIgst;

  const exportExcel = async () => {
    const { utils, writeFile } = await import("xlsx");
    const data = sampleInvoices.map(i => ({
      "Invoice No": i.invoiceNumber,
      "Customer": i.customerName,
      "Date": i.date,
      "Subtotal": i.subtotal,
      "CGST": i.totalCgst,
      "SGST": i.totalSgst,
      "IGST": i.totalIgst,
      "Total GST": i.totalGst,
      "Total Amount": i.totalAmount,
    }));
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "GST Report");
    writeFile(wb, "gst_report.xlsx");
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="GST Management"
        subtitle="Monitor and manage your GST liabilities"
        actions={
          <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Download className="w-4 h-4" /> Export Excel
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total GST", value: `${cs}${totalGst.toFixed(2)}`, color: "gradient-text" },
          { label: "CGST (Intra)", value: `${cs}${totalCgst.toFixed(2)}`, color: "text-purple-400" },
          { label: "SGST (Intra)", value: `${cs}${totalSgst.toFixed(2)}`, color: "text-cyan-400" },
          { label: "IGST (Inter)", value: `${cs}${totalIgst.toFixed(2)}`, color: "text-pink-400" },
        ].map(m => (
          <div key={m.label} className="metric-card p-4 text-center">
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Monthly GST Chart */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Monthly GST Collection</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={gstMonthly} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="gst" name="Total GST" fill="#7c3aed" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* GST Summary Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">GST Sales Register</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Invoice #", "Customer", "Date", "Taxable Amount", "CGST", "SGST", "IGST", "Total GST", "Total Amount"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sampleInvoices.map(inv => (
              <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-primary font-mono text-xs">{inv.invoiceNumber}</td>
                <td className="py-3 px-4 text-foreground">{inv.customerName}</td>
                <td className="py-3 px-4 text-muted-foreground">{inv.date}</td>
                <td className="py-3 px-4 text-foreground">{cs}{inv.subtotal.toFixed(2)}</td>
                <td className="py-3 px-4 text-purple-400">{cs}{inv.totalCgst.toFixed(2)}</td>
                <td className="py-3 px-4 text-cyan-400">{cs}{inv.totalSgst.toFixed(2)}</td>
                <td className="py-3 px-4 text-pink-400">{cs}{inv.totalIgst.toFixed(2)}</td>
                <td className="py-3 px-4 text-amber-400 font-semibold">{cs}{inv.totalGst.toFixed(2)}</td>
                <td className="py-3 px-4 text-foreground font-semibold">{cs}{inv.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-border bg-muted/20">
              <td colSpan={3} className="py-3 px-4 font-bold text-foreground">Totals</td>
              <td className="py-3 px-4 font-bold text-foreground">{cs}{sampleInvoices.reduce((s,i) => s + i.subtotal, 0).toFixed(2)}</td>
              <td className="py-3 px-4 font-bold text-purple-400">{cs}{totalCgst.toFixed(2)}</td>
              <td className="py-3 px-4 font-bold text-cyan-400">{cs}{totalSgst.toFixed(2)}</td>
              <td className="py-3 px-4 font-bold text-pink-400">{cs}{totalIgst.toFixed(2)}</td>
              <td className="py-3 px-4 font-bold text-amber-400">{cs}{totalGst.toFixed(2)}</td>
              <td className="py-3 px-4 font-bold gradient-text">{cs}{sampleInvoices.reduce((s,i) => s + i.totalAmount, 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
