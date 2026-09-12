# Auterix

**One workflow across 21 native AI tools. Universal agent standard.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D22-brightgreen)](package.json)
[![Tests: 90 Passing](https://img.shields.io/badge/Tests-90%20Passing-emerald)](test/)
[![npm version](https://img.shields.io/npm/v/auterix.svg?color=cb3837)](https://www.npmjs.com/package/auterix)
[![Open VSX](https://img.shields.io/open-vsx/v/auterix/auterix-workflow.svg?color=purple)](https://open-vsx.org/extension/auterix/auterix-workflow)
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/auterix.auterix-workflow.svg?color=blue)](https://marketplace.visualstudio.com/items?itemName=auterix.auterix-workflow)
[![Studio: Vercel](https://img.shields.io/badge/Web%20Studio-auterix.vercel.app-sky)](https://auterix.vercel.app)
[![Get Auterix Pro](https://img.shields.io/badge/Pro%20Suite-%2414%20Instant%20Access-orange)](https://tenantdefense.gumroad.com/l/auterix)

Auterix is a deterministic, tool-neutral autonomous context protocol and multi-agent engineering workflow. Projects define shared architectural invariants, task lifecycles, and verification gates once, while Auterix compiles, verifies, and locks them natively across **21 modern AI coding assistants and platforms** — including Cursor, Claude Code, Google Antigravity, Windsurf, GitHub Copilot, Devin, Aider, OpenHands, Cline, Roo Code, CodeRabbit, Zed, Trae, and more.

> 📖 **[Explore the Documentation Hub (docs/)](docs/README.md)** | **[60-Second Quickstart](docs/quickstart.md)** | **[Free vs. Pro vs. Agency Guide](docs/free-vs-pro.md)**  
> ⚡ **Live Web Studio:** Configure, auto-detect your stack, test hallucination diffs, and export unified AI configs visually at **[auterix.vercel.app](https://auterix.vercel.app)**.  
> 📦 **Commercial Pro Suite:** Production stacks, runnable templates, pre-commit AI guardrails, turnkey PR review bots, and 6 specialized role personas available at **[Gumroad (`$14`)](https://tenantdefense.gumroad.com/l/auterix)**.

---

## ⚡ What Makes Auterix Different?

| Challenge with Raw Prompts / Rules | How Auterix Solves It |
| :--- | :--- |
| **Tool Fragmentation:** Maintaining separate `.cursorrules`, `CLAUDE.md`, and `.agents/` leads to out-of-sync rules. | **Single Canonical Source:** Auterix synchronizes all 21 client adapters with zero drift. |
| **Silent Regressions:** AI claims "task done" without running tests or verifying constraints. | **Deterministic Verification:** Staged writer guards, content-addressed hash locks, and pre-commit checks. |
| **Context Window Rot:** Massive prompt files cause LLM attention degradation and blow token budgets. | **Progressive Disclosure:** Hierarchical 3-tiered context loading (Core Invariants ➔ Stack Blueprints ➔ Task Contracts). |
| **Lost Chat State:** Switching between Cursor (inline) and Claude/Antigravity (deep refactoring) resets progress. | **Cross-Agent Task Contracts & Shared Memory:** Formal state machine & `.ai/memory.md` persist institutional decisions across models. |
| **Architectural Drift:** Team members merge unconstrained AI code that violates database RLS or leaks secrets. | **Turnkey CI Compliance:** Headless GitHub Actions & PR bots audit rules and block non-compliant diffs in <1.5s. |

---

## 🩺 AI Readiness Scorecard (`npx auterix doctor`)

Scan any repository and receive a scored diagnostic report (0–100%) checking 8 core AI safety dimensions with actionable fix commands:

```
┌──────────────────────────────────────────────────┐
│  🏥  AUTERIX DOCTOR — AI Readiness Report        │
├──────────────────────────────────────────────────┤
│  ✅ Adapter Sync ..................... 12.5 / 12.5│
│  ✅ Schema Distillation .............. 12.5 / 12.5│
│  ✅ Memory File ...................... 12.5 / 12.5│
│  ✅ Pre-Commit Hook .................. 12.5 / 12.5│
│  ✅ Protected Boundaries ............. 12.5 / 12.5│
│  ✅ Task Tracking .................... 12.5 / 12.5│
│  ✅ Secret Leak Scan ................. 12.5 / 12.5│
│  ✅ Roles Defined .................... 12.5 / 12.5│
├──────────────────────────────────────────────────┤
│  SCORE: 100 / 100  EXCELLENT                     │
└──────────────────────────────────────────────────┘
```

Run in any project:
```sh
npx auterix doctor
```
Or export as structured JSON for CI pipelines:
```sh
npx auterix doctor --out report.json
```

---

## 🎭 Modular Role Personas (`.ai/roles/`)

Instead of bloated monolithic prompts that confuse LLMs, Auterix generates focused, modular role personas:

* **`architect.md`**: System topology, high-level design, database schema invariants, boundary enforcement.
* **`engineer.md`**: Idiomatic, typed implementation adhering strictly to project architectural rules.
* **`reviewer.md`**: Rigorous PR auditing, vulnerability detection, and invariant compliance checks.
* **`verifier.md`**: End-to-end acceptance testing, regression suites, and proof-of-correctness.

*(Pro Suite unlocks 6 additional specialized roles: Security Auditor, Database Architect, QA Engineer, API Designer, Performance Engineer, and DevOps Engineer).*

---

## 🧠 Cross-Agent Shared Memory & Git Hooks

Keep institutional memory intact across Cursor, Claude, Antigravity, and Windsurf so discarded libraries and bad patterns are never re-introduced.

### 1. Automatic Post-Commit Ingestion
Simply add `--ai-note <category>` to any git commit message:
```sh
git commit -m "Migrate from Redux to Zustand --ai-note architecture"
git commit -m "Sanitize user inputs before DB queries --ai-note security"
```
The installed Git post-commit hook automatically appends the decision, category, author, and timestamp into `.ai/memory.md`.

### 2. Manual CLI Logging
```sh
npx auterix memory --category architecture --note "We use Drizzle ORM + pgvector for RAG"
npx auterix memory --category anti-patterns --note "Do not use client-side Supabase service role keys"
```

---

## 🛡️ Rich CI Compliance Reports (`action.yml`)

Add turnkey AI rule compliance audits to your GitHub PRs at **`$0.00` compute cost**. Auterix formats rich Markdown tables directly into `$GITHUB_STEP_SUMMARY`:

```yaml
- name: Auterix AI Workflow Audit
  uses: SapanMozammel/auterix@main
```

### Pull Request Summary Output:
| Check | Status | Details |
| :--- | :--- | :--- |
| **SHA-256 Integrity** | ✅ Pass | 21 managed files verified |
| **Manifest Valid** | ✅ Pass | Schema v1 compliant |
| **Protected Boundaries** | ✅ Pass | No unauthorized mutations |
| **Context Validation** | ✅ Pass | All targets accessible |

---

## 🗄️ Database Schema Extractor (`npx auterix extract-schema`)

Extract token-compact Markdown schemas from Drizzle ORM, Prisma, or SQL DDL for zero-hallucination query generation:

```sh
npx auterix extract-schema --file blueprints/database/drizzle.schema.ts
```

*Reduces prompt token overhead by **>70%** compared to dumping raw schema files into context.*

---

## Supported AI Tools & Platforms (21 Total)

Auterix provides native discovery and rules for:
* **Native AI IDEs:** Cursor (`.cursor/`), Windsurf (`.windsurfrules`), Trae (`.trae/`), Zed (`.zed/`)
* **Autonomous Terminal Agents:** Claude Code (`CLAUDE.md`), Google Antigravity (`.agents/`), Aider (`CONVENTIONS.md`), OpenHands (`.openhands_instructions`), Devin (`DEVIATION.md`), OpenAI Codex (`AGENTS.md`)
* **Agent Extensions & Modes:** GitHub Copilot (`.github/copilot-instructions.md`), Cline (`.clinerules`), Roo Code / Kilo Code (`.roomodes`), Continue.dev (`.continue/`), Augment Code, Tabnine
* **AI PR Review & CI Bots:** CodeRabbit (`.coderabbit.yaml`)
* **Generative App Builders:** v0 by Vercel, Bolt.new, Lovable.dev, Replit Agent

*Read the [21 AI Tools Playbook](docs/ai-tools-playbook.md) for full setup runbooks.*

---

## Quickstart

### Option A: Interactive CLI Wizard (Fastest)
Run directly inside any repository:
```sh
npx auterix@latest
```
Launches an interactive ANSI wizard to pick your tools, select your production stack, and install pre-commit guardrails and post-commit memory hooks.

Verify rule integrity at any time:
```sh
npx auterix check
```

Run health diagnostics:
```sh
npx auterix doctor
```

### Option B: Visual Web Studio (In-Browser)
Open the **[Auterix Web Studio](https://auterix.vercel.app)** to test interactive hallucination diffs, auto-detect your stack, and export unified multi-tool bundles.

### Option C: VS Code & Cursor Extension
Install the official **Auterix** extension from [`extensions/vscode/`](extensions/vscode/) for live status bar telemetry (`$(shield) Auterix: 21 Tools Synced`), real-time drift alerts, and 1-click adapter re-sync.

---

## Production Stack Profiles (Pro Blueprints)

Auterix includes battle-tested production profiles available interactively in the **[Web Studio](https://auterix.vercel.app)** and packaged in the **[Auterix Pro Suite](https://tenantdefense.gumroad.com/l/auterix)**:

* **Next.js 15 App Router + Supabase RLS:** Strict Server Component boundaries, Zod-validated Server Actions, and mandatory PostgreSQL Row Level Security.
* **FastAPI + Async SQLAlchemy 2.0:** Pure async connection hygiene, Pydantic v2 schema isolation, and layered repository patterns.
* **Enterprise Node.js 22 + Clean Architecture:** Typed domain error boundaries, request correlation IDs, and transaction isolation.
* **React Native & Expo 51+ Mobile:** Platform-defensive guards, safe area wrappers, and atomic Zustand selectors.
* **AI & Autonomous Agent Pipelines:** Structured JSON outputs, evaluation harnesses, and exponential retry fallbacks.

---

## 🧪 Comprehensive Test Suite (Zero Dependencies)

```sh
node --test
```

Auterix includes **90 automated unit tests** (0 external npm dependencies, running on Node.js >=22 native test runner):
* Deterministic, content-addressed SHA-256 bundle digests.
* Diagnostic 8-check health scoring (`lib/doctor.mjs`).
* Automated commit message memory parsing (`lib/memory.mjs`).
* Atomic staging, rollback guards, and preserved concurrent edits.
* Task state machine contracts, cycle detection, and deferral expiration.
* Symlink traversal and secret-file leak protections.

Review [provenance](docs/provenance.md), [architecture](docs/architecture.md), and [context contract](docs/context-contract.md).

---

## License & Attribution

Created by [Sapan Mozammel](https://github.com/SapanMozammel).

Original maintained code and guidance are released under the [MIT License](LICENSE).
