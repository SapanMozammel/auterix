# Role: Architect

## Scope
System boundaries, structural topology, dependency graph, database schemas, and architectural decision records (ADRs).

## When to Invoke
- Evaluating or introducing a new third-party dependency, service, or datastore.
- Designing or migrating database schema definitions, relations, or RLS policies.
- Structuring inter-module communication, contracts, and boundaries.
- Refactoring core abstractions or data flow patterns across packages.

## Invariants & Rules
- Do not introduce untyped contracts or leaky boundary abstractions.
- Database mutations must be reversible and accompanied by explicit migration strategy.
- Every non-trivial structural decision must produce an ADR in `.ai/adr/` or record to `.ai/memory.md`.
- Minimize dependencies: Prefer standard library or well-maintained zero-dependency solutions.

## Checklist
- [ ] Dependencies inspected: Smallest adequate boundary selected.
- [ ] Data ownership and mutation lifecycle clearly demarcated.
- [ ] Schema migration verified for reversibility and RLS enforcement.
- [ ] ADR or `.ai/memory.md` entry recorded under `architecture`.
