import { useState } from "react";
import { Plus, Truck, Calculator, TrendingUp } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { Badge } from "~/components/ui/badge";
import { Modal } from "~/components/ui/modal";
import { useConfigurables } from "~/modules/configurables";

interface Order {
  id: string;
  orderNumber: string;
  platform: string;
  productName: string;
  customerName: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  cost: number;
  sellingPrice: number;
  shippingCost: number;
  profit: number;
  date: string;
}

const PLATFORMS = ["Amazon", "Flipkart", "Meesho", "Shopify", "WooCommerce", "Direct"];
const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;
const STATUS_COLORS = {
  pending: "warning" as const,
  processing: "info" as const,
  shipped: "cyan" as const,
  delivered: "success" as const,
  cancelled: "error" as const,
};

const initialOrders: Order[] = [
  { id: "o1", orderNumber: "DS-2024-001", platform: "Amazon", productName: "Wireless Earbuds", customerName: "Rahul S.", status: "delivered", cost: 450, sellingPrice: 1299, shippingCost: 80, profit: 769, date: "2024-03-01" },
  { id: "o2", orderNumber: "DS-2024-002", platform: "Flipkart", productName: "Smart Watch Band", customerName: "Priya P.", status: "shipped", cost: 180, sellingPrice: 599, shippingCost: 60, profit: 359, date: "2024-03-10" },
  { id: "o3", orderNumber: "DS-2024-003", platform: "Meesho", productName: "Phone Holder", customerName: "Amit K.", status: "processing", cost: 80, sellingPrice: 249, shippingCost: 40, profit: 129, date: "2024-03-12" },
];

