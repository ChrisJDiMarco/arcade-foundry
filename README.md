# Arcade Foundry

Arcade Foundry is a macOS Electron cabinet for designing **original** browser arcade games and playing them immediately.

## Use

1. Open the app and play `Neon Bastion` with arrow keys or WASD, Space, and mouse/click.
2. Describe a new original game in the Forge panel, then select **Forge Original Game**.
3. Use **Service** to hand-edit a complete self-contained HTML canvas cartridge.
4. Export a cartridge as JSON or load one back in.

Set `OPENAI_API_KEY` in the environment before launching to enable Forge. It uses the Responses API in the Electron main process, with `gpt-5.6` by default (override with `ARCADE_FOUNDRY_MODEL`). The key is never written to the cartridge or app state.

## Safety boundary

Cartridges are original, local HTML canvas games, screened for remote URLs, network APIs, storage, parent-frame access, popups, Electron/Node APIs, forms, and external scripts. They run in an opaque `sandbox="allow-scripts"` iframe. The app rejects requests to clone or copy games; describe the mechanic or genre instead.

## Development

```sh
npm install
npm test
npm start
npm run package:mac
```

The Apple-silicon package is at `dist/ArcadeFoundry-darwin-arm64/ArcadeFoundry.app`.
