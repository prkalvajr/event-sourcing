import { FormEvent, useState } from 'react'
import { ACCOUNTS, AccountId, BankState, YOU } from '../domain/types'
import { dollarsToCents } from '../domain/money'
import {
  validateAmount,
  validateTransfer,
  validateWithdraw,
} from '../domain/validation'
import { eventStore } from '../store/eventStore'

interface ActionsProps {
  /** Live state used for balance validation. */
  state: BankState
  /** When true (e.g. while viewing the past), actions are blocked. */
  disabled?: boolean
  /** Fired after a successful append, so the parent can snap back to live. */
  onAction?: () => void
}

/** The Add / Withdraw / Transfer action panel, acting as the logged-in user. */
export function Actions({ state, disabled = false, onAction }: ActionsProps) {
  return (
    <section className="actions" aria-label="Actions">
      <AddFundsForm disabled={disabled} onAction={onAction} />
      <WithdrawForm state={state} disabled={disabled} onAction={onAction} />
      <TransferForm state={state} disabled={disabled} onAction={onAction} />
    </section>
  )
}

function AddFundsForm({
  disabled,
  onAction,
}: {
  disabled: boolean
  onAction?: () => void
}) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)

  function submit(e: FormEvent) {
    e.preventDefault()
    const err = validateAmount(amount)
    if (err) return setError(err)
    eventStore.append({
      type: 'FundsAdded',
      account: YOU,
      amountCents: dollarsToCents(amount),
    })
    setAmount('')
    setError(null)
    onAction?.()
  }

  return (
    <form className="action-card" onSubmit={submit}>
      <fieldset disabled={disabled}>
        <h3>Add funds</h3>
        <p className="action-card__hint">Deposit money into your account.</p>
        <AmountInput
          value={amount}
          onChange={(v) => {
            setAmount(v)
            setError(null)
          }}
        />
        {error && <p className="action-card__error">{error}</p>}
        <button type="submit" className="btn btn--add">
          Add funds
        </button>
      </fieldset>
    </form>
  )
}

function WithdrawForm({
  state,
  disabled,
  onAction,
}: {
  state: BankState
  disabled: boolean
  onAction?: () => void
}) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)

  function submit(e: FormEvent) {
    e.preventDefault()
    const err = validateWithdraw(amount, state)
    if (err) return setError(err)
    eventStore.append({
      type: 'FundsWithdrawn',
      account: YOU,
      amountCents: dollarsToCents(amount),
    })
    setAmount('')
    setError(null)
    onAction?.()
  }

  return (
    <form className="action-card" onSubmit={submit}>
      <fieldset disabled={disabled}>
        <h3>Withdraw</h3>
        <p className="action-card__hint">Take money out of your account.</p>
        <AmountInput
          value={amount}
          onChange={(v) => {
            setAmount(v)
            setError(null)
          }}
        />
        {error && <p className="action-card__error">{error}</p>}
        <button type="submit" className="btn btn--withdraw">
          Withdraw
        </button>
      </fieldset>
    </form>
  )
}

function TransferForm({
  state,
  disabled,
  onAction,
}: {
  state: BankState
  disabled: boolean
  onAction?: () => void
}) {
  const others = ACCOUNTS.filter((a) => a.id !== YOU)
  const [amount, setAmount] = useState('')
  const [to, setTo] = useState<AccountId>(others[0].id)
  const [error, setError] = useState<string | null>(null)

  function submit(e: FormEvent) {
    e.preventDefault()
    const err = validateTransfer(amount, to, state)
    if (err) return setError(err)
    eventStore.append({
      type: 'MoneyTransferred',
      from: YOU,
      to,
      amountCents: dollarsToCents(amount),
    })
    setAmount('')
    setError(null)
    onAction?.()
  }

  return (
    <form className="action-card" onSubmit={submit}>
      <fieldset disabled={disabled}>
        <h3>Transfer</h3>
        <p className="action-card__hint">Send money to another account.</p>
        <label className="field">
          <span>To</span>
          <select
            value={to}
            onChange={(e) => {
              setTo(e.target.value as AccountId)
              setError(null)
            }}
          >
            {others.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <AmountInput
          value={amount}
          onChange={(v) => {
            setAmount(v)
            setError(null)
          }}
        />
        {error && <p className="action-card__error">{error}</p>}
        <button type="submit" className="btn btn--transfer">
          Transfer
        </button>
      </fieldset>
    </form>
  )
}

function AmountInput({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="field">
      <span>Amount</span>
      <div className="field__money">
        <span className="field__prefix">$</span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </label>
  )
}
