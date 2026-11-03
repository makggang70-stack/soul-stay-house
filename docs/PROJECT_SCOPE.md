# SOUL STAY HOUSE — development scope

## MVP (P0)
- `/` home, `/houses` 3 scenic spaces, `/studio` audio mixer
- Web Audio generated ambient tones/noise, user-triggered playback, continuous player, sleep timer
- local settings/preset and basic error handling
- responsive PC/tablet/mobile and accessible controls
- admin content rights inventory before adding licensed tracks

## Beta (P1)
- sign-in; per-user private settings and journaling with server authorization
- quiet shared meditation rooms: real participants, synchronized sessions and timeouts
- audio rights tracking, CDN and content operations

## Later (P2)
- religious music as opt-in categories only, licensed catalog
- subscriptions, languages, expanded scene library

## Design
Warm forest green, cream, understated serif brand, minimal navigation, gentle no-pressure UX. Never treat passive listening as medical treatment.

## Important architecture decisions
- Separate visual scene from audio playback state.
- User gesture starts sound; never promise cross-device guaranteed 24-hour playback.
- Audio layers are independently gain-controlled; keep safe master volume.
- All journal entries private by default.
- Initial group timer is solo only; don't represent it as live multiplayer.
