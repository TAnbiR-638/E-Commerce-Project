# NovaShop Technology Stack Analysis

This document provides a comprehensive breakdown of the frameworks, tools, and databases used across the NovaShop microservice architecture (Frontend User, Frontend Admin, and Backend). 

---

## 1. Core Frameworks & Technologies Used

We are currently utilizing **10 primary technologies/frameworks** across the stack:

1. **Next.js (React)** - Frontend Framework (Both User & Admin apps)
2. **Node.js & Express.js** - Backend Framework
3. **TypeScript** - Programming Language (Full Stack)
4. **PostgreSQL** - Primary Database
5. **Prisma** - Object-Relational Mapper (ORM)
6. **Redis** - In-Memory Cache & Rate Limiter Store
7. **JSON Web Tokens (JWT) & bcryptjs** - Authentication & Security
8. **Vanilla CSS / CSS Modules** - Styling
9. **Docker & Docker Compose** - Containerization (Local Services)
10. **GitHub Actions** - CI/CD Pipeline

---

## 2 & 3. Why They Are Used & How They Work

### Next.js (React)
* **Why:** Provides a robust React framework with built-in routing, server-side rendering (SSR), and static site generation (SSG) which is crucial for e-commerce SEO and fast page loads.
* **How it works:** It compiles React components into optimized HTML/JS, handling file-based routing (`app/` directory). It pre-renders pages on the server before sending them to the client browser.

### Node.js & Express.js
* **Why:** Express is a minimalist, fast web framework for Node.js. It allows us to build RESTful APIs quickly and share the same language (TypeScript/JavaScript) across the entire stack.
* **How it works:** It listens for incoming HTTP requests on a specific port (5000), processes them through middleware (like CORS, auth, caching), routes them to specific controllers, and returns JSON responses.

### TypeScript
* **Why:** Adds static typing to JavaScript. It catches errors at compile-time rather than runtime, making large codebases significantly more stable and providing excellent IDE autocomplete.
* **How it works:** Developers write `.ts` code with types/interfaces. The compiler (`tsc`) strips the types and outputs standard JavaScript that browsers and Node.js can execute.

### PostgreSQL
* **Why:** The most advanced, robust, open-source relational database. E-commerce platforms require strict data integrity (ACID compliance) for transactions, orders, and complex relations (e.g., Products belonging to Categories).
* **How it works:** Stores data in structured tables with rows and columns. It enforces constraints and relationships at the database level.

### Prisma ORM
* **Why:** Provides a type-safe database client. It prevents SQL injection attacks and makes writing database queries in TypeScript intuitive and fast.
* **How it works:** You define your database schema in a `schema.prisma` file. Prisma generates a customized TypeScript client based on that schema, translating JavaScript method calls (like `prisma.product.findMany()`) into optimized SQL queries under the hood.

### Redis
* **Why:** Extreme performance for repetitive tasks. We use it for caching product queries and storing rate-limit data to prevent DDOS attacks.
* **How it works:** It is an in-memory key-value store. Because data is stored in RAM rather than on a hard drive, fetching a cached product from Redis takes milliseconds compared to querying the Postgres database.

### Vanilla CSS / CSS Modules
* **Why:** Provides maximum flexibility for premium, custom "glassmorphic" and animated designs without being constrained by utility class frameworks.
* **How it works:** Scopes CSS locally to a specific component (e.g., `Button.module.css`), guaranteeing that styles will never leak or clash with other components on the page.

---

## 4. Alternatives to Our Current Stack

If we were to swap out technologies, here are the industry-standard alternatives:

| Current Tool | Alternative 1 | Alternative 2 | Notes |
| :--- | :--- | :--- | :--- |
| **Next.js** | Remix | Vite (React SPA) | Remix is excellent for data mutations; Vite is faster but lacks built-in SSR/SEO. |
| **Express.js** | NestJS | Fastify | NestJS is highly opinionated and great for massive enterprise apps. Fastify is significantly faster than Express. |
| **PostgreSQL** | MongoDB (NoSQL) | MySQL | *Project Specific Note:* We intentionally removed MongoDB from this project. While MongoDB is great for flexible, unstructured data, a strict relational database (Postgres) is far superior for handling strict transactional e-commerce data (e.g., tying Orders firmly to Users and Products). |
| **Prisma** | TypeORM | Drizzle ORM | Drizzle is newer, faster, and closer to raw SQL. TypeORM is older and heavier. |
| **Redis** | Memcached | In-memory (Node Cache) | Redis is the undisputed king here; Memcached lacks complex data structures. |

