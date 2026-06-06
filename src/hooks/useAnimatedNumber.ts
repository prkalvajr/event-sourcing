import { useEffect, useRef, useState } from 'react'

/**
 * Smoothly animates a numeric value toward its target whenever it changes,
 * using requestAnimationFrame with an ease-out curve. Used to count balances
 * up/down as the ledger is replayed.
 */
export function useAnimatedNumber(value: number, duration = 450): number {
  const [display, setDisplay] = useState(value)
  const displayRef = useRef(value)
  const frameRef = useRef(0)

  useEffect(() => {
    const from = displayRef.current
    const to = value
    if (from === to) return

    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = Math.round(from + (to - from) * eased)
      displayRef.current = current
      setDisplay(current)
      if (t < 1) frameRef.current = requestAnimationFrame(step)
    }

    frameRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value, duration])

  return display
}
