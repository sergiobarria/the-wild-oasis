# Product Spec

> **Not written yet.** The full spec lands here. Until then, treat requirements as
> unspecified and ask rather than assume — do not infer product behaviour from the
> scaffold or from the legacy data files in `data/`.

Suggested shape when filling this in:

## Problem and audience

Who uses this, and what breaks for them today.

## Scope

What is in, and — just as important — what is explicitly out.

## Domain model

The entities and their relationships, in product language. The Convex schema follows
from this, not the other way round.

## Flows

The handful of paths that matter end to end (booking, check-in, cancellation, …),
including the failure and edge cases.

## Roles and permissions

Who can see and do what. This is the input to the authorization checks inside the Convex
functions — see `docs/01_PROJECT_SCAFFOLD.md` §5.

## Non-goals and open questions

Anything deliberately deferred, and the decisions still outstanding.
