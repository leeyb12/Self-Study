import { useState, useRef } from 'react'
import ScorePanel from '../components/ScorePanel.jsx'

const SENTENCES = [
  'The quick brown fox jumps over the lazy dog',
  'React makes it painless to create interactive UIs',
  'Practice typing every day to improve your speed',
  'A journey of a thousand miles begins with a single step',
]

function pickSentence() {
  return SENTENCES[Math.floor(Math.random() * SENTENCES.length)]
}

function TypingTest() {
  const [target, setTarget] = useState(pickSentence)
  const [input, setInput] = useState('')
  const [startedAt, setStartedAt] = useState(null)
  const [result, setResult] = useState(null)
  const [round, setRound] = useState(0)
  const inputRef = useRef(null)

  function handleChange(e) {
    const value = e.target.value
    if (result) return

    if (startedAt === null && value.length > 0) {
      setStartedAt(performance.now())
    }
    setInput(value)

    if (value === target) {
      const seconds = (performance.now() - (startedAt ?? performance.now())) / 1000
      const words = target.trim().split(/\s+/).length
      const wpm = Math.round((words / seconds) * 60)
      setResult({ seconds: seconds.toFixed(1), wpm })
    }
  }

  function reset() {
    setTarget(pickSentence())
    setInput('')
    setStartedAt(null)
    setResult(null)
    setRound((r) => r + 1)
    inputRef.current?.focus()
  }

  return (
    <div className="game">
      <p className="typing-target">
        {target.split('').map((ch, i) => {
          let cls = ''
          if (i < input.length) cls = input[i] === ch ? 'ok' : 'bad'
          return (
            <span key={i} className={`typing-char ${cls}`}>
              {ch}
            </span>
          )
        })}
      </p>

      <textarea
        ref={inputRef}
        className="typing-input"
        value={input}
        onChange={handleChange}
        disabled={!!result}
        placeholder="여기에 입력하세요…"
        rows={2}
        autoFocus
      />

      {result && (
        <p className="game-message">
          🎉 {result.seconds}초 · {result.wpm} WPM
        </p>
      )}

      <button type="button" className="game-reset" onClick={reset}>
        새 문장
      </button>
      <ScorePanel
        key={round}
        gameId="typing"
        score={result ? result.wpm : 0}
        active={!!result}
        unit=" WPM"
      />
    </div>
  )
}

export default TypingTest
