import { cn } from "~/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function GlassCard({ children, className, onClick, hoverable = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card p-6",
        hoverable && "metric-card cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: number; positive: boolean };
  gradient?: "purple" | "cyan" | "pink" | "green" | "yellow";
  className?: string;
}

const gradientMap = {
  purple: "from-purple-500 to-purple-700",
  cyan: "from-cyan-400 to-cyan-600",
  pink: "from-pink-400 to-pink-600",
  green: "from-emerald-400 to-emerald-600",
  yellow: "from-amber-400 to-amber-600",
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  gradient = "purple",
  className,
}: MetricCardProps) {
  return (
    <div className={cn("metric-card p-5", className)}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-muted-foreground text-sm font-medium">{title}</p>
        {icon && (
          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br", gradientMap[gradient])}>
            <span className="text-white">{icon}</span>
          </div>
        )}
      </div>
      <div className={cn("text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent", gradientMap[gradient])}>
        {value}
      </div>
      {(subtitle || trend) && (
        <div className="mt-2 flex items-center gap-2">
          {trend && (
            <span className={cn("text-xs font-medium", trend.positive ? "text-emerald-400" : "text-red-400")}>
              {trend.positive ? "+" : ""}{trend.value}%
            </span>
          )}
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
