# Hacker News (Show HN) Phase 2 Launch Playbook

**Target Date & Time**: Tuesday, September 15, 2026 at 6:30 PM BDT (8:30 AM US Eastern Time)  
**Submission URL**: https://news.ycombinator.com/submit

---

### Step 1: Submit Form
* **Title**:
  ```text
  Show HN: Auterix – Stop AI hallucinations across Cursor, Claude, and 21 tools
  ```
* **URL**: *(Leave blank to make it a Text post that displays your technical story directly)*
* **Text**:
  ```text
  Hi HN,

  Like many developers, I love coding with Cursor, Claude Code, and Copilot. But as codebases grow, multi-agent AI coding hits three painful bottlenecks:

  1. Context Fragmentation: Every assistant expects its own config format (.cursorrules, CLAUDE.md, .agents/), and they inevitably drift apart.
  2. Silent Regressions & Drift: Models hallucinate deprecated packages, leak secret keys into client components, or generate destructive DB migrations without checking invariants.
  3. Attention Degradation: Dumping raw schemas and monolithic 3,000-line prompt files exhausts token budgets and degrades LLM reasoning.

  To solve this, I built Auterix (https://github.com/SapanMozammel/auterix) as a zero-dependency, open-source context engine and protocol:

  • 21 AI Native Adapters: Define rules once in .ai/rules/ and Auterix compiles them into native config files for Cursor, Claude, Windsurf, Copilot, Cline, Antigravity, etc. with SHA-256 lockfile tracking.
  • npx auterix doctor: An 8-check diagnostic scorecard in your terminal checking AI readiness (0–100%) to catch missing schemas or secrets before they cost you tokens.
  • Automated Git Memory Ingestion: Flag decisions in commit messages (e.g. git commit -m "... --ai-note architecture") and it automatically records the rationale into .ai/memory.md across all models.
  • Zero Dependencies: Pure Node.js built-ins. Nothing to bloat your repository.

  It is 100% free and MIT licensed:
  • GitHub: https://github.com/SapanMozammel/auterix
  • Web Studio: https://auterix.vercel.app
  • Open VSX / Cursor: https://open-vsx.org/extension/auterix/auterix-workflow

  I’d love your feedback, architectural critique, and thoughts on how you manage AI context drift!
  ```

---

### Step 2: Post-Launch Execution (First 2 Hours)
1. **Upvote & Check**: Refresh your profile on HN and verify the post appears under `/newest` and `/show`.
2. **Respond to Every Comment**: Be humble, fast, technical, and constructive. HN commenters respect deep technical explanations (e.g., explaining why you chose Node.js built-ins over external packages).
3. **Monitor GitHub & Gumroad**:
   - Watch GitHub stars: https://github.com/SapanMozammel/auterix
   - For `$14` Pro sales, Gumroad fulfills automatically.
   - For `$39` Agency sales, invite buyers as collaborators to `SapanMozammel/auterix-pro`.
