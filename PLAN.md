# Event Sourcing Bank — Build Plan

A small MVP that demonstrates **event sourcing**: every action is stored as an
immutable event in an append-only log (browser `localStorage`), and the entire
account state is derived by folding (reducing) those events. The UI lets you
**time-travel**: replay the ledger to any point in its history.

No backend, no login. You "pretend" to be a logged-in user. Deployable to
**GitHub Pages** as a pure static SPA.

## Architecture at a glance

- **React + Vite + TypeScript**, single page, hand-rolled CSS (no UI lib).
- **Persistence:** append-only `events[]` array in `localStorage`.
- **State:** `state = events.slice(0..N).reduce(reducer, initial)` — never stored,
  always derived. This is the heart of event sourcing.
- **Accounts:** fixed seeded set — `You` (logged-in), `Alice`, `Bob`.
- **Money:** stored as integer **cents**, displayed as dollars (`$100.00`).
- **Deploy:** GitHub Actions → GitHub Pages, Vite `base: './'` (works at any path).

## Event types

| Event              | Payload                          | Effect on state                     |
| ------------------ | -------------------------------- | ----------------------------------- |
| `FundsAdded`       | `{ account, amountCents }`       | `+amount` to account                |
| `FundsWithdrawn`   | `{ account, amountCents }`       | `-amount` from account              |
| `MoneyTransferred` | `{ from, to, amountCents }`      | `-amount` from `from`, `+` to `to`  |

Every event also carries `seq`, `id`, `timestamp`, `type`.

## Validation rules (checked against live/latest balance)

1. Amount must be `> 0`.
2. Withdraw `<=` your balance (no overdraft).
3. Transfer `<=` your balance.
4. Cannot transfer to yourself.

## Seed (applied on first load if storage empty; restored by Reset button)

1. `Alice` `FundsAdded` $500.00
2. `Alice` `MoneyTransferred` $100.00 → `You`

Resulting balances: **You $100.00, Alice $400.00, Bob $0.00**.

## Replay / time travel

- Events table (chronological). Click a row → state recomputed by folding
  events `0..N`; that row is highlighted.
- Play control auto-steps **forward and backward**, animating balances.
- Replay is **read-only**: action buttons disabled while viewing the past;
  submitting an action appends at the head and snaps back to live.

---

## Phases

Each phase is a single, self-contained commit.

- [x] **Phase 1 — Scaffold & infra.** Vite + React + TS project, relative base
      config, app shell, `.gitignore`, this plan, GitHub Actions deploy workflow.
- [x] **Phase 2 — Domain core.** Event types, money utils (cents ↔ dollars),
      the event reducer, seed data, and the `localStorage` event store.
- [x] **Phase 3 — Live app UI.** Balance cards + Add / Withdraw / Transfer forms
      with full validation, wired to the store. *(End of autonomous half — review here.)*
- [x] **Phase 4 — Events table + click-to-replay.** Read-only time travel.
- [x] **Phase 5 — Play/step animation.** Forward/backward auto-step controls and
      animated balance count-up.
- [x] **Phase 6 — Reset & polish.** Reset-to-seed button, final styling,
      explainer footer, deploy verification.
