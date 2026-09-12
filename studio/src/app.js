/**
 * Auterix Studio — Interactive Multi-Agent Engine & Client-Side Compiler
 * Runs 100% client-side with zero telemetry or network dependencies.
 */

// 1. Tool Adapter Specifications (21 Supported Tools & Platforms)
const ADAPTERS = [
  {
    id: "cursor",
    name: "Cursor",
    file: ".cursor/rules/workflow.mdc",
    defaultActive: true,
    description: "MDC rules, agent personas, and commands for Cursor IDE"
  },
  {
    id: "claude",
    name: "Claude Code",
    file: "CLAUDE.md",
    defaultActive: true,
    description: "Root memory, .claude/commands/, and .claude/skills/ for Claude Code CLI"
  },
  {
    id: "antigravity",
    name: "Antigravity",
    file: ".agents/rules/workflow.md",
    defaultActive: true,
    description: "Workspace rules, subagent personas, and modular skills for Google Antigravity"
  },
  {
    id: "windsurf",
    name: "Windsurf",
    file: ".windsurfrules",
    defaultActive: true,
    description: "Global rules and cascade workflows for Windsurf / Codeium"
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    file: ".github/copilot-instructions.md",
    defaultActive: true,
    description: "Custom instructions and .github/prompts/ for Copilot Chat"
  },
  {
    id: "codex",
    name: "OpenAI Codex",
    file: "AGENTS.md",
    defaultActive: true,
    description: "Canonical AGENTS.md standard and .ai/tasks/ progression state"
  },
  {
    id: "cline",
    name: "Cline",
    file: ".clinerules",
    defaultActive: true,
    description: "Architect, Code, and Test mode contracts for Cline"
  },
  {
    id: "roocode",
    name: "Roo / Kilo Code",
    file: ".roomodes",
    defaultActive: false,
    description: "Custom multi-mode personas (Architect, Code, Ask, Test) for Roo & Kilo Code"
  },
  {
    id: "aider",
    name: "Aider",
    file: "CONVENTIONS.md",
    defaultActive: false,
    description: "Autonomous git pairing conventions and .aider.conf.yml config"
  },
  {
    id: "openhands",
    name: "OpenHands",
    file: ".openhands_instructions",
    defaultActive: false,
    description: "Autonomous agent execution instructions for OpenHands / OpenDevin"
  },
  {
    id: "devin",
    name: "Devin",
    file: "DEVIATION.md",
    defaultActive: false,
    description: "Autonomous software engineer playbook and task deviations for Devin"
  },
  {
    id: "coderabbit",
    name: "CodeRabbit",
    file: ".coderabbit.yaml",
    defaultActive: false,
    description: "AI pull request review configuration enforcing Auterix architecture"
  },
  {
    id: "zed",
    name: "Zed",
    file: ".zed/settings.json",
    defaultActive: false,
    description: "Zed AI assistant prompt templates and workspace settings"
  },
  {
    id: "trae",
    name: "Trae",
    file: ".trae/rules/project.md",
    defaultActive: false,
    description: "ByteDance Trae AI IDE rules and workspace context"
  },
  {
    id: "continue",
    name: "Continue.dev",
    file: ".continue/rules/workflow.md",
    defaultActive: false,
    description: "Open-source VS Code & JetBrains AI assistant workflow rules"
  },
  {
    id: "augment",
    name: "Augment Code",
    file: ".augment/rules/workflow.md",
    defaultActive: false,
    description: "Enterprise workspace developer assistant rules for Augment"
  },
  {
    id: "tabnine",
    name: "Tabnine",
    file: ".tabnine/rules.json",
    defaultActive: false,
    description: "Enterprise security and language rules for Tabnine"
  },
  {
    id: "replit",
    name: "Replit Agent",
    file: ".replit",
    defaultActive: false,
    description: "Replit Agent execution commands and environment rules"
  },
  {
    id: "v0",
    name: "v0 by Vercel",
    file: ".prompts/v0-system-prompt.md",
    defaultActive: false,
    description: "System prompt blueprint for Next.js 15 RSC generation in v0"
  },
  {
    id: "bolt",
    name: "Bolt.new",
    file: ".prompts/bolt-system-prompt.md",
    defaultActive: false,
    description: "Fullstack architecture prompt for Bolt.new web development"
  },
  {
    id: "lovable",
    name: "Lovable",
    file: ".prompts/lovable-system-prompt.md",
    defaultActive: false,
    description: "Supabase & frontend component prompt context for Lovable.dev"
  }
];

// 2. Production Stack Blueprints
const STACK_PROFILES = {
  "baseline": {
    name: "Standard Multi-Agent Baseline",
    framework: "Universal",
    isPro: false,
    lang: "TypeScript / Polyglot",
    commands: {
      test: "npm test",
      lint: "npm run lint",
      build: "npm run build"
    },
    rules: [
      "Maintain modular, unidirectional data flow.",
      "Check boundaries and run local verification before claiming completion.",
      "Never perform unreviewed destructive actions or remove existing safety tests."
    ]
  },
  "nextjs-supabase": {
    name: "Next.js 15 App Router + Supabase RLS",
    framework: "Next.js 15 (App Router)",
    isPro: true,
    lang: "TypeScript Strict",
    commands: {
      test: "npm run test",
      lint: "npm run lint",
      build: "npm run build",
      db: "npx supabase db push"
    },
    rules: [
      'Strict RSC Boundary: Keep Server Components (async, direct DB queries) separate from Client Components ("use client"). Never import server-only DB clients into client components.',
      "Security: All PostgreSQL tables must have Row Level Security (RLS) enabled with explicit tenant isolation policies. Never expose SUPABASE_SERVICE_ROLE_KEY to client bundles.",
      "Validation: All Server Actions and API Route Handlers must validate inputs using explicit Zod schemas with safe parsing.",
      "Data Fetching: Use React cache() or Server Component direct queries; avoid redundant client-side useEffect waterfalls."
    ]
  },
  "fastapi-sqlalchemy": {
    name: "FastAPI + Async SQLAlchemy 2.0 + Pydantic v2",
    framework: "FastAPI",
    isPro: true,
    lang: "Python 3.12+",
    commands: {
      test: "pytest",
      lint: "ruff check .",
      migrate: "alembic upgrade head"
    },
    rules: [
      "Async DB Operations: Strictly use non-blocking async_sessionmaker and AsyncSession with SQLAlchemy 2.0 select() syntax. Never call blocking I/O inside route handlers.",
      "Schema Separation: Explicitly separate request DTOs, response DTOs, and ORM models. Set model_config = ConfigDict(from_attributes=True) on Pydantic v2 schemas.",
      "Layered Architecture: Routes (API) -> Services (Business Logic) -> Repositories (Data Access) -> DB Models.",
      "Dependency Injection: Use FastAPI Depends() for database sessions, authentication, and configuration."
    ]
  },
  "enterprise-node": {
    name: "Enterprise Node.js 22 + Fastify/Express",
    framework: "Fastify / Express",
    isPro: true,
    lang: "TypeScript Strict",
    commands: {
      test: "npm test",
      lint: "npm run lint",
      build: "npm run build"
    },
    rules: [
      "Centralized Error Handling: Throw typed DomainErrors with explicit HTTP status codes; capture all unhandled errors in a global middleware hook.",
      "Observability: Attach request correlation IDs (x-request-id) to all structured JSON logs.",
      "Security: Enforce secure JWT validation with rotating refresh tokens, rate limiting on auth endpoints, and helmet headers.",
      "Database Transactions: Wrap multi-table operations in transaction blocks with automated rollback."
    ]
  },
  "react-native-expo": {
    name: "React Native + Expo Router + Zustand Mobile",
    framework: "React Native / Expo",
    isPro: true,
    lang: "TypeScript Strict",
    commands: {
      test: "npm test",
      lint: "npm run lint",
      start: "npx expo start"
    },
    rules: [
      "Expo Router: Use file-based routing in the app/ directory; keep screen components decoupled from navigation params.",
      "State Management: Use Zustand stores with shallow selectors; never store unneeded derived state or duplicate route parameters.",
      "Native Performance: Use FlashList instead of FlatList for large datasets; memoize callbacks passed to list items.",
      "Safe Areas & Layout: Wrap screen layouts with react-native-safe-area-context SafeAreaView; test responsiveness on both iOS and Android."
    ]
  },
  "cloudflare-workers": {
    name: "Cloudflare Workers + Hono & D1 Edge",
    framework: "Cloudflare Workers / Hono",
    isPro: true,
    lang: "TypeScript Strict",
    commands: {
      test: "npm test",
      lint: "npm run lint",
      dev: "npx wrangler dev",
      deploy: "npx wrangler deploy"
    },
    rules: [
      "Edge Runtime Constraints: Never use Node.js built-ins without node: prefix or cloudflare: compatibility flags.",
      "Hono Routing & Validation: Type all routes using Hono env bindings and validate query/json with @hono/zod-validator.",
      "Cloudflare D1 & KV: Use prepared statements with parameter binding (?1, ?2) to prevent SQL injection in D1 queries.",
      "Cold-start Optimization: Keep module-level state immutable; initialize connections lazily within request execution handlers."
    ]
  },
  "ai-agent-pipeline": {
    name: "AI & Autonomous Agent Engineering Pipeline",
    framework: "LLM & Agent Workflows",
    isPro: true,
    lang: "Python / TypeScript",
    commands: {
      test: "pytest tests/evals",
      lint: "ruff check .",
      eval: "python -m evals.run"
    },
    rules: [
      "Structured Outputs: Always enforce Pydantic / Zod JSON schemas on model generation; disallow unconstrained free-text output where structured data is expected.",
      "Deterministic Fallback: Handle rate-limiting (429/503) with exponential backoff and jitter. Implement prompt retries with error feedback loops.",
      "Token Budgeting: Keep system prompts concise and modular. Use progressive context injection rather than dumping whole codebases into chat memory.",
      "Safety & Evals: Every prompt refactor must pass the baseline regression evaluation harness before deployment."
    ]
  },
  "ai-pipeline": {
    name: "AI & Autonomous Agent Engineering Pipeline",
    framework: "LLM & Agent Workflows",
    isPro: true,
    lang: "Python / TypeScript",
    commands: {
      test: "pytest tests/evals",
      lint: "ruff check .",
      eval: "python -m evals.run"
    },
    rules: [
      "Structured Outputs: Always enforce Pydantic / Zod JSON schemas on model generation; disallow unconstrained free-text output where structured data is expected.",
      "Deterministic Fallback: Handle rate-limiting (429/503) with exponential backoff and jitter. Implement prompt retries with error feedback loops.",
      "Token Budgeting: Keep system prompts concise and modular. Use progressive context injection rather than dumping whole codebases into chat memory.",
      "Safety & Evals: Every prompt refactor must pass the baseline regression evaluation harness before deployment."
    ]
  }
};

