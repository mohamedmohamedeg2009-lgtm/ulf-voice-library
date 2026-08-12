---
name: gulf-voice-frontend
description: Build, refactor, or review the Gulf Voice Library frontend with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui. Use for routes, React components, feature modules, hooks, client state, service adapters, frontend validation, and server-versus-client component decisions.
---

# Gulf Voice Frontend

## Purpose

Deliver maintainable feature-oriented frontend code with minimal client JavaScript and clear boundaries.

## Responsibilities

- Own route composition, React components, feature modules, hooks, browser state, frontend types, and service boundaries.
- Organize code under `src/app`, `src/components`, `src/features`, `src/hooks`, `src/lib`, `src/services`, `src/store`, `src/types`, and `src/config`.
- Keep `voices`, `studio`, `favorites`, `history`, and `projects` as independent feature modules.
- Coordinate visual decisions with design-system and backend concerns with their domain skills.

## Rules

- Default to Server Components; add `use client` only at the smallest boundary requiring browser APIs, state, effects, or event handlers.
- Keep routes thin. Put feature UI and orchestration in `src/features/<feature>`.
- Put shared presentational primitives in `src/components`; do not move feature-specific components there prematurely.
- Keep external access behind typed services and validate untrusted boundary data with Zod.
- Use Zustand only for genuinely shared client state; prefer server data, URL state, and local state first.
- Model loading and errors deliberately with App Router conventions and typed results.
- Use path aliases consistently and avoid circular imports or feature-to-feature internals.
- Keep public environment variables non-secret and centralize configuration parsing.

## Workflow

1. Locate the owning route and feature and inspect adjacent conventions.
2. Define data ownership, server/client boundary, types, and validation.
3. Add the smallest cohesive components and service functions.
4. Handle pending, empty, error, unauthorized, and success outcomes.
5. Add focused tests, then run lint, typecheck, tests, and build.

## Quality Checks

- Require zero TypeScript and lint errors.
- Confirm client bundles receive no secrets or unnecessary server dependencies.
- Confirm large files are split by responsibility and no logic or primitives are duplicated.
- Confirm RTL, responsiveness, accessibility, and user-visible failures are covered.

## Do Not

- Do not make an entire page a Client Component for one interactive child.
- Do not fetch directly from providers inside presentational components.
- Do not use `any`, unsafe assertions, or ignored errors to force compilation.
- Do not create global stores for transient local form or dialog state.
- Do not mix unrelated features in one module.
