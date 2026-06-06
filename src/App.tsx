import { useEvents } from './store/useEvents'
import { deriveState } from './domain/reducer'
import { BalanceCards } from './components/BalanceCards'
import { Actions } from './components/Actions'

export default function App() {
  const events = useEvents()
  const liveState = deriveState(events)

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
        <BalanceCards state={liveState} />
        <Actions state={liveState} />
      </main>
    </div>
  )
}