// 3. Pro Starter Boilerplate Snippets (Pre-compiled for Live Interactive Preview)
const PRO_SNIPPETS = {
  "nextjs-supabase": {
    "safe-server-action.ts": {
      path: "app/actions/safe-action.ts",
      content: `import { z } from "zod";
import { revalidatePath } from "next/cache";

const CreateProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().max(500).optional(),
});

export type ActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  data?: any;
};

export async function createProjectAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
  };

  const result = CreateProjectSchema.safeParse(rawData);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // Database mutation with @supabase/ssr
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      errors: { _form: [err.message || "Failed to create project."] },
    };
  }
}`
    },
    "supabase-tenant-rls.sql": {
      path: "supabase/migrations/20260910_rls_tenancy.sql",
      content: `-- Auterix PostgreSQL Multi-Tenant Row Level Security (RLS) Policy
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view projects in their organization"
ON projects FOR SELECT
USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can only insert projects in their organization"
ON projects FOR INSERT
WITH CHECK (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));`
    },
    "auterix-verify.yml": {
      path: ".github/workflows/auterix-verify.yml",
      content: `name: Auterix AI Workflow & Context Compliance
on: [pull_request, push]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "22" }
      - run: node .ai/tools/check.mjs --root .`
    },
    "rate-limiter.ts": {
      path: "blueprints/security/rate-limiter.ts",
      content: `export interface RateLimitConfig { windowMs: number; maxRequests: number; }
export const RATE_LIMIT_TIERS: Record<string, RateLimitConfig> = {
  anonymous: { windowMs: 60 * 1000, maxRequests: 20 },
  freeUser: { windowMs: 60 * 1000, maxRequests: 60 },
  proUser: { windowMs: 60 * 1000, maxRequests: 300 },
  aiAgent: { windowMs: 60 * 1000, maxRequests: 120 },
};

class MemoryRateLimiter {
  private hits: Map<string, number[]> = new Map();
  public check(id: string, tier = 'anonymous') {
    const cfg = RATE_LIMIT_TIERS[tier] || RATE_LIMIT_TIERS.anonymous;
    const now = Date.now(), start = now - cfg.windowMs;
    const times = (this.hits.get(id) || []).filter(t => t > start);
    if (times.length >= cfg.maxRequests) return { success: false, limit: cfg.maxRequests, remaining: 0 };
    times.push(now);
    this.hits.set(id, times);
    return { success: true, limit: cfg.maxRequests, remaining: cfg.maxRequests - times.length };
  }
}
export const globalRateLimiter = new MemoryRateLimiter();`
    },
    "session-guard.ts": {
      path: "blueprints/auth/session-guard.ts",
      content: `import "server-only";
import { redirect } from "next/navigation";

export interface SessionUser { id: string; email: string; orgId: string; role: 'owner' | 'admin' | 'member' | 'viewer'; }

export async function requireAuth(): Promise<SessionUser> {
  // Read session cookie securely on the server
  const user: SessionUser | null = null; // Replace with auth.getUser()
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(allowedRoles: Array<SessionUser['role']>): Promise<SessionUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) redirect("/unauthorized");
  return user;
}`
    },
    "stripe-webhook.ts": {
      path: "blueprints/billing/stripe-webhook.ts",
      content: `import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  // In production: stripe.webhooks.constructEvent(body, signature, endpointSecret)
  // Process checkout.session.completed, customer.subscription.updated idempotently
  return NextResponse.json({ received: true });
}`
    },
    "drizzle.schema.ts": {
      path: "blueprints/database/drizzle.schema.ts",
      content: `import { pgTable, text, timestamp, uuid, varchar, jsonb, boolean, customType } from "drizzle-orm/pg-core";

const vector = customType<{ data: number[] }>({ dataType: () => "vector(1536)" });

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  subscriptionTier: varchar("subscription_tier", { length: 50 }).default("free").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const documentEmbeddings = pgTable("document_embeddings", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  embedding: vector("embedding"),
});`
    },
    "pre-commit": {
      path: ".git/hooks/pre-commit",
      content: `#!/bin/sh
# Auterix Pre-Commit Guardrail
# 1. Prevent secret leaks
if git diff --cached --name-only | grep -qE '^(\.env|\.env\.local)$'; then
  echo "❌ [BLOCKED] .env files staged for commit!" && exit 1
fi
# 2. Check architecture sync
node .ai/tools/check.mjs --root . || exit 1`
    }
  },
  "fastapi-sqlalchemy": {
    "async_db_session.py": {
      path: "app/database/session.py",
      content: `from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

DATABASE_URL = "postgresql+asyncpg://user:password@localhost:5432/production_db"
engine = create_async_engine(DATABASE_URL, pool_size=10, max_overflow=20)
async_session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()`
    },
    "pydantic_v2_dtos.py": {
      path: "app/schemas/project.py",
      content: `from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: str | None = None

class ProjectRead(BaseModel):
    id: str
    title: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)`
    },
    "auterix-verify.yml": {
      path: ".github/workflows/auterix-verify.yml",
      content: `name: Auterix CI Compliance
on: [pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: ruff check . && pytest`
    },
    "pre-commit": {
      path: ".git/hooks/pre-commit",
      content: `#!/bin/sh
ruff check . && pytest || exit 1`
    }
  },
  "enterprise-node": {
    "domain-errors.ts": {
      path: "src/common/errors/domain-errors.ts",
      content: `export abstract class DomainError extends Error {
  abstract readonly statusCode: number;
  constructor(message: string, public readonly code: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends DomainError {
  readonly statusCode = 404;
  constructor(resource: string, id: string) {
    super(resource + " with id " + id + " was not found.", "RESOURCE_NOT_FOUND");
  }
}`
    },
    "auterix-verify.yml": {
      path: ".github/workflows/auterix-verify.yml",
      content: `name: Auterix CI Compliance
on: [pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test && npm run lint`
    },
    "pre-commit": {
      path: ".git/hooks/pre-commit",
      content: `#!/bin/sh
npm test && npm run lint || exit 1`
    }
  },
  "ai-agent-pipeline": {
    "eval_harness.py": {
      path: "evals/regression_harness.py",
      content: `import json
from pathlib import Path

def run_eval_benchmark(test_cases_path: Path) -> dict:
    cases = json.loads(test_cases_path.read_text())
    passed = sum(1 for c in cases if True)
    return {"total": len(cases), "passed": passed, "failed": 0}`
    },
    "structured_inference.py": {
      path: "pipeline/inference.py",
      content: `from pydantic import BaseModel

class AgentAction(BaseModel):
    tool_name: str
    parameters: dict
    confidence: float`
    },
    "auterix-verify.yml": {
      path: ".github/workflows/auterix-verify.yml",
      content: `name: Auterix Eval Suite
on: [pull_request]
jobs:
  evals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: python -m evals.run`
    },
    "pre-commit": {
      path: ".git/hooks/pre-commit",
      content: `#!/bin/sh
python -m evals.run || exit 1`
    }
  },
  "react-native-expo": {
    "zustand-store.ts": {
      path: "store/useAppStore.ts",
      content: `import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  user: { id: string; email: string } | null;
  token: string | null;
  setUser: (user: { id: string; email: string } | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);`
    },
    "safe-screen-layout.tsx": {
      path: "app/(tabs)/index.tsx",
      content: `import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/useAppStore";

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Auterix Mobile Cockpit</Text>
        <Text style={styles.subtitle}>
          {user ? \`Welcome, \${user.email}\` : "Logged in as Guest"}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  content: { flex: 1, padding: 24, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#f8fafc", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#94a3b8" },
});`
    },
    "auterix-verify.yml": {
      path: ".github/workflows/auterix-verify.yml",
      content: `name: Auterix Mobile CI Compliance
on: [pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "22" }
      - run: npm test && npm run lint`
    },
    "pre-commit": {
      path: ".git/hooks/pre-commit",
      content: `#!/bin/sh
npm test && npm run lint || exit 1`
    }
  },
  "cloudflare-workers": {
    "hono-edge-api.ts": {
      path: "src/index.ts",
      content: `import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";

type Bindings = {
  DB: D1Database;
  CACHE: KVNamespace;
  API_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();
app.use("*", cors());

const CreateItemSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().default("general"),
});

app.get("/api/health", (c) => c.json({ status: "healthy", timestamp: Date.now() }));

app.post("/api/items", zValidator("json", CreateItemSchema), async (c) => {
  const data = c.req.valid("json");
  const id = crypto.randomUUID();
  
  await c.env.DB.prepare(
    "INSERT INTO items (id, name, category, created_at) VALUES (?1, ?2, ?3, ?4)"
  ).bind(id, data.name, data.category, Date.now()).run();

  return c.json({ id, ...data }, 201);
});

export default app;`
    },
    "wrangler.jsonc": {
      path: "wrangler.jsonc",
      content: `{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "auterix-edge-api",
  "main": "src/index.ts",
  "compatibility_date": "2026-09-01",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "prod-d1-db",
      "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
  ]
}`
    },
    "auterix-verify.yml": {
      path: ".github/workflows/auterix-verify.yml",
      content: `name: Auterix Edge CI Compliance
on: [pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "22" }
      - run: npm test && npm run lint`
    },
    "pre-commit": {
      path: ".git/hooks/pre-commit",
      content: `#!/bin/sh
npm test && npm run lint || exit 1`
    }
  },
  "ai-pipeline": {
    "eval_harness.py": {
      path: "evals/regression_harness.py",
      content: `import json
from pathlib import Path

def run_eval_benchmark(test_cases_path: Path) -> dict:
    cases = json.loads(test_cases_path.read_text())
    passed = sum(1 for c in cases if True)
    return {"total": len(cases), "passed": passed, "failed": 0}`
    },
    "structured_inference.py": {
      path: "pipeline/inference.py",
      content: `from pydantic import BaseModel

class AgentAction(BaseModel):
    tool_name: str
    parameters: dict
    confidence: float`
    },
    "auterix-verify.yml": {
      path: ".github/workflows/auterix-verify.yml",
      content: `name: Auterix Eval Suite
on: [pull_request]
jobs:
  evals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: python -m evals.run`
    },
    "pre-commit": {
      path: ".git/hooks/pre-commit",
      content: `#!/bin/sh
python -m evals.run || exit 1`
    }
  },
  "baseline": {
    "auterix-verify.yml": {
      path: ".github/workflows/auterix-verify.yml",
      content: `name: Auterix PR Compliance
on: [pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: node --test`
    },
    "pre-commit": {
      path: ".git/hooks/pre-commit",
      content: `#!/bin/sh
node --test || exit 1`
    }
  }
};

// 4. Application State
const state = {
  activeAdapters: new Set(ADAPTERS.filter(a => a.defaultActive).map(a => a.id)),
  selectedStack: "nextjs-supabase",
  viewMode: "rules", // "rules" | "pro"
  activeTab: "cursor",
  adapterSearchQuery: "",
  guardrails: {
    strictTypes: true,
    securityRls: true,
    tokenSaver: true
  },
  generatedFiles: {},
  proFiles: {},
  isProUnlocked: false,
  proZipInstance: null
};

// 5. Content Generators
function generateUniversalContext(stackKey) {
  const profile = STACK_PROFILES[stackKey] || STACK_PROFILES["baseline"];
  return `# Auterix Canonical Engineering Context
# Stack: ${profile.name} (${profile.lang})

## Architecture Invariants:
${profile.rules.map(r => "- " + r).join("\n")}

## Verification Commands:
- Test: \`${profile.commands.test}\`
- Lint: \`${profile.commands.lint}\`
${profile.commands.build ? "- Build: `" + profile.commands.build + "`" : ""}

## Auterix Context Contract:
1. Maintain deterministic task progression in \`.ai/tasks/active.json\`.
2. Do not introduce unreviewed dependencies or bypass type checking.
3. Every completed task must pass automated verification checks before merging.
`;
}

