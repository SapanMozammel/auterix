If you switch between different AI coding tools — like **Cursor** for rapid feature work, **Claude Code** in the terminal for complex refactoring, and **GitHub Copilot** in VS Code — you have probably hit the **AI Context Drift** wall.

### The Problem: Rule & Context Fragmentation

As your codebase grows, keeping your AI assistants aligned becomes painful:
* Every tool demands its own proprietary instruction format (`.cursorrules`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.windsurfrules`).
* When you update an architectural invariant or database schema, you have to manually copy it across multiple hidden files.
* Without a single source of truth, one tool respects your rules while another hallucinates deprecated patterns, leaks secrets, or breaks your testing conventions.
* Massive monolithic prompt files blow your token budget and degrade LLM attention reasoning.

To fix this, I built and open-sourced **Auterix** 🛡️ (https://github.com/SapanMozammel/auterix).

***

### Why Zero Dependencies?

Developer workflow tools shouldn't pull in a 100MB `node_modules` tree just to manage Markdown files and schemas. Auterix is built **100% using Node.js built-ins** (`fs`, `crypto`, `path`), making it instant, secure, and lightweight.

***

### 4 Core Capabilities in Auterix

#### 1. Universal Protocol (21 Native AI Adapters)
You define your project guidelines, tech stack invariants, and coding standards once in `.ai/rules/`. Auterix automatically compiles them into native config files for:
- **Cursor** (`.cursorrules`)
- **Claude Code & Claude Desktop** (`CLAUDE.md`)
- **GitHub Copilot** (`.github/copilot-instructions.md`)
- **Windsurf, Cline, Roo Code, Antigravity, Trae, Devin**, and 15 others.
- Uses SHA-256 cryptographic lockfile tracking to detect rule tampering and drift.

#### 2. `npx auterix doctor` (AI Readiness Scorecard)
Run a single command in your terminal to get an instant 8-check diagnostic scorecard (0–100%):
* Adapter synchronization status
* Token-distilled schema presence
* Cross-agent memory integrity
* Git pre-commit hooks
* Secret leak scans
* Modular role definitions

#### 3. Automated Git-Hook Memory Ingestion
Never repeat an architectural decision to your AI twice. When committing code, simply add the `--ai-note` flag:

```bash
git commit -m "feat: migrate to drizzle with pgvector --ai-note architecture"
```

Auterix automatically intercepts the commit hook and records the architectural rationale directly into `.ai/memory.md` so future AI sessions know *why* a decision was made.

#### 4. Turnkey GitHub Action
Auterix includes a headless CI check (`action.yml`) that verifies SHA-256 context compliance on Pull Requests in `<1.5s` with `$0.00` compute overhead.

***

### Try It in 5 Seconds

You don't need to install anything globally. Run the guided initialization wizard directly in any existing project root:

```bash
npx auterix
```

* ⭐️ **GitHub Repository (MIT)**: https://github.com/SapanMozammel/auterix
* ⚡ **Interactive Web Studio**: https://auterix.vercel.app
* 🟣 **Open VSX (Cursor / Windsurf)**: https://open-vsx.org/extension/auterix/auterix-workflow
* 🔵 **VS Code Marketplace**: https://marketplace.visualstudio.com/items?itemName=auterix.auterix-workflow

I’d love to hear your feedback! How are you and your team currently handling context synchronization across different AI tools?