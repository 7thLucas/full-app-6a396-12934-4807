import { Shield, Sparkles, TrendingUp, Receipt, Package } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import type { ReactNode } from "react";

const features = [
  { icon: TrendingUp, text: "Revenue & Profit Analytics" },
  { icon: Receipt, text: "GST Invoice Generator" },
  { icon: Package, text: "Inventory Management" },
  { icon: Sparkles, text: "8 AI-powered Business Tools" },
];

export function AuthLayout({ children }: { children: ReactNode }) {
  const { config, loading } = useConfigurables();
  const appName = loading ? "BizVault AI" : (config?.appName ?? "BizVault AI");
  const tagline = loading ? "The Future of Business Management and AI Automation" : (config?.tagline ?? "The Future of Business Management and AI Automation");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl neon-button flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">{appName}</h1>
          </div>
        </div>

        <div className="relative space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground leading-tight mb-3">
              All-in-One Business Management for India
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">{tagline}</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 glass-card">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-foreground/80">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-muted-foreground">
          GST Compliant • Made for India • Trusted by 10,000+ businesses
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        {children}
      </div>
    </div>
  );
}