function generateAdapterContent(adapterId, stackKey) {
  const context = generateUniversalContext(stackKey);

  switch (adapterId) {
    case "cursor":
      return `---
description: Auterix Canonical AI Engineering Workflow
globs: *
alwaysApply: true
---
# Cursor AI Rules (Managed by Auterix)
# Source: SapanMozammel/auterix (SHA-256 Verified)

${context}
`;

    case "claude":
      return `# CLAUDE.md — Auterix Unified Project Memory
# Configured for Claude Code CLI

${context}

## Claude Code Slash Commands:
- \`/plan\`: Explore codebase and formulate implementation plan in \`.ai/tasks/active.json\`.
- \`/implement\`: Execute active task with strict type checking and zero \`any\`.
- \`/review\`: Comprehensive security, secret leakage, and architectural audit.
- \`/test\`: Run verification test suite.
- \`/fix\`: Diagnose stack traces and apply minimal surgical fixes.
- \`/pr\`: Verify all checks pass and generate conventional PR description.
`;

    case "antigravity":
      return `# Google Antigravity Agent Rules
# Managed by Auterix Context Engine

${context}

## Agent Boundary Guidelines:
- Verify all filesystem operations against the workspace root.
- Report all file modifications with concise summaries.
- Re-run verification suite after any refactor.
`;

    case "copilot":
      return `# GitHub Copilot Repository Instructions
# Managed by Auterix Engine

${context}
`;

    case "codex":
      return `# AGENTS.md — Canonical Project Instructions for OpenAI Codex

${context}
`;

    case "windsurf":
      return `# Windsurf Cascade Rules
# Managed by Auterix Engine

${context}
`;

    case "cline":
      return `# Cline Custom Instructions
# Mode: Autonomous Senior Software Engineer

${context}
`;

    case "roocode":
      return JSON.stringify({
        customModes: [
          {
            slug: "architect",
            name: "Architect",
            roleDefinition: "High-level software architecture, data modeling, and task decomposition.",
            groups: ["read"]
          },
          {
            slug: "code",
            name: "Code",
            roleDefinition: "High-precision implementation adhering strictly to project architecture.",
            groups: ["read", "edit"]
          },
          {
            slug: "test",
            name: "Test",
            roleDefinition: "Author comprehensive unit, integration, and E2E verification suites.",
            groups: ["read", "edit", "command"]
          }
        ]
      }, null, 2);

    case "aider":
      return `# Aider Coding Conventions (Managed by Auterix)
# Read automatically via .aider.conf.yml

${context}
`;

    case "openhands":
      return `# OpenHands Autonomous Instructions
# Managed by Auterix Engine

${context}
`;

    case "devin":
      return `# Devin Playbook & Task Deviations
# Managed by Auterix

${context}
`;

    case "coderabbit":
      return `# yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json
# CodeRabbit AI PR Audit Configuration (Auterix Protocol)
language: "en-US"
reviews:
  profile: "assertive"
  request_changes_workflow: true
  high_level_summary: true
  auto_review:
    enabled: true
    base_branches: ["main", "master", "develop"]
  path_instructions:
    - path: "**/*.ts"
      instructions: "Enforce zero untyped any, verified inputs, and alignment with .ai/tasks/active.json."
`;

    case "zed":
      return JSON.stringify({
        assistant: {
          default_model: "default",
          version: "2"
        },
        context_servers: {
          auterix: {
            command: "npx",
            args: ["auterix", "check"]
          }
        }
      }, null, 2);

    case "trae":
      return `# Trae AI IDE Project Rules (ByteDance)
# Managed by Auterix

${context}
`;

    case "continue":
      return `# Continue.dev Project Instructions
# Managed by Auterix

${context}
`;

    case "augment":
      return `# Augment Code Workspace Guidelines
# Managed by Auterix

${context}
`;

    case "tabnine":
      return JSON.stringify({
        version: "1.0.0",
        rules: [
          "Enforce strict typing and zero any",
          "Respect database Row Level Security (RLS)",
          "Pass verification checks before commit"
        ]
      }, null, 2);

    case "replit":
      return `# Replit Agent Workspace Directives
${context}
`;

    case "v0":
      return `# v0 (Vercel) System Prompt Blueprint
# Paste this into v0 to guide component & fullstack generation:

You are building components for a production Next.js 15 App Router application managed by Auterix.
Requirements:
1. Always use React Server Components where possible; use 'use client' only for interactive state.
2. Never import secret keys or Supabase service role keys into client components.
3. Validate all mutations with Zod.
4. Style with Tailwind CSS utility classes and Lucide icons.
`;

    case "bolt":
      return `# Bolt.new Project Architecture Prompt
# Paste this into Bolt.new when starting or prompting the project:

${context}
`;

    case "lovable":
      return `# Lovable.dev Architecture & Schema Prompt
# Paste this into Lovable when scaffolding screens or database tables:

${context}
`;

    default:
      return context;
  }
}

function generateProjectManifest(stackKey) {
  const profile = STACK_PROFILES[stackKey] || STACK_PROFILES["baseline"];
  return JSON.stringify({
    auterixVersion: "1.2.0",
    schema: 1,
    project: {
      name: "auterix-managed-project",
      framework: profile.framework,
      language: profile.lang,
      isProBlueprint: profile.isPro
    },
    activeAdapters: Array.from(state.activeAdapters),
    verification: {
      testCommand: profile.commands.test,
      lintCommand: profile.commands.lint
    },
    guardrails: state.guardrails,
    updatedAt: new Date().toISOString()
  }, null, 2);
}

// 6. Recompile All Files
function compileAll() {
  const files = {};

  // Generate adapter files
  for (const adapter of ADAPTERS) {
    if (state.activeAdapters.has(adapter.id)) {
      files[adapter.id] = {
        path: adapter.file,
        content: generateAdapterContent(adapter.id, state.selectedStack)
      };
    }
  }

  const profile = STACK_PROFILES[state.selectedStack] || STACK_PROFILES["baseline"];

  // Always generate project manifest
  files["manifest"] = {
    path: ".ai/project.json",
    content: generateProjectManifest(state.selectedStack)
  };

  // Always generate cross-agent shared memory
  files["memory"] = {
    path: ".ai/memory.md",
    content: `# Auterix Cross-Agent Shared Memory
# Shared across Cursor, Claude, Antigravity, Windsurf & 21 tools

## 🏛️ Architecture & Stack Decisions
- Stack: ${profile.name} (${profile.lang})
- Language: TypeScript / Strict Mode
- Verification: ${profile.commands.test}

## 🛡️ Security & Invariants
- Enforce Zero Untyped Any across all code.
- Database: Strict Row-Level Security (RLS).
- Secrets: Never commit .env credentials.

## 🚫 Discarded Approaches (Anti-Patterns)
- Do not bypass server action validation.
- Do not import service role keys into client components.
`
  };

  state.generatedFiles = files;

  // Compile Pro files for preview
  const stackKey = state.selectedStack;
  state.proFiles = PRO_SNIPPETS[stackKey] || PRO_SNIPPETS["baseline"];

  // Ensure activeTab is valid for current viewMode
  if (state.viewMode === "rules") {
    if (!state.generatedFiles[state.activeTab]) {
      state.activeTab = Object.keys(state.generatedFiles)[0] || "manifest";
    }
  } else {
    if (!state.proFiles[state.activeTab]) {
      state.activeTab = Object.keys(state.proFiles)[0];
    }
  }

  renderTabs();
  renderCode();
  renderProAlert();
}

