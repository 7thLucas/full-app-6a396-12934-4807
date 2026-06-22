# BizVault AI — Product Overview

## Identity
- **Name**: BizVault AI
- **Tagline**: "The Future of Business Management and AI Automation"
- **Category**: All-in-one AI-powered Business Operating System (SaaS)
- **Market**: India — GST-compliant, INR pricing, Razorpay payments
- **Admin credentials**: email: `admin` / password: `281109`

---

## Purpose
BizVault AI consolidates the full operational stack of a small Indian business — GST invoicing, inventory, accounting, customer management, and AI-powered content tools — into a single futuristic interface. It eliminates the need to juggle multiple apps and removes the manual burden of GST compliance and bookkeeping from business owners who can't afford a dedicated accountant.

---

## Target Users (Personas)
| Persona | Core Job to Be Done |
|---|---|
| SMB Owner / Retailer | GST invoicing, inventory tracking, P&L visibility |
| Freelancer / Sole Trader | Invoice creation, expense tracking, customer CRM |
| Watch Seller | Watch-specific inventory, profit calculator, sales analytics |
| Dropshipper | Product profit calculator, order + supplier tracking |
| Student | AI homework planner, resume builder, study planner |
| Service Provider | Customer profiles, invoice history, income tracking |

---

## Design Language
- Dark mode by default; futuristic AI operating system aesthetic
- Glassmorphism effects with neon purple, cyan, blue, and pink gradients
- Smooth animations, professional typography
- Fully mobile and desktop responsive
- Premium startup-quality UI

---

## Core Modules

### Authentication & Access Control
- User Registration, Login, Forgot Password, Email Verification
- Profile Management
- Role-Based Access Control: User role and Admin role (separate access)
- Admin credentials: `admin` / `281109`

### User Dashboard
- Revenue Overview, Profit Overview, GST Summary
- Sales Analytics, Customer Analytics, Inventory Analytics
- Recent Activity feed
- Business Health Score (composite metric)

### Customer Management
- Full CRUD: Add, Edit, Delete customers
- Search and filter across all customers
- Customer profiles with purchase history, GST details, contact details

### Product Management
- Full CRUD: Add, Edit, Delete products with categories and images
- Cost price, selling price, and live stock tracking per product

### Inventory Management
- Stock tracking dashboard with low-stock alerts
- Stock In / Stock Out operations
- Inventory reports, supplier tracking

### Invoice Management
- GST Invoice Generator and Tax Invoice Generator
- Multiple invoice templates; auto invoice number sequencing
- Download as PDF, print, view full customer invoice history

### GST Management
- Automatic CGST / SGST / IGST calculation per transaction
- GST Dashboard, Reports, and Summary views
- Export to Excel and PDF
- Sales Register and Purchase Register

### Accounting
- Income and expense tracking
- Profit & Loss Reports, Cash Flow Reports
- Financial Dashboard

### AI Tools (8 built-in tools)
1. **AI Resume Builder** — resume templates, PDF export, ATS-friendly output
2. **AI Instagram Caption Generator** — business & marketing captions, hashtag suggestions
3. **AI Homework Planner** — subject planning, daily and weekly study plans
4. **AI Product Description Generator** — ecommerce and SEO-friendly descriptions
5. **AI Business Name Generator**
6. **AI Marketing Content Generator**
7. **AI Email Writer**
8. **AI Social Media Post Generator**

### Watch Seller Tools
- Watch Profit Calculator
- Watch Inventory Management
- Watch Sales Analytics
- Watch Stock Tracking

### Dropshipping Tools
- Product Profit Calculator
- Order Tracking
- Supplier Tracking
- AI Product Description Generator (shared with AI Tools)

### Reports
- Revenue, Profit, GST, Inventory, and Customer reports
- Export to Excel and PDF

### Admin Dashboard (Platform Admin)
- View, Suspend, and Delete users
- Manage subscription plans and view platform revenue
- View all invoices and GST reports across all users
- Manage content, announcements, and support tickets

---

## Subscription Plans
| Plan | Price | Notes |
|---|---|---|
| Free | ₹0 / month | Entry-level access |
| Basic | ₹199 / month | Core business tools |
| Pro | ₹499 / month | + AI tools & advanced reports |
| Business | ₹999 / month | Full suite + admin analytics |

---

## Integrations & Tech Stack
- **Auth & Database**: Supabase (authentication + PostgreSQL)
- **Payments**: Razorpay (subscription billing and management)
- **AI**: AI API integration (powers all 8 AI content tools)
- **Documents**: PDF generation, Excel export
- **Deployment**: Vercel-ready, SEO-optimized, production-ready

---

## Security
- Role-based permissions enforced at API level
- Secure Supabase authentication
- Data validation and rate limiting
- Audit logs for all sensitive operations

---

## North Star Operations
The three verified operations this app is built to serve:
1. **Invoice Generated** — a GST-compliant invoice created and saved by a business user
2. **Stock Transaction Recorded** — a stock-in or stock-out event logged in the inventory
3. **AI Tool Output Generated** — a resume, caption, description, or other AI output created and used
