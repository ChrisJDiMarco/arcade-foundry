# Arcade Foundry QA report

Date: 2026-08-15

## Completed checks

| Check | Result | Evidence |
|---|---|---|
| Factory cartridge validates | Pass | `npm test` — 4/4 tests passed |
| Unsafe network code is rejected | Pass | Unit test rejects `fetch()` |
| Cartridge CSP helper blocks connections | Pass | Unit test verifies `connect-src 'none'` |
| Clone wording is blocked before model call | Pass | Live IPC check returned the original-only refusal |
| Browser isolation is present | Pass | Live CDP inspection: `sandbox="allow-scripts"` |
| CRT game renders | Pass | Live window screenshot after CSP correction; canvas pixel data `[1,5,16,255]` and game loop loaded |
| Electron package | Pass | `dist/ArcadeFoundry-darwin-arm64/ArcadeFoundry.app` created and launched as process `ArcadeFoundry` |
| Package signature | Pass | `codesign --verify --deep --strict` returned valid on disk / satisfies designated requirement |

## Visual inspection

The live development window was inspected at desktop scale. The cabinet maintains a separate marquee, curved CRT bezel, scanline/glare treatment, control deck, joystick, colored physical buttons, coin door, speaker grille, and a dark cartridge-workbench rail. The loaded game remains legible beside the Forge controls.

## Known limitation

`OPENAI_API_KEY` was absent during this verification, so the live model-generated cartridge path was intentionally not exercised. The Forge UI reports the missing-key requirement and leaves the current cartridge unchanged; the built-in game, Service editor, export, import, persistence, and factory reset do not need a key.

The package is signed locally for this machine but has not been notarized or distributed.

## Material pass — 2026-08-15

Live visual inspection after the cabinet realism revision confirmed: worn black-enamel housing, faded brass-tinted edge wear, recessed bezel depth, CRT glare/scanlines, hardware bolts, scuffed control deck, raised joystick and buttons, worn coin door, and speaker grille. The game canvas, Forge panel, keyboard/mouse controls, and cartridge actions remained usable. The revised Apple-silicon app was repackaged and passed `codesign --verify --deep --strict`.
