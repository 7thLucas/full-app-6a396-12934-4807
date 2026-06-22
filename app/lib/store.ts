// In-memory data store for MVP — simulates database operations
// In production, this would connect to the backend API / MongoDB

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  state: string;
  totalPurchases: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  gstRate: number;
  hsnCode: string;
  stock: number;
  lowStockThreshold: number;
  createdAt: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  gstRate: number;
  amount: number;
  cgst: number;
  sgst: number;
  igst: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerGstin?: string;
  customerState: string;
  businessState: string;
  items: InvoiceItem[];
  subtotal: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalGst: number;
  totalAmount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  date: string;
  dueDate: string;
  template: "minimal" | "classic" | "premium";
  notes?: string;
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  createdAt: string;
}

export interface StockTransaction {
  id: string;
  productId: string;
  productName: string;
  type: "in" | "out";
  quantity: number;
  note: string;
  date: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  leadTime: number;
  products: string;
  createdAt: string;
}

export interface WatchItem {
  id: string;
  brand: string;
  model: string;
  refNo: string;
  condition: "new" | "like-new" | "good" | "fair";
  purchasePrice: number;
  sellingPrice: number;
  status: "in-stock" | "sold" | "reserved";
  purchaseDate: string;
}

export interface Order {
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

// Generate sample data
function genId() {
  return Math.random().toString(36).substring(2, 11);
}

export const sampleCustomers: Customer[] = [
  { id: "c1", name: "Rahul Sharma", email: "rahul@techcorp.in", phone: "9876543210", address: "123 MG Road, Mumbai", gstin: "27AABCU9603R1ZX", state: "Maharashtra", totalPurchases: 45000, createdAt: "2024-01-15" },
  { id: "c2", name: "Priya Patel", email: "priya@startup.in", phone: "9876543211", address: "456 Brigade Rd, Bangalore", gstin: "29AABCU9603R1ZX", state: "Karnataka", totalPurchases: 32000, createdAt: "2024-02-10" },
  { id: "c3", name: "Amit Kumar", email: "amit@business.in", phone: "9876543212", address: "789 CP, Delhi", gstin: "07AABCU9603R1ZX", state: "Delhi", totalPurchases: 68000, createdAt: "2024-01-20" },
  { id: "c4", name: "Sneha Reddy", email: "sneha@ventures.in", phone: "9876543213", address: "321 Jubilee Hills, Hyderabad", gstin: "36AABCU9603R1ZX", state: "Telangana", totalPurchases: 21000, createdAt: "2024-03-01" },
  { id: "c5", name: "Vikram Singh", email: "vikram@services.in", phone: "9876543214", address: "654 Civil Lines, Jaipur", gstin: "08AABCU9603R1ZX", state: "Rajasthan", totalPurchases: 54000, createdAt: "2024-02-25" },
];

export const sampleProducts: Product[] = [
  { id: "p1", name: "Laptop Stand Pro", category: "Electronics", costPrice: 800, sellingPrice: 1299, gstRate: 18, hsnCode: "8473", stock: 25, lowStockThreshold: 5, createdAt: "2024-01-10" },
  { id: "p2", name: "Wireless Mouse", category: "Electronics", costPrice: 300, sellingPrice: 599, gstRate: 18, hsnCode: "8471", stock: 8, lowStockThreshold: 10, createdAt: "2024-01-15" },
  { id: "p3", name: "USB-C Hub 7-in-1", category: "Electronics", costPrice: 600, sellingPrice: 1199, gstRate: 18, hsnCode: "8473", stock: 15, lowStockThreshold: 5, createdAt: "2024-02-01" },
  { id: "p4", name: "Mechanical Keyboard", category: "Electronics", costPrice: 1500, sellingPrice: 2499, gstRate: 18, hsnCode: "8471", stock: 3, lowStockThreshold: 5, createdAt: "2024-02-10" },
  { id: "p5", name: "Monitor Light Bar", category: "Electronics", costPrice: 400, sellingPrice: 799, gstRate: 18, hsnCode: "9405", stock: 20, lowStockThreshold: 5, createdAt: "2024-03-01" },
  { id: "p6", name: "Desk Cable Manager", category: "Accessories", costPrice: 100, sellingPrice: 249, gstRate: 12, hsnCode: "3926", stock: 45, lowStockThreshold: 10, createdAt: "2024-03-05" },
];

export const sampleInvoices: Invoice[] = [
  {
    id: "i1", invoiceNumber: "INV-2024-0001", customerId: "c1", customerName: "Rahul Sharma",
    customerGstin: "27AABCU9603R1ZX", customerState: "Maharashtra", businessState: "Maharashtra",
    items: [{ productId: "p1", productName: "Laptop Stand Pro", quantity: 2, unitPrice: 1299, gstRate: 18, amount: 2598, cgst: 233.82, sgst: 233.82, igst: 0 }],
    subtotal: 2598, totalCgst: 233.82, totalSgst: 233.82, totalIgst: 0, totalGst: 467.64, totalAmount: 3065.64,
    status: "paid", date: "2024-03-01", dueDate: "2024-03-15", template: "premium"
  },
  {
    id: "i2", invoiceNumber: "INV-2024-0002", customerId: "c3", customerName: "Amit Kumar",
    customerGstin: "07AABCU9603R1ZX", customerState: "Delhi", businessState: "Maharashtra",
    items: [{ productId: "p4", productName: "Mechanical Keyboard", quantity: 1, unitPrice: 2499, gstRate: 18, amount: 2499, cgst: 0, sgst: 0, igst: 449.82 }],
    subtotal: 2499, totalCgst: 0, totalSgst: 0, totalIgst: 449.82, totalGst: 449.82, totalAmount: 2948.82,
    status: "sent", date: "2024-03-10", dueDate: "2024-03-24", template: "classic"
  },
  {
    id: "i3", invoiceNumber: "INV-2024-0003", customerId: "c2", customerName: "Priya Patel",
    customerState: "Karnataka", businessState: "Maharashtra",
    items: [
      { productId: "p2", productName: "Wireless Mouse", quantity: 3, unitPrice: 599, gstRate: 18, amount: 1797, cgst: 0, sgst: 0, igst: 323.46 },
      { productId: "p3", productName: "USB-C Hub 7-in-1", quantity: 1, unitPrice: 1199, gstRate: 18, amount: 1199, cgst: 0, sgst: 0, igst: 215.82 },
    ],
    subtotal: 2996, totalCgst: 0, totalSgst: 0, totalIgst: 539.28, totalGst: 539.28, totalAmount: 3535.28,
    status: "paid", date: "2024-03-12", dueDate: "2024-03-26", template: "minimal"
  },
];

export const sampleExpenses: Expense[] = [
  { id: "e1", description: "Office rent", category: "Rent", amount: 15000, date: "2024-03-01", createdAt: "2024-03-01" },
  { id: "e2", description: "Internet bill", category: "Utilities", amount: 1500, date: "2024-03-05", createdAt: "2024-03-05" },
  { id: "e3", description: "Marketing ads", category: "Marketing", amount: 5000, date: "2024-03-10", createdAt: "2024-03-10" },
  { id: "e4", description: "Shipping supplies", category: "Supplies", amount: 2000, date: "2024-03-12", createdAt: "2024-03-12" },
  { id: "e5", description: "Staff salary", category: "Salaries", amount: 35000, date: "2024-03-31", createdAt: "2024-03-31" },
];

export const sampleWatchItems: WatchItem[] = [
  { id: "w1", brand: "Rolex", model: "Submariner", refNo: "126610LN", condition: "like-new", purchasePrice: 850000, sellingPrice: 950000, status: "in-stock", purchaseDate: "2024-02-15" },
  { id: "w2", brand: "Omega", model: "Seamaster 300", refNo: "210.30.42.20.01.001", condition: "good", purchasePrice: 280000, sellingPrice: 320000, status: "sold", purchaseDate: "2024-01-20" },
  { id: "w3", brand: "TAG Heuer", model: "Carrera", refNo: "CV2014-2", condition: "new", purchasePrice: 120000, sellingPrice: 145000, status: "in-stock", purchaseDate: "2024-03-01" },
];

export const monthlyRevenue = [
  { month: "Jan", revenue: 45000, expenses: 28000, profit: 17000, gst: 6750 },
  { month: "Feb", revenue: 62000, expenses: 35000, profit: 27000, gst: 9300 },
  { month: "Mar", revenue: 58000, expenses: 31000, profit: 27000, gst: 8700 },
  { month: "Apr", revenue: 75000, expenses: 40000, profit: 35000, gst: 11250 },
  { month: "May", revenue: 68000, expenses: 37000, profit: 31000, gst: 10200 },
  { month: "Jun", revenue: 82000, expenses: 42000, profit: 40000, gst: 12300 },
];
