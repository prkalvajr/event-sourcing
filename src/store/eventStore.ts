import { AccountId, BankEvent } from '../domain/types'
import { seedEvents } from '../domain/seed'

// An append-only event store backed by localStorage. The events array is
// treated as immutable: every mutation produces a new array, so React's
// useSyncExternalStore can rely on reference equality to detect changes.

const STORAGE_KEY = 'event-sourcing-bank/events/v1'

/** The shape callers pass in; seq/id/timestamp are assigned by the store. */
export type NewEvent =
  | { type: 'FundsAdded'; account: AccountId; amountCents: number }
  | { type: 'FundsWithdrawn'; account: AccountId; amountCents: number }
  | { type: 'MoneyTransferred'; from: AccountId; to: AccountId; amountCents: number }

type Listener = () => void

function loadFromStorage(): BankEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as BankEvent[]
  } catch {
    // Corrupt or unavailable storage — fall through to a fresh seed.
  }
  const seeded = seedEvents()
  persist(seeded)
  return seeded
}

function persist(events: BankEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch {
    // Best-effort: ignore quota / private-mode failures.
  }
}

let events: BankEvent[] = loadFromStorage()
const listeners = new Set<Listener>()

function commit(next: BankEvent[]): void {
  events = next
  persist(events)
  listeners.forEach((notify) => notify())
}

export const eventStore = {
  /** Stable reference; only changes when the log actually changes. */
  getEvents(): BankEvent[] {
    return events
  },

  /** Append a new event at the head of the log and return it. */
  append(input: NewEvent): BankEvent {
    const seq = events.length + 1
    const event = {
      ...input,
      seq,
      id: `evt-${seq}-${Date.now()}`,
      timestamp: new Date().toISOString(),
    } as BankEvent
    commit([...events, event])
    return event
  },

  /** Wipe the log and restore the seed story. */
  reset(): void {
    commit(seedEvents())
  },

  /** Subscribe to changes; returns an unsubscribe function. */
  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}
