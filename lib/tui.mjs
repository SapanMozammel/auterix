/**
 * Auterix Interactive CLI TUI Wizard
 * Pure Node.js standard library (node:readline). Zero dependencies.
 * Provides interactive setup when running `npx auterix` in an interactive terminal.
 */

import readline from 'node:readline';

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

const ALL_TOOLS = [
  { id: 'cursor', name: 'Cursor IDE', default: true },
  { id: 'claude', name: 'Claude Code CLI', default: true },
  { id: 'antigravity', name: 'Google Antigravity', default: true },
  { id: 'windsurf', name: 'Windsurf / Codeium', default: true },
  { id: 'copilot', name: 'GitHub Copilot (Agent Mode)', default: true },
  { id: 'coderabbit', name: 'CodeRabbit AI PR Reviews', default: true },
  { id: 'aider', name: 'Aider Git Pairing', default: false },
  { id: 'cline', name: 'Cline / Autonomous Agent', default: false },
  { id: 'roocode', name: 'Roo Code / Kilo Code', default: false },
  { id: 'openhands', name: 'OpenHands / OpenDevin', default: false },
  { id: 'devin', name: 'Devin Playbook', default: false },
  { id: 'zed', name: 'Zed AI Assistant', default: false },
  { id: 'trae', name: 'Trae AI IDE (ByteDance)', default: false },
  { id: 'continue', name: 'Continue.dev', default: false },
  { id: 'augment', name: 'Augment Code', default: false },
  { id: 'tabnine', name: 'Tabnine', default: false },
  { id: 'replit', name: 'Replit Agent', default: false },
  { id: 'v0', name: 'v0 by Vercel', default: false },
  { id: 'bolt', name: 'Bolt.new', default: false },
  { id: 'lovable', name: 'Lovable.dev', default: false },
  { id: 'codex', name: 'OpenAI Codex (AGENTS.md)', default: false },
];

const PROFILES = [
  { id: 'nextjs-supabase', name: 'Next.js 15 App Router + Supabase RLS (Recommended)' },
  { id: 'fastapi-sqlalchemy', name: 'Python FastAPI + Async SQLAlchemy 2.0' },
  { id: 'enterprise-node', name: 'Enterprise Node.js 22 + Clean Architecture' },
  { id: 'react-native-expo', name: 'Expo & React Native 51+ Mobile' },
  { id: 'baseline', name: 'Standard Multi-Agent Baseline' },
];

/**
 * Prompts user with a yes/no question
 */
function askQuestion(rl, query, defaultVal = 'y') {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      const a = answer.trim().toLowerCase();
      if (!a) resolve(defaultVal === 'y');
      else resolve(a === 'y' || a === 'yes');
    });
  });
}

/**
 * Interactive multi-select checklist using raw mode keypresses
 */
function interactiveChecklist(items, promptText) {
  return new Promise((resolve) => {
    let cursor = 0;
    const selected = new Set(items.filter((i) => i.default).map((i) => i.id));
    const stdin = process.stdin;
    const stdout = process.stdout;

    readline.emitKeypressEvents(stdin);
    if (stdin.isTTY) stdin.setRawMode(true);

    const render = () => {
      // Clear previous lines
      stdout.write('\x1b[H\x1b[J');
      stdout.write(`${ANSI.bold}${ANSI.cyan}AUTERIX — Universal Autonomous AI Context Standard${ANSI.reset}\n`);
      stdout.write(`${ANSI.dim}─────────────────────────────────────────────────────────────${ANSI.reset}\n`);
      stdout.write(`${ANSI.bold}${promptText}${ANSI.reset}\n`);
      stdout.write(`${ANSI.dim}(Use ↑/↓ arrows to navigate, Space to toggle, 'a' to select all, Enter to confirm)${ANSI.reset}\n\n`);

      items.forEach((item, index) => {
        const isCursor = index === cursor;
        const isChecked = selected.has(item.id);
        const pointer = isCursor ? `${ANSI.cyan}❯${ANSI.reset}` : ' ';
        const check = isChecked ? `${ANSI.green}✔${ANSI.reset}` : `${ANSI.dim}○${ANSI.reset}`;
        const name = isCursor ? `${ANSI.bold}${item.name}${ANSI.reset}` : item.name;
        stdout.write(` ${pointer} [${check}] ${name}\n`);
      });

      stdout.write(`\n${ANSI.dim}Selected: ${selected.size} / ${items.length} tools${ANSI.reset}\n`);
    };

    const cleanup = () => {
      if (stdin.isTTY) stdin.setRawMode(false);
      stdin.removeListener('keypress', onKeypress);
      stdout.write('\x1b[H\x1b[J');
    };

    const onKeypress = (str, key) => {
      if (!key) return;
      if (key.name === 'c' && key.ctrl) {
        cleanup();
        process.exit(0);
      }

      if (key.name === 'up') {
        cursor = (cursor - 1 + items.length) % items.length;
        render();
      } else if (key.name === 'down') {
        cursor = (cursor + 1) % items.length;
        render();
      } else if (key.name === 'space') {
        const id = items[cursor].id;
        if (selected.has(id)) {
          if (selected.size > 1) selected.delete(id);
        } else {
          selected.add(id);
        }
        render();
      } else if (key.name === 'a') {
        if (selected.size === items.length) {
          selected.clear();
          selected.add(items[0].id);
        } else {
          items.forEach((i) => selected.add(i.id));
        }
        render();
      } else if (key.name === 'return') {
        cleanup();
        resolve(Array.from(selected));
      }
    };

    stdin.on('keypress', onKeypress);
    render();
  });
}

