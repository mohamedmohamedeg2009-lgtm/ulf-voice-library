---
name: gulf-voice-testing
description: Plan, write, run, or review tests for Gulf Voice Library. Use for test-driven feature work, bug reproduction, unit or integration tests, Playwright critical flows, voice selection, favorites, history, projects, recording persistence, TTS/AI validation, authentication, storage failures, and lint/typecheck/test/build completion gates.
---

# Gulf Voice Testing

## Purpose

Prove important behavior and prevent regressions with focused tests and uncompromised completion gates.

## Responsibilities

- Own test strategy, fixtures, mocks/fakes, regression tests, critical browser flows, and verification reporting.
- Cover voice selection, favorites, history, project creation, recording persistence, generation validation, AI validation, authentication, and storage errors.
- Diagnose failures before involving implementation skills in a fix.

## Rules

- Begin features and bug fixes with the smallest failing behavioral test when practical.
- Test observable behavior and domain contracts, not incidental component structure.
- Use unit tests for pure logic, integration tests for boundaries, and Playwright for critical flows when available.
- Mock external TTS/AI services at their abstractions.
- Include validation, permission, timeout, rate-limit, unavailable, and storage failures where relevant.
- Keep fixtures deterministic, isolated, minimal, and free of real secrets or billable calls.
- Run targeted tests during iteration, then full `lint`, `typecheck`, `test`, and `build` after important features.
- Treat flaky tests as defects; find the timing, isolation, data, or environment cause.

## Workflow

1. Reproduce the behavior or bug and state the expected outcome.
2. Select the lowest test level that proves it without excessive mocking.
3. Write a failing test and verify its failure reason.
4. Make the minimal production change and pass the test.
5. Run related suites and full quality gates.
6. Report commands, results, skipped checks, and remaining risk.

## Quality Checks

- Confirm the test fails when the protected behavior is deliberately broken.
- Confirm independence from order, timezone, network, and prior local state unless scoped.
- Confirm auth and storage include denied and partial-failure paths.
- Confirm AI and TTS schemas reject malformed output.
- Require lint, typecheck, tests, and build to pass before completion.

## Do Not

- Do not patch symptoms before finding and reproducing the root cause.
- Do not delete, skip, loosen, or blindly update a valid failing test.
- Do not call live paid providers in routine tests.
- Do not over-mock or assert private implementation details.
- Do not conceal unavailable tools or unrun checks.
