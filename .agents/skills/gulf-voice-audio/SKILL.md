---
name: gulf-voice-audio
description: Implement or review audio behavior in Gulf Voice Library. Use for audio players, play/pause/seek, duration, volume, previews, MP3/WAV downloads, generated-audio state, metadata, lazy loading, playback errors, waveforms, or architecture for future effects, music, mixing, and processing.
---

# Gulf Voice Audio

## Purpose

Provide fast, predictable audio playback and downloads while keeping the audio subsystem extensible.

## Responsibilities

- Own browser playback, preview coordination, audio state, metadata normalization, formats, downloads, and audio-specific failures.
- Define boundaries for future sound effects, music, mixing, and processing without replacing the player core.
- Leave voice generation to TTS, storage authorization to security, and styling to design-system.

## Rules

- Maintain one playback coordinator so starting a preview pauses and resets the previously active preview.
- Load media only when needed; choose `preload="none"` or `metadata` by interaction.
- Never fetch the full voice catalog audio eagerly.
- Represent playback with explicit idle, loading, ready, playing, paused, ended, and error states.
- Clean up event listeners, object URLs, timers, and audio nodes on replacement or unmount.
- Treat MP3 and WAV as separate artifacts; never infer one URL from the other.
- Normalize duration and file metadata at boundaries and handle unknown duration safely.
- Keep generated audio distinct from catalog previews and preserve recording identity.
- Separate source acquisition, transport, waveform rendering, downloading, and future processing interfaces.

## Workflow

1. Identify the audio source, format, ownership, and lifecycle.
2. Register it with the shared playback coordinator.
3. Implement lazy loading and explicit state transitions.
4. Add seek, duration, volume, download, and error behavior as required.
5. Test rapid source switching, slow loading, unsupported media, expired URLs, and cleanup.

## Quality Checks

- Confirm only one preview plays at once and a new voice stops the previous audio.
- Confirm seeking and duration work before and after metadata arrives.
- Confirm downloads use the requested available format and meaningful filenames.
- Confirm controls are accessible and no listener, object URL, or audio-context leaks.

## Do Not

- Do not preload every file or decode waveforms for off-screen items.
- Do not create an uncoordinated `Audio` instance in every card.
- Do not fabricate conversions or fallback URLs.
- Do not couple playback to one TTS provider or storage backend.
