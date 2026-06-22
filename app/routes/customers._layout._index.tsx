import { useState } from "react";
import { Search, Plus, Edit2, Trash2, Eye, Phone, Mail } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { Badge } from "~/components/ui/badge";
import { Modal } from "~/components/ui/modal";
import { sampleCustomers, type Customer } from "~/lib/store";
import { useConfigurables } from "~/modules/configurables";

function CustomerForm({ customer, onSave, onCancel }: {
  customer?: Customer;
  onSave: (c: Partial<Customer>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: customer?.name ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    address: customer?.address ?? "",
    gstin: customer?.gstin ?? "",
    state: customer?.state ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { label: "Full Name", key: "name", placeholder: "Rahul Sharma" },
        { label: "Email", key: "email", placeholder: "rahul@example.com" },
        { label: "Phone", key: "phone", placeholder: "9876543210" },
        { label: "Address", key: "address", placeholder: "123 MG Road, Mumbai" },
        { label: "GSTIN", key: "gstin", placeholder: "27AABCU9603R1ZX" },
        { label: "State", key: "state", placeholder: "Maharashtra" },
      ].map(f => (
        <div key={f.key}>
          <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
          <input
            type="text"
            value={(form as any)[f.key]}
            onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
            placeholder={f.placeholder}
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring"
          />
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 neon-button py-2.5 rounded-lg text-sm font-semibold">
          {customer ? "Update Customer" : "Add Customer"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function CustomersPage() {
  const { config, loading } = useConfigurables();
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | undefined>();
  const [viewCustomer, setViewCustomer] = useState<Customer | undefined>();

  const currencySymbol = loading ? "₹" : (config?.currencySymbol ?? "₹");

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const handleSave = (data: Partial<Customer>) => {
    if (editCustomer) {
      setCustomers(prev => prev.map(c => c.id === editCustomer.id ? { ...c, ...data } : c));
    } else {
      const newC: Customer = {
        id: Math.random().toString(36).substring(2, 11),
        name: data.name ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        address: data.address ?? "",
        gstin: data.gstin ?? "",
        state: data.state ?? "",
        totalPurchases: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCustomers(prev => [newC, ...prev]);
    }
    setModalOpen(false);
    setEditCustomer(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this customer?")) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Customers"
        subtitle="Manage your customer relationships"
        actions={
          <button
            onClick={() => { setEditCustomer(undefined); setModalOpen(true); }}
            className="neon-button px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="metric-card p-4 text-center">
          <p className="text-2xl font-bold gradient-text">{customers.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Customers</p>
        </div>
        <div className="metric-card p-4 text-center">
          <p className="text-2xl font-bold text-cyan-400">
            {currencySymbol}{customers.reduce((s, c) => s + c.totalPurchases, 0).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Total Revenue</p>
        </div>
        <div className="metric-card p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">
            {customers.filter(c => c.gstin).length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">GST Registered</p>
        </div>
      </div>

      {/* Search + Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Contact", "State", "GSTIN", "Total Purchases", "Actions"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No customers found</td></tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-foreground font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">Since {c.createdAt}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {c.email}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {c.phone}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="info">{c.state}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      {c.gstin ? (
                        <span className="text-xs font-mono text-cyan-400">{c.gstin}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">
                      {currencySymbol}{c.totalPurchases.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewCustomer(c)}
                          className="p-1.5 text-muted-foreground hover:text-cyan-400 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setEditCustomer(c); setModalOpen(true); }}
                          className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditCustomer(undefined); }}
        title={editCustomer ? "Edit Customer" : "Add Customer"}
      >
        <CustomerForm
          customer={editCustomer}
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditCustomer(undefined); }}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        open={!!viewCustomer}
        onClose={() => setViewCustomer(undefined)}
        title="Customer Profile"
        size="lg"
      >
        {viewCustomer && (
          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-border">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-white">{viewCustomer.name[0]}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">{viewCustomer.name}</h3>
              <p className="text-sm text-muted-foreground">{viewCustomer.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Phone", value: viewCustomer.phone },
                { label: "State", value: viewCustomer.state },
                { label: "GSTIN", value: viewCustomer.gstin || "Not provided" },
                { label: "Total Purchases", value: `${currencySymbol}${viewCustomer.totalPurchases.toLocaleString("en-IN")}` },
                { label: "Address", value: viewCustomer.address },
                { label: "Customer Since", value: viewCustomer.createdAt },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm text-foreground font-medium mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
