# IndiaGov Platform (Indian GovTech SaaS)

Build a production-ready, AI-powered, multi-tenant GovTech platform for India that serves as the unified digital front door for citizens and Urban Local Bodies (ULBs). The platform enables citizens to discover government services, apply for certificates and licenses, pay taxes and utility bills, submit grievances, file RTI requests, book public facilities, manage personal documents, and interact with AI assistants that guide them through every workflow.

The design should take inspiration only from modern enterprise GovTech usability patterns (such as clean navigation, service discovery, search-first experience, accessibility, and modular SaaS architecture). **Do not copy CivicPlus or any other vendor's branding, layouts, graphics, copy, icons, product names, or copyrighted assets.** Every screen, workflow, component, illustration, and brand element must be original and designed specifically for Indian governance.

---

# Pages & Routes

## Public Website

- `/` — Home
- `/services` — Government Services
- `/complaints` — Citizen Grievances (311-style)
- `/payments` — Taxes & Utility Payments
- `/certificates` — Certificates
- `/licenses` — Licenses & Permits
- `/bookings` — Public Facility Bookings
- `/rti` — RTI Portal
- `/schemes` — Government Schemes
- `/rights` — Citizen Rights
- `/maps` — GIS & Ward Maps
- `/notifications` — Public Notices
- `/help-center` — FAQs & Help Center
- `/resources` — Blogs, Guides & News

## AI

- `/ai-assistant`
- `/voice-assistant`

## Citizen Portal

- `/dashboard`
- `/profile`
- `/family`
- `/properties`
- `/documents`
- `/applications`
- `/payments/history`
- `/notifications`
- `/settings`

## Officer Portal

- `/officer/dashboard`
- `/officer/tasks`
- `/officer/complaints`
- `/officer/workflows`
- `/officer/inspections`
- `/officer/reports`

## Admin Portal

- `/admin`
- `/admin/users`
- `/admin/roles`
- `/admin/workflows`
- `/admin/services`
- `/admin/departments`
- `/admin/cms`
- `/admin/analytics`
- `/admin/settings`

Shared Header, Navigation, Language Switcher, Theme Switcher, Search, AI Assistant Button, Login, and Footer should be available across the entire platform.

---

# Home Page Sections

- Government utility bar
- Municipal Corporation selector
- Language switcher
- Main navigation
- Hero section
- AI-powered universal service search
- Voice search
- Popular citizen services
- Service categories
- Featured municipal services
- Payments quick actions
- Certificate quick actions
- Complaint quick actions
- Government schemes
- Citizen rights
- GIS ward map preview
- AI Assistant preview
- Live announcements
- Emergency contacts
- Latest news & resources
- Mobile app section
- Citizen success stories
- CTA section
- Footer

---

# Services Page

Hero section

Search bar

Filter by

- Category
- Department
- Municipality
- State
- Language

Service categories

- Certificates
- Taxes
- Utilities
- Complaints
- Licenses
- Building Permissions
- Bookings
- RTI
- Schemes
- Rights
- Emergency Services

Every service includes

- Description
- Eligibility
- Required documents
- Timeline
- Fees
- Department
- SLA
- Apply Now
- AI Assistant
- Track Status

---

# Complaints (311)

- File Complaint
- Upload Images
- Upload Videos
- Map Location
- Select Ward
- Track Complaint
- Escalation Timeline
- Resolution History
- Officer Updates
- AI Complaint Assistant

---

# Payments

- Property Tax
- Water Bill
- Drainage Bill
- Professional Tax
- Trade License Fee
- Miscellaneous Municipal Payments

Features

- Online Payment
- Payment History
- Download Receipts
- UPI Integration
- Payment Status

---

# Certificates

- Birth Certificate
- Death Certificate
- Marriage Certificate
- Income Certificate
- Caste Certificate
- Disability Certificate
- Residence Certificate

Each workflow includes

- Eligibility
- AI Form Filling
- Document Upload
- Review
- Submit
- Status Tracking

---

# Licenses

- Trade License
- Shop Registration
- Vendor Registration
- Contractor Registration
- Fire NOC Guidance
- Food License Guidance
- Building Permission

---

# Bookings

- Community Hall
- Auditorium
- Sports Facilities
- Parks
- Guest Houses
- Meeting Rooms

Calendar-based booking interface.

---

# RTI Portal

- File RTI
- First Appeal
- Second Appeal
- RTI Status
- AI Draft Assistant

---

# Schemes

- Central Government
- State Government
- Municipal Schemes

AI-powered eligibility checker.

---

