import { cn } from "~/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "purple" | "cyan";
  className?: string;
}

const variantMap = {
  default: "bg-muted text-muted-foreground",
  success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  error: "bg-red-500/20 text-red-400 border border-red-500/30",
  info: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  purple: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  cyan: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", variantMap[variant], className)}>
      {children}
    </span>
  );
}
