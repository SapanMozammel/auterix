#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  applyPlan,
  buildBundle,
  check,
  ejectPlan,
  inspect,
  makePlan,
  readJsonFile,
  validateBundle,
  writeNewJson,
} from '../lib/workflow.mjs';
import { runInteractiveWizard } from '../lib/tui.mjs';
import { extractSchemaContextFromFile } from '../lib/schema-extractor.mjs';
import { getOrCreateMemoryFile, recordMemory, readMemoryContext } from '../lib/memory.mjs';

function performInit(root, rawAdapters, profileName, bundleFn, installPreCommit = false) {
  const coreKnown = new Set(['cursor', 'claude', 'antigravity', 'copilot', 'codex', 'augment']);
  let coreAdapters = undefined;
  if (rawAdapters) {
    if (rawAdapters === 'none') {
      coreAdapters = [];
    } else {
      const list = Array.isArray(rawAdapters) ? rawAdapters : rawAdapters.split(',');
      coreAdapters = list.filter((a) => coreKnown.has(a));
      if (coreAdapters.length === 0 && list.length > 0) {
        coreAdapters = ['codex'];
      }
    }
  }

  const b = bundleFn();
  const plan = makePlan(root, b, 'install', { adapters: coreAdapters });
  const applied = applyPlan(root, b, plan);

  // Initialize Cross-Agent Shared Memory
  getOrCreateMemoryFile(root);

  const list = Array.isArray(rawAdapters)
    ? rawAdapters
    : (rawAdapters ? rawAdapters.split(',') : ['cursor', 'claude', 'antigravity', 'windsurf', 'aider', 'coderabbit']);
  const requested = new Set(list);

  if (requested.has('coderabbit')) {
    const p = path.join(root, '.coderabbit.yaml');
    if (!fs.existsSync(p)) {
      fs.writeFileSync(
        p,
        '# yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json\nlanguage: "en-US"\nreviews:\n  profile: "assertive"\n  request_changes_workflow: true\n  high_level_summary: true\n  auto_review:\n    enabled: true\n',
      );
    }
  }

  if (requested.has('aider')) {
    const conf = path.join(root, '.aider.conf.yml');
    const conv = path.join(root, 'CONVENTIONS.md');
    if (!fs.existsSync(conf)) {
      fs.writeFileSync(conf, 'auto-commits: false\nattribute-author: false\nread: CONVENTIONS.md\n');
    }
    if (!fs.existsSync(conv)) {
      fs.writeFileSync(conv, '# Aider Project Conventions\n- Enforce strict typing and zero any.\n- Verify all tests pass before completing tasks.\n');
    }
  }

  if (requested.has('openhands')) {
    const p = path.join(root, '.openhands_instructions');
    if (!fs.existsSync(p)) {
      fs.writeFileSync(p, '# OpenHands Instructions\nFollow project invariants and run checks before committing.\n');
    }
  }

  if (requested.has('devin')) {
    const p = path.join(root, 'DEVIATION.md');
    if (!fs.existsSync(p)) {
      fs.writeFileSync(p, '# Devin Playbook & Task Deviations\nAdhere to .ai/manifest.json and verification commands.\n');
    }
  }

  if (requested.has('windsurf')) {
    const p = path.join(root, '.windsurfrules');
    if (!fs.existsSync(p)) {
      fs.writeFileSync(p, '# Windsurf Cascade Rules\nAdhere to .ai/manifest.json and run verification tests.\n');
    }
  }

  if (requested.has('cline')) {
    const p = path.join(root, '.clinerules');
    if (!fs.existsSync(p)) {
      fs.writeFileSync(p, '# Cline Custom Instructions\nAdhere to .ai/manifest.json and run verification tests.\n');
    }
  }

  if (requested.has('trae')) {
    const p = path.join(root, '.traerules');
    if (!fs.existsSync(p)) {
      fs.writeFileSync(p, '# Trae AI IDE Rules\nAdhere to .ai/manifest.json and project invariants.\n');
    }
  }

  if (requested.has('zed')) {
    const dir = path.join(root, '.zed');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const p = path.join(dir, 'settings.json');
    if (!fs.existsSync(p)) {
      fs.writeFileSync(
        p,
        JSON.stringify(
          {
            assistant: { default_model: 'default', version: '2' },
            context_servers: { auterix: { command: 'npx', args: ['auterix', 'check'] } },
          },
          null,
          2,
        ),
      );
    }
  }

  if (requested.has('continue')) {
    const dir = path.join(root, '.continue', 'rules');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const p = path.join(dir, 'workflow.md');
    if (!fs.existsSync(p)) {
      fs.writeFileSync(p, '# Continue.dev Instructions\nAdhere to .ai/manifest.json and verification commands.\n');
    }
  }

  if (requested.has('tabnine')) {
    const dir = path.join(root, '.tabnine');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const p = path.join(dir, 'rules.json');
    if (!fs.existsSync(p)) {
      fs.writeFileSync(
        p,
        JSON.stringify(
          {
            version: '1.0.0',
            rules: [
              'Enforce strict typing and zero any',
              'Respect database Row Level Security (RLS)',
              'Pass verification checks before commit',
            ],
          },
          null,
          2,
        ),
      );
    }
  }

  if (requested.has('roocode') || requested.has('kilo')) {
    const p = path.join(root, '.roomodes');
    if (!fs.existsSync(p)) {
      fs.writeFileSync(
        p,
        JSON.stringify(
          {
            customModes: [
              { slug: 'architect', name: 'Architect', roleDefinition: 'Architecture and task decomposition.', groups: ['read'] },
              { slug: 'code', name: 'Code', roleDefinition: 'High-precision implementation.', groups: ['read', 'edit'] },
              { slug: 'test', name: 'Test', roleDefinition: 'Verification and test suites.', groups: ['read', 'edit', 'command'] },
            ],
          },
          null,
          2,
        ),
      );
    }
  }

  if (requested.has('replit')) {
    const p = path.join(root, '.replit');
    if (!fs.existsSync(p)) {
      fs.writeFileSync(p, 'run = "npm test"\nentrypoint = "index.ts"\n');
    }
  }

  if (requested.has('v0') || requested.has('bolt') || requested.has('lovable')) {
    const dir = path.join(root, '.prompts');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (requested.has('v0')) {
      const p = path.join(dir, 'v0-system-prompt.md');
      if (!fs.existsSync(p)) {
        fs.writeFileSync(p, '# v0 System Prompt\nAlways use React Server Components where possible; validate mutations with Zod.\n');
      }
    }
    if (requested.has('bolt')) {
      const p = path.join(dir, 'bolt-system-prompt.md');
      if (!fs.existsSync(p)) {
        fs.writeFileSync(p, '# Bolt.new Prompt\nAdhere to project architecture in .ai/manifest.json.\n');
      }
    }
    if (requested.has('lovable')) {
      const p = path.join(dir, 'lovable-system-prompt.md');
      if (!fs.existsSync(p)) {
        fs.writeFileSync(p, '# Lovable Prompt\nAdhere to PostgreSQL RLS and strict TypeScript contracts.\n');
      }
    }
  }

  if (installPreCommit) {
    const gitDir = path.join(root, '.git');
    if (fs.existsSync(gitDir)) {
      const hooksDir = path.join(gitDir, 'hooks');
      if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir, { recursive: true });
      const hookPath = path.join(hooksDir, 'pre-commit');
      fs.writeFileSync(
        hookPath,
        '#!/bin/sh\n# Auterix Pre-Commit Guardrail\nif git diff --cached --name-only | grep -qE "^(\\.env|\\.env\\.local)$"; then\n  echo "❌ [BLOCKED] .env files staged for commit!" && exit 1\nfi\nnode .ai/tools/check.mjs --root . || exit 1\n',
        { mode: 0o755 }
      );
    }
  }

  const verified = check(root);

  return {
    status: 'initialized',
    root,
    version: b.version,
    profile: profileName || 'baseline',
    adapters: Array.isArray(rawAdapters)
      ? rawAdapters
      : (rawAdapters ? rawAdapters.split(',') : ['cursor', 'claude', 'antigravity', 'copilot', 'codex', 'windsurf', 'aider', 'coderabbit']),
    lock: '.ai/workflow.lock.json',
    verification: verified,
  };
}

