---
name: gulf-voice-ai
description: Build or review Gulf Voice Library AI features. Use for text analysis, top-three voice recommendations, voice-setting suggestions, text improvement, Magic Wand consent flows, AIService/provider abstraction, structured output validation, and domain-aware prompts extensible beyond sports.
---

# Gulf Voice AI

## Purpose

Deliver useful, consent-aware AI assistance through a provider-neutral service with validated results.

## Responsibilities

- Own `AIService`, adapters, prompt contracts, structured outputs, recommendation rationale, and consent around text changes.
- Support `analyzeText`, `recommendVoice`, `suggestVoiceSettings`, and `improveText`.
- Optimize initially for football, stadium bookings, match ads, challenges, and tournaments without encoding sports into core interfaces.
- Leave TTS generation, styling, and persistence to their domains.

## Rules

- Keep AI SDK calls server-side behind `AIService`; components never consume provider SDKs.
- Validate every response with Zod and handle refusal, truncation, malformed output, timeout, and rate limits.
- Ground recommendations in the available active voice catalog and supported settings.
- Return exactly the best three eligible voices when three exist; otherwise return all and state the limitation.
- Include one concise evidence-based reason per recommendation; never invent capabilities.
- Before Magic Wand runs, ask whether to improve settings only or both text and settings.
- Never replace or persist user text without explicit approval; show a preview or diff.
- Parameterize prompts by domain so future non-sports use does not require redesign.
- Treat output as advisory and untrusted, not authorization or executable instructions.

## Workflow

1. Identify the AI operation, intent, context inputs, and consent requirement.
2. Build a minimal structured request using domain-neutral types.
3. Invoke the configured server-side adapter with limits and timeout.
4. Validate the result and reconcile voice IDs with current catalog data.
5. Present recommendations or proposed changes for review.
6. Apply text changes only after explicit confirmation.

## Quality Checks

- Confirm providers can be swapped without component changes.
- Confirm returned voices exist, are active, and support suggested settings.
- Confirm recommendations are ranked, limited to three, and justified.
- Confirm original text remains unchanged and recoverable before approval.
- Confirm Arabic and Gulf context are preserved.

## Do Not

- Do not import OpenAI or another provider in UI components.
- Do not accept free-form output where a typed schema is possible.
- Do not silently alter text, dialect, facts, names, dates, or calls to action.
- Do not invent voices, settings, or successful fallbacks.
- Do not lock architecture permanently to sports.
