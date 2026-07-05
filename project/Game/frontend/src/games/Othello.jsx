import { useState, useEffect } from 'react'
import Difficulty from '../components/Difficulty.jsx'

const SIZE = 8

const OTHELLO_DIFF = [
  { label: '쉬움', value: 'easy' },
  { label: '보통', value: 'normal' },
  { label: '어려움', value: 'hard' },
]

// 위치 가중치(모서리 최고, 모서리 옆 위험) — 어려움 난이도에서 사용
const WEIGHTS = [
  [120, -20, 20, 5, 5, 20, -20, 120],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [120, -20, 20, 5, 5, 20, -20, 120],
]

function pickAiMove(moves, difficulty) {
  if (moves.length === 0) return null
  if (difficulty === 'easy') return moves[Math.floor(Math.random() * moves.length)]
  if (difficulty === 'hard') {
    return moves.reduce((best, m) => {
      const s = WEIGHTS[m.r][m.c] + m.flips.length
      const bs = WEIGHTS[best.r][best.c] + best.flips.length
      return s > bs ? m : best
    })
  }
  // normal: 가장 많이 뒤집는 수
  return moves.reduce((a, m) => (m.flips.length > a.flips.length ? m : a))
}
const BLACK = 'B' // 플레이어
const WHITE = 'W' // AI
const DIRS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
]

function initialBoard() {
  const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
  board[3][3] = WHITE
  board[3][4] = BLACK
  board[4][3] = BLACK
  board[4][4] = WHITE
  return board
}

const opponent = (p) => (p === BLACK ? WHITE : BLACK)

// (r,c)에 player가 두었을 때 뒤집히는 돌들의 좌표 목록
function flipsFor(board, r, c, player) {
  if (board[r][c]) return []
  const flips = []
  for (const [dr, dc] of DIRS) {
    const line = []
    let nr = r + dr
    let nc = c + dc
    while (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === opponent(player)) {
      line.push([nr, nc])
      nr += dr
      nc += dc
    }
    if (line.length && nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === player) {
      flips.push(...line)
    }
  }
  return flips
}

function legalMoves(board, player) {
  const moves = []
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      const flips = flipsFor(board, r, c, player)
      if (flips.length) moves.push({ r, c, flips })
    }
  return moves
}

function applyMove(board, move, player) {
  const next = board.map((row) => row.slice())
  next[move.r][move.c] = player
  for (const [fr, fc] of move.flips) next[fr][fc] = player
  return next
}

function countDiscs(board) {
  let b = 0
  let w = 0
  for (const row of board)
    for (const cell of row) {
      if (cell === BLACK) b++
      else if (cell === WHITE) w++
    }
  return { b, w }
}

// 한 수를 둔 뒤 다음에 둘 플레이어의 상태(차례/메시지)를 계산.
// nextPlayer가 둘 곳이 없으면 상대에게 넘기고, 둘 다 없으면 종료.
function resolveTurn(board, nextPlayer) {
  if (legalMoves(board, nextPlayer).length > 0) {
    return {
      turn: nextPlayer,
      message: nextPlayer === BLACK ? '당신(흑) 차례' : 'AI(백) 생각 중…',
    }
  }
  if (legalMoves(board, opponent(nextPlayer)).length === 0) {
    const { b, w } = countDiscs(board)
    return {
      turn: 'over',
      message: b > w ? '🎉 당신 승리!' : b < w ? 'AI 승리 😢' : '무승부!',
    }
  }
  return {
    turn: opponent(nextPlayer),
    message: `${nextPlayer === BLACK ? '당신' : 'AI'} 패스`,
  }
}

function Othello() {
  const [board, setBoard] = useState(initialBoard)
  const [turn, setTurn] = useState(BLACK)
  const [message, setMessage] = useState('당신(흑) 차례')
  const [difficulty, setDifficulty] = useState('normal')

  const { b, w } = countDiscs(board)
  const playerMoves = legalMoves(board, BLACK)

  // AI(백) 차례 처리 (effect는 모듈 레벨 함수와 setState만 참조)
  useEffect(() => {
    if (turn !== WHITE) return
    const timer = setTimeout(() => {
      const moves = legalMoves(board, WHITE)
      let nextBoard = board
      const best = pickAiMove(moves, difficulty)
      if (best) {
        nextBoard = applyMove(board, best, WHITE)
        setBoard(nextBoard)
      }
      const s = resolveTurn(nextBoard, BLACK)
      setTurn(s.turn)
      setMessage(s.message)
    }, 500)
    return () => clearTimeout(timer)
  }, [turn, board, difficulty])

  function handleClick(r, c) {
    if (turn !== BLACK) return
    const move = playerMoves.find((m) => m.r === r && m.c === c)
    if (!move) return
    const next = applyMove(board, move, BLACK)
    setBoard(next)
    const s = resolveTurn(next, WHITE)
    setTurn(s.turn)
    setMessage(s.message)
  }

  function reset() {
    setBoard(initialBoard())
    setTurn(BLACK)
    setMessage('당신(흑) 차례')
  }

  const hintSet = new Set(
    turn === BLACK ? playerMoves.map((m) => `${m.r},${m.c}`) : [],
  )

  return (
    <div className="game">
      <p className="game-message">{message}</p>
      <p className="game-info">⚫ {b} : {w} ⚪</p>
      <div className="othello-board">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              className="othello-cell"
              onClick={() => handleClick(r, c)}
            >
              {cell === BLACK && <span className="disc black" />}
              {cell === WHITE && <span className="disc white" />}
              {!cell && hintSet.has(`${r},${c}`) && <span className="disc hint" />}
            </button>
          )),
        )}
      </div>
      <Difficulty value={difficulty} onChange={setDifficulty} options={OTHELLO_DIFF} />
      <button type="button" className="game-reset" onClick={reset}>
        다시 하기
      </button>
    </div>
  )
}

export default Othello
