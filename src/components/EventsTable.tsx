import { BankEvent, BankEventType } from '../domain/types'
import { describeEvent } from '../domain/reducer'
import { formatCents } from '../domain/money'

const TYPE_LABEL: Record<BankEventType, string> = {
  FundsAdded: 'deposit',
  FundsWithdrawn: 'withdrawal',
  MoneyTransferred: 'transfer',
}

interface EventsTableProps {
  events: BankEvent[]
  /** How many events are currently applied (0..events.length). */
  count: number
  /** Replay the ledger to just after the event at this 1-based position. */
  onSelect: (count: number) => void
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** The immutable event log, rendered oldest → newest. Rows are clickable. */
export function EventsTable({ events, count, onSelect }: EventsTableProps) {
  return (
    <div className="events">
      <table className="events__table">
        <thead>
          <tr>
            <th className="num">#</th>
            <th>When</th>
            <th>Event</th>
            <th className="num">Amount</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, i) => {
            const applied = i + 1 <= count
            const current = i + 1 === count
            return (
              <tr
                key={event.id}
                className={
                  'events__row' +
                  (applied ? '' : ' is-future') +
                  (current ? ' is-current' : '')
                }
                onClick={() => onSelect(i + 1)}
                title="Replay to this point"
              >
                <td className="num events__seq">{event.seq}</td>
                <td className="events__time">{formatTime(event.timestamp)}</td>
                <td>
                  <span className={`pill pill--${event.type}`}>
                    {TYPE_LABEL[event.type]}
                  </span>
                  {describeEvent(event)}
                </td>
                <td className="num">{formatCents(event.amountCents)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
