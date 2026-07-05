import { useState } from 'react'
import ScorePanel from '../components/ScorePanel.jsx'

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

function counts(dice) {
  const c = [0, 0, 0, 0, 0, 0, 0] // index 1..6
  dice.forEach((d) => c[d]++)
  return c
}

function hasStraight(dice, len) {
  const set = [...new Set(dice)].sort((a, b) => a - b)
  let run = 1
  for (let i = 1; i < set.length; i++) {
    run = set[i] === set[i - 1] + 1 ? run + 1 : 1
    if (run >= len) return true
  }
  return false
}

// 각 족보 점수 계산 함수
const CATEGORIES = [
  { id: 'ones', label: '1의 합', score: (d) => counts(d)[1] * 1 },
  { id: 'twos', label: '2의 합', score: (d) => counts(d)[2] * 2 },
  { id: 'threes', label: '3의 합', score: (d) => counts(d)[3] * 3 },
  { id: 'fours', label: '4의 합', score: (d) => counts(d)[4] * 4 },
  { id: 'fives', label: '5의 합', score: (d) => counts(d)[5] * 5 },
  { id: 'sixes', label: '6의 합', score: (d) => counts(d)[6] * 6 },
  {
    id: 'threeKind',
    label: '트리플 (합)',
    score: (d) =>
      counts(d).some((n) => n >= 3) ? d.reduce((a, b) => a + b, 0) : 0,
  },
  {
    id: 'fourKind',
    label: '포카드 (합)',
    score: (d) =>
      counts(d).some((n) => n >= 4) ? d.reduce((a, b) => a + b, 0) : 0,
  },
  {
    id: 'fullHouse',
    label: '풀하우스 (25)',
    score: (d) => {
      const c = counts(d).filter((n) => n > 0)
      return c.includes(3) && c.includes(2) ? 25 : 0
    },
  },
  { id: 'smallStraight', label: '스몰 스트레이트 (30)', score: (d) => (hasStraight(d, 4) ? 30 : 0) },
  { id: 'largeStraight', label: '라지 스트레이트 (40)', score: (d) => (hasStraight(d, 5) ? 40 : 0) },
  { id: 'yahtzee', label: '야추 (50)', score: (d) => (counts(d).some((n) => n === 5) ? 50 : 0) },
  { id: 'chance', label: '찬스 (합)', score: (d) => d.reduce((a, b) => a + b, 0) },
]

function rollDie() {
  return Math.floor(Math.random() * 6) + 1
}

function Yahtzee() {
  const [dice, setDice] = useState([1, 2, 3, 4, 5])
  const [held, setHeld] = useState([false, false, false, false, false])
  const [rollsLeft, setRollsLeft] = useState(3)
  const [scores, setScores] = useState({}) // id -> number
  const [rolledThisTurn, setRolledThisTurn] = useState(false)
  const [round, setRound] = useState(0)

  const filled = Object.keys(scores).length
  const gameOver = filled === CATEGORIES.length
  const total = Object.values(scores).reduce((a, b) => a + b, 0)

  function roll() {
    if (rollsLeft <= 0) return
    setDice((prev) => prev.map((d, i) => (held[i] ? d : rollDie())))
    setRollsLeft((r) => r - 1)
    setRolledThisTurn(true)
  }

  function toggleHold(i) {
    if (!rolledThisTurn) return
    setHeld((prev) => prev.map((h, idx) => (idx === i ? !h : h)))
  }

  function pickCategory(cat) {
    if (!rolledThisTurn || scores[cat.id] !== undefined) return
    setScores((prev) => ({ ...prev, [cat.id]: cat.score(dice) }))
    // 다음 턴 준비
    setHeld([false, false, false, false, false])
    setRollsLeft(3)
    setRolledThisTurn(false)
  }

  function reset() {
    setDice([1, 2, 3, 4, 5])
    setHeld([false, false, false, false, false])
    setRollsLeft(3)
    setScores({})
    setRolledThisTurn(false)
    setRound((r) => r + 1)
  }

  return (
    <div className="game">
      <p className="game-message">
        {gameOver ? `🎉 최종 점수: ${total}` : `총점: ${total}`}
      </p>

      <div className="yacht-dice">
        {dice.map((d, i) => (
          <button
            key={i}
            type="button"
            className={`yacht-die ${held[i] ? 'is-held' : ''}`}
            onClick={() => toggleHold(i)}
            title={held[i] ? '고정됨' : '클릭해 고정'}
          >
            {DICE_FACES[d - 1]}
          </button>
        ))}
      </div>

      {!gameOver && (
        <button
          type="button"
          className="game-reset"
          onClick={roll}
          disabled={rollsLeft <= 0}
        >
          굴리기 ({rollsLeft}회 남음)
        </button>
      )}

      <div className="yacht-scores">
        {CATEGORIES.map((cat) => {
          const used = scores[cat.id] !== undefined
          return (
            <button
              key={cat.id}
              type="button"
              className={`yacht-row ${used ? 'is-used' : ''}`}
              onClick={() => pickCategory(cat)}
              disabled={used || !rolledThisTurn || gameOver}
            >
              <span>{cat.label}</span>
              <span>{used ? scores[cat.id] : rolledThisTurn ? cat.score(dice) : '-'}</span>
            </button>
          )
        })}
      </div>

      {gameOver && (
        <button type="button" className="game-reset" onClick={reset}>
          다시 하기
        </button>
      )}
      <ScorePanel key={round} gameId="yahtzee" score={total} active={gameOver} />
    </div>
  )
}

export default Yahtzee
