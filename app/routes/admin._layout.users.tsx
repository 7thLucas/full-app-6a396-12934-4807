import { useState } from "react";
import { Search, UserX, UserCheck, Trash2 } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { Badge } from "~/components/ui/badge";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  plan: string;
  joinDate: string;
  status: "active" | "suspended";
  invoices: number;
}

const initialUsers: AdminUser[] = [
  { id: 1, name: "Rahul Sharma", email: "rahul@techcorp.in", plan: "Pro", joinDate: "2024-03-12", status: "active", invoices: 45 },
  { id: 2, name: "Priya Patel", email: "priya@startup.in", plan: "Basic", joinDate: "2024-03-10", status: "active", invoices: 23 },
  { id: 3, name: "Amit Kumar", email: "amit@business.in", plan: "Business", joinDate: "2024-03-08", status: "active", invoices: 78 },
  { id: 4, name: "Sneha Reddy", email: "sneha@ventures.in", plan: "Free", joinDate: "2024-03-05", status: "active", invoices: 4 },
  { id: 5, name: "Vikram Singh", email: "vikram@services.in", plan: "Pro", joinDate: "2024-03-01", status: "suspended", invoices: 12 },
  { id: 6, name: "Deepa Nair", email: "deepa@business.in", plan: "Basic", joinDate: "2024-02-28", status: "active", invoices: 19 },
  { id: 7, name: "Suresh Rao", email: "suresh@shop.in", plan: "Free", joinDate: "2024-02-25", status: "active", invoices: 2 },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [search, setSearch] = useState("");

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u));
  };

  const deleteUser = (id: number) => {
    if (confirm("Delete this user permanently?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader title="User Management" subtitle="View, suspend, and manage all platform users" />

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, color: "gradient-text" },
          { label: "Active", value: users.filter(u => u.status === "active").length, color: "text-emerald-400" },
          { label: "Suspended", value: users.filter(u => u.status === "suspended").length, color: "text-red-400" },
          { label: "Paid Plans", value: users.filter(u => u.plan !== "Free").length, color: "text-cyan-400" },
        ].map(m => (
          <div key={m.label} className="metric-card p-4 text-center">
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
              className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["User", "Plan", "Joined", "Invoices", "Status", "Actions"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={u.plan === "Business" ? "warning" : u.plan === "Pro" ? "purple" : u.plan === "Basic" ? "info" : "default"}>
                    {u.plan}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{u.joinDate}</td>
                <td className="py-3 px-4 text-foreground">{u.invoices}</td>
                <td className="py-3 px-4">
                  <Badge variant={u.status === "active" ? "success" : "error"}>{u.status}</Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleStatus(u.id)}
                      className={`p-1.5 transition-colors ${u.status === "active" ? "text-muted-foreground hover:text-amber-400" : "text-muted-foreground hover:text-emerald-400"}`}
                      title={u.status === "active" ? "Suspend user" : "Activate user"}>
                      {u.status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                    <button onClick={() => deleteUser(u.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
