---
name: gulf-voice-tts
description: Design, integrate, or review text-to-speech in Gulf Voice Library. Use for VoiceProvider contracts, provider adapters, voice catalogs, generation, settings validation, timeouts, rate limits, invalid voices, unsupported options, server-side credentials, and honest fallback structure.
---

# Gulf Voice TTS

## Purpose

Keep text-to-speech provider-neutral, server-only, validated, observable, and replaceable.

## Responsibilities

- Own the `VoiceProvider` contract, provider adapters, normalized voice models, generation, settings validation, and provider error mapping.
- Require persisted voices to retain `provider` and `providerVoiceId`.
- Leave playback, persistence schema, and route authorization to their domain skills.

## Rules

- Define `VoiceProvider` with at least `generateVoice`, `getVoices`, `getVoice`, and `validateSettings`.
- Keep provider SDKs and API keys in server-only modules.
- Use normalized inputs and outputs so components never depend on provider payloads.
- Validate text, voice identity, format, and settings before contacting a provider.
- Map failures into timeout, rate limit, invalid voice, unsupported setting, authentication, unavailable, and unknown.
- Apply explicit timeouts and cancellation where supported; log correlation details without secrets.
- Reject unsupported settings rather than silently dropping them.
- Define fallback structure only when needed; never claim failover unless a real provider can execute it.
- Keep ElevenLabs, Azure, Google, and custom implementations behind adapters.

## Workflow

1. Define normalized voice, settings, request, result, and error types.
2. Implement the adapter without leaking SDK types.
3. Validate settings and resolve the stored provider voice identifier.
4. Generate server-side with timeout, cancellation, and mapped errors.
5. Persist and return normalized metadata and authorized audio references.
6. Test success and each expected failure class.

## Quality Checks

- Confirm no TTS secret or provider SDK enters a client bundle.
- Confirm every stored voice has both provider fields.
- Confirm unsupported options fail clearly before a billable request.
- Confirm logs and user messages are useful but sanitized.
- Confirm adding a provider does not require component rewrites.

## Do Not

- Do not call providers from React components or browser code.
- Do not hard-code one provider into the domain model.
- Do not retry validation or authentication failures.
- Do not fabricate fallback audio or success.
- Do not expose raw provider errors, keys, or stack traces.
