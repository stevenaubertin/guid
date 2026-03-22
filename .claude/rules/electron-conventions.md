# Electron Conventions

## Main Process
- Single entry point that creates the main window
- `app.whenReady()` for initialization
- Handle `window-all-closed` (quit on Windows/Linux, stay open on macOS)
- `activate` to recreate the window on macOS
- All filesystem and system logic goes here, never in the renderer

## Preload Scripts
- Expose a minimal API via `contextBridge.exposeInMainWorld()`
- Name the API clearly: `window.electronAPI.saveFile()`, `window.electronAPI.getSettings()`
- Type the exposed API with a shared TypeScript interface
- No business logic in the preload — just the IPC bridge

## IPC (Inter-Process Communication)
- Channels named with a namespace: `dialog:open`, `store:get`, `store:set`
- `ipcMain.handle()` + `ipcRenderer.invoke()` for request/response (returns a Promise)
- `ipcMain.on()` + `webContents.send()` for pushing from main to renderer
- Validate arguments on the main side before processing
- No complex non-serializable objects in IPC

## Renderer Process
- Treat like a standard web app (React/Vue)
- No Node.js access — everything goes through the preload API
- Normal state management (useState, Zustand, Pinia, etc.)
- Client-side routing if multi-page

## BrowserWindow
- Reasonable minimum size (`minWidth`, `minHeight`)
- Save window position/size for the next launch
- `show: false` + `ready-to-show` event to avoid the white flash
- App icon configured per platform

## Packaging
- electron-builder: `electron-builder.yml` for config
- electron-forge: `forge.config.ts`
- Sign builds for macOS and Windows
- Auto-update with `electron-updater` (GitHub Releases or custom server)
- Exclude dev files from the package (tests, docs, .env)

## Performance
- Lazy loading of heavy modules in the main process
- No heavy computations in the renderer — use workers or the main process
- `backgroundThrottling: false` if the app needs to run in the background
