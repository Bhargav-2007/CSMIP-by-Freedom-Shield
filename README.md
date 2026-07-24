# CivicHub (CSMIP) by Freedom Shield

A unified AI-powered platform connecting citizens with Urban Local Bodies for services, payments, certificates, complaints, and more.

## Architecture

The project consists of three main components:
1. **Frontend**: A modern React application (Vite + TanStack Router + Tailwind CSS).
2. **Backend**: A robust Django web framework providing core APIs, authentication, and database models.
3. **AI Service**: A FastAPI-based service handling AI-powered chat and semantic search operations.

## Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- Docker & Docker Compose (optional, for containerized setup)

## Setup Instructions

Copy the root [.env.example](.env.example) file and adjust the backend, frontend, and AI service values before running locally.

### 1. Backend (Django)

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 2. AI Service (FastAPI)

```bash
cd ai_service
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

For a production static build:

```bash
cd frontend
npm run build
```

## GitHub Pages Deployment

This project is now prepared for GitHub Pages with `.github/workflows/pages.yml`.
GitHub Pages can host the React frontend only; the Django backend and FastAPI AI
service must be deployed separately on a server platform such as Render, Railway,
Fly.io, AWS, Azure, or a VPS.

Before publishing, add these repository variables in GitHub if you have hosted
APIs:

- `VITE_API_URL`: public Django API URL, for example `https://api.example.com/api`
- `VITE_AI_SERVICE_URL`: public FastAPI AI URL, for example `https://ai.example.com`

Then push the project to a GitHub repository with a `main` branch and enable
GitHub Pages with source set to **GitHub Actions**. The workflow builds
`frontend/`, applies the correct repository base path, and publishes `dist/`.

### 4. Running with Docker Compose

You can easily run the Backend and AI Service via Docker Compose:

```bash
docker-compose up --build
```
This will start:
- Django Backend on `http://localhost:8000`
- FastAPI AI Service on `http://localhost:8001`
- PostgreSQL (if configured)

## API Documentation

- **Django Backend**: Visit `http://localhost:8000/api/docs/` for the OpenAPI UI.
- **Auth**: `POST /api/auth/login/`, `POST /api/auth/register/`, `GET /api/auth/me/`, `POST /api/auth/logout/`, `POST /api/auth/token/refresh/`
- **Core APIs**: `applications`, `complaints`, `payments`, `services`, `municipalities`, `notifications`, `documents`, `bookings`, and `rti` are exposed under `http://localhost:8000/api/`
- **FastAPI AI Service**: Visit `http://localhost:8001/docs` for the Swagger UI.
