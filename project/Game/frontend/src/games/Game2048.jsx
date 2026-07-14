import { useState, useEffect, useCallback } from 'react'
import ScorePanel from '../components/ScorePanel.jsx'
import Difficulty from '../components/Difficulty.jsx'

const DIFFICULTIES = [
  { label: '4×4', value: 4 },
  { label: '5×5', value: 5 },
  { label: '6×6', value: 6 },
]
const CELL_PX = { 4: 70, 5: 58, 6: 48 }

function emptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(0))
}

function spawn(grid) {
  const size = grid.length
  const empties = []
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) if (grid[r][c] === 0) empties.push([r, c])
  if (empties.length === 0) return grid
  const [r, c] = empties[Math.floor(Math.random() * empties.length)]
  const next = grid.map((row) => row.slice())
  next[r][c] = Math.random() < 0.9 ? 2 : 4
  return next
}

function slideRow(row) {
  const size = row.length
  const nums = row.filter((n) => n !== 0)
  let gained = 0
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === nums[i + 1]) {
      nums[i] *= 2
      gained += nums[i]
      nums.splice(i + 1, 1)
    }
  }
  while (nums.length < size) nums.push(0)
  return { row: nums, gained }
}

const transpose = (g) => g[0].map((_, c) => g.map((row) => row[c]))
const reverseRows = (g) => g.map((row) => row.slice().reverse())

function move(grid, dir) {
  let g = grid
  if (dir === 'up') g = transpose(g)
  else if (dir === 'down') g = reverseRows(transpose(g))
  else if (dir === 'right') g = reverseRows(g)

  let gained = 0
  g = g.map((row) => {
    const res = slideRow(row)
    gained += res.gained
    return res.row
  })

  if (dir === 'up') g = transpose(g)
  else if (dir === 'down') g = transpose(reverseRows(g))
  else if (dir === 'right') g = reverseRows(g)

  return { grid: g, gained }
}

const equal = (a, b) => a.every((row, r) => row.every((v, c) => v === b[r][c]))

function hasMoves(grid) {
  for (const dir of ['up', 'down', 'left', 'right']) {
    if (!equal(grid, move(grid, dir).grid)) return true
  }
  return false
}

function freshGrid(size) {
  return spawn(spawn(emptyGrid(size)))
}

const DIRS = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
}

function Game2048() {
  const [size, setSize] = useState(4)
  const [grid, setGrid] = useState(() => freshGrid(4))
  const [score, setScore] = useState(0)
  const [over, setOver] = useState(false)
  const [round, setRound] = useState(0) // 새 판마다 증가시켜 랭킹 패널을 리마운트

  const handleMove = useCallback((dir) => {
    setGrid((prev) => {
      const { grid: moved, gained } = move(prev, dir)
      if (equal(prev, moved)) return prev
      const next = spawn(moved)
      setScore((s) => s + gained)
      if (!hasMoves(next)) setOver(true)
      return next
    })
  }, [])

  useEffect(() => {
    function onKey(e) {
      const dir = DIRS[e.key]
      if (!dir || over) return
      e.preventDefault()
      handleMove(dir)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleMove, over])

  function reset(nextSize = size) {
    setGrid(freshGrid(nextSize))
    setScore(0)
    setOver(false)
    setRound((r) => r + 1)
  }

  function changeDifficulty(v) {
    if (v === size) return
    setSize(v)
    reset(v)
  }

  const cell = CELL_PX[size]

  return (
    <div className="game">
      <p className="game-message">점수: {score}</p>
      <div
        className="g2048-board"
        style={{
          gridTemplateColumns: `repeat(${size}, ${cell}px)`,
          gridAutoRows: `${cell}px`,
        }}
      >
        {grid.flatMap((row, r) =>
          row.map((v, c) => (
            <div key={`${r}-${c}`} className={`g2048-tile v${v}`}>
              {v !== 0 ? v : ''}
            </div>
          )),
        )}
      </div>
      <p className="game-info">방향키로 타일을 밀어 합치세요{over && ' · 게임 오버!'}</p>
      <Difficulty value={size} onChange={changeDifficulty} options={DIFFICULTIES} />
      <button type="button" className="game-reset" onClick={() => reset()}>
        다시 하기
      </button>
      <ScorePanel key={round} gameId={`2048-${size}`} score={score} active={over} />
    </div>
  )
}

export default Game2048