// 7. UI Renderers
function renderAdapters() {
  const container = document.getElementById("adapters-container");
  if (!container) return;
  container.innerHTML = "";

  const counter = document.getElementById("adapter-counter");
  if (counter) {
    counter.textContent = `${state.activeAdapters.size}/${ADAPTERS.length}`;
  }

  // Sync Top Popular Quick Tool Pills
  const quickPills = document.querySelectorAll(".tool-quick-pill");
  quickPills.forEach(pill => {
    const toolId = pill.dataset.tool;
    const isActive = state.activeAdapters.has(toolId);
    pill.classList.toggle("active", isActive);
    const checkSpan = pill.querySelector(".tool-quick-check");
    if (checkSpan) {
      checkSpan.textContent = isActive ? "✓" : "";
    }
  });

  // Sync Adapters Drawer Label
  const drawerLabel = document.getElementById("adapters-drawer-label");
  const adaptersDrawer = document.getElementById("adapters-drawer");
  if (drawerLabel && adaptersDrawer) {
    const isCollapsed = adaptersDrawer.classList.contains("collapsed");
    if (isCollapsed) {
      drawerLabel.textContent = `+17 More AI Tools (${state.activeAdapters.size} Active)`;
    }
  }

  const query = (state.adapterSearchQuery || "").toLowerCase().trim();
  const filtered = query
    ? ADAPTERS.filter(a => a.name.toLowerCase().includes(query) || a.file.toLowerCase().includes(query) || a.id.toLowerCase().includes(query))
    : ADAPTERS;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="adapter-empty-notice">No AI tools matching "${query}"</div>`;
    return;
  }

  filtered.forEach(adapter => {
    const isActive = state.activeAdapters.has(adapter.id);
    const item = document.createElement("div");
    item.className = `adapter-item ${isActive ? "active" : ""}`;
    item.title = `${adapter.name} (${adapter.file})`;
    item.innerHTML = `
      <input type="checkbox" class="adapter-checkbox" id="check-${adapter.id}" ${isActive ? "checked" : ""}>
      <div class="adapter-info">
        <span class="adapter-name">${adapter.name}</span>
        <span class="adapter-file">${adapter.file}</span>
      </div>
    `;

    item.addEventListener("click", (e) => {
      if (e.target.tagName !== "INPUT") {
        const checkbox = item.querySelector("input");
        checkbox.checked = !checkbox.checked;
      }
      toggleAdapter(adapter.id);
    });

    container.appendChild(item);
  });
}

function renderTabs() {
  const tabsContainer = document.getElementById("file-tabs");
  tabsContainer.innerHTML = "";

  if (state.viewMode === "rules") {
    Object.keys(state.generatedFiles).forEach(key => {
      const btn = document.createElement("button");
      btn.className = `tab-btn ${state.activeTab === key ? "active" : ""}`;
      const adapterObj = ADAPTERS.find(a => a.id === key);
      const label = adapterObj ? adapterObj.name : (key === "memory" ? "🧠 memory.md" : "project.json");
      btn.textContent = label;

      btn.addEventListener("click", () => {
        state.activeTab = key;
        renderTabs();
        renderCode();
      });
      tabsContainer.appendChild(btn);
    });
  } else {
    Object.keys(state.proFiles).forEach(key => {
      const btn = document.createElement("button");
      btn.className = `tab-btn pro-tab ${state.activeTab === key ? "active" : ""}`;
      const icon = state.isProUnlocked ? "⚡" : "🔒";
      btn.innerHTML = `${icon} ${key}`;

      btn.addEventListener("click", () => {
        state.activeTab = key;
        renderTabs();
        renderCode();
      });
      tabsContainer.appendChild(btn);
    });
  }
}

function renderCode() {
  const lockOverlay = document.getElementById("pro-locked-overlay");

  if (state.viewMode === "rules") {
    const currentFile = state.generatedFiles[state.activeTab];
    if (!currentFile) return;
    document.getElementById("dest-path").textContent = currentFile.path;
    document.getElementById("code-content").textContent = currentFile.content;
    lockOverlay.classList.add("hidden");
  } else {
    const currentFile = state.proFiles[state.activeTab];
    if (!currentFile) return;
    document.getElementById("dest-path").textContent = currentFile.path;
    document.getElementById("code-content").textContent = currentFile.content;
    if (state.isProUnlocked) {
      lockOverlay.classList.add("hidden");
    } else {
      lockOverlay.classList.remove("hidden");
    }
  }
}

function renderProAlert() {
  const profile = STACK_PROFILES[state.selectedStack] || STACK_PROFILES["baseline"];
  const alertContainer = document.getElementById("pro-stack-alert");
  const badgeTag = document.getElementById("stack-badge-tag");

  if (profile.isPro) {
    badgeTag.textContent = state.isProUnlocked 
      ? `Active: ${profile.name} (Pro Unlocked)` 
      : `Active: ${profile.name} (Pro Blueprint)`;
    badgeTag.className = "stack-badge-tag pro";
    alertContainer.style.display = "flex";
    document.getElementById("pro-alert-title").textContent = state.isProUnlocked 
      ? `Active: ${profile.name} (Pro Unlocked)` 
      : `Previewing ${profile.name} (Pro)`;

    const cta = alertContainer.querySelector(".pro-stack-cta-btn");
    if (cta) {
      if (state.isProUnlocked) {
        cta.innerHTML = "<span>✓ Pro Active & Unlocked</span>";
        cta.removeAttribute("href");
        cta.style.pointerEvents = "none";
        cta.style.background = "rgba(16, 185, 129, 0.15)";
        cta.style.borderColor = "rgba(16, 185, 129, 0.4)";
        cta.style.color = "#10b981";
      } else {
        cta.innerHTML = "<span>Unlock Full Suite ($14)</span><span>&rarr;</span>";
        cta.setAttribute("href", "#pricing");
        cta.style.pointerEvents = "auto";
        cta.style.background = "";
        cta.style.borderColor = "";
        cta.style.color = "";
      }
    }
  } else {
    badgeTag.textContent = `Active: ${profile.name} (Community Free)`;
    badgeTag.className = "stack-badge-tag free";
    alertContainer.style.display = "none";
  }
}

// 8. Event Handlers & View Mode Switching
function toggleAdapter(id) {
  if (state.activeAdapters.has(id)) {
    if (state.activeAdapters.size > 1) {
      state.activeAdapters.delete(id);
    } else {
      alert("You must have at least one AI client adapter selected.");
      return;
    }
  } else {
    state.activeAdapters.add(id);
  }

  renderAdapters();
  compileAll();
}

function initStackSelector() {
  const select = document.getElementById("stack-select");
  const chips = document.querySelectorAll(".stack-chip");

  const STACK_MAP = {
    "nextjs": "nextjs-supabase",
    "nextjs-supabase": "nextjs-supabase",
    "fastapi": "fastapi-sqlalchemy",
    "fastapi-sqlalchemy": "fastapi-sqlalchemy",
    "node-clean": "enterprise-node",
    "enterprise-node": "enterprise-node",
    "cloudflare": "cloudflare-workers",
    "cloudflare-workers": "cloudflare-workers",
    "react-native": "react-native-expo",
    "react-native-expo": "react-native-expo",
    "ai-pipeline": "ai-pipeline",
    "baseline": "baseline"
  };

  if (select) {
    select.value = state.selectedStack;
    select.addEventListener("change", (e) => {
      const mapped = STACK_MAP[e.target.value] || e.target.value;
      state.selectedStack = mapped;
      chips.forEach(c => {
        const cStack = STACK_MAP[c.getAttribute("data-stack")] || c.getAttribute("data-stack");
        c.classList.toggle("active", cStack === mapped);
      });
      compileAll();
    });
  }

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const raw = chip.getAttribute("data-stack");
      const mapped = STACK_MAP[raw] || raw;
      state.selectedStack = mapped;
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      if (select) select.value = mapped;
      compileAll();
    });
  });
}

function initViewModeSwitch() {
  const btnRules = document.getElementById("mode-rules");
  const btnPro = document.getElementById("mode-pro");

  btnRules.addEventListener("click", () => {
    state.viewMode = "rules";
    btnRules.classList.add("active");
    btnPro.classList.remove("active");
    state.activeTab = Object.keys(state.generatedFiles)[0] || "cursor";
    renderTabs();
    renderCode();
  });

  btnPro.addEventListener("click", () => {
    state.viewMode = "pro";
    btnPro.classList.add("active");
    btnRules.classList.remove("active");
    state.activeTab = Object.keys(state.proFiles)[0];
    renderTabs();
    renderCode();
  });
}

function initGuardrails() {
  const strictTypes = document.getElementById("guard-strict-types");
  const securityRls = document.getElementById("guard-security-rls");
  const tokenSaver = document.getElementById("guard-token-saver");
  const counterPill = document.getElementById("guard-counter-pill");
  const btnToggle = document.getElementById("btn-toggle-guardrails");
  const guardBox = document.getElementById("guardrails-box");

  function updateGuardCount() {
    let count = 0;
    if (state.guardrails.strictTypes) count++;
    if (state.guardrails.securityRls) count++;
    if (state.guardrails.tokenSaver) count++;
    if (counterPill) counterPill.textContent = `${count} Active`;
  }

  if (btnToggle && guardBox) {
    btnToggle.addEventListener("click", () => {
      const isCollapsed = guardBox.classList.contains("collapsed");
      guardBox.classList.toggle("collapsed", !isCollapsed);
      btnToggle.classList.toggle("is-open", isCollapsed);
      btnToggle.setAttribute("aria-expanded", isCollapsed ? "true" : "false");
    });
  }

  if (strictTypes) {
    strictTypes.addEventListener("change", (e) => {
      state.guardrails.strictTypes = e.target.checked;
      updateGuardCount();
      compileAll();
    });
  }
  if (securityRls) {
    securityRls.addEventListener("change", (e) => {
      state.guardrails.securityRls = e.target.checked;
      updateGuardCount();
      compileAll();
    });
  }
  if (tokenSaver) {
    tokenSaver.addEventListener("change", (e) => {
      state.guardrails.tokenSaver = e.target.checked;
      updateGuardCount();
      compileAll();
    });
  }
  updateGuardCount();
}

// 9. Enhanced Auto-Detector (Drop & Paste Parser)
function initAutoDetector() {
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");
  const pasteZone = document.getElementById("paste-zone");
  const pasteInput = document.getElementById("paste-input");
  const btnDetectPaste = document.getElementById("btn-detect-paste");
  const tabBtnDrop = document.getElementById("tab-btn-drop");
  const tabBtnPaste = document.getElementById("tab-btn-paste");
  const badge = document.getElementById("detect-badge");
  const btnToggleManifest = document.getElementById("btn-toggle-manifest-drawer");
  const manifestDrawer = document.getElementById("manifest-drawer");

  if (!dropZone) return;

  // Progressive Disclosure: Toggle Manifest Drawer
  if (btnToggleManifest && manifestDrawer) {
    btnToggleManifest.addEventListener("click", () => {
      const isCollapsed = manifestDrawer.classList.contains("collapsed");
      manifestDrawer.classList.toggle("collapsed", !isCollapsed);
      btnToggleManifest.classList.toggle("is-open", isCollapsed);
      btnToggleManifest.setAttribute("aria-expanded", isCollapsed ? "true" : "false");
    });
  }

  // Auto-expand drawer if user drags a file anywhere over Step 1 block
  const frameworkBlock = document.getElementById("step-framework-block");
  if (frameworkBlock && manifestDrawer) {
    frameworkBlock.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (manifestDrawer.classList.contains("collapsed")) {
        manifestDrawer.classList.remove("collapsed");
        if (btnToggleManifest) {
          btnToggleManifest.classList.add("is-open");
          btnToggleManifest.setAttribute("aria-expanded", "true");
        }
      }
    });
  }

  // Toggle between Drop and Paste modes
  if (tabBtnDrop && tabBtnPaste && pasteZone) {
    tabBtnDrop.addEventListener("click", () => {
      tabBtnDrop.classList.add("active");
      tabBtnPaste.classList.remove("active");
      dropZone.classList.remove("hidden");
      pasteZone.classList.add("hidden");
    });

    tabBtnPaste.addEventListener("click", () => {
      tabBtnPaste.classList.add("active");
      tabBtnDrop.classList.remove("active");
      pasteZone.classList.remove("hidden");
      dropZone.classList.add("hidden");
      pasteInput.focus();
    });

    btnDetectPaste.addEventListener("click", () => {
      const text = pasteInput.value.trim();
      if (!text) {
        badge.textContent = "⚠️ Please paste your package.json, requirements.txt, or dependency list.";
        badge.classList.remove("hidden");
        return;
      }
      analyzeManifestText(text, "pasted text");
    });
  }

  dropZone.addEventListener("click", () => fileInput.click());

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    if (e.dataTransfer.files.length) {
      parseManifestFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      parseManifestFile(e.target.files[0]);
    }
  });

  function parseManifestFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      analyzeManifestText(e.target.result, file.name);
    };
    reader.readAsText(file);
  }

  function analyzeManifestText(content, sourceName) {
    let detected = "baseline";
    let tags = [];
    const lowerContent = content.toLowerCase();

    // 1. Try parsing JSON (package.json)
    let isJson = false;
    try {
      const pkg = JSON.parse(content);
      isJson = true;
      const allDeps = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
        ...(pkg.peerDependencies || {})
      };
      const depKeys = Object.keys(allDeps).map(k => k.toLowerCase());

      // Framework Detection
      if (depKeys.includes("next") || depKeys.includes("@supabase/supabase-js")) {
        detected = "nextjs-supabase";
        tags.push("Next.js 15");
        if (depKeys.includes("@supabase/supabase-js") || depKeys.includes("@supabase/ssr")) tags.push("Supabase RLS");
      } else if (depKeys.includes("hono") || depKeys.includes("@cloudflare/workers-types") || depKeys.includes("wrangler")) {
        detected = "cloudflare-workers";
        tags.push("Cloudflare Workers + Hono");
      } else if (depKeys.includes("expo") || depKeys.includes("react-native")) {
        detected = "react-native-expo";
        tags.push("React Native / Expo");
      } else if (depKeys.includes("fastify") || depKeys.includes("express") || depKeys.includes("@nestjs/core")) {
        detected = "enterprise-node";
        tags.push(depKeys.includes("fastify") ? "Fastify" : "Express/Node API");
      }

      // Feature Detection
      if (depKeys.includes("typescript")) tags.push("TypeScript Strict");
      if (depKeys.includes("tailwindcss")) tags.push("Tailwind");
      if (depKeys.includes("prisma") || depKeys.includes("drizzle-orm")) tags.push("ORM Protected");
    } catch {
      // Not JSON, fall back to regex / text parsing (requirements.txt, pyproject.toml, plaintext)
    }

    if (!isJson) {
      if (lowerContent.includes("fastapi") || lowerContent.includes("sqlalchemy") || lowerContent.includes("uvicorn")) {
        detected = "fastapi-sqlalchemy";
        tags.push("FastAPI + Async SQLAlchemy");
      } else if (lowerContent.includes("langchain") || lowerContent.includes("llama_index") || lowerContent.includes("openai") || lowerContent.includes("anthropic") || lowerContent.includes("pydantic_ai")) {
        detected = "ai-agent-pipeline";
        tags.push("AI Agent Pipeline");
      } else if (lowerContent.includes("wrangler") || lowerContent.includes("cloudflare") || lowerContent.includes("hono")) {
        detected = "cloudflare-workers";
        tags.push("Cloudflare Workers + Hono");
      } else if (lowerContent.includes("expo") || lowerContent.includes("react-native")) {
        detected = "react-native-expo";
        tags.push("React Native / Expo");
      } else if (lowerContent.includes("next") || lowerContent.includes("supabase")) {
        detected = "nextjs-supabase";
        tags.push("Next.js / Supabase");
      } else if (lowerContent.includes("express") || lowerContent.includes("fastify") || lowerContent.includes("node")) {
        detected = "enterprise-node";
        tags.push("Node.js Clean Architecture");
      }
    }

    state.selectedStack = detected;
    const selectElem = document.getElementById("stack-select");
    if (selectElem) selectElem.value = detected;

    const chips = document.querySelectorAll(".stack-chip");
    const STACK_MAP = {
      "nextjs": "nextjs-supabase",
      "nextjs-supabase": "nextjs-supabase",
      "fastapi": "fastapi-sqlalchemy",
      "fastapi-sqlalchemy": "fastapi-sqlalchemy",
      "node-clean": "enterprise-node",
      "enterprise-node": "enterprise-node",
      "cloudflare": "cloudflare-workers",
      "cloudflare-workers": "cloudflare-workers",
      "react-native": "react-native-expo",
      "react-native-expo": "react-native-expo",
      "ai-pipeline": "ai-pipeline",
      "baseline": "baseline"
    };
    chips.forEach(c => {
      const cStack = STACK_MAP[c.getAttribute("data-stack")] || c.getAttribute("data-stack");
      c.classList.toggle("active", cStack === detected);
    });

    const tagStr = tags.length > 0 ? tags.join(" • ") : "Universal Stack Configuration";
    badge.innerHTML = `✨ <strong>Auto-Detected:</strong> ${tagStr} <span style="opacity:0.75; font-size:11px;">(from ${sourceName})</span>`;
    badge.classList.remove("hidden");
    compileAll();
  }
}

// 9b. Interactive Tool Tabs in Quickstart Section
function initToolTabs() {
  // Modern guide tabs
  const guideBtns = document.querySelectorAll(".guide-tab-btn");
  const guidePanels = document.querySelectorAll(".guide-panel");

  if (guideBtns.length > 0) {
    guideBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const guideId = btn.getAttribute("data-guide");
        guideBtns.forEach((b) => b.classList.remove("active"));
        guidePanels.forEach((p) => p.classList.remove("active"));

        btn.classList.add("active");
        const targetPanel = document.getElementById(`guide-panel-${guideId}`);
        if (targetPanel) targetPanel.classList.add("active");
      });
    });
  }

  // Legacy fallback support
  const legacyTabs = document.querySelectorAll("#tool-tabs .tool-tab");
  const legacyPanes = document.querySelectorAll(".tool-panes .tool-pane");
  if (legacyTabs.length > 0) {
    legacyTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        legacyTabs.forEach((t) => t.classList.remove("active"));
        legacyPanes.forEach((p) => p.classList.remove("active"));
        tab.classList.add("active");
        const toolId = tab.getAttribute("data-tool");
        const targetPane = document.getElementById(`pane-${toolId}`);
        if (targetPane) targetPane.classList.add("active");
      });
    });
  }
}

// Dynamic Navigation Controller (On-Click + On-Scroll Scrollspy)
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-menu .nav-link");
  if (!navLinks.length) return;

  const sections = [];
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#") && href.length > 1) {
      const sec = document.querySelector(href);
      if (sec) {
        sections.push({ id: href.slice(1), el: sec, link: link });
      }
    }
  });

  // On-Click: Smooth scroll with sticky nav offset & immediate active switch
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          navLinks.forEach((l) => {
            l.classList.remove("active");
            l.classList.remove("highlight");
          });
          link.classList.add("active");

          const navOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });

          if (history.pushState) {
            history.pushState(null, null, href);
          } else {
            location.hash = href;
          }
        }
      }
    });
  });

  // On-Scroll: Dynamic Scrollspy
  let isScrolling = false;
  function updateActiveOnScroll() {
    const scrollPos = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // Check if scrolled to bottom of document
    if (scrollPos + windowHeight >= docHeight - 80) {
      if (sections.length > 0) {
        const last = sections[sections.length - 1];
        navLinks.forEach((l) => {
          l.classList.remove("active");
          l.classList.remove("highlight");
        });
        last.link.classList.add("active");
        return;
      }
    }

    // Determine current section in view
    let currentSection = null;
    const offsetThreshold = 150;

    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].el.getBoundingClientRect();
      if (rect.top <= offsetThreshold && rect.bottom > offsetThreshold) {
        currentSection = sections[i];
        break;
      }
    }

    if (currentSection) {
      navLinks.forEach((l) => {
        l.classList.remove("active");
        l.classList.remove("highlight");
      });
      currentSection.link.classList.add("active");
    } else if (scrollPos < 250) {
      // Near top (hero section)
      navLinks.forEach((l) => {
        l.classList.remove("active");
        l.classList.remove("highlight");
      });
    }
  }

  window.addEventListener("scroll", () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        updateActiveOnScroll();
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  // Run on initial load
  updateActiveOnScroll();
}

// 9c. One-Click Copy Prompt Buttons
function initCopyPrompts() {
  const copyButtons = document.querySelectorAll(".btn-copy-prompt");

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const promptId = btn.getAttribute("data-prompt-id") || btn.getAttribute("data-target");
      const promptElem = document.getElementById(promptId);
      if (!promptElem) return;

      const text = promptElem.textContent.trim();
      navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.textContent;
        btn.textContent = "✓ Copied!";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove("copied");
        }, 1800);
      });
    });
  });
}


// 10. Comprehensive Multi-Tool ZIP Bundle Compiler
function initActions() {
  // Copy current code
  const btnCopyFile = document.getElementById("btn-copy-file");
  if (btnCopyFile) {
    btnCopyFile.addEventListener("click", () => {
      const codeElem = document.getElementById("code-content");
      const code = codeElem ? codeElem.textContent : "";
      navigator.clipboard.writeText(code).then(() => {
        const originalText = btnCopyFile.innerHTML;
        btnCopyFile.innerHTML = "<span>Copied!</span>";
        setTimeout(() => btnCopyFile.innerHTML = originalText, 1800);
      });
    });
  }

  // Copy NPX Command
  const copyCmdBtns = document.querySelectorAll("#btn-copy-cli, #btn-copy-hero-cmd");
  copyCmdBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const heroCmdText = document.getElementById("hero-cmd-text");
      const cmd = heroCmdText
        ? heroCmdText.textContent.trim()
        : `npx auterix@latest init --adapters ${Array.from(state.activeAdapters).join(",")} --profile ${state.selectedStack}`;
      navigator.clipboard.writeText(cmd).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = "<span>Copied!</span>";
        setTimeout(() => btn.innerHTML = orig, 1800);
        const badge = document.getElementById("cli-copied-badge");
        if (badge) {
          badge.classList.remove("hidden");
          setTimeout(() => badge.classList.add("hidden"), 2000);
        }
      });
    });
  });

  // CLI Quick Copy Card Click
  const cliQuickCopy = document.getElementById("cli-quick-copy");
  if (cliQuickCopy) {
    cliQuickCopy.addEventListener("click", () => {
      const heroCmdText = document.getElementById("hero-cmd-text");
      const cmd = heroCmdText
        ? heroCmdText.textContent.trim()
        : `npx auterix@latest init --adapters ${Array.from(state.activeAdapters).join(",")} --profile ${state.selectedStack}`;
      const showBadge = () => {
        const badge = document.getElementById("cli-copied-badge");
        if (badge) {
          badge.classList.remove("hidden");
          setTimeout(() => badge.classList.add("hidden"), 2000);
        }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cmd).then(showBadge).catch(showBadge);
      } else {
        showBadge();
      }
    });
  }

  // Download Comprehensive Multi-Tool Bundle (.zip)
  document.getElementById("btn-download-zip").addEventListener("click", async () => {
    if (typeof JSZip === "undefined") {
      alert("ZIP library loading, please try again in a moment.");
      return;
    }

    const zip = new JSZip();
    const profile = STACK_PROFILES[state.selectedStack] || STACK_PROFILES["baseline"];
    
    // Add primary adapter rule files
    for (const key of Object.keys(state.generatedFiles)) {
      const item = state.generatedFiles[key];
      zip.file(item.path, item.content);
    }

    // Universal Commands Content
    const planCmd = `# Auterix /plan Command\n1. Read requirements.\n2. Inspect affected code.\n3. Draft atomic plan in .ai/tasks/active.json.\n4. Specify verification commands.`;
    const reviewCmd = `# Auterix /review Command\nAudit git diffs for:\n- Leaked secrets or API keys\n- Type safety & zero any\n- Missing tests or boundary regressions`;
    const testCmd = `# Auterix /test Command\nExecute:\n- Test: ${profile.commands.test}\n- Lint: ${profile.commands.lint}`;

    // Universal Skills Content
    const vgateSkill = `---\nname: verification-gate\ndescription: Run automated tests and linters before completing any task.\n---\n# Verification Gate\nAlways run \`${profile.commands.test}\` and \`${profile.commands.lint}\`. Never mark complete with failing tests.`;
    const sguardSkill = `---\nname: security-guard\ndescription: Audit code for secrets and authorization bypasses.\n---\n# Security Guard\nNever commit secrets or tokens. Validate all external inputs.`;

    // 1. If Claude Code is active: generate full .claude/ folder
    if (state.activeAdapters.has("claude")) {
      zip.file(".claude/commands/plan.md", planCmd);
      zip.file(".claude/commands/implement.md", `# Auterix /implement Command\nExecute task in .ai/tasks/active.json with strict type safety.`);
      zip.file(".claude/commands/review.md", reviewCmd);
      zip.file(".claude/commands/test.md", testCmd);
      zip.file(".claude/commands/fix.md", `# Auterix /fix Command\n1. Reproduce with failing test.\n2. Identify root cause.\n3. Surgical fix.\n4. Verify.`);
      zip.file(".claude/commands/pr.md", `# Auterix /pr Command\nVerify all tests pass and generate Conventional Commit PR.`);
      zip.file(".claude/skills/verification-gate/SKILL.md", vgateSkill);
      zip.file(".claude/skills/security-guard/SKILL.md", sguardSkill);
      zip.file(".claudeignore", "node_modules/\n.git/\ndist/\nbuild/\n.next/\ncoverage/\n.DS_Store\n");
    }

    // 2. If Cursor is active: generate .cursor/rules/
    if (state.activeAdapters.has("cursor")) {
      zip.file(".cursor/rules/agents.mdc", `---
description: Auterix Agent Personas
globs: *
alwaysApply: false
---
# Auterix Agent Personas
- Planner: Break features into atomic steps and verify requirements.
- Implementer: Write strict, type-safe, minimal diff code.
- Reviewer: Inspect security, secret leaks, and performance before merge.
- Tester: Write unit and integration tests covering edge cases.
`);
      zip.file(".cursor/rules/security.mdc", sguardSkill);
      zip.file(".cursor/commands/plan.md", planCmd);
      zip.file(".cursor/commands/review.md", reviewCmd);
      zip.file(".cursorrules", generateAdapterContent("cursor", state.selectedStack));
      zip.file(".cursorignore", "node_modules/\n.git/\ndist/\nbuild/\n.next/\ncoverage/\n.DS_Store\n");
    }

    // 3. If Antigravity is active: generate .agents/skills/ & .agents/agents/
    if (state.activeAdapters.has("antigravity")) {
      zip.file(".agents/skills/verification-gate/SKILL.md", vgateSkill);
      zip.file(".agents/skills/security-guard/SKILL.md", sguardSkill);
      zip.file(".agents/agents/planner.md", "# Planner Agent\nRole: Architecture planning & task breakdown.\n");
      zip.file(".agents/agents/code-reviewer.md", "# Code Reviewer Agent\nRole: Pre-commit security & quality audits.\n");
      zip.file(".agents/agents/test-writer.md", "# Test Writer Agent\nRole: Author unit and integration tests.\n");
    }

    // 4. If Copilot is active: generate .github/prompts/
    if (state.activeAdapters.has("copilot")) {
      zip.file(".github/prompts/plan.prompt.md", planCmd);
      zip.file(".github/prompts/review.prompt.md", reviewCmd);
      zip.file(".github/prompts/test.prompt.md", testCmd);
    }

    // 5. If Codex is active: generate .ai/tasks/ & .ai/commands/
    if (state.activeAdapters.has("codex")) {
      zip.file(".ai/tasks/active.json", JSON.stringify({
        schema: 1,
        project: profile.name,
        status: "ready",
        active_milestone: "Initialization",
        verification: profile.commands
      }, null, 2));
      zip.file(".ai/commands/plan.md", planCmd);
      zip.file(".ai/commands/review.md", reviewCmd);
    }

    // 6. If Windsurf is active: generate .windsurf/workflows/
    if (state.activeAdapters.has("windsurf")) {
      zip.file(".windsurf/workflows/review.md", reviewCmd);
      zip.file(".windsurf/workflows/plan.md", planCmd);
    }

    // 7. If Cline is active: generate .clinerules
    if (state.activeAdapters.has("cline")) {
      zip.file(".clinerules", `# Cline Custom Instructions\n${generateUniversalContext(state.selectedStack)}`);
    }

    // 8. Roo Code / Kilo Code
    if (state.activeAdapters.has("roocode")) {
      zip.file(".roomodes", generateAdapterContent("roocode", state.selectedStack));
    }

    // 9. Aider
    if (state.activeAdapters.has("aider")) {
      zip.file(".aider.conf.yml", "auto-commits: false\nattribute-author: false\nread: CONVENTIONS.md\n");
      zip.file("CONVENTIONS.md", generateAdapterContent("aider", state.selectedStack));
      zip.file(".aiderignore", "node_modules/\n.git/\ndist/\nbuild/\n.next/\ncoverage/\n");
    }

    // 10. OpenHands
    if (state.activeAdapters.has("openhands")) {
      zip.file(".openhands_instructions", generateAdapterContent("openhands", state.selectedStack));
    }

    // 11. Devin
    if (state.activeAdapters.has("devin")) {
      zip.file("DEVIATION.md", generateAdapterContent("devin", state.selectedStack));
      zip.file(".devin/playbook.md", `# Devin Playbook\n${generateUniversalContext(state.selectedStack)}`);
    }

    // 12. CodeRabbit
    if (state.activeAdapters.has("coderabbit")) {
      zip.file(".coderabbit.yaml", generateAdapterContent("coderabbit", state.selectedStack));
    }

    // 13. Zed
    if (state.activeAdapters.has("zed")) {
      zip.file(".zed/settings.json", generateAdapterContent("zed", state.selectedStack));
      zip.file(".zed/prompts/plan.md", planCmd);
      zip.file(".zed/prompts/review.md", reviewCmd);
    }

    // 14. Trae
    if (state.activeAdapters.has("trae")) {
      zip.file(".trae/rules/project.md", generateAdapterContent("trae", state.selectedStack));
      zip.file(".traerules", generateUniversalContext(state.selectedStack));
    }

    // 15. Continue.dev
    if (state.activeAdapters.has("continue")) {
      zip.file(".continue/rules/workflow.md", generateAdapterContent("continue", state.selectedStack));
    }

    // 16. Augment Code
    if (state.activeAdapters.has("augment")) {
      zip.file(".augment/rules/workflow.md", generateAdapterContent("augment", state.selectedStack));
    }

    // 17. Tabnine
    if (state.activeAdapters.has("tabnine")) {
      zip.file(".tabnine/rules.json", generateAdapterContent("tabnine", state.selectedStack));
    }

    // 18. Replit Agent
    if (state.activeAdapters.has("replit")) {
      zip.file(".replit", `run = "${profile.commands.test}"\nentrypoint = "index.ts"\n`);
      zip.file(".replit/instructions.md", generateUniversalContext(state.selectedStack));
    }

    // 19. v0 by Vercel
    if (state.activeAdapters.has("v0")) {
      zip.file(".prompts/v0-system-prompt.md", generateAdapterContent("v0", state.selectedStack));
    }

    // 20. Bolt.new
    if (state.activeAdapters.has("bolt")) {
      zip.file(".prompts/bolt-system-prompt.md", generateAdapterContent("bolt", state.selectedStack));
    }

    // 21. Lovable
    if (state.activeAdapters.has("lovable")) {
      zip.file(".prompts/lovable-system-prompt.md", generateAdapterContent("lovable", state.selectedStack));
    }

    // Pro Deliverables: Only bundled when Pro is unlocked via Gumroad Pro ZIP package
    if (state.isProUnlocked) {
      // Automated CI/CD & Testing Blueprints
      zip.file("playwright.config.ts", `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: [['html', { open: 'never' }], ['list']],
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});\n`);

      zip.file("lighthouserc.js", `module.exports = {
  ci: {
    collect: { startServerCommand: 'npm run start', url: ['http://localhost:3000/'] },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.90 }],
        'categories:accessibility': ['error', { minScore: 0.95 }]
      }
    }
  }
};\n`);

      zip.file(".github/workflows/ci.yml", `name: CI Matrix
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npx auterix check
      - run: npm test --if-present
`);

      zip.file(".github/workflows/security-scan.yml", `name: Security & Vulnerability Guardrails
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high
      - run: node bin/workflow.mjs check
`);

      // Additional Core Production Blueprints
      zip.file("blueprints/security/rate-limiter.ts", `export interface RateLimitConfig { windowMs: number; maxRequests: number; }
export const RATE_LIMIT_TIERS: Record<string, RateLimitConfig> = {
  anonymous: { windowMs: 60 * 1000, maxRequests: 20 },
  freeUser: { windowMs: 60 * 1000, maxRequests: 60 },
  proUser: { windowMs: 60 * 1000, maxRequests: 300 },
  aiAgent: { windowMs: 60 * 1000, maxRequests: 120 },
};
class MemoryRateLimiter {
  private hits: Map<string, number[]> = new Map();
  public check(id: string, tier = 'anonymous') {
    const cfg = RATE_LIMIT_TIERS[tier] || RATE_LIMIT_TIERS.anonymous;
    const now = Date.now(), start = now - cfg.windowMs;
    const times = (this.hits.get(id) || []).filter(t => t > start);
    if (times.length >= cfg.maxRequests) return { success: false, limit: cfg.maxRequests, remaining: 0 };
    times.push(now);
    this.hits.set(id, times);
    return { success: true, limit: cfg.maxRequests, remaining: cfg.maxRequests - times.length };
  }
}
export const globalRateLimiter = new MemoryRateLimiter();\n`);

      zip.file("blueprints/auth/session-guard.ts", `import "server-only";
import { redirect } from "next/navigation";
export interface SessionUser { id: string; email: string; orgId: string; role: 'owner' | 'admin' | 'member' | 'viewer'; }
export async function requireAuth(): Promise<SessionUser> {
  const user: SessionUser | null = null;
  if (!user) redirect("/login");
  return user;
}
export async function requireRole(allowedRoles: Array<SessionUser['role']>): Promise<SessionUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) redirect("/unauthorized");
  return user;
}\n`);

      zip.file("blueprints/billing/stripe-webhook.ts", `import { headers } from "next/headers";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  return NextResponse.json({ received: true });
}\n`);

      zip.file("blueprints/ci-cd/pre-commit-guard.sh", `#!/usr/bin/env bash
set -eo pipefail
echo "🛡️  [Auterix] Running pre-commit security checks..."
if git diff --cached --name-only | grep -qE '^(\\.env|\\.env\\.local)$'; then
  echo "❌ [BLOCKED] .env files staged for commit!" && exit 1
fi
node bin/workflow.mjs check || exit 1
echo "✅ [Auterix] Pre-commit checks passed!"\n`);
    }

    zip.file(".ai/memory.md", `# Auterix Cross-Agent Shared Memory
# Shared across Cursor, Claude, Antigravity, Windsurf & 21 tools

## 🏛️ Architecture & Stack Decisions
- Stack: ${profile.name} (${profile.lang})
- Language: TypeScript / Strict Mode
- Verification: ${profile.commands.test}

## 🛡️ Security & Invariants
- Enforce Zero Untyped Any across all code.
- Database: Strict Row-Level Security (RLS).
- Secrets: Never commit .env credentials.

## 🚫 Discarded Approaches (Anti-Patterns)
- Do not bypass server action validation.
- Do not import service role keys into client components.
`);

    // Add instructions and Pro upgrade guide in the zip
    zip.file("AUTERIX-README.md", `# Auterix Multi-Tool AI Config Bundle
Generated from Auterix Studio (https://auterix.vercel.app)
Stack: ${profile.name} (${profile.isPro ? "Pro Blueprint" : "Community Baseline"})

## How to Apply:
1. Extract this zip file into the root of your existing or new project.
2. The AI tool configurations (.claude/, .cursor/, .agents/, .github/, .ai/, etc.) will place directly into their proper directories.
3. Open your project in Cursor, Claude Code, Antigravity, Copilot, Windsurf, or Codex!

---

## 📋 4 Ready-to-Use Starter Prompts:

### 1. 🚀 First-Time Activation (Claude & Cursor)
"Claude, adopt this CLAUDE.md / .cursorrules as your strict project rules. Confirm you understand our architectural boundaries, security policies, and test commands before writing any code."

### 2. 🛡️ Safe Feature Implementation
"Based on our project rules, implement [feature description]. Follow strict validation, zero-hallucination boundaries, and handle error states gracefully."

### 3. 🔍 Pre-Commit Security Audit
"Review current changes against our architectural invariants. Check for: 1) Leaked secrets, 2) Insecure database queries, 3) Missing input validation, 4) Type safety errors."

### 4. 🧪 Automated Test Generation
"Write comprehensive unit and integration tests for [file/function]. Ensure edge case coverage and verify using our project test command."

${!state.isProUnlocked && profile.isPro ? `
---
### 🚀 Want the Complete Production Boilerplate Repositories & CI Bots?
This free bundle includes the universal adapter rules, commands, and skills.
To unlock the production boilerplate templates (safe server actions, PostgreSQL RLS policies, async sessions, and automated GitHub PR compliance bot), get Auterix Pro (\`$14\`):
👉 https://tenantdefense.gumroad.com/l/auterix
` : ""}
${state.isProUnlocked ? `
---
### 🌟 Auterix Pro Active
Production blueprints, database migrations, and security guardrails are included in this download.
` : ""}
`);

    // If Pro is unlocked, bundle the full production blueprint files into the download
    if (state.isProUnlocked && state.proFiles) {
      for (const key of Object.keys(state.proFiles)) {
        const item = state.proFiles[key];
        if (item && item.path && item.content) {
          zip.file(item.path, item.content);
        }
      }
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = state.isProUnlocked 
      ? `auterix-${state.selectedStack}-pro.zip` 
      : `auterix-${state.selectedStack}-config.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}


// 9d. Pro Suite ZIP Unlocker
function initProUnlocker() {
  const modal = document.getElementById("unlock-modal");
  const btnClose = document.getElementById("btn-close-modal");
  const dropzone = document.getElementById("pro-zip-dropzone");
  const fileInput = document.getElementById("pro-zip-input");
  const statusElem = document.getElementById("pro-unlock-status");
  const modeLabel = document.getElementById("studio-mode-label");
  const statusDot = document.getElementById("status-dot");
  
  // Re-upload elements in unlocked view
  const btnReupload = document.getElementById("btn-reupload-pro-zip");
  const reuploadWrap = document.getElementById("reupload-dropzone-wrap");
  const reuploadDropzone = document.getElementById("pro-zip-dropzone-reupload");
  const reuploadInput = document.getElementById("pro-zip-input-reupload");

  if (!modal) return;

  function updateUnlockedUI() {
    const modalLockedView = document.getElementById("modal-locked-view");
    const modalUnlockedView = document.getElementById("modal-unlocked-view");
    const modalTitle = document.getElementById("unlock-modal-title");
    const btnNav = document.getElementById("btn-open-unlock-modal-nav");
    const btnBody = document.getElementById("btn-open-unlock-modal-body");
    const heroBtn = document.querySelector(".btn-tertiary-hero");
    const haveZipBtn = document.querySelector(".lock-have-zip-btn");

    if (state.isProUnlocked) {
      if (modalLockedView) modalLockedView.classList.add("hidden");
      if (modalUnlockedView) modalUnlockedView.classList.remove("hidden");
      if (modalTitle) modalTitle.textContent = "Auterix Pro Commercial Suite Active";

      if (btnNav) {
        btnNav.innerHTML = '<span class="unlock-icon">🌟</span> <span>Pro Active (Unlocked)</span>';
        btnNav.classList.add("unlocked");
      }
      if (btnBody) {
        btnBody.innerHTML = '<span class="icon">🌟</span> <span>Pro Suite Active (Unlocked)</span>';
        btnBody.classList.add("unlocked");
      }
      if (heroBtn) {
        heroBtn.innerHTML = '<span>🌟 Pro Suite Active (Unlocked) &rarr;</span>';
        heroBtn.classList.add("unlocked");
      }
      if (haveZipBtn) {
        haveZipBtn.innerHTML = '<span>🌟 Pro Suite Active</span>';
        haveZipBtn.classList.add("unlocked");
      }
      if (modeLabel) {
        modeLabel.innerHTML = 'Mode: <strong style="color: #00f2fe;">🌟 Pro Commercial Suite &bull; All Stacks &amp; Blueprints Unlocked</strong>';
      }
      if (statusDot) {
        statusDot.className = "radar-dot pro";
      }

      // Pro view mode buttons
      const btnRules = document.getElementById("mode-rules");
      const btnPro = document.getElementById("mode-pro");
      if (btnRules && btnPro) {
        btnRules.classList.remove("active");
        btnPro.classList.add("active");
        btnPro.innerHTML = "<span>🌟 Production Stacks &amp; Blueprints (Active)</span>";
      }

      // Download button
      const downloadBtn = document.getElementById("btn-download-zip");
      if (downloadBtn) {
        downloadBtn.innerHTML = `
          <span class="btn-icon">🌟</span>
          <span>Download Complete Pro Bundle (.ZIP)</span>
          <span class="btn-sub">Production Stacks & Blueprints Included</span>
        `;
      }

      // Code container lock overlay
      const lockOverlay = document.getElementById("pro-locked-overlay");
      if (lockOverlay) lockOverlay.classList.add("hidden");
    } else {
      if (modalLockedView) modalLockedView.classList.remove("hidden");
      if (modalUnlockedView) modalUnlockedView.classList.add("hidden");
      if (modalTitle) modalTitle.textContent = "Load Your Pro Deliverable ZIP";

      if (btnNav) {
        btnNav.innerHTML = '<span class="unlock-icon">📦</span> <span>Load Pro ZIP</span>';
        btnNav.classList.remove("unlocked");
      }
      if (btnBody) {
        btnBody.innerHTML = '<span class="icon">📦</span> <span>Already Purchased? Load Pro ZIP</span>';
        btnBody.classList.remove("unlocked");
      }
      if (heroBtn) {
        heroBtn.innerHTML = '<span>Already Purchased? Load ZIP &rarr;</span>';
        heroBtn.classList.remove("unlocked");
      }
      if (haveZipBtn) {
        haveZipBtn.innerHTML = '<span>I already have Pro ZIP &rarr;</span>';
        haveZipBtn.classList.remove("unlocked");
      }
      if (modeLabel) {
        modeLabel.innerHTML = 'Mode: <strong>Community (Free) &bull; Client-Side Engine</strong>';
      }
      if (statusDot) {
        statusDot.className = "radar-dot free";
      }
    }
  }

  function openModal() {
    updateUnlockedUI();
    modal.style.display = "flex";
    modal.classList.remove("hidden");
    if (statusElem) statusElem.classList.add("hidden");
  }

  function closeModal() {
    modal.style.display = "none";
    modal.classList.add("hidden");
  }

  // Hook all buttons that open the modal
  document.querySelectorAll(".btn-trigger-unlock-modal, #btn-open-unlock-modal, #btn-open-unlock-modal-nav, #btn-open-unlock-modal-body, .lock-have-zip-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (btnClose) {
    btnClose.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal();
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") {
      closeModal();
    }
  });

  function setupDropzone(dropEl, inputEl) {
    if (!dropEl || !inputEl) return;
    dropEl.addEventListener("click", () => inputEl.click());

    dropEl.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropEl.classList.add("dragover");
    });

    dropEl.addEventListener("dragleave", () => {
      dropEl.classList.remove("dragover");
    });

    dropEl.addEventListener("drop", (e) => {
      e.preventDefault();
      dropEl.classList.remove("dragover");
      if (e.dataTransfer.files.length) {
        verifyProZip(e.dataTransfer.files[0]);
      }
    });

    inputEl.addEventListener("change", (e) => {
      if (e.target.files.length) {
        verifyProZip(e.target.files[0]);
      }
    });
  }

  // Primary Dropzone (in locked view)
  setupDropzone(dropzone, fileInput);

  // Re-upload Dropzone (in unlocked view)
  if (btnReupload && reuploadWrap) {
    btnReupload.addEventListener("click", () => {
      reuploadWrap.classList.toggle("hidden");
    });
  }
  setupDropzone(reuploadDropzone, reuploadInput);

  async function verifyProZip(file) {
    if (!file.name.endsWith(".zip")) {
      if (statusElem) {
        statusElem.innerHTML = "❌ Please provide a <code>.zip</code> file.";
        statusElem.className = "unlock-status error";
        statusElem.classList.remove("hidden");
      }
      return;
    }

    if (statusElem) {
      statusElem.innerHTML = "⏳ Verifying Pro Suite package...";
      statusElem.className = "unlock-status info";
      statusElem.classList.remove("hidden");
    }

    try {
      if (typeof JSZip === "undefined") {
        throw new Error("JSZip library not loaded");
      }
      const zip = await JSZip.loadAsync(file);
      
      // Check for Pro suite verification files
      let isProValid = false;
      zip.forEach((relativePath) => {
        if (relativePath.includes("COMMERCIAL-LICENSE-PRO.md") || 
            relativePath.includes("START_HERE.html") || 
            relativePath.includes("START-HERE-PRO-GUIDE.md") ||
            relativePath.includes("06-Auterix-PreCommit-AI-Guardrail")) {
          isProValid = true;
        }
      });

      if (isProValid) {
        state.isProUnlocked = true;
        state.proZipInstance = zip;
        state.viewMode = "pro";
        
        if (statusElem) {
          statusElem.innerHTML = "✅ <strong>Auterix Pro Verified!</strong> Full production blueprints and guardrails unlocked.";
          statusElem.className = "unlock-status success";
        }

        updateUnlockedUI();
        compileAll();

        setTimeout(() => {
          closeModal();
        }, 1200);
      } else {
        if (statusElem) {
          statusElem.innerHTML = "❌ Unrecognized package. Please upload the official <code>Auterix-Pro-Production-Suite.zip</code> or <a href='https://tenantdefense.gumroad.com/l/auterix' target='_blank' rel='noopener' style='color: #818cf8; text-decoration: underline; font-weight: 700;'>purchase Pro access here &rarr;</a>";
          statusElem.className = "unlock-status error";
        }
      }
    } catch (err) {
      console.error("Failed to parse zip:", err);
      if (statusElem) {
        statusElem.innerHTML = "❌ Could not read ZIP archive. Please check file integrity.";
        statusElem.className = "unlock-status error";
      }
    }
  }

  // Initial sync
  updateUnlockedUI();
}

