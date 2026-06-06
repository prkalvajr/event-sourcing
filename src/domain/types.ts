// ---------------------------------------------------------------------------
// Accounts
// ---------------------------------------------------------------------------

export type AccountId = 'you' | 'alice' | 'bob'

export interface Account {
  id: AccountId
  name: string
  isYou: boolean
}

/** Fixed, seeded set of accounts. No account-creation in this MVP. */
export const ACCOUNTS: Account[] = [
  { id: 'you', name: 'You', isYou: true },
  { id: 'alice', name: 'Alice', isYou: false },
  { id: 'bob', name: 'Bob', isYou: false },
]

/** The logged-in account. All live actions are performed as this account. */
export const YOU: AccountId = 'you'

export function accountName(id: AccountId): string {
  return ACCOUNTS.find((a) => a.id === id)?.name ?? id
}

// ---------------------------------------------------------------------------
// Events — the immutable, append-only log
// ---------------------------------------------------------------------------

interface EventBase {
  /** 1-based position in the log. */
  seq: number
  /** Stable unique id. */
  id: string
  /** ISO-8601 wall-clock time the event was recorded. */
  timestamp: string
}

export interface FundsAddedEvent extends EventBase {
  type: 'FundsAdded'
  account: AccountId
  amountCents: number
}

export interface FundsWithdrawnEvent extends EventBase {
  type: 'FundsWithdrawn'
  account: AccountId
  amountCents: number
}

export interface MoneyTransferredEvent extends EventBase {
  type: 'MoneyTransferred'
  from: AccountId
  to: AccountId
  amountCents: number
}

export type BankEvent =
  | FundsAddedEvent
  | FundsWithdrawnEvent
  | MoneyTransferredEvent

export type BankEventType = BankEvent['type']

// ---------------------------------------------------------------------------
// Derived state
// ---------------------------------------------------------------------------

/** Balances in integer cents, keyed by account. Never persisted — derived. */
export type BankState = Record<AccountId, number>
