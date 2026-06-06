# 💸 Event Sourcing Bank

A tiny MVP that demonstrates **event sourcing**. Every action (add funds,
withdraw, transfer) is recorded as an immutable event in an append-only log
stored in your browser's `localStorage`. Account balances are never stored —
they are always **derived** by folding the event log. The UI lets you
**replay** the ledger to any point in its history.

No backend, no login. Pure static SPA, deployable to GitHub Pages.

## Tech

React + Vite + TypeScript. State = `events.reduce(reducer)`.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs static site to dist/
npm run preview    # serve the production build locally
```

## Deploy

Pushing to `main` triggers a GitHub Actions workflow that builds and publishes
to GitHub Pages. Enable it once under **Settings → Pages → Source: GitHub
Actions**.

See [PLAN.md](./PLAN.md) for the design and phased build plan.
