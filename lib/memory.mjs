/**
 * Auterix Cross-Agent Shared Memory Protocol
 * Manages institutional repository decisions, tech choices, and discarded approaches
 * so Cursor, Claude Code, Antigravity, Windsurf, and all 21 tools never hallucinate old decisions.
 */

import fs from 'node:fs';
import path from 'node:path';

export const MEMORY_CATEGORIES = [
  'architecture',
  'security',
  'conventions',
  'anti-patterns',
];

export const DEFAULT_MEMORY_PATH = '.ai/memory.md';

/**
 * Initializes or loads the project memory document
 */
export function getOrCreateMemoryFile(root = process.cwd()) {
  const dir = path.join(root, '.ai');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const memoryPath = path.join(root, DEFAULT_MEMORY_PATH);
  if (!fs.existsSync(memoryPath)) {
    const initialContent = `# Auterix Cross-Agent Shared Memory
# Canonical architectural memory shared across all 21 AI assistants.
# Rules: Before proposing new libraries or patterns, verify against this document.

## 🏛️ Architecture & Stack Decisions
- Core Language: TypeScript (strict mode, zero untyped any)
- Runtime: Node.js (>=22 LTS) / Next.js 15 App Router

## 🛡️ Security & Invariants
- Database: PostgreSQL Row-Level Security (RLS) is mandatory on all user-facing tables.
- Secrets: No API keys, JWT secrets, or connection strings in code or git.

## 📐 Conventions & Patterns
- Server Actions: Must validate all input payloads with Zod schemas.
- Testing: Every PR must include unit or E2E tests before marking tasks complete.

## 🚫 Discarded Approaches (Anti-Patterns)
- Do not use client-side Supabase service role keys (causes credential leak).
- Do not write unescaped raw currency math without code fences.
`;
    fs.writeFileSync(memoryPath, initialContent, 'utf-8');
  }

  return memoryPath;
}

/**
 * Appends a new decision to the shared memory document
 */
export function recordMemory(root, category, note, author = 'agent') {
  const memoryPath = getOrCreateMemoryFile(root);
  const content = fs.readFileSync(memoryPath, 'utf-8');
  const timestamp = new Date().toISOString().split('T')[0];

  const categoryHeadings = {
    'architecture': '## 🏛️ Architecture & Stack Decisions',
    'security': '## 🛡️ Security & Invariants',
    'conventions': '## 📐 Conventions & Patterns',
    'anti-patterns': '## 🚫 Discarded Approaches (Anti-Patterns)',
  };

  const targetHeading = categoryHeadings[category.toLowerCase()] || categoryHeadings.architecture;
  const newEntry = `- [${timestamp}] (${author}): ${note.trim()}`;

  let updated;
  if (content.includes(targetHeading)) {
    updated = content.replace(targetHeading, `${targetHeading}\n${newEntry}`);
  } else {
    updated = `${content.trim()}\n\n${targetHeading}\n${newEntry}\n`;
  }

  fs.writeFileSync(memoryPath, updated, 'utf-8');
  return { ok: true, file: DEFAULT_MEMORY_PATH, entry: newEntry };
}

/**
 * Parses a git commit message for --ai-note flags.
 * Returns { note, category } if found, or null if no flag present.
 *
 * Examples:
 *   "Switch to tRPC --ai-note architecture" → { note: "Switch to tRPC", category: "architecture" }
 *   "Fix auth bug --ai-note security"       → { note: "Fix auth bug", category: "security" }
 *   "Add tests --ai-note"                   → { note: "Add tests", category: "conventions" }
 *   "Normal commit"                         → null
 */
export function parseCommitMessage(message) {
  if (typeof message !== 'string') return null;
  const marker = '--ai-note';
  const index = message.indexOf(marker);
  if (index === -1) return null;

  const note = message.slice(0, index).trim();
  if (!note) return null;

  const rest = message.slice(index + marker.length).trim();
  const categoryMatch = rest.match(/^([\w-]+)/);
  const category = categoryMatch
    ? (MEMORY_CATEGORIES.includes(categoryMatch[1].toLowerCase())
        ? categoryMatch[1].toLowerCase()
        : 'conventions')
    : 'conventions';

  return { note, category };
}

/**
 * Reads memory summary for context injection into AI prompts
 */
export function readMemoryContext(root = process.cwd(), maxChars = 3000) {
  const memoryPath = path.join(root, DEFAULT_MEMORY_PATH);
  if (!fs.existsSync(memoryPath)) return '';

  const raw = fs.readFileSync(memoryPath, 'utf-8').trim();
  if (raw.length <= maxChars) return raw;

  return `${raw.slice(0, maxChars)}\n\n<!-- Truncated to fit token budget -->`;
}
