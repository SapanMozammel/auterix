#!/usr/bin/env node
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

try {
  const [command, ...args] = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    if (
      !['--root', '--out', '--plan', '--bundle', '--adapters'].includes(key) ||
      !args[i + 1] ||
      args[i + 1].startsWith('--') ||
      key in options
    )
      throw new Error(`Invalid option: ${key}`);
    options[key] = args[i + 1];
  }
  const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  if (options['--adapters'] !== undefined && !['plan', 'update-plan'].includes(command))
    throw new Error(
      '--adapters is supported only by plan and update-plan; apply uses the reviewed selection.',
    );
  const bundle = () =>
    options['--bundle']
      ? validateBundle(readJsonFile(options['--bundle']))
      : buildBundle(sourceRoot);
  let result;
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
    default:
      throw new Error(
        'Usage: node bin/workflow.mjs inspect|plan|update-plan|apply|check|eject-plan --root /absolute/project [--adapters codex,cursor|none] [--bundle /absolute/bundle.json] [--plan /absolute/plan.json] [--out /absolute/new.json]; or bundle --out /absolute/new.json',
      );
  }
  if (options['--out']) writeNewJson(options['--out'], result);
  else process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`workflow: ${error.message}\n`);
  process.exitCode = 1;
}