# Citizen Dashboard

- Active Applications
- Pending Payments
- Certificates
- Complaints
- Notifications
- AI Recommendations
- Saved Documents
- Recent Activity

---

# Officer Dashboard

- Assigned Tasks
- Pending Approvals
- Field Inspections
- SLA Monitoring
- Complaints Queue
- Department Analytics
- AI Recommendations

---

# Admin Dashboard

- Municipality Management
- Department Management
- Service Catalog
- Workflow Builder
- SLA Configuration
- CMS
- User Management
- Roles & Permissions
- Analytics
- Audit Logs

---

# Multi-Tenant Platform

Each Municipal Corporation has

- Logo
- Branding
- Theme
- Departments
- Services
- Workflow Rules
- SLA Rules
- Languages
- Announcements
- Maps
- Contact Details

Example

- Ahmedabad Municipal Corporation
- Surat Municipal Corporation
- Rajkot Municipal Corporation
- Vadodara Municipal Corporation
- Pune Municipal Corporation
- BBMP
- GHMC
- MCD

Configuration loads dynamically without code changes.

---

# Design System

## Theme

- Trust-first Government UI
- Modern Enterprise SaaS
- Mobile-first
- Accessible (WCAG 2.2)
- Low-bandwidth optimized

## Colors

- Government Navy
- India Saffron Accent
- Emerald Green
- Neutral White
- Soft Gray
- Success
- Warning
- Error
- Info

## Design Tokens

- `--brand`
- `--brand-foreground`
- `--accent`
- `--success`
- `--warning`
- `--danger`
- `--background`
- `--surface`
- `--shadow-card`
- `--radius`
- `--gradient-primary`

## Typography

- Inter (Body)
- Fraunces or Merriweather (Display)
- Noto Sans Devanagari
- Noto Sans Gujarati
- Noto Sans Tamil
- Noto Sans Telugu

---

# Components

- Header
- Footer
- Hero
- Universal Search
- Language Switcher
- Municipality Selector
- AI Assistant Widget
- Service Card
- Department Card
- Dashboard Cards
- Stat Cards
- Notification Card
- Resource Card
- Workflow Timeline
- Document Viewer
- Upload Component
- Map Component
- Payment Card
- Complaint Card
- Certificate Card
- License Card
- Booking Calendar
- AI Chat Window

Built using

- shadcn/ui
- Radix UI
- Tailwind CSS

---

# AI Modules

- Citizen Assistant
- Form Filling Agent
- Document Intelligence
- Semantic Search Agent
- Complaint Resolution Agent
- Workflow Agent
- Municipal Officer Assistant
- Administrator AI

---

# Images

Generate original illustrations only.

Required assets include

- Hero Illustration
- AI Assistant Illustration
- Smart City Illustration
- Citizen Services Illustration
- Officer Dashboard Illustration
- Document Intelligence Illustration
- GIS Illustration
- Resource Covers
- Testimonials
- Empty States

Store under `src/assets/`.

---

# SEO & Metadata

Every page must include

- Unique Title
- Meta Description
- Open Graph Tags
- Twitter Card
- Structured Data ([Schema.org](http://Schema.org))
- Canonical URL
- Sitemap Support
- Robots Configuration

---

# Technical Stack

Frontend

- React 19
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI
- Framer Motion
- React Query
- Zustand
- React Hook Form
- Zod
- React Leaflet
- Recharts
- i18next
- PWA Support

Backend

- Django
- Django REST Framework
- FastAPI
- LangGraph
- LangChain
- OpenAI SDK or equivalent
- MCP
- Celery
- Redis
- RabbitMQ

Database

- PostgreSQL
- PostGIS
- Redis
- OpenSearch / Elasticsearch
- MinIO / Amazon S3
- pgvector

---

# Deliverables

- Production-ready frontend
- Fully functional backend
- Working APIs
- Authentication
- Multi-tenant architecture
- AI agent integration
- Dynamic workflows
- Document vault
- Admin portal
- Officer portal
- Citizen portal
- API documentation
- Database schemas
- Folder structure
- Deployment configuration
- Docker setup
- CI/CD pipeline
- Security hardening
- Automated testing
- README and project documentation

---

# Out of Scope

- Copying CivicPlus branding, layouts, code, assets, or content.
- Placeholder-only interfaces with no working functionality.
- Hardcoded municipality-specific logic.
- Non-production architectural shortcuts.

Every citizen-facing and administrative feature should function locally with real APIs, databases, authentication, role-based access control, and AI-assisted workflows, while remaining scalable for production deployment.