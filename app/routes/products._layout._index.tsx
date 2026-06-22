import { useState } from "react";
import { Search, Plus, Edit2, Trash2, AlertTriangle } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { Badge } from "~/components/ui/badge";
import { Modal } from "~/components/ui/modal";
import { sampleProducts, type Product } from "~/lib/store";
import { useConfigurables } from "~/modules/configurables";

const GST_RATES = [0, 5, 12, 18, 28];
const CATEGORIES = ["Electronics", "Accessories", "Clothing", "Food", "Services", "Other"];

function ProductForm({ product, onSave, onCancel }: {
  product?: Product;
  onSave: (p: Partial<Product>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name ?? "",
    category: product?.category ?? "Electronics",
    costPrice: product?.costPrice ?? 0,
    sellingPrice: product?.sellingPrice ?? 0,
    gstRate: product?.gstRate ?? 18,
    hsnCode: product?.hsnCode ?? "",
    stock: product?.stock ?? 0,
    lowStockThreshold: product?.lowStockThreshold ?? 10,
  });

  const profitMargin = form.sellingPrice > 0
    ? (((form.sellingPrice - form.costPrice) / form.sellingPrice) * 100).toFixed(1)
    : "0";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Product Name</label>
        <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          placeholder="Wireless Mouse" required
          className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Category</label>
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">GST Rate (%)</label>
          <select value={form.gstRate} onChange={e => setForm(p => ({ ...p, gstRate: Number(e.target.value) }))}
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring">
            {GST_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Cost Price (₹)</label>
          <input type="number" value={form.costPrice} onChange={e => setForm(p => ({ ...p, costPrice: Number(e.target.value) }))}
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Selling Price (₹)</label>
          <input type="number" value={form.sellingPrice} onChange={e => setForm(p => ({ ...p, sellingPrice: Number(e.target.value) }))}
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
        </div>
      </div>
      <div className="glass-card p-3 !rounded-lg text-center">
        <p className="text-xs text-muted-foreground">Profit Margin</p>
        <p className="text-xl font-bold gradient-text">{profitMargin}%</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">HSN/SAC Code</label>
          <input type="text" value={form.hsnCode} onChange={e => setForm(p => ({ ...p, hsnCode: e.target.value }))}
            placeholder="8471"
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Initial Stock</label>
          <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: Number(e.target.value) }))}
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 neon-button py-2.5 rounded-lg text-sm font-semibold">
          {product ? "Update Product" : "Add Product"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function ProductsPage() {
  const { config, loading } = useConfigurables();
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();

  const currencySymbol = loading ? "₹" : (config?.currencySymbol ?? "₹");
  const lowStockThreshold = loading ? 10 : (config?.lowStockThreshold ?? 10);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.hsnCode.includes(search);
    const matchCat = !categoryFilter || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleSave = (data: Partial<Product>) => {
    if (editProduct) {
      setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...data } : p));
    } else {
      const newP: Product = {
        id: Math.random().toString(36).substring(2, 11),
        name: data.name ?? "",
        category: data.category ?? "Electronics",
        costPrice: data.costPrice ?? 0,
        sellingPrice: data.sellingPrice ?? 0,
        gstRate: data.gstRate ?? 18,
        hsnCode: data.hsnCode ?? "",
        stock: data.stock ?? 0,
        lowStockThreshold: data.lowStockThreshold ?? lowStockThreshold,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setProducts(prev => [newP, ...prev]);
    }
    setModalOpen(false);
    setEditProduct(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this product?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const categories = Array.from(new Set(products.map(p => p.category)));
  const totalValue = products.reduce((s, p) => s + p.stock * p.sellingPrice, 0);
  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Products"
        subtitle="Manage your product catalog"
        actions={
          <button
            onClick={() => { setEditProduct(undefined); setModalOpen(true); }}
            className="neon-button px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: products.length, color: "gradient-text" },
          { label: "Catalog Value", value: `${currencySymbol}${totalValue.toLocaleString("en-IN")}`, color: "text-cyan-400" },
          { label: "Categories", value: categories.length, color: "text-purple-400" },
          { label: "Low Stock", value: lowStockCount, color: "text-amber-400" },
        ].map(m => (
          <div key={m.label} className="metric-card p-4 text-center">
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Product", "Category", "Cost Price", "Selling Price", "Margin", "GST", "Stock", "Actions"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">No products found</td></tr>
            ) : (
              filtered.map(p => {
                const margin = p.sellingPrice > 0 ? (((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100).toFixed(1) : "0";
                const isLow = p.stock <= p.lowStockThreshold;
                return (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-foreground font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">HSN: {p.hsnCode}</p>
                    </td>
                    <td className="py-3 px-4"><Badge variant="info">{p.category}</Badge></td>
                    <td className="py-3 px-4 text-foreground">{currencySymbol}{p.costPrice.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-4 text-foreground font-semibold">{currencySymbol}{p.sellingPrice.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">{margin}%</td>
                    <td className="py-3 px-4"><Badge variant="purple">{p.gstRate}%</Badge></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {isLow && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        <span className={isLow ? "text-amber-400 font-semibold" : "text-foreground"}>{p.stock}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditProduct(p); setModalOpen(true); }}
                          className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </GlassCard>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditProduct(undefined); }}
        title={editProduct ? "Edit Product" : "Add Product"}
        size="lg"
      >
        <ProductForm
          product={editProduct}
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditProduct(undefined); }}
        />
      </Modal>
    </div>
  );
}
