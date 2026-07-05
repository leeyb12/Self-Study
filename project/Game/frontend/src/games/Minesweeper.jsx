import { useState, useEffect } from 'react'
import ScorePanel from '../components/ScorePanel.jsx'
import Difficulty from '../components/Difficulty.jsx'

const CONFIGS = {
  easy: { rows: 9, cols: 9, mines: 10 },
  normal: { rows: 12, cols: 12, mines: 25 },
  hard: { rows: 14, cols: 14, mines: 45 },
}
const DIFFICULTIES = [
  { label: '쉬움', value: 'easy' },
  { label: '보통', value: 'normal' },
  { label: '어려움', value: 'hard' },
]

function buildBoard({ rows, cols, mines }) {
  // 각 칸: { mine, revealed, flagged, count }
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      count: 0,
    })),
  )

  let placed = 0
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows)
    const c = Math.floor(Math.random() * cols)
    if (!board[r][c].mine) {
      board[r][c].mine = true
      placed++
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue
      let count = 0
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine)
            count++
        }
      board[r][c].count = count
    }
  }
  return board
}

// 빈 칸(count 0)이면 인접 칸까지 재귀적으로 오픈. 보드 크기는 b에서 읽는다.
function revealAt(b, r, c) {
  if (r < 0 || r >= b.length || c < 0 || c >= b[0].length) return
  const cell = b[r][c]
  if (cell.revealed || cell.flagged) return
  cell.revealed = true
  if (cell.count === 0 && !cell.mine) {
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++)
        if (dr !== 0 || dc !== 0) revealAt(b, r + dr, c + dc)
  }
}

function checkWin(b) {
  for (const row of b) for (const cell of row) if (!cell.mine && !cell.revealed) return false
  return true
}

function Minesweeper() {
  const [difficulty, setDifficulty] = useState('easy')
  const [board, setBoard] = useState(() => buildBoard(CONFIGS.easy))
  const [status, setStatus] = useState('playing') // playing | won | lost
  const [seconds, setSeconds] = useState(0)
  const [started, setStarted] = useState(false)
  const [round, setRound] = useState(0)

  const cols = board[0].length

  // 첫 클릭 이후 게임 중에는 1초마다 경과 시간 증가
  useEffect(() => {
    if (status !== 'playing' || !started) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [status, started])

  function handleClick(r, c) {
    if (status !== 'playing') return
    const cell = board[r][c]
    if (cell.revealed || cell.flagged) return
    if (!started) setStarted(true) // 첫 클릭에 타이머 시작

    const next = board.map((row) => row.map((cl) => ({ ...cl })))

    if (next[r][c].mine) {
      next.forEach((row) => row.forEach((cl) => { if (cl.mine) cl.revealed = true }))
      setBoard(next)
      setStatus('lost')
      return
    }

    revealAt(next, r, c)
    setBoard(next)
    if (checkWin(next)) setStatus('won')
  }

  function handleFlag(e, r, c) {
    e.preventDefault()
    if (status !== 'playing' || board[r][c].revealed) return
    const next = board.map((row) => row.map((cl) => ({ ...cl })))
    next[r][c].flagged = !next[r][c].flagged
    setBoard(next)
  }

  function reset(diff = difficulty) {
    setBoard(buildBoard(CONFIGS[diff]))
    setStatus('playing')
    setSeconds(0)
    setStarted(false)
    setRound((r) => r + 1)
  }

  function changeDifficulty(v) {
    if (v === difficulty) return
    setDifficulty(v)
    reset(v)
  }

  const message =
    status === 'won' ? '🎉 클리어!' : status === 'lost' ? '💥 지뢰 밟음!' : '지뢰를 피해 모든 칸을 여세요'

  return (
    <div className="game">
      <p className="game-message">{message}</p>
      <div
        className="mine-board"
        style={{ gridTemplateColumns: `repeat(${cols}, 30px)`, gridAutoRows: '30px' }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            let content = ''
            let cls = 'mine-cell'
            if (cell.revealed) {
              cls += ' is-revealed'
              if (cell.mine) content = '💣'
              else if (cell.count > 0) {
                content = cell.count
                cls += ` n${cell.count}`
              }
            } else if (cell.flagged) {
              content = '🚩'
            }
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                className={cls}
                onClick={() => handleClick(r, c)}
                onContextMenu={(e) => handleFlag(e, r, c)}
              >
                {content}
              </button>
            )
          }),
        )}
      </div>
      <p className="game-info">⏱ {seconds}초 · 좌클릭: 열기 · 우클릭: 깃발</p>
      <Difficulty value={difficulty} onChange={changeDifficulty} options={DIFFICULTIES} />
      <button type="button" className="game-reset" onClick={() => reset()}>
        새 게임
      </button>
      <ScorePanel
        key={round}
        gameId={`minesweeper-${difficulty}`}
        score={seconds}
        active={status === 'won'}
        order="asc"
        unit="초"
      />
    </div>
  )
}

export default Minesweeper
