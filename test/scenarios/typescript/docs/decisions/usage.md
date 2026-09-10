# ADR 02: Minimum search query

Status: accepted

One-character searches cause excessive irrelevant results. The existing shared
contract requires two characters after trimming. Keep that behavior and document
it; changing the constraint requires a separate application task.

Accepted usage text: Search queries need at least two characters after trimming.
