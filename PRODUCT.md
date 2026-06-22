# BizVault AI — Product Specification

## Brand
- **Name**: BizVault AI
- **Tagline**: "The Future of Business Management and AI Automation"
- **Target Market**: India — GST compliance, INR pricing
- **Admin Credentials**: Email: `admin` | Password: `281109`

## Target Users
Sole traders, freelancers, students, watch resellers, dropshippers, small business owners, retailers, service providers

## Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + custom glassmorphism components
- **Auth & DB**: Supabase (Authentication + PostgreSQL)
- **Payments**: Razorpay
- **PDF**: jsPDF
- **Charts**: Recharts
- **Excel Export**: xlsx / SheetJS
- **Routing**: React Router v6

---

## Authentication System
- User Registration (email + password)
- User Login
- Forgot Password / Reset Password
- Email Verification
- Profile Management (name, business name, GSTIN, phone, address)
- Role-Based Access Control: `user` and `admin` roles
- Separate Admin Login (email: admin, password: 281109)
- Protected routes based on role

---

## User Dashboard
- Revenue Overview (monthly/yearly charts)
- Profit Overview
- GST Summary (CGST/SGST/IGST breakdown)
- Sales Analytics (line/bar charts)
- Customer Analytics
- Inventory Analytics (stock levels)
- Recent Activity Feed
- Business Health Score (composite metric)

---

## Customer Management
- Add / Edit / Delete Customer
- Search & Filter Customers
- Customer Profile (name, email, phone, address, GSTIN)
- Customer Purchase History
- Customer GST Details

---

## Product Management
- Add / Edit / Delete Products
- Product Categories
- Product Pricing (cost price + selling price + profit margin auto-calc)
- Stock Tracking (current stock qty)
- HSN/SAC Code field
- GST Rate per product (0%, 5%, 12%, 18%, 28%)

---

## Inventory Management
- Inventory Dashboard (total items, total value, low stock count)
- Stock In / Stock Out transactions
- Low Stock Alerts (threshold-based)
- Supplier Tracking (name, contact, lead time)
- Inventory Reports

---

## Invoice Management
- GST Invoice Generator (CGST+SGST for intra-state, IGST for inter-state)
- Invoice Number Auto-generation (INV-2024-0001 format)
- Multiple templates (minimal, classic, premium)
- Download PDF Invoice
- Print Invoice
- Customer Invoice History

---

## GST Management
- Automatic CGST / SGST / IGST calculation
- GST Dashboard (monthly liability)
- GST Reports by period
- GST Summary table
- GST Excel + PDF Export
- Sales Register
- Purchase Register

---

## Accounting
- Income Tracking
- Expense Tracking (by category)
- Profit & Loss Report
- Cash Flow Report
- Financial Dashboard

---

## AI Tools (8 tools — UI forms with mock AI responses for MVP)
1. AI Resume Builder — templates (Modern/Classic/ATS), PDF export
2. AI Instagram Caption Generator — captions + hashtags
3. AI Homework Planner — daily/weekly study schedule
4. AI Product Description Generator — ecommerce + SEO
5. AI Business Name Generator — 10 suggestions from keywords
6. AI Marketing Content Generator — ad copy, promo
7. AI Email Writer — professional drafts
8. AI Social Media Post Generator — multi-platform

---

## Watch Seller Tools
- Watch Profit Calculator
- Watch Inventory (brand, model, ref no, condition, purchase/sell price)
- Watch Sales Analytics
- Watch Stock Tracking

---

## Dropshipping Tools
- Product Profit Calculator (cost + shipping + platform fee)
- Order Tracking
- Supplier Tracking

---

## Reports
- Revenue, Profit, GST, Inventory, Customer Reports
- Export to Excel (.xlsx)
- Export to PDF

---

## Admin Panel (role: admin)
- Admin Dashboard
- View/Suspend/Delete Users
- Manage Subscription Plans
- Platform Revenue & Analytics
- View All Invoices
- Announcements Management
- Support Tickets (basic)

---

## Subscription System
- Free Plan (limited)
- Basic ₹199/month, Pro ₹499/month, Business ₹999/month
- Plan comparison page
- Razorpay integration (test mode)
- Feature gating by plan

---

## Database Tables (Supabase)
- profiles (user_id, role, business_name, gstin, phone, address, plan)
- customers, products, suppliers, stock_transactions
- invoices (with items_json), expenses
- watch_inventory, orders
- subscriptions, notifications, audit_logs
- support_tickets, announcements

---