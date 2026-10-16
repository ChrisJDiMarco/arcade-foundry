# Arcade Foundry research

Date: 2026-08-15

## Job

Chris wants one desktop arcade cabinet where a fresh game can be created from a sentence or edited code, then played immediately with the keyboard and mouse. The cabinet has to feel physically convincing, not like a code editor wearing a retro skin.

## What the market already makes ordinary

- Browser game engines already support keyboard, pointer, and gamepad input. Phaser documents a unified input system and a conventional canvas game lifecycle. That makes basic browser game play table stakes, not the product. [Phaser input](https://docs.phaser.io/phaser/concepts/input), [Phaser game lifecycle](https://docs.phaser.io/phaser/getting-started/making-your-first-phaser-game) — fetched 2026-08-15.
- Electron can make a native desktop shell, but executing remote or model-generated code in a privileged renderer is explicitly dangerous. Electron recommends no Node integration for untrusted content, context isolation, process sandboxing, restricted navigation, narrow IPC, and no exposed Electron APIs. [Electron security](https://www.electronjs.org/docs/latest/tutorial/security), [context isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation) — fetched 2026-08-15.
- OpenAI Structured Outputs can return a schema-shaped response, which fits a game-cartridge contract better than unreliable freeform prose. The host must still validate length and policy locally. [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) — fetched 2026-08-15.

## Four directions debated

| Direction | Value | Distinctiveness | Build risk | Verdict |
| --- | --- | --- | --- | --- |
| Conventional AI game maker | Prompt, code editor, preview pane | Low. Every element is familiar and the game is secondary. | Medium | Reject. Competent but dead. |
| **Cabinet cartridge forge** | One physical machine, one prompt creates one playable cartridge | High. The machine is the product and the play test is instant. | Medium | **Choose.** |
| Full arcade operating system | Cabinets, cabinet marketplace, game sharing, high scores, mods | High later, diffuse now | High | Defer until people make and replay cartridges. |
| Skeptic | AI games are toy demos, generated code is unsafe, “clone” invites IP trouble | Important dissent | Low | Keep the security boundary and ban branded clones. |

## Product thesis

Build a cabinet-first game forge, not a generic game builder. A prompt becomes a self-contained, local “cartridge” that boots inside the CRT. The user can also edit or paste the cartridge code, apply it, and play it. The test loop is the whole point: code, coin-up, play, revise.

The differentiator is not AI generation itself. It is the tight physical loop and the safe cartridge boundary: every game is a self-contained HTML canvas program running in an opaque sandbox with no Electron APIs, file access, network access, or external assets.

## Consequences

- “Clone a game” becomes “remix the mechanics without copied names, characters, music, art, level layouts, or branding.”
- V1 supports one local player, keyboard and mouse, and canvas/Web APIs. Gamepad, multiplayer, web publishing, stores, cloud sync, ROMs, and emulation are excluded.
- A real API key enables AI generation. Without one, the default cartridge and manual code workflow remain fully playable. The interface must never fake a generated game.
