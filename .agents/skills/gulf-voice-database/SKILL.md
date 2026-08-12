---
name: gulf-voice-database
description: Design, migrate, query, or review Gulf Voice Library data in Supabase and PostgreSQL. Use for voices, recordings, projects, favorites, app_settings, optional voice_tags, relations, constraints, indexes, migrations, recording metadata, data integrity, and generated database types.
---

# Gulf Voice Database

## Purpose

Maintain an explicit, migration-driven relational model with strong integrity and efficient access paths.

## Responsibilities

- Own schemas, migrations, relations, constraints, indexes, database functions, and generated database types.
- Model `voices`, `recordings`, `projects`, `favorites`, and `app_settings`; add `voice_tags` only when justified.
- Coordinate row-level policies with security and storage lifecycle with audio/security.

## Rules

- Make every schema change through an ordered migration; never rely on dashboard-only edits.
- Use database snake_case and map deliberately to application naming at typed boundaries.
- Give recordings: `id`, `text`, `voice_id`, `voice_name`, `settings`, `audio_url`, `mp3_url`, `wav_url`, `duration`, `project_id`, and `created_at`.
- Give voices: `id`, `name`, `display_name`, `dialect`, `country`, `gender`, `age_style`, `voice_tone`, `energy_level`, `style_tags`, `description`, `preview_audio_url`, `provider`, `provider_voice_id`, `is_active`, `created_at`, and `updated_at`.
- Define foreign-key actions intentionally and protect referenced data from accidental deletion.
- Enforce uniqueness for favorites per owner/voice and provider voice identity where appropriate.
- Use suitable PostgreSQL types, timestamps with time zone, defaults, checks, and non-null constraints.
- Index foreign keys and measured filter/sort paths; avoid speculative duplicate indexes.
- Use transactions for multi-row invariants and explicit compensation for storage/database failures.

## Workflow

1. Identify entities, ownership, cardinality, lifecycle, and required queries.
2. Draft the migration, constraints, indexes, and safe backfill sequence.
3. Check compatibility with existing data and deployed application versions.
4. Apply in an isolated environment and regenerate database types.
5. Test writes, constraint failures, joins, and relevant query plans.
6. Report irreversible or multi-phase deployment requirements.

## Quality Checks

- Confirm required columns, relations, and intentional nullability.
- Confirm orphan recordings, duplicate favorites, and invalid provider identities are prevented.
- Confirm migrations work from clean and prior schema states.
- Confirm indexes match real access patterns and types match the schema.

## Do Not

- Do not use manual production edits as the source of truth.
- Do not store relational data as unvalidated JSON merely to avoid schema design.
- Do not delete populated columns in one unsafe step when expand/migrate/contract is needed.
- Do not weaken constraints to hide faulty application behavior.
