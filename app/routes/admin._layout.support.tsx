import { useState } from "react";
import { MessageSquare, Check } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { Badge } from "~/components/ui/badge";

interface Ticket {
  id: string;
  user: string;
  email: string;
  subject: string;
  message: string;
  status: "open" | "in-progress" | "resolved";
  date: string;
}

const initialTickets: Ticket[] = [
  { id: "t1", user: "Rahul Sharma", email: "rahul@techcorp.in", subject: "Invoice PDF not downloading", message: "When I click download PDF nothing happens. Using Chrome on Windows 11.", status: "open", date: "2024-03-12" },
  { id: "t2", user: "Priya Patel", email: "priya@startup.in", subject: "GST calculation issue", message: "The IGST is showing wrong amount for inter-state invoice.", status: "in-progress", date: "2024-03-10" },
  { id: "t3", user: "Vikram Singh", email: "vikram@services.in", subject: "Cannot access AI Tools", message: "AI Tools section shows upgrade message but I'm on Pro plan.", status: "resolved", date: "2024-03-08" },
  { id: "t4", user: "Deepa Nair", email: "deepa@business.in", subject: "Inventory not updating", message: "Stock count doesn't change after Stock Out transaction.", status: "open", date: "2024-03-07" },
];

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selected, setSelected] = useState<Ticket | null>(null);

  const updateStatus = (id: string, status: Ticket["status"]) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const STATUS_COLORS = {
    open: "error" as const,
    "in-progress": "warning" as const,
    resolved: "success" as const,
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader title="Support Tickets" subtitle="Manage user support requests" />

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Open", value: tickets.filter(t => t.status === "open").length, color: "text-red-400" },
          { label: "In Progress", value: tickets.filter(t => t.status === "in-progress").length, color: "text-amber-400" },
          { label: "Resolved", value: tickets.filter(t => t.status === "resolved").length, color: "text-emerald-400" },
        ].map(m => (
          <div key={m.label} className="metric-card p-4 text-center">
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Ticket List */}
        <div className="space-y-3">
          {tickets.map(t => (
            <button
              key={t.id}
              onClick={() => setSelected(t)}
              className={`w-full text-left glass-card p-4 hover:border-primary/50 transition-all ${selected?.id === t.id ? "border-primary" : ""}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">{t.subject}</span>
                </div>
                <Badge variant={STATUS_COLORS[t.status]}>{t.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{t.user} · {t.date}</p>
            </button>
          ))}
        </div>

        {/* Ticket Detail */}
        {selected ? (
          <GlassCard className="p-5">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-bold text-foreground">{selected.subject}</h3>
                <Badge variant={STATUS_COLORS[selected.status]}>{selected.status}</Badge>
              </div>
              <div className="p-3 bg-muted/20 rounded-xl space-y-1">
                <p className="text-xs text-muted-foreground">From: <span className="text-foreground">{selected.user}</span></p>
                <p className="text-xs text-muted-foreground">Email: <span className="text-foreground">{selected.email}</span></p>
                <p className="text-xs text-muted-foreground">Date: <span className="text-foreground">{selected.date}</span></p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Message:</p>
                <p className="text-sm text-foreground bg-muted/20 p-3 rounded-xl">{selected.message}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Update Status:</p>
                <div className="flex gap-2">
                  {(["open", "in-progress", "resolved"] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all border ${
                        selected.status === s ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="flex items-center justify-center h-64">
            <p className="text-muted-foreground text-sm">Select a ticket to view details</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
