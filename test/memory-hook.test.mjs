/**
 * Tests for parseCommitMessage() in lib/memory.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseCommitMessage } from '../lib/memory.mjs';

describe('parseCommitMessage', () => {
  it('extracts architecture note', () => {
    const result = parseCommitMessage('Switch from REST to tRPC --ai-note architecture');
    assert.deepStrictEqual(result, { note: 'Switch from REST to tRPC', category: 'architecture' });
  });

  it('extracts security note', () => {
    const result = parseCommitMessage('Enforce RLS on all tables --ai-note security');
    assert.deepStrictEqual(result, { note: 'Enforce RLS on all tables', category: 'security' });
  });

  it('extracts conventions note', () => {
    const result = parseCommitMessage('Use Zod for all form validation --ai-note conventions');
    assert.deepStrictEqual(result, { note: 'Use Zod for all form validation', category: 'conventions' });
  });

  it('extracts anti-patterns note', () => {
    const result = parseCommitMessage('Removed client-side Supabase key --ai-note anti-patterns');
    assert.deepStrictEqual(result, { note: 'Removed client-side Supabase key', category: 'anti-patterns' });
  });

  it('defaults to conventions when no category specified', () => {
    const result = parseCommitMessage('Add tests for auth flow --ai-note');
    assert.deepStrictEqual(result, { note: 'Add tests for auth flow', category: 'conventions' });
  });

  it('defaults to conventions for unknown categories', () => {
    const result = parseCommitMessage('Some decision --ai-note unknowncategory');
    assert.deepStrictEqual(result, { note: 'Some decision', category: 'conventions' });
  });

  it('returns null for commits without --ai-note', () => {
    const result = parseCommitMessage('Normal commit without any flags');
    assert.strictEqual(result, null);
  });

  it('returns null for empty string', () => {
    const result = parseCommitMessage('');
    assert.strictEqual(result, null);
  });

  it('returns null for non-string input', () => {
    assert.strictEqual(parseCommitMessage(null), null);
    assert.strictEqual(parseCommitMessage(undefined), null);
    assert.strictEqual(parseCommitMessage(42), null);
  });

  it('returns null when --ai-note is at the start (empty note)', () => {
    const result = parseCommitMessage('--ai-note architecture');
    assert.strictEqual(result, null);
  });

  it('handles extra whitespace around --ai-note', () => {
    const result = parseCommitMessage('Migrate to Drizzle ORM   --ai-note   architecture');
    assert.deepStrictEqual(result, { note: 'Migrate to Drizzle ORM', category: 'architecture' });
  });

  it('handles multi-word notes with special characters', () => {
    const result = parseCommitMessage('Switch auth: JWT → session cookies (more secure) --ai-note security');
    assert.deepStrictEqual(result, { note: 'Switch auth: JWT → session cookies (more secure)', category: 'security' });
  });
});
