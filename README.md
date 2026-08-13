# NovaShop — Premium E-Commerce Platform

A production-grade, full-stack e-commerce web application demonstrating mastery of the modern web development stack.

## Tech Stack

### Frontend
- **Next.js 14 (App Router)**
- TypeScript
- Vanilla CSS + CSS Modules (Glassmorphism UI design)
- Context API for State Management

### Backend
- **Node.js & Express.js**
- RESTful API with versioning (`/api/v1`)
- JWT Authentication & Role-Based Access Control
- Zod Data Validation & Error Handling
- Rate Limiting, Helmet, CORS

### Databases & ORM
- **PostgreSQL** with Prisma ORM
- **MongoDB** with Mongoose

### Infrastructure & DevOps
- Docker & Docker Compose
- GitHub Actions CI/CD

## Running Locally

We have configured a **unified command** to run the entire stack effortlessly, but you can also run each service individually.

### Quick Start (Unified Command)
Run everything concurrently from the root directory:
```bash
npm run install:all  # Installs dependencies for root, backend, frontend-user, and frontend-admin
npm run dev          # Spins up Docker (Postgres/Redis), Backend, and both Frontends!
```

### Manual Step-by-Step Setup

If you prefer to run services individually, follow these steps:

#### 1. Start Infrastructure (Docker)
Start PostgreSQL and Redis in the background:
```bash
docker compose up -d
```

#### 2. Database & Prisma Setup
Push the schema to Postgres and seed it with default users/products:
```bash
cd backend
npx prisma generate
npx prisma db push
npm run prisma:seed
```

#### 3. Run the Backend API (Port 5000)
```bash
cd backend
npm run dev
```

#### 4. Run the Customer Storefront (Port 3000)
```bash
cd frontend-user
npm run dev
```

#### 5. Run the Admin Dashboard (Port 3001)
```bash
cd frontend-admin
npm run dev
```

## Design Notes
The UI is built with a premium dark mode glassmorphism aesthetic. It avoids generic colors in favor of tailored HSL palettes, modern typography (`Inter` & `Outfit`), micro-animations, and dynamic interactions for a state-of-the-art user experience.
