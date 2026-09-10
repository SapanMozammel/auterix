# Tool discovery and runtime verification

Documentation was reviewed on 2026-09-06. The installed registry is
`.ai/adapters.json`; each adapter points to the same canonical project context.
These are documented integrations, not certified runtime compatibility.

| Tool          | Entry                             | Setup                                                        |
| ------------- | --------------------------------- | ------------------------------------------------------------ |
| Codex         | `AGENTS.md`                       | Open the project root.                                       |
| Claude Code   | `CLAUDE.md`                       | Open the project root; no hooks installed.                   |
| Cursor        | `.cursor/rules/workflow.mdc`      | Always-applied discovery rule.                               |
| Augment       | `.augment/rules/workflow.md`      | Always-applied workspace rule.                               |
| Copilot       | `.github/copilot-instructions.md` | Enable repository instructions in the chosen client.         |
| Antigravity   | `.agents/rules/workflow.md`       | Confirm Always On in Rules, or attach manually.              |
| Other clients | `AGENTS.md`                       | Explicitly attach the manifest, profile and task as context. |

Adapters are selectable at install time (`--adapters codex,cursor` or `none`);
updates retain the locked choice. Codex checks `AGENTS.override.md` before AGENTS.md.
Auterix detects root overrides and requires an explicit canonical link after
policy reconciliation; inspect scoped overrides and global/client settings too.
This protects discovery configuration, not runtime behavior.

Authoritative references: [Codex](https://learn.chatgpt.com/docs/agent-configuration/agents-md),
[Claude](https://code.claude.com/docs/en/memory),
[Cursor](https://cursor.com/docs/rules),
[Augment](https://docs.augmentcode.com/cli/rules),
[Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions),
[Antigravity](https://antigravity.google/docs/rules-workflows).

Antigravity documents the plural directory and UI activation modes; this baseline
does not invent an undocumented frontmatter activation contract. Confirm client
activation during the user's later runtime check. The generic path also serves
Windsurf, Cline, Continue, Aider and future tools through explicit context; no
unverified vendor-specific entry files are advertised for those clients.

Run the protocol in `.ai/core/workflows/verification.md` and record results in a
project-owned file copied from `.ai/templates/tool-verification.md`. A client can
then be described as verified for that version/environment. Upstream registry
promotion requires separately reviewed evidence and a validator change; editing
the registry locally correctly appears as managed drift.

Tool adapters cannot guarantee model behavior. Keep actual checks, source review
and human approval of external operations in the engineering process.
