import { Link, useLocation } from "react-router";
import { useState } from "react";
import {
  LayoutDashboard, Users, Package, Warehouse, FileText, Receipt,
  Calculator, Sparkles, Watch, Truck, BarChart3, Settings,
  Shield, ChevronLeft, ChevronRight, Menu, X, LogOut,
  TrendingUp, Bell, Crown
} from "lucide-react";
import { useAuth } from "~/modules/authentication/use-authentication";
import { useConfigurables } from "~/modules/configurables";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const userNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Products", href: "/products", icon: Package },
  { label: "Inventory", href: "/inventory", icon: Warehouse },
  { label: "Invoices", href: "/invoices", icon: FileText },
  { label: "GST", href: "/gst", icon: Receipt },
  { label: "Accounting", href: "/accounting", icon: Calculator },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "AI Tools", href: "/ai-tools", icon: Sparkles, badge: "AI" },
  { label: "Watch Tools", href: "/watch-tools", icon: Watch },
  { label: "Dropshipping", href: "/dropshipping", icon: Truck },
  { label: "Subscriptions", href: "/subscriptions", icon: Crown },
  { label: "Profile", href: "/profile", icon: Settings },
];

const adminNavItems: NavItem[] = [
  { label: "Admin Dashboard", href: "/admin", icon: Shield },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: Crown },
  { label: "Revenue", href: "/admin/revenue", icon: TrendingUp },
  { label: "Invoices", href: "/admin/invoices", icon: FileText },
  { label: "Announcements", href: "/admin/announcements", icon: Bell },
  { label: "Support", href: "/admin/support", icon: Settings },
];

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { config, loading } = useConfigurables();

  const appName = loading ? "BizVault AI" : (config?.appName ?? "BizVault AI");
  const navItems = isAdmin ? adminNavItems : userNavItems;

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/admin") return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-sidebar-border ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-lg neon-button flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-sm font-bold gradient-text leading-tight">{appName}</h1>
            <p className="text-xs text-muted-foreground">Business Suite</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${active
                  ? "sidebar-item-active text-foreground"
                  : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
                }
                ${collapsed ? "justify-center" : ""}
              `}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-primary" : ""}`} />
              {!collapsed && (
                <span className="flex-1">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <form action="/auth/logout" method="post">
          <button
            type="submit"
            className={`
              flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium
              text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col h-full bg-sidebar border-r border-sidebar-border
          transition-all duration-200 flex-shrink-0
          ${collapsed ? "w-16" : "w-60"}
        `}
      >
        <SidebarContent />
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-[72px] -right-3 bg-card border border-border rounded-full p-1 text-muted-foreground hover:text-foreground z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg text-foreground"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
