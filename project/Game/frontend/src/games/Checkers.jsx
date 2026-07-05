import { useState, useEffect } from 'react'

// 플레이어 red(r): 아래쪽에서 위로(-r). AI black(b): 위에서 아래로(+r).
// 어두운 칸((r+c)%2===1)만 사용. 킹은 양방향 이동/캡처.
const RED = 'r'
const BLACK = 'b'
const inB = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8

function initialBoard() {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null))
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 !== 1) continue
      if (r < 3) board[r][c] = { c: BLACK, king: false }
      else if (r > 4) board[r][c] = { c: RED, king: false }
    }
  return board
}

function pieceDirs(piece) {
  if (piece.king) return [[-1, -1], [-1, 1], [1, -1], [1, 1]]
  return piece.c === RED ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]]
}

const cloneBoard = (b) => b.map((row) => row.slice())

// 한 기물의 모든 연속 캡처 시퀀스(최대 점프)를 반환
function captureSeqs(board, sr, sc) {
  const results = []
  const rec = (b, r, c, path, caps) => {
    const piece = b[r][c]
    let extended = false
    for (const [dr, dc] of pieceDirs(piece)) {
      const mr = r + dr
      const mc = c + dc
      const lr = r + 2 * dr
      const lc = c + 2 * dc
      if (!inB(lr, lc)) continue
      const mid = b[mr][mc]
      if (mid && mid.c !== piece.c && !b[lr][lc]) {
        const nb = cloneBoard(b)
        nb[lr][lc] = piece
        nb[r][c] = null
        nb[mr][mc] = null
        extended = true
        rec(nb, lr, lc, [...path, [lr, lc]], [...caps, [mr, mc]])
      }
    }
    if (!extended && caps.length > 0) results.push({ path, caps })
  }
  rec(board, sr, sc, [[sr, sc]], [])
  return results
}

function genMoves(board, color) {
  const captures = []
  const simples = []
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (!piece || piece.c !== color) continue
      captures.push(...captureSeqs(board, r, c))
      for (const [dr, dc] of pieceDirs(piece)) {
        const nr = r + dr
        const nc = c + dc
        if (inB(nr, nc) && !board[nr][nc]) {
          simples.push({ path: [[r, c], [nr, nc]], caps: [] })
        }
      }
    }
  // 강제 캡처: 캡처 가능하면 캡처만 합법
  return captures.length > 0 ? captures : simples
}

function applyMove(board, move) {
  const b = cloneBoard(board)
  const [sr, sc] = move.path[0]
  const [er, ec] = move.path[move.path.length - 1]
  const piece = { ...b[sr][sc] }
  b[sr][sc] = null
  for (const [cr, cc] of move.caps) b[cr][cc] = null
  // 킹 승격
  if (piece.c === RED && er === 0) piece.king = true
  if (piece.c === BLACK && er === 7) piece.king = true
  b[er][ec] = piece
  return b
}

function countPieces(board, color) {
  let n = 0
  for (const row of board) for (const cell of row) if (cell && cell.c === color) n++
  return n
}

function Checkers() {
  const [board, setBoard] = useState(initialBoard)
  const [turn, setTurn] = useState(RED)
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('당신(빨강) 차례')
  const [over, setOver] = useState(false)

  const playerMoves = turn === RED && !over ? genMoves(board, RED) : []
  // 선택한 기물에서 시작하는 이동의 도착 칸
  const targets = selected
    ? playerMoves.filter((m) => m.path[0][0] === selected[0] && m.path[0][1] === selected[1])
    : []
  const targetSet = new Set(targets.map((m) => `${m.path.at(-1)[0]},${m.path.at(-1)[1]}`))
  const movableSet = new Set(playerMoves.map((m) => `${m.path[0][0]},${m.path[0][1]}`))

  function finishAfter(nb, mover) {
    const next = mover === RED ? BLACK : RED
    if (countPieces(nb, next) === 0 || genMoves(nb, next).length === 0) {
      setOver(true)
      setMessage(mover === RED ? '🎉 당신 승리!' : 'AI 승리 😢')
      return
    }
    setTurn(next)
    setMessage(next === RED ? '당신(빨강) 차례' : 'AI 생각 중…')
  }

  // AI 차례
  useEffect(() => {
    if (turn !== BLACK || over) return
    const timer = setTimeout(() => {
      const moves = genMoves(board, BLACK)
      if (moves.length === 0) return
      // 그리디: 가장 많이 잡는 수, 동점이면 무작위
      const maxCaps = Math.max(...moves.map((m) => m.caps.length))
      const bestMoves = moves.filter((m) => m.caps.length === maxCaps)
      const move = bestMoves[Math.floor(Math.random() * bestMoves.length)]
      const nb = applyMove(board, move)
      setBoard(nb)
      finishAfter(nb, BLACK)
    }, 400)
    return () => clearTimeout(timer)
  }, [turn, over, board])

  function handleClick(r, c) {
    if (over || turn !== RED) return
    const piece = board[r][c]

    if (selected) {
      const move = targets.find((m) => {
        const end = m.path.at(-1)
        return end[0] === r && end[1] === c
      })
      if (move) {
        const nb = applyMove(board, move)
        setBoard(nb)
        setSelected(null)
        finishAfter(nb, RED)
        return
      }
      if (piece && piece.c === RED && movableSet.has(`${r},${c}`)) setSelected([r, c])
      else setSelected(null)
      return
    }

    if (piece && piece.c === RED && movableSet.has(`${r},${c}`)) setSelected([r, c])
  }

  function reset() {
    setBoard(initialBoard())
    setTurn(RED)
    setSelected(null)
    setMessage('당신(빨강) 차례')
    setOver(false)
  }

  return (
    <div className="game">
      <p className="game-message">{message}</p>
      <div className="checkers-board">
        {board.map((row, r) =>
          row.map((piece, c) => {
            const dark = (r + c) % 2 === 1
            const isSel = selected && selected[0] === r && selected[1] === c
            const isTarget = targetSet.has(`${r},${c}`)
            const canMove = turn === RED && movableSet.has(`${r},${c}`)
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                className={
                  'checkers-cell' +
                  (dark ? ' dark' : ' light') +
                  (isSel ? ' selected' : '') +
                  (isTarget ? ' target' : '')
                }
                onClick={() => handleClick(r, c)}
              >
                {piece && (
                  <span className={`checker ${piece.c === RED ? 'red' : 'black'} ${canMove ? 'movable' : ''}`}>
                    {piece.king ? '♛' : ''}
                  </span>
                )}
              </button>
            )
          }),
        )}
      </div>
      <p className="game-info">캡처가 가능하면 반드시 잡아야 합니다</p>
      <button type="button" className="game-reset" onClick={reset}>
        새 게임
      </button>
    </div>
  )
}

export default Checkers
