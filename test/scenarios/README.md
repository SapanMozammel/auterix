# Offline adoption scenarios

These synthetic consumers retain different application layouts, formatters,
commands, existing instructions, completed tasks and accepted decisions. The
adoption suite materializes them in isolated temporary directories and never
executes their commands. Executable source ends in `.fixture` here so Node's
default test discovery cannot execute consumer code; materialization removes
only that suffix.

Each scenario first refuses an instruction conflict, then explicitly preserves
and reconciles the existing policy before adoption. A later release must preserve
the consumer's active task, configuration, decision and history. A separate
deterministic harness reads only the installed consumer state to finish the
scoped documentation task, verifies retained source hashes, and records review.
Ejection remains a read-only preview. This proves repository-state continuity
and installer boundaries, not native AI-client behavior or application checks.
