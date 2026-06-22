import { Check, Zap, Crown, Shield } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { useAuth } from "~/modules/authentication/use-authentication";
import { useConfigurables } from "~/modules/configurables";

const planIcons = [Shield, Zap, Crown, Shield];
const planColors = ["from-slate-500 to-slate-700", "from-blue-500 to-blue-700", "from-purple-500 to-cyan-500", "from-amber-500 to-amber-700"];

const defaultPlans = [
  { name: "Free", price: 0, description: "Get started for free", features: "5 invoices/month,50 products,Basic dashboard,Email support" },
  { name: "Basic", price: 199, description: "For freelancers & sole traders", features: "Unlimited invoices,500 products,All reports,GST filing,CSV export" },
  { name: "Pro", price: 499, description: "For growing businesses", features: "Everything in Basic,AI Tools (8 tools),Watch tools,Dropshipping tools,Priority support" },
  { name: "Business", price: 999, description: "For established businesses", features: "Everything in Pro,Unlimited products,Multi-user access,Custom branding,Dedicated support" },
];

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const { config, loading } = useConfigurables();

  const plans = loading || !config?.subscriptionPlans?.length ? defaultPlans : config.subscriptionPlans;
  const currentPlan = (user?.profile as any)?.plan ?? "Free";

  const handleSubscribe = async (planName: string, price: number) => {
    if (planName === "Free") return;
    // Mock Razorpay integration
    alert(`Razorpay integration: Would open payment for ${planName} plan at ₹${price}/month.\n\nTest mode: Integration ready for production Razorpay keys.`);
  };

  return (
    <div className="animate-fade-in-up space-y-8">
      <PageHeader
        title="Subscription Plans"
        subtitle="Choose the plan that fits your business needs"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan, i) => {
          const Icon = planIcons[i % planIcons.length];
          const isPopular = plan.name === "Pro";
          const isCurrent = currentPlan === plan.name;
          const features = typeof plan.features === "string"
            ? plan.features.split(",")
            : (plan.features as string[]) ?? [];

          return (
            <div
              key={plan.name}
              className={`relative flex flex-col glass-card p-6 ${isPopular ? "border-primary shadow-lg shadow-primary/20" : ""}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="neon-button px-4 py-1 rounded-full text-xs font-bold">MOST POPULAR</span>
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${planColors[i % planColors.length]} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">{plan.description}</p>

              <div className="mb-6">
                {plan.price === 0 ? (
                  <span className="text-3xl font-bold gradient-text">Free</span>
                ) : (
                  <div>
                    <span className="text-3xl font-bold gradient-text">₹{plan.price}</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                )}
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{feature.trim()}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full py-2.5 rounded-xl border border-primary text-primary text-sm font-semibold text-center">
                  Current Plan
                </div>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.name, plan.price)}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    plan.price === 0
                      ? "border border-border text-muted-foreground hover:text-foreground"
                      : "neon-button"
                  }`}
                >
                  {plan.price === 0 ? "Use Free Plan" : `Upgrade to ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Feature Comparison */}
      <GlassCard className="p-6">
        <h3 className="text-base font-bold text-foreground mb-6">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 text-muted-foreground font-medium">Feature</th>
                {plans.map(p => (
                  <th key={p.name} className="text-center py-3 px-4 text-muted-foreground font-medium">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["GST Invoicing", true, true, true, true],
                ["Customer Management", true, true, true, true],
                ["Product Catalog", "50", "500", "Unlimited", "Unlimited"],
                ["Inventory Management", false, true, true, true],
                ["AI Tools (8 tools)", false, false, true, true],
                ["Watch Seller Tools", false, false, true, true],
                ["Dropshipping Tools", false, false, true, true],
                ["Excel/PDF Reports", false, true, true, true],
                ["Admin Panel", false, false, false, true],
                ["Priority Support", false, false, true, true],
                ["Multi-user Access", false, false, false, true],
              ].map(([feature, ...values]) => (
                <tr key={String(feature)} className="border-b border-border/50">
                  <td className="py-3 pr-4 text-foreground">{feature}</td>
                  {values.map((val, i) => (
                    <td key={i} className="text-center py-3 px-4">
                      {typeof val === "boolean" ? (
                        val
                          ? <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                          : <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-foreground text-xs font-medium">{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Payment Note */}
      <div className="text-center text-xs text-muted-foreground">
        <p>Payments powered by Razorpay (test mode) • Secure • GST applicable on subscription fees</p>
        <p className="mt-1">All plans include: SSL security, data backup, 99.9% uptime</p>
      </div>
    </div>
  );
}
