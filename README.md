# Auterix

**One workflow across 21 native AI tools. Universal agent standard.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D22-brightgreen)](package.json)
[![Tests: 65 Passing](https://img.shields.io/badge/Tests-65%20Passing-emerald)](test/)
[![Studio: Vercel](https://img.shields.io/badge/Web%20Studio-auterix.vercel.app-sky)](https://auterix.vercel.app)
[![Get Auterix Pro](https://img.shields.io/badge/Pro%20Suite-%2414%20Instant%20Access-orange)](https://tenantdefense.gumroad.com/l/auterix)

Auterix is a deterministic, tool-neutral autonomous context protocol and multi-agent engineering workflow. Projects define shared architectural invariants, task lifecycles, and verification gates once, while Auterix compiles, verifies, and locks them natively across **21 modern AI coding assistants and platforms** — including Cursor, Claude Code, Google Antigravity, Windsurf, GitHub Copilot, Devin, Aider, OpenHands, Cline, Roo Code, CodeRabbit, Zed, Trae, and more.

> 📖 **[Explore the Documentation Hub (docs/)](docs/README.md)** | **[60-Second Quickstart](docs/quickstart.md)** | **[Free vs. Pro vs. Agency Guide](docs/free-vs-pro.md)**  
> ⚡ **Live Web Studio:** Configure, auto-detect your stack, and export unified AI configs visually at **[auterix.vercel.app](https://auterix.vercel.app)**.  
> 📦 **Commercial Pro Suite:** Production stacks, runnable templates, pre-commit AI guardrails, and automated CI PR bots available at **[Gumroad (`$14`)](https://tenantdefense.gumroad.com/l/auterix)**.

---

## Why Auterix?

| Challenge with Raw Prompts / Rules | How Auterix Solves It |
| :--- | :--- |
| **Tool Fragmentation:** Maintaining separate `.cursorrules`, `CLAUDE.md`, and `.agents/` leads to out-of-sync rules. | **Single Canonical Source:** Auterix synchronizes all 21 client adapters with zero drift. |
| **Silent Regressions:** AI claims "task done" without running tests or verifying constraints. | **Deterministic Verification:** Staged writer guards, content-addressed hash locks, and pre-commit checks. |
| **Context Window Rot:** Massive prompt files cause LLM attention degradation and blow token budgets. | **Progressive Disclosure:** Hierarchical 3-tiered context loading (Core Invariants ➔ Stack Blueprints ➔ Task Contracts). |
| **Lost Chat State:** Switching between Cursor (inline) and Claude/Antigravity (deep refactoring) resets progress. | **Cross-Agent Task Contracts:** Formal `.ai/tasks/` state machine preserves active progress across all tools. |

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
Run directly inside any new or existing repository:
```sh
npx auterix@latest
```
Launches an interactive ANSI wizard to pick your tools, select your production stack, and install pre-commit security hooks.

Verify rule integrity at any time:
```sh
npx auterix check
```

### Option B: Visual Web Studio (In-Browser)
Open the **[Auterix Web Studio](https://auterix.vercel.app)**, select your AI clients, drop your `package.json` to auto-detect your stack, and click **"Download Multi-Tool Bundle (.zip)"**. Extract into your project root.

### Option C: VS Code & Cursor Extension
Install the official **Auterix** extension from [`extensions/vscode/`](extensions/vscode/) for live status bar telemetry (`$(shield) Auterix: 21 Tools Synced`), real-time drift alerts, and 1-click adapter re-sync.

---

## 🧠 Cross-Agent Shared Memory (`.ai/memory.md`)

Log repository decisions, conventions, and discarded anti-patterns so Cursor, Claude, Antigravity, and Windsurf never hallucinate obsolete patterns:

```sh
npx auterix memory --category architecture --note "We use Drizzle ORM + pgvector for RAG"
npx auterix memory --category anti-patterns --note "Do not use client-side Supabase service role keys"
```

---

## 🗄️ Database Schema Extractor (`npx auterix extract-schema`)

Extract token-compact Markdown schemas from Drizzle ORM, Prisma, or SQL DDL for zero-hallucination query generation:

```sh
npx auterix extract-schema --file blueprints/database/drizzle.schema.ts
```

---

## 🤖 Official GitHub Action (`action.yml`)

Add turnkey AI rule compliance audits to your PRs at **`$0.00` cost**:

```yaml
- name: Auterix AI Workflow Audit
  uses: SapanMozammel/auterix@main
```

---

## Production Stack Profiles (Pro Blueprints)

Auterix includes battle-tested production profiles available interactively in the **[Web Studio](https://auterix.vercel.app)** and packaged in the **[Auterix Pro Suite](https://tenantdefense.gumroad.com/l/auterix)** to prevent common AI hallucinations:

* **Next.js 15 App Router + Supabase RLS:** Strict Server Component boundaries, Zod-validated Server Actions, and mandatory PostgreSQL Row Level Security.
* **FastAPI + Async SQLAlchemy 2.0:** Pure async connection hygiene, Pydantic v2 schema isolation, and layered repository patterns.
* **Enterprise Node.js 22 + Clean Architecture:** Typed domain error boundaries, request correlation IDs, and transaction isolation.
* **React Native & Expo 51+ Mobile:** Platform-defensive guards, safe area wrappers, and atomic Zustand selectors.
* **AI & Autonomous Agent Pipelines:** Structured JSON outputs, evaluation harnesses, and exponential retry fallbacks.

---

## CI/CD Verification & GitHub Actions

Auterix provides an automated pull request audit workflow in [`.github/workflows/auterix-verify.yml`](.github/workflows/auterix-verify.yml). It verifies that AI-generated code complies with project invariants and prevents unauthorized context drift before merging.

---

## Test Suite & Architecture

```sh
node --test
```
Auterix includes 65 automated tests verifying:
* Deterministic, content-addressed SHA-256 bundle digests.
* Atomic staging, rollback guards, and preserved concurrent edits.
* Task state machine contracts, cycle detection, and deferral expiration.
* Symlink traversal and secret-file leak protections.

Review [provenance](docs/provenance.md), [architecture](docs/architecture.md), and [context contract](docs/context-contract.md).

---

## License & Attribution

Created by [Sapan Mozammel](https://github.com/SapanMozammel).

Original maintained code and guidance are released under the [MIT License](LICENSE).
