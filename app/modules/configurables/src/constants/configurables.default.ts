/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  // Base
  background: string;
  foreground: string;
  // Card
  card: string;
  cardForeground: string;
  // Popover
  popover: string;
  popoverForeground: string;
  // Primary
  primary: string;
  primaryForeground: string;
  // Secondary
  secondary: string;
  secondaryForeground: string;
  // Muted
  muted: string;
  mutedForeground: string;
  // Accent
  accent: string;
  accentForeground: string;
  // Destructive
  destructive: string;
  destructiveForeground: string;
  // Border / Input / Ring
  border: string;
  input: string;
  ring: string;
  // Charts
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
  // Navbar
  navbarBackground: string;
  // Sidebar
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export type TFont = {
  headingFont: string;
  textFont: string;
};

export type TSubscriptionPlan = {
  name: string;
  price: number;
  description?: string;
  features?: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  font: TFont;
  tagline?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  subscriptionPlans?: TSubscriptionPlan[];
  aiToolsEnabled?: boolean;
  watchToolsEnabled?: boolean;
  dropshippingToolsEnabled?: boolean;
  gstEnabled?: boolean;
  defaultGstRate?: number;
  lowStockThreshold?: number;
  invoicePrefix?: string;
  businessState?: string;
  currencySymbol?: string;
  footerText?: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "BizVault AI",
  logoUrl: "",
  brandColor: {
    // Base — dark futuristic
    background:        "#050508",
    foreground:        "#f8fafc",
    // Card
    card:              "#0d0d14",
    cardForeground:    "#f8fafc",
    // Popover
    popover:           "#0d0d14",
    popoverForeground: "#f8fafc",
    // Primary — purple
    primary:           "#7c3aed",
    primaryForeground: "#ffffff",
    // Secondary — cyan
    secondary:         "#06b6d4",
    secondaryForeground: "#ffffff",
    // Muted
    muted:           "#1a1a2e",
    mutedForeground: "#94a3b8",
    // Accent — pink
    accent:           "#ec4899",
    accentForeground: "#ffffff",
    // Destructive
    destructive:           "#ef4444",
    destructiveForeground: "#ffffff",
    // Border / Input / Ring
    border: "#1f1f2e",
    input:  "#1a1a2e",
    ring:   "#7c3aed",
    // Charts
    chart1: "#7c3aed",
    chart2: "#06b6d4",
    chart3: "#ec4899",
    chart4: "#10b981",
    chart5: "#f59e0b",
    // Navbar
    navbarBackground: "#050508",
    // Sidebar
    sidebarBackground:        "#0a0a12",
    sidebarForeground:        "#94a3b8",
    sidebarPrimary:           "#7c3aed",
    sidebarPrimaryForeground: "#ffffff",
    sidebarAccent:            "#1a1a2e",
    sidebarAccentForeground:  "#f8fafc",
    sidebarBorder:            "#1f1f2e",
    sidebarRing:              "#7c3aed",
  },
  font: {
    headingFont: "Inter",
    textFont: "Inter",
  },
  tagline: "The Future of Business Management and AI Automation",
  heroTitle: "Manage Your Business with AI Intelligence",
  heroSubtitle: "GST invoicing, inventory, accounting, AI tools, and more — all in one platform built for Indian businesses.",
  subscriptionPlans: [
    { name: "Free", price: 0, description: "Basic features to get started", features: "5 invoices/month,50 products,Basic reports" },
    { name: "Basic", price: 199, description: "For sole traders & freelancers", features: "Unlimited invoices,500 products,All reports,GST filing" },
    { name: "Pro", price: 499, description: "For growing businesses", features: "Everything in Basic,AI Tools,Watch tools,Dropshipping" },
    { name: "Business", price: 999, description: "For established businesses", features: "Everything in Pro,Priority support,Multi-user,Custom branding" },
  ],
  aiToolsEnabled: true,
  watchToolsEnabled: true,
  dropshippingToolsEnabled: true,
  gstEnabled: true,
  defaultGstRate: 18,
  lowStockThreshold: 10,
  invoicePrefix: "INV",
  businessState: "Maharashtra",
  currencySymbol: "₹",
  footerText: "© 2024 BizVault AI. All rights reserved. Made with love for Indian businesses.",
};
