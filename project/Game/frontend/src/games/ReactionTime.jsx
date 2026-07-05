import { useState, useRef, useEffect } from 'react'
import ScorePanel from '../components/ScorePanel.jsx'

// idle: 대기 / waiting: 초록 기다리는 중 / now: 지금 클릭 / result: 결과 / early: 성급
function ReactionTime() {
  const [state, setState] = useState('idle')
  const [time, setTime] = useState(0)
  const [best, setBest] = useState(null)
  const [round, setRound] = useState(0)
  const timerRef = useRef(null)
  const startRef = useRef(0)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  function start() {
    setState('waiting')
    setRound((r) => r + 1)
    const delay = 1000 + Math.random() * 3000
    timerRef.current = setTimeout(() => {
      startRef.current = performance.now()
      setState('now')
    }, delay)
  }

  function handleClick() {
    if (state === 'idle' || state === 'result' || state === 'early') {
      start()
    } else if (state === 'waiting') {
      clearTimeout(timerRef.current)
      setState('early')
    } else if (state === 'now') {
      const ms = Math.round(performance.now() - startRef.current)
      setTime(ms)
      setBest((b) => (b === null ? ms : Math.min(b, ms)))
      setState('result')
    }
  }

  const view = {
    idle: { cls: 'idle', text: '클릭해서 시작' },
    waiting: { cls: 'waiting', text: '초록색이 될 때까지 기다리세요…' },
    now: { cls: 'now', text: '지금 클릭!' },
    result: { cls: 'idle', text: `${time} ms — 다시 하려면 클릭` },
    early: { cls: 'early', text: '너무 빨라요! 다시 클릭' },
  }[state]

  return (
    <div className="game">
      <button
        type="button"
        className={`reaction-pad reaction-${view.cls}`}
        onClick={handleClick}
      >
        {view.text}
      </button>
      <p className="game-info">
        {best !== null ? `최고 기록: ${best} ms` : '기록 없음'}
      </p>
      <ScorePanel
        key={round}
        gameId="reaction"
        score={time}
        active={state === 'result'}
        order="asc"
        unit=" ms"
      />
    </div>
  )
}

export default ReactionTime
