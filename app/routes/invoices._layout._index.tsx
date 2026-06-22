import { useState } from "react";
import { Plus, Download, Printer, Eye, Search } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { Badge } from "~/components/ui/badge";
import { Modal } from "~/components/ui/modal";
import { sampleInvoices, sampleCustomers, sampleProducts, type Invoice, type InvoiceItem } from "~/lib/store";
import { useConfigurables } from "~/modules/configurables";

const STATUS_COLORS = {
  draft: "default" as const,
  sent: "info" as const,
  paid: "success" as const,
  overdue: "error" as const,
};

function InvoicePreview({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const { config, loading } = useConfigurables();
  const cs = loading ? "₹" : (config?.currencySymbol ?? "₹");
  const isIntraState = invoice.customerState === invoice.businessState;

  const handlePrint = () => window.print();

  const handlePDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("TAX INVOICE", 105, 20, { align: "center" });
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice No: ${invoice.invoiceNumber}`, 20, 35);
      doc.text(`Date: ${invoice.date}`, 20, 43);
      doc.text(`Customer: ${invoice.customerName}`, 20, 51);
      if (invoice.customerGstin) doc.text(`GSTIN: ${invoice.customerGstin}`, 20, 59);
      doc.setLineWidth(0.5);
      doc.line(20, 65, 190, 65);
      doc.setFont("helvetica", "bold");
      doc.text("Item", 20, 73);
      doc.text("Qty", 110, 73);
      doc.text("Rate", 130, 73);
      doc.text("GST%", 150, 73);
      doc.text("Amount", 170, 73);
      doc.setFont("helvetica", "normal");
      let y = 80;
      invoice.items.forEach(item => {
        doc.text(item.productName.substring(0, 35), 20, y);
        doc.text(String(item.quantity), 110, y);
        doc.text(`${cs}${item.unitPrice}`, 130, y);
        doc.text(`${item.gstRate}%`, 150, y);
        doc.text(`${cs}${item.amount.toFixed(2)}`, 170, y);
        y += 8;
      });
      doc.line(20, y, 190, y);
      y += 7;
      doc.text(`Subtotal: ${cs}${invoice.subtotal.toFixed(2)}`, 130, y); y += 7;
      if (isIntraState) {
        doc.text(`CGST: ${cs}${invoice.totalCgst.toFixed(2)}`, 130, y); y += 7;
        doc.text(`SGST: ${cs}${invoice.totalSgst.toFixed(2)}`, 130, y); y += 7;
      } else {
        doc.text(`IGST: ${cs}${invoice.totalIgst.toFixed(2)}`, 130, y); y += 7;
      }
      doc.setFont("helvetica", "bold");
      doc.text(`TOTAL: ${cs}${invoice.totalAmount.toFixed(2)}`, 130, y);
      doc.save(`${invoice.invoiceNumber}.pdf`);
    } catch (e) {
      alert("PDF generation error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">{invoice.invoiceNumber}</h2>
          <p className="text-sm text-muted-foreground">Date: {invoice.date} | Due: {invoice.dueDate}</p>
        </div>
        <Badge variant={STATUS_COLORS[invoice.status]}>{invoice.status.toUpperCase()}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-xl">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Customer</p>
          <p className="text-sm font-semibold text-foreground">{invoice.customerName}</p>
          {invoice.customerGstin && <p className="text-xs text-muted-foreground font-mono">{invoice.customerGstin}</p>}
          <p className="text-xs text-muted-foreground">{invoice.customerState}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">GST Type</p>
          <Badge variant={isIntraState ? "success" : "cyan"}>
            {isIntraState ? "Intra-State (CGST+SGST)" : "Inter-State (IGST)"}
          </Badge>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {["Product", "Qty", "Rate", "GST%", "Amount"].map(h => (
              <th key={h} className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i} className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">{item.productName}</td>
              <td className="py-2 px-3 text-foreground">{item.quantity}</td>
              <td className="py-2 px-3 text-foreground">{cs}{item.unitPrice.toLocaleString("en-IN")}</td>
              <td className="py-2 px-3 text-foreground">{item.gstRate}%</td>
              <td className="py-2 px-3 text-foreground font-semibold">{cs}{item.amount.toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto w-60 space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>{cs}{invoice.subtotal.toFixed(2)}</span>
        </div>
        {isIntraState ? (
          <>
            <div className="flex justify-between text-muted-foreground">
              <span>CGST</span>
              <span>{cs}{invoice.totalCgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>SGST</span>
              <span>{cs}{invoice.totalSgst.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <div className="flex justify-between text-muted-foreground">
            <span>IGST</span>
            <span>{cs}{invoice.totalIgst.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-foreground font-bold text-base border-t border-border pt-2">
          <span>Total</span>
          <span className="gradient-text">{cs}{invoice.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handlePDF} className="flex-1 neon-button py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
          <Download className="w-4 h-4" /> Download PDF
        </button>
        <button onClick={handlePrint} className="px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
          <Printer className="w-4 h-4" /> Print
        </button>
      </div>
    </div>
  );
}

function CreateInvoiceForm({ onSave, onCancel }: { onSave: (inv: Invoice) => void; onCancel: () => void }) {
  const { config, loading } = useConfigurables();
  const [customerId, setCustomerId] = useState(sampleCustomers[0]?.id ?? "");
  const [template, setTemplate] = useState<"minimal" | "classic" | "premium">("premium");
  const [items, setItems] = useState<Array<{ productId: string; quantity: number }>>([
    { productId: sampleProducts[0]?.id ?? "", quantity: 1 }
  ]);
  const [businessState] = useState(loading ? "Maharashtra" : (config?.businessState ?? "Maharashtra"));
  const invoicePrefix = loading ? "INV" : (config?.invoicePrefix ?? "INV");
  const cs = loading ? "₹" : (config?.currencySymbol ?? "₹");

  const customer = sampleCustomers.find(c => c.id === customerId);
  const isIntraState = customer?.state === businessState;

  const computedItems: InvoiceItem[] = items.map(item => {
    const product = sampleProducts.find(p => p.id === item.productId);
    if (!product) return {} as InvoiceItem;
    const amount = product.sellingPrice * item.quantity;
    const gstAmount = amount * product.gstRate / 100;
    return {
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.sellingPrice,
      gstRate: product.gstRate,
      amount,
      cgst: isIntraState ? gstAmount / 2 : 0,
      sgst: isIntraState ? gstAmount / 2 : 0,
      igst: !isIntraState ? gstAmount : 0,
    };
  }).filter(i => i.productId);

  const subtotal = computedItems.reduce((s, i) => s + i.amount, 0);
  const totalCgst = computedItems.reduce((s, i) => s + i.cgst, 0);
  const totalSgst = computedItems.reduce((s, i) => s + i.sgst, 0);
  const totalIgst = computedItems.reduce((s, i) => s + i.igst, 0);
  const totalGst = isIntraState ? totalCgst + totalSgst : totalIgst;
  const totalAmount = subtotal + totalGst;

  const handleSave = () => {
    if (!customer) return;
    const now = new Date();
    const invoice: Invoice = {
      id: Math.random().toString(36).substring(2, 11),
      invoiceNumber: `${invoicePrefix}-${now.getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1000).padStart(4, "0")}`,
      customerId,
      customerName: customer.name,
      customerGstin: customer.gstin,
      customerState: customer.state,
      businessState,
      items: computedItems,
      subtotal,
      totalCgst,
      totalSgst,
      totalIgst,
      totalGst,
      totalAmount,
      status: "draft",
      date: now.toISOString().split("T")[0],
      dueDate: new Date(now.getTime() + 14 * 86400000).toISOString().split("T")[0],
      template,
    };
    onSave(invoice);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Customer</label>
        <select value={customerId} onChange={e => setCustomerId(e.target.value)}
          className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring">
          {sampleCustomers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.state}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Template</label>
        <div className="flex gap-2">
          {(["minimal", "classic", "premium"] as const).map(t => (
            <button key={t} onClick={() => setTemplate(t)} type="button"
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors border ${
                template === t ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground hover:text-foreground"
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-muted-foreground">Line Items</label>
          <button onClick={() => setItems(prev => [...prev, { productId: sampleProducts[0]?.id ?? "", quantity: 1 }])} type="button"
            className="text-xs text-primary hover:underline">+ Add Item</button>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <select value={item.productId} onChange={e => setItems(prev => prev.map((it, idx) => idx === i ? { ...it, productId: e.target.value } : it))}
                className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring">
                {sampleProducts.map(p => <option key={p.id} value={p.id}>{p.name} - {cs}{p.sellingPrice}</option>)}
              </select>
              <input type="number" value={item.quantity} min={1}
                onChange={e => setItems(prev => prev.map((it, idx) => idx === i ? { ...it, quantity: Number(e.target.value) } : it))}
                className="w-16 bg-input border border-border rounded-lg px-2 py-2 text-sm text-foreground focus:outline-none focus:border-ring" />
              {items.length > 1 && (
                <button onClick={() => setItems(prev => prev.filter((_, idx) => idx !== i))} type="button"
                  className="text-destructive hover:text-destructive/80">×</button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 bg-muted/20 rounded-xl space-y-1 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span><span>{cs}{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>{isIntraState ? "CGST + SGST" : "IGST"}</span>
          <span>{cs}{totalGst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-foreground font-bold border-t border-border pt-1">
          <span>Total</span><span className="gradient-text">{cs}{totalAmount.toFixed(2)}</span>
        </div>
        <Badge variant={isIntraState ? "success" : "cyan"} className="mt-1">
          {isIntraState ? "Intra-State: CGST+SGST" : "Inter-State: IGST"}
        </Badge>
      </div>
      <div className="flex gap-3">
        <button onClick={handleSave} className="flex-1 neon-button py-2.5 rounded-lg text-sm font-semibold">Create Invoice</button>
        <button onClick={onCancel} className="px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const { config, loading } = useConfigurables();
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices);
  const [search, setSearch] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | undefined>();
  const cs = loading ? "₹" : (config?.currencySymbol ?? "₹");

  const filtered = invoices.filter(i =>
    i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    i.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const paidCount = invoices.filter(i => i.status === "paid").length;
  const pendingAmount = invoices.filter(i => i.status !== "paid").reduce((s, i) => s + i.totalAmount, 0);

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Invoices"
        subtitle="Create and manage GST invoices"
        actions={
          <button onClick={() => setCreateModal(true)} className="neon-button px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Invoice
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Invoices", value: invoices.length, color: "gradient-text" },
          { label: "Total Value", value: `${cs}${totalRevenue.toLocaleString("en-IN")}`, color: "text-emerald-400" },
          { label: "Paid", value: paidCount, color: "text-cyan-400" },
          { label: "Pending Amount", value: `${cs}${pendingAmount.toLocaleString("en-IN")}`, color: "text-amber-400" },
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
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..."
              className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Invoice #", "Customer", "Date", "GST Type", "Amount", "Status", "Actions"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => {
              const isIntra = inv.customerState === inv.businessState;
              return (
                <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 text-primary font-semibold font-mono text-xs">{inv.invoiceNumber}</td>
                  <td className="py-3 px-4 text-foreground">{inv.customerName}</td>
                  <td className="py-3 px-4 text-muted-foreground">{inv.date}</td>
                  <td className="py-3 px-4">
                    <Badge variant={isIntra ? "success" : "cyan"}>{isIntra ? "CGST+SGST" : "IGST"}</Badge>
                  </td>
                  <td className="py-3 px-4 text-foreground font-semibold">{cs}{inv.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <Badge variant={STATUS_COLORS[inv.status]}>{inv.status}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => setViewInvoice(inv)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </GlassCard>

      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Create Invoice" size="lg">
        <CreateInvoiceForm
          onSave={(inv) => { setInvoices(prev => [inv, ...prev]); setCreateModal(false); }}
          onCancel={() => setCreateModal(false)}
        />
      </Modal>

      <Modal open={!!viewInvoice} onClose={() => setViewInvoice(undefined)} title="Invoice Preview" size="xl">
        {viewInvoice && <InvoicePreview invoice={viewInvoice} onClose={() => setViewInvoice(undefined)} />}
      </Modal>
    </div>
  );
}
