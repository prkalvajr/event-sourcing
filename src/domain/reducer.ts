import { ACCOUNTS, BankEvent, BankState, accountName } from './types'
import { formatCents } from './money'

/** A fresh ledger: every account at zero. */
export function initialState(): BankState {
  const state = {} as BankState
  for (const account of ACCOUNTS) state[account.id] = 0
  return state
}

/** Pure reducer: apply a single event to a state, returning a new state. */
export function applyEvent(state: BankState, event: BankEvent): BankState {
  const next = { ...state }
  switch (event.type) {
    case 'FundsAdded':
      next[event.account] += event.amountCents
      break
    case 'FundsWithdrawn':
      next[event.account] -= event.amountCents
      break
    case 'MoneyTransferred':
      next[event.from] -= event.amountCents
      next[event.to] += event.amountCents
      break
  }
  return next
}

/**
 * The essence of event sourcing: derive state by folding the log.
 * `count` lets callers replay only the first N events (for time travel).
 */
export function deriveState(
  events: BankEvent[],
  count: number = events.length,
): BankState {
  let state = initialState()
  const upTo = Math.max(0, Math.min(count, events.length))
  for (let i = 0; i < upTo; i++) state = applyEvent(state, events[i])
  return state
}

/** Human-readable one-line summary of an event, for the events table. */
export function describeEvent(event: BankEvent): string {
  switch (event.type) {
    case 'FundsAdded':
      return `${accountName(event.account)} added ${formatCents(event.amountCents)}`
    case 'FundsWithdrawn':
      return `${accountName(event.account)} withdrew ${formatCents(event.amountCents)}`
    case 'MoneyTransferred':
      return `${accountName(event.from)} transferred ${formatCents(
        event.amountCents,
      )} to ${accountName(event.to)}`
  }
}
