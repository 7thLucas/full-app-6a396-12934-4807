import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, AlertTriangle, Package } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { Badge } from "~/components/ui/badge";
import { Modal } from "~/components/ui/modal";
import { sampleProducts, type Product, type StockTransaction, type Supplier } from "~/lib/store";
import { useConfigurables } from "~/modules/configurables";

const initialSuppliers: Supplier[] = [
  { id: "s1", name: "TechDistrib India", contact: "9876543200", email: "orders@techdistrib.in", leadTime: 3, products: "Electronics", createdAt: "2024-01-01" },
  { id: "s2", name: "AccessoryHub", contact: "9876543201", email: "bulk@accessoryhub.in", leadTime: 5, products: "Accessories", createdAt: "2024-01-15" },
];

export default function InventoryPage() {
  const { config, loading } = useConfigurables();
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [stockModal, setStockModal] = useState<{ open: boolean; type: "in" | "out"; productId: string } | null>(null);
  const [supplierModal, setSupplierModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: "", contact: "", email: "", leadTime: 3, products: "" });
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [tab, setTab] = useState<"inventory" | "suppliers" | "transactions">("inventory");

  const currencySymbol = loading ? "₹" : (config?.currencySymbol ?? "₹");
  const lowStockThreshold = loading ? 10 : (config?.lowStockThreshold ?? 10);

  const totalValue = products.reduce((s, p) => s + p.stock * p.costPrice, 0);
  const lowStockItems = products.filter(p => p.stock <= p.lowStockThreshold);

  const handleStockUpdate = () => {
    if (!stockModal) return;
    const { productId, type } = stockModal;
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      return { ...p, stock: type === "in" ? p.stock + qty : Math.max(0, p.stock - qty) };
    }));
    const p = products.find(x => x.id === productId);
    setTransactions(prev => [{
      id: Math.random().toString(36).substring(2, 11),
      productId,
      productName: p?.name ?? "",
      type,
      quantity: qty,
      note,
      date: new Date().toISOString().split("T")[0],
    }, ...prev]);
    setStockModal(null);
    setQty(1);
    setNote("");
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Inventory"
        subtitle="Track stock levels and manage suppliers"
        actions={
          <button
            onClick={() => setSupplierModal(true)}
            className="neon-button px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Supplier
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Items", value: products.reduce((s, p) => s + p.stock, 0), color: "gradient-text" },
          { label: "Inventory Value", value: `${currencySymbol}${totalValue.toLocaleString("en-IN")}`, color: "text-cyan-400" },
          { label: "Low Stock Items", value: lowStockItems.length, color: "text-amber-400" },
          { label: "Suppliers", value: suppliers.length, color: "text-purple-400" },
        ].map(m => (
          <div key={m.label} className="metric-card p-4 text-center">
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted/30 rounded-xl w-fit">
        {["inventory", "suppliers", "transactions"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "inventory" && (
        <GlassCard className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Product", "Category", "Stock", "Status", "Cost Value", "Actions"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const isLow = p.stock <= p.lowStockThreshold;
                return (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4"><Badge variant="info">{p.category}</Badge></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {isLow && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        <span className={`font-semibold ${isLow ? "text-amber-400" : "text-foreground"}`}>{p.stock}</span>
                        <span className="text-xs text-muted-foreground">/ min {p.lowStockThreshold}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={isLow ? "warning" : "success"}>{isLow ? "Low Stock" : "In Stock"}</Badge>
                    </td>
                    <td className="py-3 px-4 text-foreground">{currencySymbol}{(p.stock * p.costPrice).toLocaleString("en-IN")}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setStockModal({ open: true, type: "in", productId: p.id })}
                          className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-400/30 px-2 py-1 rounded-lg transition-colors"
                        >
                          <TrendingUp className="w-3 h-3" /> Stock In
                        </button>
                        <button
                          onClick={() => setStockModal({ open: true, type: "out", productId: p.id })}
                          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-2 py-1 rounded-lg transition-colors"
                        >
                          <TrendingDown className="w-3 h-3" /> Stock Out
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GlassCard>
      )}

      {tab === "suppliers" && (
        <GlassCard className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Supplier", "Contact", "Email", "Lead Time", "Products"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suppliers.map(s => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium">{s.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{s.contact}</td>
                  <td className="py-3 px-4 text-muted-foreground">{s.email}</td>
                  <td className="py-3 px-4"><Badge variant="cyan">{s.leadTime} days</Badge></td>
                  <td className="py-3 px-4 text-muted-foreground">{s.products}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {tab === "transactions" && (
        <GlassCard className="p-0 overflow-hidden">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No transactions yet. Update stock to see history.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Date", "Product", "Type", "Quantity", "Note"].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-muted-foreground">{t.date}</td>
                    <td className="py-3 px-4 text-foreground">{t.productName}</td>
                    <td className="py-3 px-4">
                      <Badge variant={t.type === "in" ? "success" : "error"}>{t.type === "in" ? "Stock In" : "Stock Out"}</Badge>
                    </td>
                    <td className="py-3 px-4 text-foreground font-semibold">{t.quantity}</td>
                    <td className="py-3 px-4 text-muted-foreground">{t.note || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </GlassCard>
      )}

      {/* Stock Update Modal */}
      <Modal
        open={!!stockModal}
        onClose={() => setStockModal(null)}
        title={stockModal?.type === "in" ? "Stock In" : "Stock Out"}
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Product: <span className="text-foreground font-medium">
                {products.find(p => p.id === stockModal?.productId)?.name}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Current stock: <span className="text-foreground font-medium">
                {products.find(p => p.id === stockModal?.productId)?.stock ?? 0}
              </span>
            </p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Quantity</label>
            <input
              type="number"
              value={qty}
              onChange={e => setQty(Math.max(1, Number(e.target.value)))}
              min={1}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Reason for stock update"
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>
          <button onClick={handleStockUpdate} className="w-full neon-button py-2.5 rounded-lg text-sm font-semibold">
            Confirm {stockModal?.type === "in" ? "Stock In" : "Stock Out"}
          </button>
        </div>
      </Modal>

      {/* Add Supplier Modal */}
      <Modal open={supplierModal} onClose={() => setSupplierModal(false)} title="Add Supplier">
        <form onSubmit={(e) => {
          e.preventDefault();
          setSuppliers(prev => [...prev, { ...newSupplier, id: Math.random().toString(36).substring(2, 11), createdAt: new Date().toISOString().split("T")[0] }]);
          setSupplierModal(false);
          setNewSupplier({ name: "", contact: "", email: "", leadTime: 3, products: "" });
        }} className="space-y-4">
          {[
            { label: "Supplier Name", key: "name", type: "text", placeholder: "TechDistrib India" },
            { label: "Phone", key: "contact", type: "text", placeholder: "9876543200" },
            { label: "Email", key: "email", type: "email", placeholder: "orders@supplier.in" },
            { label: "Products", key: "products", type: "text", placeholder: "Electronics, Accessories" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
              <input
                type={f.type}
                value={(newSupplier as any)[f.key]}
                onChange={e => setNewSupplier(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring"
              />
            </div>
          ))}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Lead Time (days)</label>
            <input type="number" value={newSupplier.leadTime} onChange={e => setNewSupplier(p => ({ ...p, leadTime: Number(e.target.value) }))}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
          </div>
          <button type="submit" className="w-full neon-button py-2.5 rounded-lg text-sm font-semibold">Add Supplier</button>
        </form>
      </Modal>
    </div>
  );
}
