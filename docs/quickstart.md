# 60-Second Quickstart Guide

Get Auterix up and running in under 60 seconds. Choose either the **Interactive CLI TUI**, the **Visual Web Studio**, or the **VS Code & Cursor Extension**.

---

## Option A: Interactive CLI Wizard (Fastest & Recommended)

Best for engineers who prefer rapid, interactive setup directly in their terminal:

```bash
npx auterix@latest
```

When run in an interactive terminal, Auterix launches an ANSI setup wizard:
1. **Tool Checklist:** Select any combination of the 21 supported AI tools (Cursor, Claude Code, Antigravity, Windsurf, Copilot, Aider, CodeRabbit, etc.).
2. **Architecture Stack:** Pick your production profile (Next.js 15 + Supabase, FastAPI + SQLAlchemy, Enterprise Node, Expo, Baseline).
3. **Pre-Commit Guard:** Choose `(Y/n)` to install automated secret-leak prevention and TypeScript pre-commit hooks.

### Verify Your Configuration at Any Time:
```bash
npx auterix check
```
Verifies that all AI rule files match their cryptographic SHA-256 content hashes with zero drift.

---

## Option B: Visual Web Studio (No Install Required)

Best for developers who prefer an interactive visual interface in the browser:

1. **Open the Studio:** Navigate to **[auterix.vercel.app](https://auterix.vercel.app)**.
2. **Auto-Detect or Select Your Stack:** Drop your `package.json` or `requirements.txt` to auto-detect your stack.
3. **Select Your AI Tools:** Toggle on the tools you use.
4. **Download Multi-Tool Bundle:** Click **"Download Multi-Tool Bundle (.zip)"** and extract into your project root.

---

## Option C: VS Code, Cursor & Windsurf Extension

Auterix provides an official editor extension for real-time drift detection and 1-click synchronization:

1. Look for **Auterix** in the Extensions Marketplace (or install via `extensions/vscode`).
2. The live telemetry badge appears in your status bar:
   * `$(shield) Auterix: 21 Tools Synced`: All AI rules match the SHA-256 lock.
   * `$(alert) Auterix: Drift Detected`: An AI assistant or teammate edited rules without updating the lock. Click to re-sync!
3. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and type `Auterix: Re-Sync All 21 AI Adapters`.

---

## 🧠 Cross-Agent Shared Memory (`.ai/memory.md`)

Eliminate repetitive hallucinations across team members and different AI assistants. When an architectural decision or anti-pattern is established, log it once:

```bash
npx auterix memory --category architecture --note "We use Drizzle ORM + pgvector for semantic search"
npx auterix memory --category anti-patterns --note "Do not use client-side Supabase service role keys"
```

All 21 AI assistants automatically inherit `.ai/memory.md` before generating code or proposing changes!

---

## 🗄️ Database Schema-to-Context Extractor

Never let an AI assistant hallucinate table or column names again:

```bash
npx auterix extract-schema --file blueprints/database/drizzle.schema.ts
```

Parses Drizzle ORM, Prisma, and SQL DDL schemas into token-compact Markdown blocks that fit easily into system prompts without wasting tokens.

---

## 🤖 Official GitHub Action (`action.yml`)

Add automated AI rule compliance checks to your pull requests in 3 lines of YAML:

```yaml
name: Auterix Compliance
on: [pull_request, push]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: SapanMozammel/auterix@main
```

Runs headlessly in <1.5 seconds at **`$0.00` cost to you**, and writes a verified compliance audit summary directly to your GitHub PR step summary.

---

## 📦 Commercial Pro Blueprints & Automated PR Bots
If you need turnkey Next.js 15 + Supabase RLS migrations, pre-commit AI guardrails, or automated GitHub Actions PR bots, upgrade to **[Auterix Pro (`$14`) or Agency (`$39`)](free-vs-pro.md)**.
