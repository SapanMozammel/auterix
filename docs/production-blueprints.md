# Production Code Blueprints & Architecture

Auterix provides battle-tested production blueprints so developers and AI agents don't write foundational boilerplate from scratch. Every blueprint is hardened for security, type-safety, and multi-tenant scalability.

---

## 📁 Blueprints & Scaffolds Directory Structure

```
blueprints/
├── scaffolds/                   # 5 COMPLETE RUNNABLE APPLICATION STARTERS
│   ├── nextjs-supabase/        # Next.js 15 App Router + Server Actions + Supabase RLS
│   ├── fastapi-sqlalchemy/     # Python FastAPI + Async SQLAlchemy 2.0 + Pydantic v2
│   ├── enterprise-node/        # Enterprise Node.js 22 + Fastify 5 + Prisma ORM
│   ├── react-native-expo/      # React Native 0.74+ & Expo 51+ Mobile with SecureStore
│   └── cloudflare-worker-hono/ # Cloudflare Workers & Hono Edge API with D1
├── ai/
│   └── rag-pipeline.ts          # Semantic search, text chunking & vector ranking
├── auth/
│   └── session-guard.ts         # Next.js 15 server-only auth & RBAC session guards
├── billing/
│   └── stripe-webhook.ts        # Idempotent Stripe webhook handler with signatures
├── ci-cd/
│   ├── coderabbit.yaml          # AI PR review guardrails for CodeRabbit
│   ├── github-ci.yml            # Unified GitHub Actions pipeline (Lint, Test, Lighthouse)
│   ├── lighthouserc.js          # Core Web Vitals & accessibility performance budgets
│   ├── playwright.config.ts     # Multi-browser end-to-end testing setup
│   ├── pre-commit-guard.sh      # Git hook preventing secret leaks & type errors
│   └── security-scan.yml        # Trivy & TruffleHog container/dependency audit
├── database/
│   └── drizzle.schema.ts        # Drizzle ORM schema (PostgreSQL + pgvector for RAG)
├── docker/
│   ├── Dockerfile               # Multi-stage non-root hardened container (<80MB)
│   └── docker-compose.yml       # Local development stack (App + PG16 pgvector + Redis)
├── graphql/
│   ├── codegen.ts               # GraphQL Code Generator configuration
│   └── schema.graphql           # Production schema with query depth limits
├── monitoring/
│   └── logger.ts                # Structured JSON logger with PII redaction & trace IDs
└── security/
    └── rate-limiter.ts          # Sliding-window distributed rate limiter for LLMs
```

---

## 🚀 5 Complete Production Starter Scaffolds (Pro & Agency)

These full-stack starter scaffolds are part of the commercial **Auterix Pro (`$14`)** and **Agency (`$39`)** suites, delivered via the official Gumroad package (`Auterix-Pro-Production-Suite.zip`) and synced via the private `SapanMozammel/auterix-pro` GitHub repository:

### 1. Next.js 15 + Supabase RLS (`blueprints/scaffolds/nextjs-supabase/`)
* **Core Stack:** Next.js 15.1, React 19, `@supabase/ssr`, Tailwind CSS, Zod.
* **Included Architecture:**
  * Strict Server Actions with Zod schema parsing.
  * Next.js async cookies session management.
  * Bank-grade multi-tenant PostgreSQL Row-Level Security (`20260911_init_rls.sql`) isolating tenant data at the database kernel level.
  * Middleware route guard protecting `/dashboard` and refreshing auth cookies.

### 2. Python FastAPI + Async SQLAlchemy 2.0 (`blueprints/scaffolds/fastapi-sqlalchemy/`)
* **Core Stack:** FastAPI, Uvicorn, SQLAlchemy 2.0 (asyncio), `asyncpg`, Pydantic v2.
* **Included Architecture:**
  * Asynchronous connection pool lifecycle management.
  * Type-safe declarative models with UUID primary keys.
  * JWT authentication with Bearer token header extraction.
  * Strict Pydantic settings loading validated environment variables.

### 3. Enterprise Node.js 22 + Fastify + Prisma (`blueprints/scaffolds/enterprise-node/`)
* **Core Stack:** Node.js 22 LTS, Fastify 5, Prisma ORM, Pino logger, Zod.
* **Included Architecture:**
  * High-throughput HTTP server with graceful OS signal handling (`SIGTERM`, `SIGINT`).
  * Kubernetes `/health/liveness` and `/health/readiness` probes.
  * Multi-tenant relational Prisma schema.

### 4. React Native & Expo 51+ Mobile (`blueprints/scaffolds/react-native-expo/`)
* **Core Stack:** React Native 0.74+, Expo 51+, Expo Router 3.5, Expo SecureStore.
* **Included Architecture:**
  * File-system based typed navigation with Expo Router.
  * Hardware-backed iOS Keychain & Android Keystore encryption for tokens.
  * Dark theme cosmic aesthetic matching Auterix design guidelines.

### 5. Cloudflare Workers & Hono Edge API (`blueprints/scaffolds/cloudflare-worker-hono/`)
* **Core Stack:** Cloudflare Workers, Hono 4, Wrangler, D1 Database bindings.
* **Included Architecture:**
  * Sub-10ms global edge response times.
  * Structured timing headers, CORS middleware, and typed JSON responses.

