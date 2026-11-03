# CODEX — First implementation task

You are the lead engineer for SOUL STAY HOUSE. Use this repository and existing functional prototype; **do not work in soul-stay-garden**.

## Goal
Turn the current one-page dependency-free proof of concept into a maintainable app foundation without losing working audio.

## Phase 1 checklist
1. Audit existing files and document current behavior.
2. Introduce Vite + TypeScript (or another justified lightweight stack); organize UI, audio engine, storage, and page routing into modules.
3. Implement real scene switching with original or properly licensed assets (fallback CSS scenes must still work).
4. Keep Web Audio engine as a singleton and preserve playback across routes.
5. Add automated tests for settings persistence, journal CRUD and HTML-safe rendering, audio volume boundaries, and timer behavior. Avoid claiming actual sound output in headless tests.
6. Add explicit privacy notice for local journal, browser audio restrictions, and prototype limitations.
7. Add scripts for install/dev/build/test/lint, run them, and document actual results.
8. Commit to a feature branch and open a PR if connected GitHub access permits.

## Acceptance criteria
- `npm install`, `npm run dev`, `npm run build`, `npm test` succeed after migration.
- 3 houses and mobile navigation work.
- Audio continues while navigating; no audio starts before click.
- Preset and journal persist locally; private journal text never rendered as unsanitized HTML.
- No unlicensed music, no fake online participants, no hard-coded secrets.

## Next milestones (do not implement without prioritization)
- Auth + PostgreSQL, server-backed private journal, personal presets.
- Scheduled communal meditation sessions with verifiable real-time counts.
- Licensed audio catalog and track rights/expiry admin.
- Payment/subscription after actual user retention validation.
