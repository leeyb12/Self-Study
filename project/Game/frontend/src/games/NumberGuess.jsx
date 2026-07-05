import { useState } from 'react'
import ScorePanel from '../components/ScorePanel.jsx'
import Difficulty from '../components/Difficulty.jsx'

const MIN = 1
const DIFFICULTIES = [
  { label: '쉬움', value: 50 },
  { label: '보통', value: 100 },
  { label: '어려움', value: 200 },
]

function randomTarget(max) {
  return Math.floor(Math.random() * (max - MIN + 1)) + MIN
}

function NumberGuess() {
  const [max, setMax] = useState(100)
  const [target, setTarget] = useState(() => randomTarget(100))
  const [input, setInput] = useState('')
  const [tries, setTries] = useState(0)
  const [message, setMessage] = useState(`${MIN} ~ 100 사이의 숫자를 맞춰보세요!`)
  const [done, setDone] = useState(false)
  const [round, setRound] = useState(0)

  function restart(nextMax) {
    setTarget(randomTarget(nextMax))
    setInput('')
    setTries(0)
    setMessage(`${MIN} ~ ${nextMax} 사이의 숫자를 맞춰보세요!`)
    setDone(false)
    setRound((r) => r + 1)
  }

  function changeDifficulty(v) {
    if (v === max) return
    setMax(v)
    restart(v)
  }

  function handleGuess(e) {
    e.preventDefault()
    const guess = Number(input)

    if (!Number.isInteger(guess) || guess < MIN || guess > max) {
      setMessage(`${MIN}부터 ${max} 사이의 숫자를 입력하세요.`)
      return
    }

    const nextTries = tries + 1
    setTries(nextTries)
    setInput('')

    if (guess === target) {
      setMessage(`🎉 정답! ${nextTries}번 만에 맞췄어요.`)
      setDone(true)
    } else if (guess < target) {
      setMessage(`⬆️ 더 큰 숫자예요. (${guess}보다 큼)`)
    } else {
      setMessage(`⬇️ 더 작은 숫자예요. (${guess}보다 작음)`)
    }
  }

  return (
    <div className="game">
      <p className="game-message">{message}</p>

      <form className="game-controls" onSubmit={handleGuess}>
        <input
          type="number"
          min={MIN}
          max={max}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={done}
          placeholder="숫자 입력"
          autoFocus
        />
        <button type="submit" disabled={done || input === ''}>
          확인
        </button>
      </form>

      <p className="game-info">시도 횟수: {tries}</p>
      <Difficulty value={max} onChange={changeDifficulty} options={DIFFICULTIES} />

      {done && (
        <button type="button" className="game-reset" onClick={() => restart(max)}>
          다시 하기
        </button>
      )}
      <ScorePanel
        key={round}
        gameId={`number-guess-${max}`}
        score={tries}
        active={done}
        order="asc"
        unit="회"
      />
    </div>
  )
}

export default NumberGuess