---

## 🏗️ Detailed Blueprint Guide

### 1. Security & Rate Limiting (`blueprints/security/rate-limiter.ts`)
* **Purpose:** Protects LLM inference endpoints and sensitive API routes from DDoS, credential stuffing, and budget drain.
* **Key Features:**
  * Sliding-window rate limiting algorithm.
  * Pre-configured tiers: Anonymous (20 req/min), Free User (60 req/min), Pro User (300 req/min), AI Agent (120 req/min).
  * Generates standard RFC HTTP headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`).
  * In-memory zero-dependency fallback with automated garbage collection.

---

### 2. Session & RBAC Auth Guards (`blueprints/auth/session-guard.ts`)
* **Purpose:** Zero-trust authentication and role-based access control for Next.js 15 App Router and React Server Components.
* **Key Features:**
  * Uses `import 'server-only'` to guarantee auth code is never bundled into client bundles.
  * High-level guards:
    * `requireAuth()`: Enforces authenticated session; redirects to `/login` if unauthenticated.
    * `requireRole(['admin', 'owner'])`: Enforces hierarchical role permissions; redirects to `/unauthorized`.
    * `requireTenant(orgId)`: Enforces tenant isolation preventing cross-tenant data leaks.
  * Full TypeScript types for `SessionUser` and `AuthSession`.

---

### 3. Billing & Stripe Webhook Handler (`blueprints/billing/stripe-webhook.ts`)
* **Purpose:** Bulletproof billing integration with Stripe that prevents double-fulfillment and forged webhook attacks.
* **Key Features:**
  * Cryptographic signature verification using `stripe.webhooks.constructEvent`.
  * Atomic in-memory event idempotency cache to safely handle Stripe retry deliveries.
  * Handlers for `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`.
  * Automatic synchronization with user subscription tiers.

---

### 4. Database Schema with pgvector (`blueprints/database/drizzle.schema.ts`)
* **Purpose:** Universal PostgreSQL relational schema with native vector embedding support for AI features.
* **Key Features:**
  * Multi-tenant data model: `organizations` (tenants) and `users` (members).
  * Native `vector(1536)` type for OpenAI / Gemini text embeddings.
  * `document_embeddings` table with chunk indices and JSONB metadata.
  * Comprehensive `audit_logs` table for compliance, tracking user actions, IP addresses, and resource IDs.

---

### 5. RAG Pipeline & Semantic Search (`blueprints/ai/rag-pipeline.ts`)
* **Purpose:** Turnkey Retrieval-Augmented Generation pipeline for AI agents and search interfaces.
* **Key Features:**
  * `chunkText()`: Word-boundary-aware text chunker with sliding window overlap.
  * `cosineSimilarity()`: High-performance vector dot-product similarity calculator.
  * `rankChunksBySimilarity()`: Semantic top-k ranker with minimum confidence thresholding.
  * `assembleRAGContext()`: Token-budget-capped prompt assembler for injection into AI system prompts.

---

### 6. Production Docker & Containerization (`blueprints/docker/`)
* **Purpose:** Enterprise-grade container setup for reproducible local development and cloud deployments.
* **Key Features:**
  * **Dockerfile:**
    * Multi-stage build (deps ➔ builder ➔ runner).
    * Alpine Linux base for ultra-low attack surface and final image size under 80MB.
    * Non-root user (`nodejs:nodejs`, UID 10001) for strict security compliance.
    * Next.js standalone output mode.
  * **docker-compose.yml:**
    * Spins up the web application, PostgreSQL 16 with `pgvector` pre-installed (`pgvector/pgvector:pg16`), and Redis 7 Alpine with persistent volumes and health checks.

---

### 7. Structured JSON Logging & Observability (`blueprints/monitoring/logger.ts`)
* **Purpose:** Cloud-ready structured logging compatible with Datadog, CloudWatch, GCP Cloud Logging, and Sentry.
* **Key Features:**
  * Outputs single-line JSON format for automated log ingestion.
  * **Automated PII Redaction:** Recursively masks passwords, tokens, API keys, and credit card numbers.
  * Correlates logs with `correlationId`, `userId`, and `orgId`.
  * Rich error serialization capturing error names, messages, and stack traces.

---

### 8. GraphQL Production Architecture (`blueprints/graphql/`)
* **Purpose:** Scalable GraphQL API schema with strict type safety and query complexity limits.
* **Key Features:**
  * `schema.graphql`: Clean schema definition for organizations, users, and AI documents.
  * Cursor-based pagination standard (`first`, `after`, `PageInfo`).
  * `codegen.ts`: Automated TypeScript type generation targeting client and server resolvers.

---

## 🧩 Architectural Invariants Enforced Across All AI Tools

When any of the 21 AI tools (Cursor, Claude, Antigravity, etc.) interact with your code, Auterix enforces these unbreakable rules:

1. **No Untyped Any:** All TypeScript code must be strictly typed.
2. **Deterministic Migrations:** Database schemas must never be edited manually; they must be authored as timestamped SQL migrations.
3. **Secret Isolation:** Environment variables (`.env`, `.env.local`) are never logged, printed, or committed to git.
4. **Verification Gate:** No task can be marked complete until unit tests and lint checks pass with exit code 0.
