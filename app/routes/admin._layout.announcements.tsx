import { useState } from "react";
import { Plus, Bell, Trash2 } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { Badge } from "~/components/ui/badge";
import { Modal } from "~/components/ui/modal";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  date: string;
  active: boolean;
}

const initialAnnouncements: Announcement[] = [
  { id: "a1", title: "New Feature: AI Tools", message: "We've added 8 new AI tools to help boost your productivity. Check them out in the AI Tools section!", type: "success", date: "2024-03-10", active: true },
  { id: "a2", title: "Maintenance Window", message: "Scheduled maintenance on March 20th from 2-4 AM IST. The platform may be briefly unavailable.", type: "warning", date: "2024-03-08", active: true },
  { id: "a3", title: "GST Filing Reminder", message: "GSTR-1 filing deadline is March 11th. Use our GST Management module to prepare your reports.", type: "info", date: "2024-03-01", active: false },
];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", type: "info" as const });

  const handleAdd = () => {
    setAnnouncements(prev => [{
      id: Math.random().toString(36).substring(2, 11),
      ...form,
      date: new Date().toISOString().split("T")[0],
      active: true,
    }, ...prev]);
    setAddOpen(false);
    setForm({ title: "", message: "", type: "info" });
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Announcements"
        subtitle="Broadcast messages to all platform users"
        actions={
          <button onClick={() => setAddOpen(true)} className="neon-button px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        }
      />

      <div className="space-y-4">
        {announcements.map(a => (
          <GlassCard key={a.id} className={`p-5 ${!a.active ? "opacity-60" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  a.type === "success" ? "bg-emerald-500/20" : a.type === "warning" ? "bg-amber-500/20" : "bg-blue-500/20"
                }`}>
                  <Bell className={`w-4 h-4 ${
                    a.type === "success" ? "text-emerald-400" : a.type === "warning" ? "text-amber-400" : "text-blue-400"
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground">{a.title}</h3>
                    <Badge variant={a.type === "success" ? "success" : a.type === "warning" ? "warning" : "info"}>{a.type}</Badge>
                    {!a.active && <Badge variant="default">Inactive</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{a.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{a.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setAnnouncements(prev => prev.map(x => x.id === a.id ? { ...x, active: !x.active } : x))}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors border border-border px-3 py-1.5 rounded-lg"
                >
                  {a.active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => { if (confirm("Delete this announcement?")) setAnnouncements(prev => prev.filter(x => x.id !== a.id)); }}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="New Announcement">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Title</label>
            <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="Announcement title"
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Message</label>
            <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              placeholder="Write your announcement here..."
              rows={4}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Type</label>
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring">
              <option value="info">Info</option>
              <option value="success">Success / Feature</option>
              <option value="warning">Warning / Maintenance</option>
            </select>
          </div>
          <button onClick={handleAdd} disabled={!form.title || !form.message}
            className="w-full neon-button py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50">
            Publish Announcement
          </button>
        </div>
      </Modal>
    </div>
  );
}
