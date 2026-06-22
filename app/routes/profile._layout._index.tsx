import { useState } from "react";
import { User, Building2, Phone, MapPin, Save, Shield } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { useAuth } from "~/modules/authentication/use-authentication";

export default function ProfilePage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    displayName: user?.username ?? "",
    email: user?.email ?? "",
    businessName: (user?.profile as any)?.businessName ?? "",
    gstin: (user?.profile as any)?.gstin ?? "",
    phone: (user?.profile as any)?.phone ?? "",
    address: (user?.profile as any)?.address ?? "",
    state: (user?.profile as any)?.state ?? "Maharashtra",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save
    await new Promise(r => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in-up space-y-6 max-w-2xl">
      <PageHeader title="Profile" subtitle="Manage your account and business details" />

      {/* Avatar + Plan */}
      <GlassCard className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-white">{user?.username?.[0]?.toUpperCase() ?? "U"}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">{user?.username}</h3>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-primary capitalize">{user?.role ?? "user"}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-amber-400">{(user?.profile as any)?.plan ?? "Free"} Plan</span>
          </div>
        </div>
      </GlassCard>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Display Name</label>
              <input type="text" value={form.displayName} onChange={e => setForm(p => ({ ...p, displayName: e.target.value }))}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <input type="email" value={form.email} disabled
                className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground cursor-not-allowed" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="9876543210"
                  className="w-full bg-input border border-border rounded-lg pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" /> Business Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Business Name</label>
              <input type="text" value={form.businessName} onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))}
                placeholder="My Business Pvt Ltd"
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">GSTIN</label>
              <input type="text" value={form.gstin} onChange={e => setForm(p => ({ ...p, gstin: e.target.value }))}
                placeholder="27AABCU9603R1ZX"
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">State</label>
              <input type="text" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                placeholder="Maharashtra"
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Business Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  placeholder="123 Business Park, Mumbai, Maharashtra 400001"
                  rows={2}
                  className="w-full bg-input border border-border rounded-lg pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none" />
              </div>
            </div>
          </div>
        </GlassCard>

        <button
          type="submit"
          className="neon-button px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