export default function DropshippingPage() {
  const { config, loading } = useConfigurables();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [calcOpen, setCalcOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [tab, setTab] = useState<"orders" | "calculator">("orders");
  const cs = loading ? "₹" : (config?.currencySymbol ?? "₹");

  const [calc, setCalc] = useState({ cost: 0, sellingPrice: 0, shipping: 0, platformFeePercent: 10 });
  const platformFee = (calc.sellingPrice * calc.platformFeePercent / 100);
  const calcProfit = calc.sellingPrice - calc.cost - calc.shipping - platformFee;
  const calcMargin = calc.sellingPrice > 0 ? (calcProfit / calc.sellingPrice * 100).toFixed(1) : "0";

  const [newOrder, setNewOrder] = useState<Partial<Order>>({
    platform: "Amazon", status: "pending", date: new Date().toISOString().split("T")[0]
  });

  const handleAddOrder = () => {
    const order: Order = {
      id: Math.random().toString(36).substring(2, 11),
      orderNumber: `DS-2024-${String(orders.length + 1).padStart(3, "0")}`,
      platform: newOrder.platform ?? "Amazon",
      productName: newOrder.productName ?? "",
      customerName: newOrder.customerName ?? "",
      status: newOrder.status ?? "pending",
      cost: newOrder.cost ?? 0,
      sellingPrice: newOrder.sellingPrice ?? 0,
      shippingCost: newOrder.shippingCost ?? 0,
      profit: (newOrder.sellingPrice ?? 0) - (newOrder.cost ?? 0) - (newOrder.shippingCost ?? 0),
      date: newOrder.date ?? new Date().toISOString().split("T")[0],
    };
    setOrders(prev => [order, ...prev]);
    setAddOpen(false);
    setNewOrder({ platform: "Amazon", status: "pending", date: new Date().toISOString().split("T")[0] });
  };

  const totalRevenue = orders.reduce((s, o) => s + o.sellingPrice, 0);
  const totalProfit = orders.reduce((s, o) => s + o.profit, 0);
  const deliveredCount = orders.filter(o => o.status === "delivered").length;
  const avgMargin = orders.length > 0
    ? (orders.reduce((s, o) => s + (o.profit / o.sellingPrice * 100), 0) / orders.length).toFixed(1)
    : "0";

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Dropshipping"
        subtitle="Track orders, profits, and suppliers"
        actions={
          <button onClick={() => setAddOpen(true)} className="neon-button px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Order
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: orders.length, color: "gradient-text" },
          { label: "Total Revenue", value: `${cs}${totalRevenue.toLocaleString("en-IN")}`, color: "text-emerald-400" },
          { label: "Total Profit", value: `${cs}${totalProfit.toLocaleString("en-IN")}`, color: "text-cyan-400" },
          { label: "Avg Margin", value: `${avgMargin}%`, color: "text-purple-400" },
        ].map(m => (
          <div key={m.label} className="metric-card p-4 text-center">
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Profit Calculator Card */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Quick Profit Calculator</h3>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Product Cost (₹)", key: "cost" },
            { label: "Selling Price (₹)", key: "sellingPrice" },
            { label: "Shipping Cost (₹)", key: "shipping" },
            { label: "Platform Fee (%)", key: "platformFeePercent" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
              <input type="number" value={(calc as any)[f.key]}
                onChange={e => setCalc(p => ({ ...p, [f.key]: Number(e.target.value) }))}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="p-3 bg-muted/20 rounded-xl text-center">
            <p className="text-xs text-muted-foreground">Platform Fee</p>
            <p className="text-lg font-bold text-amber-400">{cs}{platformFee.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-muted/20 rounded-xl text-center">
            <p className="text-xs text-muted-foreground">Net Profit</p>
            <p className={`text-lg font-bold ${calcProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {cs}{calcProfit.toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl text-center">
            <p className="text-xs text-muted-foreground">Profit Margin</p>
            <p className="text-lg font-bold gradient-text">{calcMargin}%</p>
          </div>
        </div>
      </GlassCard>

      {/* Orders Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Order Tracking</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Order #", "Platform", "Product", "Customer", "Revenue", "Profit", "Status", "Date"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-primary font-mono text-xs">{o.orderNumber}</td>
                <td className="py-3 px-4"><Badge variant="purple">{o.platform}</Badge></td>
                <td className="py-3 px-4 text-foreground">{o.productName}</td>
                <td className="py-3 px-4 text-muted-foreground">{o.customerName}</td>
                <td className="py-3 px-4 text-foreground">{cs}{o.sellingPrice.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">+{cs}{o.profit.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4">
                  <Badge variant={STATUS_COLORS[o.status]}>{o.status}</Badge>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* Add Order Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Order" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Product Name", key: "productName", type: "text", placeholder: "Wireless Earbuds" },
              { label: "Customer Name", key: "customerName", type: "text", placeholder: "Rahul Sharma" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                <input type={f.type} value={(newOrder as any)[f.key] ?? ""} placeholder={f.placeholder}
                  onChange={e => setNewOrder(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
              </div>
            ))}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Platform</label>
              <select value={newOrder.platform} onChange={e => setNewOrder(p => ({ ...p, platform: e.target.value }))}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring">
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Status</label>
              <select value={newOrder.status} onChange={e => setNewOrder(p => ({ ...p, status: e.target.value as any }))}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring">
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Product Cost (₹)", key: "cost" },
              { label: "Selling Price (₹)", key: "sellingPrice" },
              { label: "Shipping (₹)", key: "shippingCost" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                <input type="number" value={(newOrder as any)[f.key] ?? 0}
                  onChange={e => setNewOrder(p => ({ ...p, [f.key]: Number(e.target.value) }))}
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
              </div>
            ))}
          </div>
          <div className="p-3 bg-muted/20 rounded-xl text-center">
            <p className="text-xs text-muted-foreground">Expected Profit</p>
            <p className="text-xl font-bold gradient-text">
              {cs}{((newOrder.sellingPrice ?? 0) - (newOrder.cost ?? 0) - (newOrder.shippingCost ?? 0)).toLocaleString("en-IN")}
            </p>
          </div>
          <button onClick={handleAddOrder} className="w-full neon-button py-2.5 rounded-lg text-sm font-semibold">Add Order</button>
        </div>
      </Modal>
    </div>
  );
}
