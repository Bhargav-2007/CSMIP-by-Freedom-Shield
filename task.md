# From repo root
docker compose up -d db redis backend ai_service && \
cd frontend && bun install && bun run dev# CSMIP Backend Build Tasks

## Phase 1 — Django Backend Skeleton
- [x] Django project structure + settings
- [x] requirements.txt
- [x] .env.example
- [x] Django apps: accounts, applications, complaints, payments, services, municipalities, notifications, documents
- [x] Database models for all apps
- [x] Migrations

## Phase 2 — Auth API
- [x] JWT auth (register, login, logout, /me)
- [x] Custom User model (citizen/officer/admin)
- [x] Role-based permissions

## Phase 3 — Core CRUD APIs
- [x] Applications API
- [x] Complaints API (with SLA)
- [x] Payments API (with receipt)
- [x] Certificates API
- [x] Services catalog API
- [x] Municipalities API
- [x] Notifications API
- [x] Documents/upload API
- [x] Bookings API
- [x] RTI API

## Phase 4 — FastAPI AI Service
- [x] FastAPI project skeleton
- [x] Chat endpoint (mock)
- [x] Search endpoint (mock)

## Phase 5 — Docker & Infrastructure
- [x] Dockerfile (Django)
- [x] Dockerfile (FastAPI)
- [x] docker-compose.yml
- [x] .env.example

## Phase 6 — Frontend API Integration
- [x] api.ts (Axios client + JWT interceptor)
- [x] queryClient.ts
- [x] Update auth.tsx → real API
- [x] Update store.ts → API-backed
- [x] Update dashboard.tsx → React Query
- [x] Update complaints.tsx → API
- [x] Update payments.tsx → API
- [x] Update applications.tsx → API

## Phase 7 — Docs
- [x] README.md (root)
- [x] API documentation
