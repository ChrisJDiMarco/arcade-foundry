# Arcade Foundry v1 product requirements

Status: **LOCKED FOR BUILD — 2026-08-15**

`design/arcade-foundry-interface-reference.png` governs the visual hierarchy. This document governs behavior and truth.

## Product statement

Arcade Foundry is a native macOS Electron cabinet that turns an original-game prompt or a pasted HTML cartridge into a playable, local arcade game without leaving the machine.

## Core promise

From a prompt or code change, the owner can boot a playable, original one-screen game in one explicit action and control it with the relevant keyboard or mouse inputs.

## Product principles

1. **The cabinet is the hero.** The editor is a pull-out service panel, not the main stage.
2. **Play is the proof.** Every cartridge has a visible control card and starts focused in the CRT.
3. **Generated code is untrusted.** It runs only inside an opaque `sandbox="allow-scripts"` iframe with a host-injected CSP that blocks all networking, frames, forms, and external media.
4. **No privileged bridge reaches a cartridge.** The cartridge has no Node, Electron, preload, filesystem, clipboard, shell, or host IPC access.
5. **Original mechanics, not infringed games.** The forge rejects requests to reproduce protected characters, names, art, audio, level layouts, or branded games. It can make an original mechanical remix.
6. **No fake AI.** Missing credentials, a provider error, invalid output, or an unsafe cartridge leaves the current game intact and says exactly why.
7. **Code remains owned and visible.** The source panel can be copied, replaced, applied, reset, and saved locally.

## Primary loop

1. Launch into the original default cartridge, **Neon Bastion**.
2. Click the CRT or press the green `PLAY` button; arrow keys steer and Space fires.
3. Enter an original-game request such as “make a mouse-aimed neon asteroid game with one button to boost.”
4. Forge a cartridge with AI, or paste/edit its code manually.
5. Inspect the game title and controls card, then click `BOOT CARTRIDGE`.
6. Play immediately. Revise through the service panel.

## Required screens and states

### Cabinet floor

- Full-window, hyperreal standing arcade cabinet in a dark repair-shop arcade.
- Curved CRT viewport, scanline/reflection layer, physical marquee, speaker grille, coin door, control deck, joystick, six buttons, and a small control card.
- The CRT houses the sandboxed cartridge. It receives pointer and keyboard focus when the player clicks it or hits `PLAY`.
- Bottom rail: prompt field, `FORGE`, `PLAY`, `SERVICE`, `RESET`, and a local-save indicator.
- In-cabinet controls mirror the currently declared controls, but keyboard and mouse are the actual universal controller.

### Service panel

- Slide-over code editor with full game source, title, tagline, controls, validation badge, and `APPLY & BOOT`.
- `COPY SOURCE`, `SAVE CARTRIDGE`, `LOAD CARTRIDGE`, and `RESET TO NEON BASTION` actions.
- Escape closes the panel. Tab reaches all controls. Applying a rejected cartridge cannot disturb the current running cartridge.

### States

- Default playable cartridge.
- Forging: current game keeps running while the Forge control reports progress.
- Missing API key: `OPENAI_API_KEY is not configured. You can still edit and play local cartridges.`
- Provider, invalid-output, or safety rejection: exact visible error, current cartridge preserved.
- Empty/invalid pasted source: an error row explains the failure, no boot occurs.
- Saved: a local state receipt is shown.

## AI behavior

### Role

Turn an owner instruction into one original, standalone HTML arcade cartridge. It must draw and play using inline Canvas/Web APIs only.

### Context

- The owner prompt, bounded to 1,200 characters.
- Current cartridge metadata, not its full source.
- The cartridge contract and safety constraints.

### Output contract

Structured response object with `title`, `tagline`, `controls`, `html`, and `changeSummary`. `html` is a complete standalone HTML document, limited locally to 90 KB.

### Prohibited output

- Copyrighted or branded game clones, copied assets, characters, level layouts, music, or named franchises.
- External scripts, images, fetch/XHR/WebSocket, forms, iframes, popups, `window.top`, `parent`, Electron/Node references, local storage, or network code.
- Anything other than an original one-player game and an inline control card.

## AI integration

- Provider: OpenAI Responses API, called only from Electron’s main process.
- Default model: `gpt-5.6`; override with `OPENAI_MODEL`.
- Output: strict `text.format` JSON Schema, then local validation.
- Key: `OPENAI_API_KEY` only. It is never persisted.
- API `store: false`, 45-second abort, no conversation history.
- A successful live generation is claimed only with a provider receipt.

## Data model

### Cartridge

- `id`, `title`, `tagline`, `controls`, `html`, `changeSummary`, `updatedAt`.

### Arcade state

- `current` cartridge, up to 20 local history entries, `lastPrompt`, `serviceOpen`.
- Saved atomically under Electron `userData`. Invalid/corrupt saved state is preserved with a timestamped `.corrupt.json` suffix before the default is restored.

## Functional acceptance checks

1. Launch boots the original **Neon Bastion** default and it can be played with arrow keys plus Space.
2. The CRT receives focus from `PLAY` and direct click; mouse-based cartridges receive pointer input inside the CRT.
3. The visible cabinet includes realistic CRT, scanlines, glass reflections, marquee, speaker, coin door, joystick, and buttons without copied cabinet art or trademarks.
4. Service panel exposes source, title, tagline, controls, copy, save, load, reset, and apply controls.
5. A valid self-contained local HTML cartridge applies and plays without network access.
6. Source containing an external URL, network primitive, privileged API reference, iframe, form, or `window.top` is rejected and leaves the current cartridge unchanged.
7. The active iframe is opaque-sandboxed, has no Node integration, and receives a restrictive injected CSP.
8. Main window has `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`, restrictive host CSP, denied permissions, blocked navigation/new windows, and narrow sender-validated IPC.
9. AI request supports original game prompts and returns a structured cartridge; failed, invalid, or missing-key calls preserve the running game.
10. “Clone” prompts are refused with a concrete offer to build an original mechanical remix instead.
11. Local state persists across relaunch; corruption recovery preserves the bad state and resets safely.
12. Keyboard shortcuts: Command/Ctrl+Enter for Forge, Command/Ctrl+R for apply, Escape closes Service, P focuses and plays.
13. `npm test`, syntax checks, audit, macOS package, ad-hoc signing, and signature verification pass.
14. A real macOS packaged window is launched and visually checked at 1,440 × 960 and 1,050 × 720.
15. Live AI is disclosed accurately if no valid key is present.

## Visual direction

- Reference: `design/arcade-foundry-interface-reference.png`.
- The room is almost black with rain-on-window blue and spent-amber bulb spill. The cabinet is the illuminated object.
- Materials: smoked plastic, coin-door chrome, chipped powder coat, black CRT glass, injection-molded buttons, zinc joystick shaft, dust caught in side light.
- Type: condensed technical grotesk for marquee and labels; small monospaced repair ticket copy.
- Avoid: flat retro vectors, generic neon gradients, faux wood arcade bars, pixel-art wallpaper, and dashboard-card density.

## Deliberate omissions

- No copyrighted game cloning, ROMs, emulation, imports from commercial games, multiplayer, online sharing, cloud sync, game marketplace, monetization, audio generation, gamepad support, or native code execution.

## Release evidence

- Research brief, locked PRD, generated reference image, code, tests, security audit, package/signing receipts, native-window screenshots, a playable default cartridge, and exact API-key disclosure.
