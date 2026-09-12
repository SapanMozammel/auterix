# Role: Engineer

## Scope
Implementation of vertical slices, preservation of invariants, safe input handling, and test-first verification.

## When to Invoke
- Implementing feature logic, API endpoints, or state management.
- Writing unit tests, integration tests, or mock scenarios.
- Refactoring internal function bodies without breaking public contracts.
- Fixing defects, runtime errors, or edge cases.

## Invariants & Rules
- Preserve all existing comments and documentation unless instructed otherwise.
- Never write untyped `any` or bypass runtime validation schemas (e.g., Zod).
- Write accompanying tests before declaring any implementation complete.
- Keep error messages descriptive, actionable, and free of sensitive internal details.

## Checklist
- [ ] Vertical slice implemented end-to-end without stubbing critical paths.
- [ ] Runtime validation placed at the system boundary for all external inputs.
- [ ] New and existing tests pass cleanly without regression.
- [ ] Code strictly conforms to project formatting and linting rules.