---

### Deep Dive: MongoDB vs PostgreSQL

**Why use MongoDB?**
Developers often choose MongoDB because it is a "schemaless" NoSQL database. It allows you to move incredibly fast when building prototypes because you don't have to define strict tables or migrations beforehand. If a product suddenly needs a new field (like `custom_engraving`), you can just save it directly to the database without running a schema migration.

**How it works:**
Instead of storing data in rigid Tables with Rows and Columns (like Excel), MongoDB stores data as flexible JSON-like documents (called BSON) inside Collections. It excels at storing unstructured, heavily nested data.

**What is the alternative?**
The alternative is a Relational Database Management System (RDBMS) like **PostgreSQL** or MySQL. These databases force you to define strict schemas (tables, columns, types) and relationships (Foreign Keys) before you can save any data.

**What happens if I don't use MongoDB (and use Postgres instead)?**
If you choose not to use MongoDB, you lose the ability to insert random, unstructured data on the fly. You are forced to write strict schema migrations (which we do using Prisma).
However, **for an E-commerce platform, not using MongoDB is actually a massive advantage.** E-commerce relies on *relational* data. You need absolute certainty that an Order belongs to a valid User, and that the Product ID exists. PostgreSQL guarantees "Data Integrity" and ACID compliance (making sure financial transactions either fully succeed or fully fail without corrupting data). By dropping MongoDB and relying strictly on Postgres, we eliminated the risk of corrupted, orphaned orders in the system.

---

## 5. Development & DevOps Tooling

To ensure "fluent" development and production readiness, we utilize:

### Concurrently (Unified Runner)
Instead of manually booting 4 different terminals, we configured `concurrently` in the root `package.json`. Running `npm run dev` orchestrates the entire platform:
1. Boots Docker (`docker compose up -d`)
2. Starts the Backend API (`nodemon src/server.ts`)
3. Starts the Customer UI (`next dev -p 3000`)
4. Starts the Admin UI (`next dev -p 3001`)

### GitHub Actions (Integrated CI/CD)
Our `.github/workflows/ci.yml` goes beyond a standard build check. On every push, it:
1. Provisions temporary **Postgres** and **Redis** containers.
2. Pushes the schema and runs database seeding (`npm run prisma:seed`).
3. Starts the backend in the background and pings the `/health` route to guarantee it doesn't crash on startup.
4. Builds and tests the startup of both Next.js frontends.

---

## 6. The "Best" Combinations for Projects

The "best" combination depends entirely on the scale and nature of the project. Here is research-backed advice on the best stacks:

### Stack A: The "T3 Stack" (Best for Startups & Fast Iteration)
* **Next.js, TailwindCSS, tRPC, Prisma, PlanetScale (MySQL)**
* **Why:** This is currently the most beloved stack in the React ecosystem for moving fast. tRPC allows you to share types directly between your frontend and backend without writing traditional REST APIs. PlanetScale offers serverless databases that scale infinitely.

### Stack B: The Enterprise Microservice Stack (Best for Massive Scale)
* **React/Next.js (Frontend) + Go / Java Spring Boot (Backend) + PostgreSQL + Kafka + Redis**
* **Why:** When you reach the scale of Amazon or Uber, Node.js can become a bottleneck for heavy computational tasks. Go (Golang) or Java provides massive multi-threading performance. Kafka is used for event-driven architecture (e.g., "Order Placed" triggers 5 different microservices).

### Stack C: Our Current Stack (The "Modern Full-Stack Standard")
* **Next.js + Express/Node + Postgres + Prisma + Redis**
* **Why this is great for NovaShop:** 
  1. **Unified Language:** Using TypeScript everywhere means one developer can easily jump between the database schema, backend API, and frontend UI.
  2. **Separation of Concerns:** By splitting the frontend and backend (rather than doing everything inside Next.js server actions), we created a true REST API that can easily be consumed by a future iOS/Android mobile app.
  3. **Data Integrity:** Postgres ensures our orders and payments will never be corrupted, while Redis ensures the site stays lightning fast during traffic spikes.

> [!TIP]
> **Conclusion:** For a premium E-commerce platform built by a small-to-medium team, **our current stack is objectively one of the best combinations available.** It balances developer speed (Prisma/TypeScript) with production-ready scalability (Postgres/Redis/Docker).
