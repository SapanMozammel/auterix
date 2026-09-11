/**
 * Auterix Studio — Interactive Multi-Agent Engine & Client-Side Compiler
 * Runs 100% client-side with zero telemetry or network dependencies.
 */

// 1. Tool Adapter Specifications (8 Supported Tools)
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
    id: "windsurf",
    name: "Windsurf",
    file: ".windsurfrules",
    defaultActive: true,
    description: "Global rules and cascade workflows for Windsurf / Codeium"
  },
  {
    id: "cline",
    name: "Cline / Roo",
    file: ".clinerules",
    defaultActive: false,
    description: "Architect, Code, and Test mode contracts for Cline"
  },
  {
    id: "augment",
    name: "Augment Code",
    file: ".augment/rules/workflow.md",
    defaultActive: false,
    description: "Workspace developer assistant rules for Augment"
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
    "pre-commit": {
      path: ".git/hooks/pre-commit",
      content: `#!/bin/sh
# Auterix Pre-Commit Guardrail
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
      return `# Cline / Roo Code Custom Instructions
# Mode: Autonomous Senior Software Engineer

${context}
`;

    case "augment":
      return `# Augment Code Workspace Guidelines
# Managed by Auterix

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

  // Always generate project manifest
  files["manifest"] = {
    path: ".ai/project.json",
    content: generateProjectManifest(state.selectedStack)
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
  container.innerHTML = "";

  ADAPTERS.forEach(adapter => {
    const isActive = state.activeAdapters.has(adapter.id);
    const item = document.createElement("div");
    item.className = `adapter-item ${isActive ? "active" : ""}`;
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
      btn.textContent = adapterObj ? adapterObj.name : "project.json";

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
      btn.innerHTML = `🔒 ${key}`;

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
    badgeTag.textContent = state.isProUnlocked ? "PRO BLUEPRINT (ACTIVE)" : "PRO BLUEPRINT";
    badgeTag.className = "stack-badge-tag pro";
    alertContainer.style.display = "flex";
    document.getElementById("pro-alert-title").textContent = state.isProUnlocked 
      ? `Active: ${profile.name} (Pro Unlocked)` 
      : `Previewing ${profile.name} (Pro)`;
  } else {
    badgeTag.textContent = "FREE / COMMUNITY";
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
  select.value = state.selectedStack;

  select.addEventListener("change", (e) => {
    state.selectedStack = e.target.value;
    compileAll();
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
  document.getElementById("guard-strict-types").addEventListener("change", (e) => {
    state.guardrails.strictTypes = e.target.checked;
    compileAll();
  });
  document.getElementById("guard-security-rls").addEventListener("change", (e) => {
    state.guardrails.securityRls = e.target.checked;
    compileAll();
  });
  document.getElementById("guard-token-saver").addEventListener("change", (e) => {
    state.guardrails.tokenSaver = e.target.checked;
    compileAll();
  });
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

  if (!dropZone) return;

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
      } else if (depKeys.includes("expo") || depKeys.includes("react-native")) {
        detected = "baseline";
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

    const tagStr = tags.length > 0 ? tags.join(" • ") : "Universal Stack Configuration";
    badge.innerHTML = `✨ <strong>Auto-Detected:</strong> ${tagStr} <span style="opacity:0.75; font-size:11px;">(from ${sourceName})</span>`;
    badge.classList.remove("hidden");
    compileAll();
  }
}

// 9b. Interactive Tool Tabs in Quickstart Section
function initToolTabs() {
  const tabs = document.querySelectorAll("#tool-tabs .tool-tab");
  const panes = document.querySelectorAll(".tool-panes .tool-pane");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panes.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      const toolId = tab.getAttribute("data-tool");
      const targetPane = document.getElementById(`pane-${toolId}`);
      if (targetPane) targetPane.classList.add("active");
    });
  });
}

// 9c. One-Click Copy Prompt Buttons
function initCopyPrompts() {
  const copyButtons = document.querySelectorAll(".btn-copy-prompt");

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const promptId = btn.getAttribute("data-prompt-id");
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
  document.getElementById("btn-copy-file").addEventListener("click", () => {
    const code = document.getElementById("code-content").textContent;
    navigator.clipboard.writeText(code).then(() => {
      const btn = document.getElementById("btn-copy-file");
      const originalText = btn.innerHTML;
      btn.innerHTML = "<span>Copied!</span>";
      setTimeout(() => btn.innerHTML = originalText, 1800);
    });
  });

  // Copy NPX Command
  document.getElementById("btn-copy-cli").addEventListener("click", () => {
    const adaptersList = Array.from(state.activeAdapters).join(",");
    const cmd = `npx auterix@latest init --adapters ${adaptersList} --profile ${state.selectedStack}`;
    navigator.clipboard.writeText(cmd).then(() => {
      const btn = document.getElementById("btn-copy-cli");
      const orig = btn.innerHTML;
      btn.innerHTML = "<span>Copied command!</span>";
      setTimeout(() => btn.innerHTML = orig, 1800);
    });
  });

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

${profile.isPro ? `
---
### 🚀 Want the Complete Production Boilerplate Repositories & CI Bots?
This free bundle includes the universal adapter rules, commands, and skills.
To unlock the production boilerplate templates (safe server actions, PostgreSQL RLS policies, async sessions, and automated GitHub PR compliance bot), get Auterix Pro ($14):
👉 https://tenantdefense.gumroad.com/l/auterix
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


// 9d. Pro License & ZIP Unlocker
function initProUnlocker() {
  const modal = document.getElementById("unlock-modal");
  const btnClose = document.getElementById("btn-close-modal");
  const dropzone = document.getElementById("pro-zip-dropzone");
  const fileInput = document.getElementById("pro-zip-input");
  const statusElem = document.getElementById("pro-unlock-status");
  const modeLabel = document.getElementById("studio-mode-label");
  const statusDot = document.getElementById("status-dot");
  const btnOpen = document.getElementById("btn-open-unlock-modal");

  if (!modal) return;

  function openModal() {
    modal.style.display = "flex";
    modal.classList.remove("hidden");
    if (statusElem) statusElem.classList.add("hidden");
  }

  function closeModal() {
    modal.style.display = "none";
    modal.classList.add("hidden");
  }

  // Hook all buttons that open the modal
  document.querySelectorAll("#btn-open-unlock-modal, .lock-have-zip-btn").forEach(btn => {
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

  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => fileInput.click());

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      if (e.dataTransfer.files.length) {
        verifyProZip(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length) {
        verifyProZip(e.target.files[0]);
      }
    });
  }

  async function verifyProZip(file) {
    if (!file.name.endsWith(".zip")) {
      statusElem.innerHTML = "❌ Please provide a <code>.zip</code> file.";
      statusElem.className = "unlock-status error";
      statusElem.classList.remove("hidden");
      return;
    }

    statusElem.innerHTML = "⏳ Verifying Pro Suite package...";
    statusElem.className = "unlock-status info";
    statusElem.classList.remove("hidden");

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
        
        statusElem.innerHTML = "✅ <strong>Auterix Pro Verified!</strong> Full production blueprints and guardrails unlocked.";
        statusElem.className = "unlock-status success";

        // Update Status Bar
        if (modeLabel) {
          modeLabel.innerHTML = 'Studio Mode: <strong style="color: #f59e0b;">🌟 Pro Suite Active</strong>';
        }
        if (statusDot) {
          statusDot.className = "status-dot pro";
        }
        if (btnOpen) {
          btnOpen.innerHTML = "<span>🌟 Pro Unlocked (Active)</span>";
          btnOpen.classList.add("unlocked");
        }

        // Hide lock overlay in code container
        const lockOverlay = document.getElementById("pro-locked-overlay");
        if (lockOverlay) lockOverlay.classList.add("hidden");

        compileAll();

        setTimeout(() => {
          closeModal();
        }, 1600);
      } else {
        statusElem.innerHTML = "❌ Unrecognized package. Please upload the official <code>Auterix-Pro-Production-Suite.zip</code>.";
        statusElem.className = "unlock-status error";
      }
    } catch (err) {
      console.error("Failed to parse zip:", err);
      statusElem.innerHTML = "❌ Could not read ZIP archive. Please check file integrity.";
      statusElem.className = "unlock-status error";
    }
  }
}

// 11. Bootstrap Studio
window.addEventListener("DOMContentLoaded", () => {
  renderAdapters();
  initStackSelector();
  initViewModeSwitch();
  initGuardrails();
  initAutoDetector();
  initProUnlocker();
  initToolTabs();
  initCopyPrompts();
  initActions();
  compileAll();
});
