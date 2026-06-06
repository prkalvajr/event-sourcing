import { ACCOUNTS, BankState } from '../domain/types'
import { formatCents } from '../domain/money'
import { useAnimatedNumber } from '../hooks/useAnimatedNumber'

interface BalanceCardsProps {
  state: BankState
}

/** One card per account, showing the balance derived from the event log. */
export function BalanceCards({ state }: BalanceCardsProps) {
  return (
    <section className="cards" aria-label="Account balances">
      {ACCOUNTS.map((account) => (
        <BalanceCard
          key={account.id}
          name={account.name}
          isYou={account.isYou}
          cents={state[account.id]}
        />
      ))}
    </section>
  )
}

function BalanceCard({
  name,
  isYou,
  cents,
}: {
  name: string
  isYou: boolean
  cents: number
}) {
  // Count the displayed balance up/down whenever the derived value changes.
  const animated = useAnimatedNumber(cents)
  return (
    <div className={`card${isYou ? ' card--you' : ''}`}>
      <div className="card__name">
        {name}
        {isYou && <span className="badge">logged in</span>}
      </div>
      <div className="card__balance">{formatCents(animated)}</div>
    </div>
  )
}
