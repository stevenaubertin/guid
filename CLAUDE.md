# Instructions — Electron Application

## Context
Cross-platform desktop application with Electron.

## Stack
- Framework: Electron 28+
- Language: TypeScript
- Bundler: Vite (or webpack, adapt to your project)
- UI: React / Vue (adapt to your project)
- Packaging: electron-builder or electron-forge
- Tests: Vitest (unit), Playwright (e2e)

## Commands
- `npm run dev` — Launch the app in development (hot reload)
- `npm run build` — Build the application
- `npm run package` — Package for distribution
- `npm run test` — Run the tests
- `npm run lint` — Check linting

## Architecture
- **Main process**: Node.js logic, system access, window management
- **Renderer process**: web UI (React/Vue), sandboxed
- **Preload scripts**: bridge between main and renderer via `contextBridge`
- Inter-process communication only via IPC (`ipcMain` / `ipcRenderer`)

## Conventions
- IPC via `contextBridge.exposeInMainWorld()` — never `nodeIntegration: true`
- Explicitly named IPC channels: `user:get`, `file:save`, `app:quit`
- The renderer has zero direct access to Node.js or the filesystem
- Separate business logic from Electron code (testable without Electron)
- Minimal preload scripts — just the exposed API, no logic
- One `BrowserWindow` per window, configured in the main process

## Security
- `nodeIntegration: false` and `sandbox: true` required on the renderer
- Strict Content Security Policy (CSP) in HTML pages
- No `remote` module (deprecated and dangerous)
- Validate all data received via IPC on the main process side
- No `shell.openExternal()` with unvalidated URLs
- Disable `webSecurity: false` — it's never a good idea
- Auto-updater with verified signature

## Structure
```
src/
├── main/                  # Main process
│   ├── index.ts           # Electron entry point
│   ├── ipc/               # IPC handlers
│   └── services/          # Business logic (main side)
├── renderer/              # Renderer process (web app)
│   ├── App.tsx
│   ├── components/
│   ├── pages/
│   └── hooks/
├── preload/               # Preload scripts
│   └── index.ts           # contextBridge API
└── shared/                # Shared types and constants
    └── types.ts
resources/
├── icons/                 # App icons
└── assets/                # Static assets
```
