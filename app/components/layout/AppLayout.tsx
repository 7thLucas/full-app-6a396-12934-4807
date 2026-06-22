import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "~/modules/authentication/use-authentication";

interface AppLayoutProps {
  requireAdmin?: boolean;
}

export function AppLayout({ requireAdmin = false }: AppLayoutProps) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/auth/login");
        return;
      }
      if (requireAdmin && !isAdmin) {
        navigate("/dashboard");
        return;
      }
    }
  }, [loading, isAuthenticated, isAdmin, requireAdmin, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-xl neon-button flex items-center justify-center mx-auto animate-pulse">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <p className="text-muted-foreground text-sm">Loading BizVault AI...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (requireAdmin && !isAdmin) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <Sidebar isAdmin={requireAdmin || isAdmin} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
