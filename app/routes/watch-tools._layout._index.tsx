import { useState } from "react";
import { Watch, Plus, TrendingUp, Edit2, Trash2 } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { Badge } from "~/components/ui/badge";
import { Modal } from "~/components/ui/modal";
import { sampleWatchItems, type WatchItem } from "~/lib/store";
import { useConfigurables } from "~/modules/configurables";

const CONDITIONS = ["new", "like-new", "good", "fair"] as const;
const CONDITION_COLORS = { new: "success", "like-new": "cyan", good: "info", fair: "warning" } as const;

export default function WatchToolsPage() {
  const { config, loading } = useConfigurables();
  const [watches, setWatches] = useState<WatchItem[]>(sampleWatchItems);
  const [calcOpen, setCalcOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editWatch, setEditWatch] = useState<WatchItem | undefined>();
  const [calc, setCalc] = useState({ purchase: 0, sell: 0 });
  const [form, setForm] = useState<Partial<WatchItem>>({
    brand: "", model: "", refNo: "", condition: "new", purchasePrice: 0, sellingPrice: 0, status: "in-stock",
    purchaseDate: new Date().toISOString().split("T")[0],
  });
  const cs = loading ? "₹" : (config?.currencySymbol ?? "₹");

  const totalInvestment = watches.filter(w => w.status !== "sold").reduce((s, w) => s + w.purchasePrice, 0);
  const totalSalesValue = watches.filter(w => w.status !== "sold").reduce((s, w) => s + w.sellingPrice, 0);
  const soldProfit = watches.filter(w => w.status === "sold").reduce((s, w) => s + (w.sellingPrice - w.purchasePrice), 0);
  const profitPct = calc.sell > 0 ? (((calc.sell - calc.purchase) / calc.sell) * 100).toFixed(1) : "0";

  const handleSave = () => {
    if (editWatch) {
      setWatches(prev => prev.map(w => w.id === editWatch.id ? { ...w, ...form } as WatchItem : w));
    } else {
      setWatches(prev => [...prev, { ...form, id: Math.random().toString(36).substring(2, 11) } as WatchItem]);
    }
    setAddOpen(false);
    setEditWatch(undefined);
    setForm({ brand: "", model: "", refNo: "", condition: "new", purchasePrice: 0, sellingPrice: 0, status: "in-stock", purchaseDate: new Date().toISOString().split("T")[0] });
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Watch Tools"
        subtitle="Manage your watch inventory and calculate profits"
        actions={
          <div className="flex gap-3">
            <button onClick={() => setCalcOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
              <TrendingUp className="w-4 h-4" /> Calculator
            </button>
            <button onClick={() => { setEditWatch(undefined); setAddOpen(true); }} className="neon-button px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Watch
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Watches", value: watches.length, color: "gradient-text" },
          { label: "Investment", value: `${cs}${totalInvestment.toLocaleString("en-IN")}`, color: "text-red-400" },
          { label: "Potential Value", value: `${cs}${totalSalesValue.toLocaleString("en-IN")}`, color: "text-cyan-400" },
          { label: "Sold Profit", value: `${cs}${soldProfit.toLocaleString("en-IN")}`, color: "text-emerald-400" },
        ].map(m => (
          <div key={m.label} className="metric-card p-4 text-center">
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Watch", "Ref No", "Condition", "Purchase Price", "Selling Price", "Profit", "Status", "Actions"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {watches.map(w => {
              const profit = w.sellingPrice - w.purchasePrice;
              const margin = w.sellingPrice > 0 ? (profit / w.sellingPrice * 100).toFixed(1) : "0";
              return (
                <tr key={w.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Watch className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-foreground font-medium">{w.brand}</p>
                        <p className="text-xs text-muted-foreground">{w.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{w.refNo}</td>
                  <td className="py-3 px-4">
                    <Badge variant={CONDITION_COLORS[w.condition]}>{w.condition}</Badge>
                  </td>
                  <td className="py-3 px-4 text-foreground">{cs}{w.purchasePrice.toLocaleString("en-IN")}</td>
                  <td className="py-3 px-4 text-foreground font-semibold">{cs}{w.sellingPrice.toLocaleString("en-IN")}</td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {profit >= 0 ? "+" : ""}{cs}{profit.toLocaleString("en-IN")} ({margin}%)
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={w.status === "sold" ? "success" : w.status === "reserved" ? "warning" : "info"}>
                      {w.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditWatch(w); setForm(w); setAddOpen(true); }}
                        className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { if (confirm("Delete?")) setWatches(prev => prev.filter(x => x.id !== w.id)); }}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </GlassCard>

      {/* Profit Calculator */}
      <Modal open={calcOpen} onClose={() => setCalcOpen(false)} title="Watch Profit Calculator">
        <div className="space-y-4">
          {[
            { label: "Purchase Price (₹)", key: "purchase" },
            { label: "Selling Price (₹)", key: "sell" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
              <input type="number" value={(calc as any)[f.key]}
                onChange={e => setCalc(p => ({ ...p, [f.key]: Number(e.target.value) }))}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
            </div>
          ))}
          <div className="p-4 bg-muted/20 rounded-xl space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Purchase Price</span>
              <span className="text-foreground">{cs}{calc.purchase.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Selling Price</span>
              <span className="text-foreground">{cs}{calc.sell.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-border pt-2">
              <span className="text-muted-foreground">Profit</span>
              <span className={`font-semibold ${calc.sell - calc.purchase >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {cs}{(calc.sell - calc.purchase).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-border pt-2">
              <span className="text-foreground">Profit Margin</span>
              <span className="gradient-text">{profitPct}%</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add/Edit Watch */}
      <Modal open={addOpen} onClose={() => { setAddOpen(false); setEditWatch(undefined); }} title={editWatch ? "Edit Watch" : "Add Watch"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Brand", key: "brand", placeholder: "Rolex" },
              { label: "Model", key: "model", placeholder: "Submariner" },
              { label: "Reference No", key: "refNo", placeholder: "126610LN" },
              { label: "Purchase Date", key: "purchaseDate", placeholder: "2024-01-01" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                <input type="text" value={(form as any)[f.key] ?? ""} placeholder={f.placeholder}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Condition</label>
              <select value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value as any }))}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring">
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as any }))}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring">
                {["in-stock", "sold", "reserved"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Purchase Price (₹)</label>
              <input type="number" value={form.purchasePrice ?? 0} onChange={e => setForm(p => ({ ...p, purchasePrice: Number(e.target.value) }))}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Selling Price (₹)</label>
              <input type="number" value={form.sellingPrice ?? 0} onChange={e => setForm(p => ({ ...p, sellingPrice: Number(e.target.value) }))}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
            </div>
          </div>
          <div className="p-3 bg-muted/20 rounded-xl text-center">
            <p className="text-xs text-muted-foreground">Expected Profit</p>
            <p className="text-xl font-bold gradient-text">
              {cs}{((form.sellingPrice ?? 0) - (form.purchasePrice ?? 0)).toLocaleString("en-IN")}
            </p>
          </div>
          <button onClick={handleSave} className="w-full neon-button py-2.5 rounded-lg text-sm font-semibold">
            {editWatch ? "Update Watch" : "Add Watch"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
