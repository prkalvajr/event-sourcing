import { useSyncExternalStore } from 'react'
import { BankEvent } from '../domain/types'
import { eventStore } from './eventStore'

/** Subscribe a component to the live event log. */
export function useEvents(): BankEvent[] {
  return useSyncExternalStore(
    eventStore.subscribe,
    eventStore.getEvents,
    eventStore.getEvents,
  )
}
