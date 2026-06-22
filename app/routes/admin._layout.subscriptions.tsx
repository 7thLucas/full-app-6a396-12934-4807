import { useState } from "react";
import { Crown, TrendingUp } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { Badge } from "~/components/ui/badge";
import { useConfigurables } from "~/modules/configurables";

const defaultPlans = [
  { name: "Free", price: 0, subscribers: 1250, revenue: 0, features: "Basic features" },
  { name: "Basic", price: 199, subscribers: 430, revenue: 85570, features: "Unlimited invoices" },
  { name: "Pro", price: 499, subscribers: 180, revenue: 89820, features: "AI Tools" },
  { name: "Business", price: 999, subscribers: 45, revenue: 44955, features: "Enterprise" },
];

const planColors = ["text-slate-400", "text-blue-400", "gradient-text", "text-amber-400"];

export default function AdminSubscriptionsPage() {
  const { config, loading } = useConfigurables();
  const plans = defaultPlans;
  const totalMRR = plans.reduce((s, p) => s + p.revenue, 0);
  const totalSubscribers = plans.reduce((s, p) => s + p.subscribers, 0);

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader title="Subscription Management" subtitle="Monitor and manage subscription plans" />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {plans.map((p, i) => (
          <div key={p.name} className="metric-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{p.name} Plan</p>
            </div>
            <p className={`text-2xl font-bold ${planColors[i]}`}>{p.subscribers}</p>
            <p className="text-xs text-muted-foreground mt-1">subscribers</p>
            <p className="text-sm text-emerald-400 font-medium mt-2">
              {p.price === 0 ? "Free" : `₹${p.revenue.toLocaleString("en-IN")}/mo`}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="metric-card p-5 text-center">
          <p className="text-3xl font-bold gradient-text">₹{totalMRR.toLocaleString("en-IN")}</p>
          <p className="text-sm text-muted-foreground mt-1">Monthly Recurring Revenue</p>
        </div>
        <div className="metric-card p-5 text-center">
          <p className="text-3xl font-bold text-cyan-400">{totalSubscribers.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Subscribers</p>
        </div>
      </div>

      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Plan Details</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Plan", "Price", "Subscribers", "Revenue/Month", "Features", "Status"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plans.map((p, i) => (
              <tr key={p.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-muted-foreground" />
                    <span className={`font-semibold ${planColors[i]}`}>{p.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-foreground">
                  {p.price === 0 ? "Free" : `₹${p.price}/mo`}
                </td>
                <td className="py-3 px-4 text-foreground font-semibold">{p.subscribers.toLocaleString()}</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">
                  {p.price === 0 ? "₹0" : `₹${p.revenue.toLocaleString("en-IN")}`}
                </td>
                <td className="py-3 px-4 text-muted-foreground">{p.features}</td>
                <td className="py-3 px-4">
                  <Badge variant="success">Active</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
