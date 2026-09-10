# ADR 04: Bounded retry attempts

Status: accepted

The worker stops after three total attempts. This includes the initial attempt;
an unbounded automatic retry would delay failure recovery and increase cost.
Changing MAX_ATTEMPTS requires a separate behavior regression and review.

Accepted usage text: A batch stops after three total attempts, including the first.
