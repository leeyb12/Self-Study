import { useState } from 'react'
import ScorePanel from '../components/ScorePanel.jsx'
import Difficulty from '../components/Difficulty.jsx'

const EMOJIS = ['🐶', '🐱', '🦊', '🐻', '🐼', '🐸', '🐵', '🦁', '🐨', '🐯', '🐷', '🐮']
const DIFFICULTIES = [
  { label: '쉬움', value: 6 },
  { label: '보통', value: 8 },
  { label: '어려움', value: 10 },
]

function shuffledDeck(pairs) {
  const chosen = EMOJIS.slice(0, pairs)
  return [...chosen, ...chosen]
    .map((emoji, i) => ({ id: i, emoji }))
    .sort(() => Math.random() - 0.5)
}

function Memory() {
  const [pairs, setPairs] = useState(8)
  const [deck, setDeck] = useState(() => shuffledDeck(8))
  const [flipped, setFlipped] = useState([]) // 현재 뒤집힌 카드 인덱스 (최대 2)
  const [matched, setMatched] = useState([]) // 맞춘 카드 인덱스
  const [moves, setMoves] = useState(0)
  const [busy, setBusy] = useState(false)
  const [round, setRound] = useState(0)

  const won = matched.length === deck.length

  function handleFlip(index) {
    if (busy || flipped.includes(index) || matched.includes(index)) return

    const next = [...flipped, index]
    setFlipped(next)

    if (next.length === 2) {
      setMoves((m) => m + 1)
      const [a, b] = next
      if (deck[a].emoji === deck[b].emoji) {
        setMatched((prev) => [...prev, a, b])
        setFlipped([])
      } else {
        setBusy(true)
        setTimeout(() => {
          setFlipped([])
          setBusy(false)
        }, 800)
      }
    }
  }

  function reset(nextPairs = pairs) {
    setDeck(shuffledDeck(nextPairs))
    setFlipped([])
    setMatched([])
    setMoves(0)
    setBusy(false)
    setRound((r) => r + 1)
  }

  function changeDifficulty(v) {
    if (v === pairs) return
    setPairs(v)
    reset(v)
  }

  return (
    <div className="game">
      <p className="game-message">
        {won ? `🎉 완료! (${moves}번 시도)` : `시도 횟수: ${moves}`}
      </p>
      <div className="memory-board">
        {deck.map((card, i) => {
          const show = flipped.includes(i) || matched.includes(i)
          return (
            <button
              key={card.id}
              type="button"
              className={`memory-card ${show ? 'is-open' : ''}`}
              onClick={() => handleFlip(i)}
            >
              {show ? card.emoji : '❔'}
            </button>
          )
        })}
      </div>
      <Difficulty value={pairs} onChange={changeDifficulty} options={DIFFICULTIES} />
      <button type="button" className="game-reset" onClick={() => reset()}>
        다시 섞기
      </button>
      <ScorePanel
        key={round}
        gameId={`memory-${pairs}`}
        score={moves}
        active={won}
        order="asc"
        unit="회"
      />
    </div>
  )
}

export default Memory