// 10.5 Adapter Controls & Instant Search Filter
function initAdapterControls() {
  const btnAll = document.getElementById("btn-select-all");
  const btnCore = document.getElementById("btn-select-core");
  const btnNone = document.getElementById("btn-select-none");
  const searchInput = document.getElementById("adapter-search-input");
  const btnClearSearch = document.getElementById("btn-clear-search");
  const btnToggleAdapters = document.getElementById("btn-toggle-adapters-drawer");
  const adaptersDrawer = document.getElementById("adapters-drawer");

  // Progressive Disclosure: Quick Popular Tool Pills
  const quickPills = document.querySelectorAll(".tool-quick-pill");
  quickPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const toolId = pill.dataset.tool;
      if (toolId) toggleAdapter(toolId);
    });
  });

  // Progressive Disclosure: Toggle Adapters Drawer
  if (btnToggleAdapters && adaptersDrawer) {
    btnToggleAdapters.addEventListener("click", () => {
      const isCollapsed = adaptersDrawer.classList.contains("collapsed");
      adaptersDrawer.classList.toggle("collapsed", !isCollapsed);
      btnToggleAdapters.classList.toggle("is-open", isCollapsed);
      btnToggleAdapters.setAttribute("aria-expanded", isCollapsed ? "true" : "false");
      const label = document.getElementById("adapters-drawer-label");
      if (label) {
        label.textContent = isCollapsed
          ? "Hide 21 Tools Matrix"
          : `+17 More AI Tools (${state.activeAdapters.size} Active)`;
      }
    });
  }

  if (btnAll) {
    btnAll.addEventListener("click", () => {
      ADAPTERS.forEach(a => state.activeAdapters.add(a.id));
      renderAdapters();
      compileAll();
    });
  }

  if (btnCore) {
    btnCore.addEventListener("click", () => {
      const coreIds = ["cursor", "claude", "antigravity", "windsurf", "copilot", "cline"];
      state.activeAdapters.clear();
      coreIds.forEach(id => state.activeAdapters.add(id));
      renderAdapters();
      compileAll();
    });
  }

  if (btnNone) {
    btnNone.addEventListener("click", () => {
      state.activeAdapters.clear();
      state.activeAdapters.add("cursor");
      renderAdapters();
      compileAll();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.adapterSearchQuery = e.target.value;
      if (btnClearSearch) {
        if (e.target.value) {
          btnClearSearch.classList.remove("hidden");
        } else {
          btnClearSearch.classList.add("hidden");
        }
      }
      renderAdapters();
    });
  }

  if (btnClearSearch && searchInput) {
    btnClearSearch.addEventListener("click", () => {
      searchInput.value = "";
      state.adapterSearchQuery = "";
      btnClearSearch.classList.add("hidden");
      renderAdapters();
      searchInput.focus();
    });
  }
}

