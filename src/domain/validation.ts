import { AccountId, BankState, YOU } from './types'
import { dollarsToCents } from './money'

// Pure validation helpers. Each returns an error string to show the user, or
// null when the input is valid. All balance checks run against the live state.

/** Shared rule: must parse to a positive amount. */
export function validateAmount(input: string): string | null {
  if (input.trim() === '') return 'Enter an amount'
  const cents = dollarsToCents(input)
  if (Number.isNaN(cents)) return 'Enter a valid number'
  if (cents <= 0) return 'Amount must be greater than zero'
  return null
}

export function validateWithdraw(
  input: string,
  state: BankState,
  account: AccountId = YOU,
): string | null {
  const amountError = validateAmount(input)
  if (amountError) return amountError
  if (dollarsToCents(input) > state[account]) return 'Insufficient funds'
  return null
}

export function validateTransfer(
  input: string,
  to: AccountId,
  state: BankState,
  from: AccountId = YOU,
): string | null {
  const amountError = validateAmount(input)
  if (amountError) return amountError
  if (to === from) return 'Cannot transfer to yourself'
  if (dollarsToCents(input) > state[from]) return 'Insufficient funds'
  return null
}
