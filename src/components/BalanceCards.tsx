import { ACCOUNTS, BankState } from '../domain/types'
import { formatCents } from '../domain/money'

interface BalanceCardsProps {
  state: BankState
}

/** One card per account, showing the balance derived from the event log. */
export function BalanceCards({ state }: BalanceCardsProps) {
  return (
    <section className="cards" aria-label="Account balances">
      {ACCOUNTS.map((account) => (
        <div
          key={account.id}
          className={`card${account.isYou ? ' card--you' : ''}`}
        >
          <div className="card__name">
            {account.name}
            {account.isYou && <span className="badge">logged in</span>}
          </div>
          <div className="card__balance">{formatCents(state[account.id])}</div>
        </div>
      ))}
    </section>
  )
}
