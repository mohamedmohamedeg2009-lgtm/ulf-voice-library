---
name: gulf-voice-design-system
description: Define, implement, or review Gulf Voice Library interface design. Use for Arabic RTL layouts, responsive/mobile UI, dark-theme tokens, typography, spacing, navigation, cards, buttons, forms, dialogs, sliders, audio controls, waveforms, and loading, empty, or error states.
---

# Gulf Voice Design System

## Purpose

Keep every Gulf Voice screen cohesive, fast, accessible, Arabic-first, and comfortable on phones.

## Responsibilities

- Own visual tokens, component appearance, interaction states, responsive behavior, and accessibility expectations.
- Cover navigation, cards, buttons, forms, dialogs, sliders, audio players, waveforms, and feedback states.
- Review new screens for consistency with existing primitives before accepting new patterns.
- Leave feature logic, persistence, provider integration, and authorization to their dedicated skills.

## Rules

- Set the document direction to RTL and test mixed Arabic, Latin, numbers, durations, and filenames explicitly.
- Build mobile-first; enhance layouts at larger breakpoints without changing task order or meaning.
- Use semantic design tokens through Tailwind/shadcn rather than isolated color, radius, shadow, or spacing values.
- Use a restrained dark palette with readable contrast, visible focus, and distinct interaction and feedback states.
- Use an Arabic-capable font stack, predictable type scale, comfortable line height, and logical alignment.
- Keep touch targets at least 44 by 44 CSS pixels and primary actions reachable on small screens.
- Prefer consistent spacing, limited card nesting, short forms, and progressive disclosure.
- Make audio controls and processing state immediately recognizable.
- Respect reduced-motion preferences; use brief motion only for orientation or feedback.

## Workflow

1. Inspect existing tokens and reusable components.
2. Define the content hierarchy and primary mobile task.
3. Compose from shadcn/ui and project primitives; add a primitive only when reuse is likely.
4. Implement default, interaction, loading, empty, error, disabled, and success states.
5. Check mobile, tablet, and desktop layouts in RTL.
6. Verify keyboard use, focus order, labels, contrast, truncation, and reduced motion.

## Quality Checks

- Confirm no horizontal overflow at supported widths.
- Confirm logical CSS properties or RTL-aware utilities are used where direction matters.
- Confirm Arabic copy remains readable at zoom and long content does not break controls.
- Confirm audio controls respond quickly and expose status without relying on color alone.
- Confirm the screen reuses product tokens and patterns.

## Do Not

- Do not create crowded layouts, excessive animation, or deeply nested cards.
- Do not mirror familiar media-control direction without usability evidence.
- Do not use arbitrary one-off values when a token exists.
- Do not hide essential actions behind hover-only interactions.
