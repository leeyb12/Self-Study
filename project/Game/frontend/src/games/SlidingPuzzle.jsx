import { useState } from 'react'
import ScorePanel from '../components/ScorePanel.jsx'

const SIZE = 4
const TOTAL = SIZE * SIZE
const SOLVED = Array.from({ length: TOTAL }, (_, i) => (i + 1) % TOTAL) // [1..15, 0]

function isSolvable(tiles) {
  // 15퍼즐 풀이 가능 조건: (역위수 + 빈칸의 행) 홀짝 판정
  let inversions = 0
  const nums = tiles.filter((n) => n !== 0)
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      if (nums[i] > nums[j]) inversions++
  const blankRow = Math.floor(tiles.indexOf(0) / SIZE)
  const blankRowFromBottom = SIZE - blankRow
  return (inversions + blankRowFromBottom) % 2 === 0
}

function shuffle() {
  let tiles
  do {
    tiles = [...SOLVED].sort(() => Math.random() - 0.5)
  } while (!isSolvable(tiles) || tiles.every((v, i) => v === SOLVED[i]))
  return tiles
}

function SlidingPuzzle() {
  const [tiles, setTiles] = useState(shuffle)
  const [moves, setMoves] = useState(0)
  const [round, setRound] = useState(0)

  const solved = tiles.every((v, i) => v === SOLVED[i])

  function handleClick(i) {
    if (solved) return
    const blank = tiles.indexOf(0)
    const r = Math.floor(i / SIZE)
    const c = i % SIZE
    const br = Math.floor(blank / SIZE)
    const bc = blank % SIZE
    const adjacent = Math.abs(r - br) + Math.abs(c - bc) === 1
    if (!adjacent) return

    const next = tiles.slice()
    ;[next[i], next[blank]] = [next[blank], next[i]]
    setTiles(next)
    setMoves((m) => m + 1)
  }

  function reset() {
    setTiles(shuffle())
    setMoves(0)
    setRound((r) => r + 1)
  }

  return (
    <div className="game">
      <p className="game-message">
        {solved ? `🎉 완성! (${moves}번 이동)` : `이동: ${moves}`}
      </p>
      <div className="slide-board">
        {tiles.map((v, i) => (
          <button
            key={i}
            type="button"
            className={`slide-tile ${v === 0 ? 'is-blank' : ''}`}
            onClick={() => handleClick(i)}
          >
            {v !== 0 ? v : ''}
          </button>
        ))}
      </div>
      <p className="game-info">빈칸 옆 타일을 눌러 정렬하세요</p>
      <button type="button" className="game-reset" onClick={reset}>
        섞기
      </button>
      <ScorePanel
        key={round}
        gameId="sliding-puzzle"
        score={moves}
        active={solved}
        order="asc"
        unit="회"
      />
    </div>
  )
}

export default SlidingPuzzle
