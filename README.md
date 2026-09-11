# Auterix

**One workflow. 8 native AI tools. Universal agent standard.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D22-brightgreen)](package.json)
[![Tests: 65 Passing](https://img.shields.io/badge/Tests-65%20Passing-emerald)](test/)
[![Studio: Vercel](https://img.shields.io/badge/Web%20Studio-auterix.vercel.app-sky)](https://auterix.vercel.app)
[![Get Auterix Pro](https://img.shields.io/badge/Pro%20Suite-$14%20Instant%20Access-orange)](https://tenantdefense.gumroad.com/l/auterix)

Auterix is a deterministic, tool-neutral autonomous context protocol and multi-agent engineering workflow. Projects define shared architectural invariants, task lifecycles, and verification gates once, while Auterix compiles, verifies, and locks them natively across **Cursor, Claude Code, Google Antigravity, GitHub Copilot, OpenAI Codex, Windsurf, Cline, and Augment Code** — with universal **`AGENTS.md`** compatibility for any autonomous agent.

> **Live Web Studio:** Configure, auto-detect your stack, and export unified AI configs visually at **[auterix.vercel.app](https://auterix.vercel.app)**.
> **Commercial Pro Suite:** Production stacks, runnable templates, pre-commit AI guardrails, and automated CI PR bots available at **[Gumroad ($14)](https://tenantdefense.gumroad.com/l/auterix)**.

---

## Why Auterix?

| Challenge with Raw Prompts / Rules | How Auterix Solves It |
| :--- | :--- |
| **Tool Fragmentation:** Maintaining separate `.cursorrules`, `CLAUDE.md`, and `.agents/` leads to out-of-sync rules. | **Single Canonical Source:** Auterix synchronizes all 8 client adapters with zero drift. |
| **Silent Regressions:** AI claims "task done" without running tests or verifying constraints. | **Deterministic Verification:** Staged writer guards, content-addressed hash locks, and pre-commit checks. |
| **Context Window Rot:** Massive prompt files cause LLM attention degradation and blow token budgets. | **Progressive Disclosure:** Hierarchical 3-tiered context loading (Core Invariants ➔ Stack Blueprints ➔ Task Contracts). |
| **Lost Chat State:** Switching between Cursor (inline) and Claude/Antigravity (deep refactoring) resets progress. | **Cross-Agent Task Contracts:** Formal `.ai/tasks/` state machine preserves active progress across all tools. |

---

## Supported AI Client Adapters

| AI Assistant / Client | Entrypoint Managed by Auterix | Native Structure | Discovery Contract |
| :--- | :--- | :--- | :--- |
| **Cursor** | `.cursor/rules/workflow.mdc` | `.cursor/rules/*.mdc`, `.cursor/commands/` | Always-applied MDC discovery rule |
| **Claude Code** | `CLAUDE.md` | `.claude/commands/`, `.claude/skills/`, `.claudeignore` | Root memory and verification commands |
| **Google Antigravity** | `.agents/rules/workflow.md` | `.agents/rules/`, `.agents/skills/`, `.agents/agents/` | Workspace rule with bounded tool actions |
| **GitHub Copilot** | `.github/copilot-instructions.md` | `.github/prompts/` | Repository-level custom instructions |
| **OpenAI Codex** | `AGENTS.md` | `.ai/tasks/`, `.ai/commands/` | Canonical agent instruction standard |
| **Windsurf / Codeium** | `.windsurfrules` | `.windsurf/workflows/` | Global Cascade rules and workflows |
| **Cline / Roo Code** | `.clinerules` | Mode-specific rules (Plan, Act, Review) | Root agentic persona contract |
| **Augment Code** | `.augment/rules/workflow.md` | Context guidelines | Workspace developer assistant rule |

*See [tool support](docs/tool-support.md) for adapter setup and verification status.*

---

## Quickstart & Adoption

Requires **Node.js 22** or later. No package installation, credentials, or network access is required by the core CLI.

### Option A: Interactive Visual Studio (Fastest)
Open the **[Auterix Web Studio](studio/)** (`auterix.vercel.app`), select your AI clients, drop your `package.json` to auto-detect your stack, and click **"Download Config Bundle"**.

### Option B: Terminal CLI Adoption
Inspect your repository, plan the adoption, and apply the content-hash lock:

```sh
# 1. Inspect repository conventions and commands
node bin/workflow.mjs inspect --root /absolute/path/to/project

# 2. Generate preview adoption plan
node bin/workflow.mjs plan --root /absolute/path/to/project --out /absolute/path/to/install-plan.json

# 3. Apply adoption and verify hash lock
node bin/workflow.mjs apply --root /absolute/path/to/project --plan /absolute/path/to/install-plan.json
node bin/workflow.mjs check --root /absolute/path/to/project
```

*Select specific adapters with `--adapters cursor,claude` or manual-only with `--adapters none`. Review the [initialization runbook](docs/initialization.md).*

From the adopted repository alone:
```sh
node .ai/tools/check.mjs --root .
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