/**
 * Interactive single radio select
 */
function interactiveRadio(items, promptText) {
  return new Promise((resolve) => {
    let cursor = 0;
    const stdin = process.stdin;
    const stdout = process.stdout;

    readline.emitKeypressEvents(stdin);
    if (stdin.isTTY) stdin.setRawMode(true);

    const render = () => {
      stdout.write('\x1b[H\x1b[J');
      stdout.write(`${ANSI.bold}${ANSI.cyan}AUTERIX — Universal Autonomous AI Context Standard${ANSI.reset}\n`);
      stdout.write(`${ANSI.dim}─────────────────────────────────────────────────────────────${ANSI.reset}\n`);
      stdout.write(`${ANSI.bold}${promptText}${ANSI.reset}\n`);
      stdout.write(`${ANSI.dim}(Use ↑/↓ arrows to navigate, Enter to choose)${ANSI.reset}\n\n`);

      items.forEach((item, index) => {
        const isCursor = index === cursor;
        const pointer = isCursor ? `${ANSI.cyan}❯${ANSI.reset}` : ' ';
        const mark = isCursor ? `${ANSI.green}●${ANSI.reset}` : `${ANSI.dim}○${ANSI.reset}`;
        const name = isCursor ? `${ANSI.bold}${item.name}${ANSI.reset}` : item.name;
        stdout.write(` ${pointer} (${mark}) ${name}\n`);
      });
    };

    const cleanup = () => {
      if (stdin.isTTY) stdin.setRawMode(false);
      stdin.removeListener('keypress', onKeypress);
      stdout.write('\x1b[H\x1b[J');
    };

    const onKeypress = (str, key) => {
      if (!key) return;
      if (key.name === 'c' && key.ctrl) {
        cleanup();
        process.exit(0);
      }

      if (key.name === 'up') {
        cursor = (cursor - 1 + items.length) % items.length;
        render();
      } else if (key.name === 'down') {
        cursor = (cursor + 1) % items.length;
        render();
      } else if (key.name === 'return') {
        cleanup();
        resolve(items[cursor].id);
      }
    };

    stdin.on('keypress', onKeypress);
    render();
  });
}

/**
 * Main TUI Wizard Entrypoint
 */
export async function runInteractiveWizard() {
  if (!process.stdin.isTTY) {
    return {
      adapters: ['cursor', 'claude', 'antigravity', 'windsurf', 'copilot', 'coderabbit'],
      profile: 'nextjs-supabase',
      installPreCommit: true,
    };
  }

  // 1. Tool Selection
  const selectedAdapters = await interactiveChecklist(
    ALL_TOOLS,
    'Select the AI coding tools & assistants you use:'
  );

  // 2. Production Stack Selection
  const selectedProfile = await interactiveRadio(
    PROFILES,
    'Select your project architecture / production stack:'
  );

  // 3. Pre-Commit Guardrails
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  process.stdout.write(`${ANSI.bold}${ANSI.cyan}AUTERIX — Universal Autonomous AI Context Standard${ANSI.reset}\n`);
  process.stdout.write(`${ANSI.dim}─────────────────────────────────────────────────────────────${ANSI.reset}\n`);
  const installPreCommit = await askQuestion(
    rl,
    `${ANSI.bold}? Install local pre-commit guardrail (blocks secret leaks & unverified code)? (Y/n): ${ANSI.reset}`
  );
  rl.close();

  return {
    adapters: selectedAdapters,
    profile: selectedProfile,
    installPreCommit,
  };
}
