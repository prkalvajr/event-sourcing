import { useCallback, useState } from 'react'
import { useEvents } from './store/useEvents'
import { deriveState } from './domain/reducer'
import { BalanceCards } from './components/BalanceCards'
import { Actions } from './components/Actions'
import { ReplayControls } from './components/ReplayControls'
import { EventsTable } from './components/EventsTable'

export default function App() {
  const events = useEvents()
  const total = events.length

  // null cursor === "following the live head". A number means we are viewing
  // a past state (read-only) after that many events have been applied.
  const [cursor, setCursor] = useState<number | null>(null)
  const isLive = cursor === null
  const count = isLive ? total : cursor
  const displayedState = deriveState(events, count)

  const seek = useCallback(
    (next: number) => {
      if (next >= total) setCursor(null)
      else if (next <= 0) setCursor(0)
      else setCursor(next)
    },
    [total],
  )

  const goLive = useCallback(() => setCursor(null), [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>💸 Event Sourcing Bank</h1>
        <p className="subtitle">
          An append-only ledger you can replay. You are logged in as{' '}
          <strong>You</strong>.
        </p>
      </header>

      <main className="app-main">
        <BalanceCards state={displayedState} />

        {!isLive && (
          <div className="replay-banner">
            <span>
              ⏪ Viewing history — state after event <strong>#{count}</strong> of{' '}
              {total}. The ledger is read-only here.
            </span>
            <button className="btn btn--ghost" onClick={goLive}>
              Go to live →
            </button>
          </div>
        )}

        <Actions
          state={displayedState}
          disabled={!isLive}
          onAction={goLive}
        />

        <section className="log">
          <h2 className="log__title">Event log</h2>
          <p className="log__hint">
            Click any event — or use the controls — to replay the ledger.
          </p>
          <ReplayControls total={total} count={count} onSeek={seek} />
          <EventsTable events={events} count={count} onSelect={seek} />
        </section>
      </main>
    </div>
  )
}