try {
  const rawArgs = process.argv.slice(2);

  if (rawArgs.includes('--version') || rawArgs.includes('-v')) {
    process.stdout.write('1.2.0\n');
    process.exit(0);
  }

  if (rawArgs.includes('--help') || rawArgs.includes('-h') || rawArgs[0] === 'help') {
    process.stdout.write(`Auterix v1.2.0 - Universal Multi-Agent Workflow Standard

Usage:
  npx auterix [command] [options]

Commands:
  init            Interactive setup or headless setup with adapters and profile
  check           Verify context files against SHA-256 lockfile integrity
  inspect         Report detected AI adapters, stack, and active task state
  plan            Preview file changes for install
  update-plan     Preview file changes for update
  apply           Apply a reviewed plan
  extract-schema  Extract Drizzle/Prisma/SQL schema to token-optimized Markdown
  memory          Read or record to institutional cross-agent memory (.ai/memory.md)
  bundle          Compile canonical context bundle

Options:
  --root <path>       Working directory (default: cwd)
  --adapters <list>   Comma-separated adapter IDs or 'none'
  --profile <name>    Architecture blueprint profile
  --file <path>       Schema file to extract (for extract-schema)
  --out <path>        Output destination file
  --category <cat>    Memory category (architecture|security|conventions|anti-patterns)
  --note <text>       Memory entry content
  --pre-commit        Install git pre-commit safety guardrail hook
  --yes, -y           Skip interactive prompts
  --version, -v       Show version
  --help, -h          Show this help message
\n`);
    process.exit(0);
  }

  let command = undefined;
  let args = rawArgs;
  if (rawArgs.length > 0 && !rawArgs[0].startsWith('--')) {
    command = rawArgs[0];
    args = rawArgs.slice(1);
  }

  const booleanFlags = new Set(['--yes', '-y', '--pre-commit']);
  const valueFlags = new Set([
    '--root',
    '--out',
    '--plan',
    '--bundle',
    '--adapters',
    '--profile',
    '--license',
    '--file',
    '--category',
    '--note',
  ]);

  const options = {};
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if (booleanFlags.has(key)) {
      if (key in options) throw new Error(`Invalid option: ${key}`);
      options[key] = true;
    } else if (valueFlags.has(key)) {
      if (key in options || !args[i + 1] || args[i + 1].startsWith('--')) {
        throw new Error(`Invalid option: ${key}`);
      }
      options[key] = args[i + 1];
      i++;
    } else {
      throw new Error(`Invalid option: ${key}`);
    }
  }

  const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  if (options['--adapters'] !== undefined && !['plan', 'update-plan', 'init'].includes(command))
    throw new Error(
      '--adapters is supported only by plan, update-plan, and init; apply uses the reviewed selection.',
    );
  const bundle = () =>
    options['--bundle']
      ? validateBundle(readJsonFile(options['--bundle']))
      : buildBundle(sourceRoot);
  let result;

  if (!command) {
    if (process.stdin.isTTY && !options['--yes'] && !options['-y']) {
      const wizard = await runInteractiveWizard();
      const root = path.resolve(options['--root'] || process.cwd());
      result = performInit(root, wizard.adapters, wizard.profile, bundle, wizard.installPreCommit);
      process.stdout.write(`\n\x1b[32m✔ Auterix synchronized ${wizard.adapters.length} AI tools with ${wizard.profile} stack!\x1b[0m\n\n`);
    } else {
      throw new Error(
        'Usage: node bin/workflow.mjs init|inspect|plan|update-plan|apply|check|eject-plan|extract-schema|memory --root /absolute/project [--adapters cursor,claude,...|none] [--profile nextjs-supabase] [--bundle /absolute/bundle.json] [--plan /absolute/plan.json] [--out /absolute/new.json]; or bundle --out /absolute/new.json',
      );
    }
  } else {
    switch (command) {
      case 'bundle':
        result = bundle();
        break;
      case 'inspect':
        result = inspect(options['--root']);
        break;
      case 'plan':
        result = makePlan(options['--root'], bundle(), 'install', {
          adapters: options['--adapters'] === 'none' ? [] : options['--adapters']?.split(','),
        });
        break;
      case 'update-plan':
        result = makePlan(options['--root'], bundle(), 'update', {
          adapters: options['--adapters'] === 'none' ? [] : options['--adapters']?.split(','),
        });
        break;
      case 'apply':
        result = applyPlan(options['--root'], bundle(), readJsonFile(options['--plan']));
        break;
      case 'check':
        result = check(options['--root']);
        break;
      case 'eject-plan':
        result = ejectPlan(options['--root']);
        break;
      case 'init': {
        const root = path.resolve(options['--root'] || process.cwd());
        const preCommit = Boolean(options['--pre-commit']);
        result = performInit(root, options['--adapters'], options['--profile'], bundle, preCommit);
        break;
      }
      case 'extract-schema': {
        if (!options['--file']) throw new Error('--file is required for extract-schema');
        const md = extractSchemaContextFromFile(options['--file']);
        if (options['--out']) {
          fs.writeFileSync(options['--out'], md, 'utf-8');
          result = { status: 'extracted', file: options['--file'], out: options['--out'] };
        } else {
          process.stdout.write(md);
          process.exit(0);
        }
        break;
      }
      case 'memory': {
        const root = path.resolve(options['--root'] || process.cwd());
        if (options['--note']) {
          result = recordMemory(root, options['--category'] || 'architecture', options['--note']);
        } else {
          result = { memory: readMemoryContext(root) };
        }
        break;
      }
      default:
        throw new Error(
          'Usage: node bin/workflow.mjs init|inspect|plan|update-plan|apply|check|eject-plan|extract-schema|memory --root /absolute/project [--adapters cursor,claude,...|none] [--profile nextjs-supabase] [--bundle /absolute/bundle.json] [--plan /absolute/plan.json] [--out /absolute/new.json]; or bundle --out /absolute/new.json',
        );
    }
  }

  if (options['--out']) writeNewJson(options['--out'], result);
  else if (result) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`workflow: ${error.message}\n`);
  process.exitCode = 1;
}