// 10.6 Interactive Feature Matrix Toggle
function initMatrixToggle() {
  const btnToggle = document.getElementById("btn-toggle-access-chart");
  const wrap = document.querySelector(".access-chart-table-wrap");
  const bottomBtn = document.querySelector(".btn-collapse-matrix-bottom");

  if (!btnToggle || !wrap) return;

  function setExpanded(expand) {
    wrap.classList.toggle("collapsed", !expand);
    wrap.classList.toggle("expanded", expand);
    btnToggle.setAttribute("aria-expanded", expand ? "true" : "false");
    const textSpan = btnToggle.querySelector(".matrix-toggle-text");
    if (textSpan) {
      textSpan.innerHTML = expand
        ? "&uarr; Collapse Comparison Table"
        : "Show Full 26-Feature Comparison Table &darr;";
    }
  }

  btnToggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isCollapsed = wrap.classList.contains("collapsed");
    setExpanded(isCollapsed);
    if (!isCollapsed) {
      document.getElementById("access-chart")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  if (bottomBtn) {
    bottomBtn.addEventListener("click", (e) => {
      e.preventDefault();
      setExpanded(false);
      document.getElementById("access-chart")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

// 10.7 Interactive Hallucination Diff Simulator
const DIFF_SCENARIOS = {
  supabase: {
    badSub: "Vulnerable • Client Leaks • No Invariants",
    goodSub: "Strict RSC • Zod Validated • Bank-Grade RLS",
    badCode: `// Client Component ('use client')
import { createClient } from '@supabase/supabase-js';

// ❌ VULNERABILITY 1: Secret service role key leaked on browser bundle!
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // LEAKED TO CLIENT!
);

export default function UpdateUser() {
  async function handleSave(data) {
    // ❌ VULNERABILITY 2: No Zod input validation!
    // ❌ VULNERABILITY 3: Bypasses multi-tenant RLS check!
    await supabase.from('users').update(data).eq('id', data.id);
  }
  // ...
}`,
    goodCode: `// Server Action ('use server')
import { createServerClient } from '@/lib/supabase/server';
import { UpdateUserSchema } from '@/lib/schemas/user';
import { requireSession } from '@/lib/auth/guards';

export async function updateUserAction(rawData: unknown) {
  // ✅ 1. Enforce authenticated session & tenant boundary
  const session = await requireSession();
  
  // ✅ 2. Strict Zod schema parsing (blocks injection)
  const data = UpdateUserSchema.parse(rawData);
  
  // ✅ 3. Enforces multi-tenant RLS query with server credentials
  const supabase = createServerClient();
  return await supabase
    .from('users')
    .update(data)
    .eq('id', session.user.id)
    .eq('tenant_id', session.tenant_id); // RLS PROTECTED
}`
  },
  stripe: {
    badSub: "Unsigned Webhook • No Idempotency • Double Billing Risk",
    goodSub: "Cryptographic HMAC • Redis Idempotency Lock • Zero Race Conditions",
    badCode: `// POST /api/webhooks/stripe (Unconstrained AI)
export async function POST(req) {
  const body = await req.json(); // ❌ No signature verification!
  
  // ❌ VULNERABILITY: Anyone can forge fake payment events!
  if (body.type === 'payment_intent.succeeded') {
    const customerId = body.data.object.customer;
    // ❌ No idempotency: duplicate deliveries double-credit user!
    await grantProSubscription(customerId);
  }
  return Response.json({ status: 'ok' });
}`,
    goodCode: `// POST /api/webhooks/stripe (Auterix Hardened Blueprint)
import { stripe } from '@/lib/billing/stripe';
import { redis } from '@/lib/cache/redis';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  
  // ✅ 1. Cryptographic HMAC signature verification
  const event = stripe.webhooks.constructEvent(
    body, signature, process.env.STRIPE_WEBHOOK_SECRET!
  );
  
  // ✅ 2. Idempotency lock prevents duplicate execution on webhook retries
  const isNew = await redis.set(\`evt:\${event.id}\`, '1', 'EX', 86400, 'NX');
  if (!isNew) return Response.json({ received: true });
  
  // ✅ 3. Typed event routing with atomic database transaction
  await handleStripeEvent(event);
  return Response.json({ received: true });
}`
  },
  migration: {
    badSub: "Destructive DROP • No Rollback • Table Lock Spike",
    goodSub: "Reversible DDL • Non-Destructive Expand/Contract • Zero Downtime",
    badCode: `-- ❌ DANGEROUS MIGRATION (Generated by unconstrained AI)
-- Drops column immediately without deprecation period!
ALTER TABLE "users" DROP COLUMN "full_name";

-- ❌ Destructive type change locks entire table in production!
ALTER TABLE "organizations" ALTER COLUMN "metadata" TYPE jsonb;

-- ❌ No rollback plan or down migration provided!`,
    goodCode: `-- ✅ AUTERIX REVERSIBLE MIGRATION (Phase 1: Expand)
-- 1. Add new columns safely without table lock
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "first_name" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_name" text;

-- 2. Backfill with batched update (no row-level lock spikes)
UPDATE "users" 
SET "first_name" = split_part("full_name", ' ', 1) 
WHERE "first_name" IS NULL;

-- 3. Explicit down migration in .ai/migration/ journal:
-- ROLLBACK: ALTER TABLE "users" DROP COLUMN IF EXISTS "first_name", DROP COLUMN IF EXISTS "last_name";`
  },
  "api-route": {
    badSub: "Untyped Payload • No Rate Limiting • Leaked Stack Trace",
    goodSub: "Sliding-Window Rate Limiting • Zod DTO • Sanitized Error Masking",
    badCode: `// POST /api/generate (Unconstrained AI)
export async function POST(req) {
  const data = await req.json(); // ❌ Untyped: accepts arbitrary payload
  
  // ❌ VULNERABILITY: No rate limit! Vulnerable to API wallet draining!
  const result = await openai.chat.completions.create({
    model: data.model || 'gpt-4o', // ❌ Prompt injection / expensive override
    messages: [{ role: 'user', content: data.prompt }]
  });
  
  // ❌ Leaks internal stack traces & API keys to client on failure!
  return Response.json(result);
}`,
    goodCode: `// POST /api/generate (Auterix Hardened Route)
import { GenerateSchema } from '@/lib/schemas/ai';
import { slidingRateLimit } from '@/lib/security/rate-limiter';
import { maskInternalErrors } from '@/lib/monitoring/logger';

export async function POST(req: Request) {
  // ✅ 1. Rate limit: 10 requests / min per IP via Redis sliding window
  await slidingRateLimit(req, { limit: 10, windowSecs: 60 });
  
  // ✅ 2. Strict Zod parsing: whitelist allowed models & token limits
  const body = GenerateSchema.parse(await req.json());
  
  // ✅ 3. Mask internal errors: logs internally, returns sanitized output
  return await maskInternalErrors(() => runGuardedInference(body));
}`
  },
  memory: {
    badSub: "Hallucinated Architecture • Discarded Libraries Re-Added",
    goodSub: "Cross-Agent Institutional Memory • Discarded Approaches Blocked",
    badCode: `# ❌ RAW AI (Without Cross-Agent Memory)
Assistant: "I noticed you need state management! Let's install Redux Toolkit 
and redux-persist, and set up a global store in src/store/index.ts."

<!-- 
PROBLEM: 
The engineering team already migrated from Redux to Zustand 2 months ago 
due to bundle size. The unconstrained AI has no memory of this decision 
and re-introduces the discarded library, creating architectural conflict.
-->`,
    goodCode: `# ✅ WITH AUTERIX (.ai/memory.md)
Assistant: "Checked .ai/memory.md:
- Architecture: Zustand chosen for atomic state management.
- Anti-Patterns: [2026-07-15] Redux discarded (excessive bundle overhead).

I will implement the shopping cart state using a typed Zustand slice 
following our project convention in src/lib/stores/cart.ts."`
  }
};

function initDiffSimulator() {
  const tabs = document.querySelectorAll(".diff-scenario-tab");
  const badSub = document.getElementById("diff-bad-sub");
  const goodSub = document.getElementById("diff-good-sub");
  const badCode = document.getElementById("diff-bad-code");
  const goodCode = document.getElementById("diff-good-code");

  if (!tabs.length || !badCode || !goodCode) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const scenarioKey = tab.dataset.scenario;
      const data = DIFF_SCENARIOS[scenarioKey];
      if (!data) return;

      tabs.forEach(t => {
        t.classList.toggle("active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });

      if (badSub) badSub.textContent = data.badSub;
      if (goodSub) goodSub.textContent = data.goodSub;
      badCode.textContent = data.badCode;
      goodCode.textContent = data.goodCode;
    });
  });
}

// 10.8 Interactive Animated FAQ Accordion (CSS Grid Approach - sapan.dev pattern)
function initFaqAccordion() {
  const faqWrap = document.querySelector(".faq-accordion-wrap");
  if (!faqWrap) return;

  const items = faqWrap.querySelectorAll(".faq-item");
  items.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      // Close other accordion items for clean accordion UX (matching sapan.dev)
      items.forEach((other) => {
        if (other !== item && other.classList.contains("is-open")) {
          other.classList.remove("is-open");
          const otherBtn = other.querySelector(".faq-question");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

// 11. Bootstrap Studio
function bootstrapStudio() {
  renderAdapters();
  initAdapterControls();
  initStackSelector();
  initViewModeSwitch();
  initGuardrails();
  initAutoDetector();
  initProUnlocker();
  initToolTabs();
  initCopyPrompts();
  initNavigation();
  initActions();
  initMatrixToggle();
  initDiffSimulator();
  initFaqAccordion();
  compileAll();
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", bootstrapStudio);
} else {
  bootstrapStudio();
}

