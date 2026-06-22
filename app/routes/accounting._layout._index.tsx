import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { Badge } from "~/components/ui/badge";
import { Modal } from "~/components/ui/modal";
import { sampleExpenses, monthlyRevenue, type Expense } from "~/lib/store";
import { useConfigurables } from "~/modules/configurables";

const EXPENSE_CATEGORIES = ["Rent", "Utilities", "Marketing", "Supplies", "Salaries", "Transport", "Software", "Other"];

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

export default function AccountingPage() {
  const { config, loading } = useConfigurables();
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [addModal, setAddModal] = useState(false);
  const [tab, setTab] = useState<"overview" | "expenses" | "pl">("overview");
  const [form, setForm] = useState({ description: "", category: "Rent", amount: 0, date: new Date().toISOString().split("T")[0] });
  const cs = loading ? "₹" : (config?.currencySymbol ?? "₹");

  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0) + monthlyRevenue.reduce((s, m) => s + m.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;

  const expenseByCategory = EXPENSE_CATEGORIES.map(cat => ({
    category: cat,
    amount: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(x => x.amount > 0);

  const handleAddExpense = () => {
    const newExp: Expense = {
      id: Math.random().toString(36).substring(2, 11),
      ...form,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setExpenses(prev => [newExp, ...prev]);
    setAddModal(false);
    setForm({ description: "", category: "Rent", amount: 0, date: new Date().toISOString().split("T")[0] });
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Accounting"
        subtitle="Track income, expenses, and financial health"
        actions={
          <button onClick={() => setAddModal(true)} className="neon-button px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="metric-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{cs}{totalRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="metric-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <p className="text-sm text-muted-foreground">Total Expenses</p>
          </div>
          <p className="text-2xl font-bold text-red-400">{cs}{totalExpenses.toLocaleString("en-IN")}</p>
        </div>
        <div className="metric-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <p className="text-sm text-muted-foreground">Net Profit</p>
          </div>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? "gradient-text" : "text-red-400"}`}>
            {cs}{netProfit.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted/30 rounded-xl w-fit">
        {[["overview", "Overview"], ["expenses", "Expenses"], ["pl", "P&L Report"]].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Cash Flow (6 Months)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" fill="url(#revA)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" fill="url(#expA)" strokeWidth={2} />
              <Area type="monotone" dataKey="profit" name="Profit" stroke="#7c3aed" fill="url(#profA)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {tab === "expenses" && (
        <GlassCard className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Date", "Description", "Category", "Amount"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map(e => (
                <tr key={e.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 text-muted-foreground">{e.date}</td>
                  <td className="py-3 px-4 text-foreground">{e.description}</td>
                  <td className="py-3 px-4"><Badge variant="purple">{e.category}</Badge></td>
                  <td className="py-3 px-4 text-red-400 font-semibold">-{cs}{e.amount.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {tab === "pl" && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-6">Profit & Loss Statement</h3>
          <div className="space-y-4">
            <div className="p-4 bg-muted/20 rounded-xl">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">INCOME</h4>
              {monthlyRevenue.map(m => (
                <div key={m.month} className="flex justify-between py-1.5 text-sm border-b border-border/30">
                  <span className="text-muted-foreground">{m.month} Revenue</span>
                  <span className="text-emerald-400 font-medium">{cs}{m.revenue.toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 text-sm font-bold border-t border-border mt-1">
                <span className="text-foreground">Total Revenue</span>
                <span className="text-emerald-400">{cs}{totalRevenue.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="p-4 bg-muted/20 rounded-xl">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">EXPENSES</h4>
              {expenseByCategory.map(e => (
                <div key={e.category} className="flex justify-between py-1.5 text-sm border-b border-border/30">
                  <span className="text-muted-foreground">{e.category}</span>
                  <span className="text-red-400 font-medium">{cs}{e.amount.toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 text-sm font-bold border-t border-border mt-1">
                <span className="text-foreground">Total Expenses</span>
                <span className="text-red-400">{cs}{expenses.reduce((s,e) => s + e.amount, 0).toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl flex justify-between items-center">
              <span className="text-lg font-bold text-foreground">Net Profit</span>
              <span className={`text-xl font-bold ${netProfit >= 0 ? "gradient-text" : "text-destructive"}`}>
                {cs}{netProfit.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </GlassCard>
      )}

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Expense">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Description</label>
            <input type="text" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Office supplies"
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring">
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Amount (₹)</label>
            <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: Number(e.target.value) }))}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Date</label>
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
          </div>
          <button onClick={handleAddExpense} className="w-full neon-button py-2.5 rounded-lg text-sm font-semibold">Add Expense</button>
        </div>
      </Modal>
    </div>
  );
}
