import { useEffect, useState } from 'react'

type Playing = 'forward' | 'backward' | null

interface ReplayControlsProps {
  /** Total number of events in the log. */
  total: number
  /** How many events are currently applied (0..total). */
  count: number
  /** Replay the ledger to the given applied-count. */
  onSeek: (count: number) => void
}

const STEP_MS = 700

/** Transport controls: step, jump, and auto-play the log forward/backward. */
export function ReplayControls({ total, count, onSeek }: ReplayControlsProps) {
  const [playing, setPlaying] = useState<Playing>(null)

  // One scheduled step per render keeps `count` fresh and avoids stale closures.
  useEffect(() => {
    if (!playing) return
    if (playing === 'forward' && count >= total) return setPlaying(null)
    if (playing === 'backward' && count <= 0) return setPlaying(null)
    const id = setTimeout(() => {
      onSeek(playing === 'forward' ? count + 1 : count - 1)
    }, STEP_MS)
    return () => clearTimeout(id)
  }, [playing, count, total, onSeek])

  const atStart = count <= 0
  const atEnd = count >= total

  const jump = (to: number) => {
    setPlaying(null)
    onSeek(to)
  }
  const toggle = (dir: Exclude<Playing, null>) =>
    setPlaying((p) => (p === dir ? null : dir))

  return (
    <div className="replay">
      <div className="replay__buttons">
        <button
          className="rbtn"
          onClick={() => jump(0)}
          disabled={atStart}
          title="Jump to start"
          aria-label="Jump to start"
        >
          ⏮
        </button>
        <button
          className="rbtn"
          onClick={() => jump(count - 1)}
          disabled={atStart}
          title="Step back"
          aria-label="Step back"
        >
          ◀
        </button>
        <button
          className={'rbtn rbtn--play' + (playing === 'backward' ? ' is-active' : '')}
          onClick={() => toggle('backward')}
          disabled={atStart && playing !== 'backward'}
          title="Play backward"
          aria-label="Play backward"
        >
          {playing === 'backward' ? '⏸' : '⏪'}
        </button>
        <button
          className={'rbtn rbtn--play' + (playing === 'forward' ? ' is-active' : '')}
          onClick={() => toggle('forward')}
          disabled={atEnd && playing !== 'forward'}
          title="Play forward"
          aria-label="Play forward"
        >
          {playing === 'forward' ? '⏸' : '⏩'}
        </button>
        <button
          className="rbtn"
          onClick={() => jump(count + 1)}
          disabled={atEnd}
          title="Step forward"
          aria-label="Step forward"
        >
          ▶
        </button>
        <button
          className="rbtn"
          onClick={() => jump(total)}
          disabled={atEnd}
          title="Jump to live"
          aria-label="Jump to live"
        >
          ⏭
        </button>
      </div>

      <input
        type="range"
        className="replay__slider"
        min={0}
        max={total}
        value={count}
        onChange={(e) => jump(Number(e.target.value))}
        aria-label="Replay position"
      />

      <div className="replay__status">
        <strong>{count}</strong> / {total} events
        {atEnd && <span className="replay__live">live</span>}
      </div>
    </div>
  )
}
