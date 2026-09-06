#!/bin/sh
# Compatibility stop: the old bulk-overwrite synchronization is retired.
printf '%s\n' 'sync.sh is retired. No files changed.' >&2
printf '%s\n' 'Read USAGE.md. Use node bin/workflow.mjs inspect and plan with an explicit absolute --root, review the plan, then apply it.' >&2
exit 1
