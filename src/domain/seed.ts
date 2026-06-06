import { BankEvent } from './types'

/**
 * The initial story, applied on first load (or after Reset):
 *   1. Alice adds $500.00 to her account.
 *   2. Alice transfers $100.00 to You.
 * Resulting balances: You $100.00, Alice $400.00, Bob $0.00.
 *
 * Timestamps are placed a couple of days in the past so the log reads as
 * pre-existing history rather than something that just happened.
 */
export function seedEvents(): BankEvent[] {
  const twoDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 2
  return [
    {
      seq: 1,
      id: 'seed-1',
      timestamp: new Date(twoDaysAgo).toISOString(),
      type: 'FundsAdded',
      account: 'alice',
      amountCents: 50_000,
    },
    {
      seq: 2,
      id: 'seed-2',
      timestamp: new Date(twoDaysAgo + 1000 * 60 * 5).toISOString(),
      type: 'MoneyTransferred',
      from: 'alice',
      to: 'you',
      amountCents: 10_000,
    },
  ]
}
