---
name: gulf-voice-security
description: Secure or review Gulf Voice Library authentication and trust boundaries. Use for Supabase Auth, private-route protection, allowed-email restrictions, environment secrets, .env.example, Zod input validation, upload type/size checks, Route Handlers, Server Actions, Storage, database writes, row-level security, and sanitized errors.
---

# Gulf Voice Security

## Purpose

Keep the personal Gulf Voice site private and secrets, privileged operations, and user data server-controlled.

## Responsibilities

- Own authentication, authorization, allowed-email policy, secrets, input/upload validation, RLS expectations, storage access, and safe errors.
- Define required placeholders in `.env.example` without real values.
- Review Route Handlers, Server Actions, storage operations, and database writes at trust boundaries.

## Rules

- Use Supabase Auth and deny protected content by default without a valid session.
- Enforce authorization server-side for every protected read/write; middleware is not the sole control.
- When allowed email is configured, normalize and compare the verified email server-side and deny all others.
- Keep API keys, service-role keys, TTS keys, and AI keys in server-only variables and modules.
- Expose only intentionally public Supabase values; an anon key is not authorization.
- Validate params, form data, JSON, provider output, and environment configuration with Zod.
- Validate uploads by allowlisted MIME type, signature/extension where practical, size, owner, and destination; generate object paths server-side.
- Apply RLS and ownership checks; service-role use never replaces authorization.
- Return stable sanitized errors without stack traces, SQL details, tokens, secret URLs, or provider payloads.
- Rate-limit expensive generation endpoints where possible and make duplicate submissions idempotent where needed.

## Workflow

1. Identify actors, assets, entry points, trust boundaries, and intended owner.
2. Define authentication, authorization, validation, storage, and error requirements.
3. Implement checks at the server entry point and reinforce ownership with RLS.
4. Add `.env.example` placeholders and fail closed on missing required configuration.
5. Test anonymous, wrong-account, allowed-account, malformed input, invalid files, and downstream errors.
6. Inspect client bundles and logs for leaks.

## Quality Checks

- Confirm every private route, action, handler, write, and storage operation rejects unauthorized access.
- Confirm secret values are absent from source, fixtures, browser bundles, and `.env.example`.
- Confirm schemas impose useful length, enum, numeric, and file limits.
- Confirm objects cannot be overwritten or read across ownership boundaries.
- Confirm user responses reveal no stack traces or secrets.

## Do Not

- Do not trust hidden UI, client state, middleware alone, or client-supplied user IDs as authorization.
- Do not put privileged secrets in `NEXT_PUBLIC_*` variables or browser code.
- Do not accept arbitrary upload types, sizes, filenames, or paths.
- Do not disable RLS or use privileged clients broadly to make queries pass.
- Do not log credentials, tokens, sensitive prompts, signed URLs, or raw exceptions.
