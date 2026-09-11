# Free vs. Pro vs. Agency Guide

This guide explains the exact differences between the **Free (Open Source / MIT)** tier, **Pro Developer (`$14`)**, and **Agency & Teams (`$39`)**.

---

## 🌟 The Core Distinction

> **Important Note:**  
> Free vs. Pro is **not** *"Pro has a ZIP and Free does not"*.  
> **Free users can download a complete ZIP from the Web Studio or install via `npx` at any time for free.**

The difference is **what you receive**:
* **Free Tier:** The **Universal AI Agent Context Protocol** (the "Instructions & Rules"). It synchronizes your AI assistants so they follow the same patterns without drift.
* **Pro Tier:** The **Production Boilerplates, Security Guardrails, and CI PR Bots** (the "Runnable Implementation Code & Automation"). It gives you tested production code and automated CI/CD enforcement.

---

## 📊 Comprehensive Tier Comparison

| Feature / Capability | Free Open Source (MIT) | Pro Developer (`$14`) | Agency & Teams (`$39`) |
| :--- | :---: | :---: | :---: |
| **Price** | **100% Free Forever** | **`$14` One-Time** | **`$39` One-Time** |
| **Delivery Method** | Web Studio ZIP or `npx` | Gumroad ZIP Package | Live Private GitHub Sync + ZIP |
| **License** | MIT License | Commercial (Own Products) | Commercial (Client Deliverables) |
| **All 21 AI Tool Adapters** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Web Studio Configurator** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Deterministic SHA-256 Hash Lock** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Cross-Tool Task State Machine** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Production Starter Blueprints** | ❌ (You write the app) | ✅ 5 Complete Stacks | ✅ 5 Complete Stacks |
| **PostgreSQL Row Level Security (RLS)** | ❌ (Rule docs only) | ✅ Bank-grade SQL migrations | ✅ Bank-grade SQL migrations |
| **Pre-Commit AI Guardrail Hook** | ❌ None | ✅ Local Git Hook | ✅ Local Git Hook |
| **Automated GitHub Actions PR Bot** | ❌ None | ❌ None | ✅ Turnkey CI PR Audit Bot |
| **Playwright & Lighthouse CI Stacks** | ❌ None | ✅ Included | ✅ Included |
| **Continuous Upstream Updates** | Manual git clone | Re-download from Gumroad | Direct `git pull upstream main` |
| **Issue Tracker & Priority Support** | GitHub Public Discussions | Standard Support | Priority GitHub Issues |

---

## 🛠️ Detailed Breakdown by Tier

### 1. Free Community Protocol (MIT License)
**Best for:** Solo developers and open-source contributors who write their own code from scratch and want their AI assistants to stay synchronized.

* **What's included:**
  * Native adapter rule files for all 21 supported AI tools (Cursor, Claude Code, Antigravity, Windsurf, Copilot, Cline, Aider, Devin, etc.).
  * Universal cross-tool task protocol (`.ai/manifest.json`, `.ai/tasks/active.json`).
  * Slash command definitions (`/plan`, `/implement`, `/review`, `/test`).
  * Cryptographic SHA-256 hash lock to prevent configuration tampering.
  * Node.js verification engine (`npx auterix check`).

---

### 2. Pro Developer Suite (`$14` One-Time)
**Best for:** Solo founders, indie hackers, and developers shipping their own commercial SaaS, mobile, or web applications.

* **What's included (Everything in Free, plus):**
  * **5 Complete Production Blueprints:**
    1. **Next.js 15 App Router:** TypeScript, Server Actions, async cookies, Zod validation.
    2. **Supabase Backend:** Complete PostgreSQL Row-Level Security (RLS) migrations, multi-tenant isolation, auth session callbacks.
    3. **Python FastAPI Backend:** Async SQLAlchemy, Pydantic v2 schemas, JWT authentication.
    4. **Node.js Microservice:** Fastify, Prisma ORM, distributed tracing.
    5. **Expo React Native App:** Safe area routing, offline sync, secure biometric store.
  * **Pre-Commit AI Guardrail Hook:** Intercepts local `git commit` commands to stop AI from committing leaked secrets, breaking schema changes, or untyped mutations.
  * **Playwright E2E & Lighthouse CI Configs:** Automated test scaffolds for headless verification.
  * **Offline Desktop Studio:** Standalone HTML bundle to run the Studio 100% offline without internet.

---

### 3. Agency & Teams (`$39` One-Time)
**Best for:** Dev agencies, software consultancies, and engineering teams delivering code to multiple clients.

* **What's included (Everything in Pro Developer, plus):**
  * **Direct Private GitHub Repository Access:** Your GitHub account is invited to `SapanMozammel/auterix-pro`.
  * **Continuous `git pull` Lifetime Sync:** Run `git pull upstream main` whenever new AI tools or adapter updates release—no manual zip downloads.
  * **Automated GitHub Actions PR Compliance Bot:** Turnkey CI workflow that reviews PRs opened by AI assistants or team members, flagging security vulnerabilities and architecture breaches before merge.
  * **Commercial Client Rights:** Full legal permission to use the production blueprints across unlimited client projects with zero per-seat or royalty fees.
  * **Team Collaboration:** Multi-seat team access via GitHub collaborator invitations.

---

## 🚀 How to Upgrade

1. Purchase your chosen tier on **[Gumroad](https://tenantdefense.gumroad.com/l/auterix)**.
2. **For Pro Developer:** Download your ZIP package from the Gumroad receipt.
3. **For Agency & Teams:** Provide your GitHub username during checkout. Our automated webhook invites you to the private repository within 60 seconds.
4. Open the Web Studio and click **Load Your Pro Deliverable ZIP** to unlock all production blueprints visually.
