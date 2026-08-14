# NovaShop — Premium E-Commerce Platform

A production-grade, full‑stack e‑commerce web application demonstrating mastery of a modern web development stack. This README has been updated to reflect the current codebase, CI configuration, and available developer workflows.

---

## Quick Links

- Repository: https://github.com/TAnbiR-638/E-Commerce-Project
- Docs: ./docs
- Chatbot integration doc: ./docs/chatbot_integration.md

---

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Vanilla CSS + CSS Modules (Glassmorphism UI design)
- Context API for state management

### Backend
- Node.js & Express.js
- RESTful API with versioning (`/api/v1`)
- JWT Authentication & Role-Based Access Control
- Zod for runtime validation and structured error handling
- Rate limiting, Helmet, CORS for security

### Databases & ORM
- PostgreSQL with Prisma ORM (primary relational data store)
- MongoDB with Mongoose (for document-style or analytics data)

### AI Integration
- Nova AI Chatbot (RAG-based assistant)
- Documentation: docs/chatbot_integration.md — explains architecture, embeddings, cost estimation and production best practices

### Infrastructure & DevOps
- Docker & Docker Compose for local infrastructure (Postgres, Redis)
- GitHub Actions CI/CD (see .github/workflows/ci.yml)

---

## Local Development

There are two main ways to run the project locally: unified (recommended) or manual per-service.

### Quick Start (Unified)
Install dependencies and start everything from the repository root:

```bash
npm run install:all   # Installs dependencies for root, backend, frontend-user, and frontend-admin
npm run dev           # Starts Docker services, backend, and both frontends
```

This will start:
- Backend API on http://localhost:5000
- Customer storefront on http://localhost:3000
- Admin dashboard on http://localhost:3001

> If you use Docker Desktop or a Linux server, ensure Docker Compose is available.

### Manual Step-by-Step

1. Start supporting services (Postgres & Redis):
```bash
docker compose up -d
```

2. Setup the database and Prisma (backend):
```bash
cd backend
npx prisma generate
npx prisma db push
npm run prisma:seed
```

3. Run the Backend API (port 5000):
```bash
cd backend
npm run dev
```

4. Run the Customer Storefront (port 3000):
```bash
cd frontend-user
npm run dev
```

5. Run the Admin Dashboard (port 3001):
```bash
cd frontend-admin
npm run dev
```

---

## Testing & CI

A full CI pipeline is provided under .github/workflows/ci.yml. The pipeline builds and tests the backend and both frontends, spins up Postgres and Redis services for integration steps, and includes a deploy stage that runs only on pushes to the main branch.

To run tests locally for the backend:
```bash
cd backend
npm ci
npx prisma generate
npm test
```

---

## Environment Variables (examples)

Backend (.env):

- DATABASE_URL=postgresql://novashop:password@localhost:5432/novashop
- REDIS_URL=redis://localhost:6379
- JWT_SECRET=your_jwt_secret
- NODE_ENV=development

Frontend (.env.local):
- NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
- NEXT_PUBLIC_ADMIN_URL=http://localhost:3001

---

## Production & Deployments

CI includes a deploy job (disabled by default) with example steps for deploying the backend to Railway and frontends to Vercel. To enable production deploys, add the corresponding secrets (RAILWAY_TOKEN, VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID) in the repository settings and uncomment the deploy steps in .github/workflows/ci.yml.

---

## Contributing

Contributions are welcome. Common tasks:
- Run linters and formatters before creating a PR
- Keep migrations and Prisma schema in sync with model changes
- Add tests for new API endpoints and critical business logic

Please open issues for bugs or feature requests and reference the relevant area (backend, frontend-user, frontend-admin).

---

## License

This repository is for demonstration and learning purposes. Check repository settings for license information or contact the maintainer.
