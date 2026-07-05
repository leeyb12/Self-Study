import { useState } from 'react'

const SIZE = 15
const DIRS = [
  [1, 0], // 가로
  [0, 1], // 세로
  [1, 1], // ↘ 대각
  [1, -1], // ↙ 대각
]

function emptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
}

function checkWin(board, r, c, player) {
  for (const [dr, dc] of DIRS) {
    let count = 1
    for (const sign of [1, -1]) {
      let nr = r + dr * sign
      let nc = c + dc * sign
      while (
        nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE &&
        board[nr][nc] === player
      ) {
        count++
        nr += dr * sign
        nc += dc * sign
      }
    }
    if (count >= 5) return true
  }
  return false
}

function Gomoku() {
  const [board, setBoard] = useState(emptyBoard)
  const [black, setBlack] = useState(true) // 흑 선공
  const [winner, setWinner] = useState(null)

  function handleClick(r, c) {
    if (board[r][c] || winner) return
    const player = black ? '⚫' : '⚪'
    const next = board.map((row) => row.slice())
    next[r][c] = player
    setBoard(next)
    if (checkWin(next, r, c, player)) {
      setWinner(player)
    } else {
      setBlack(!black)
    }
  }

  function reset() {
    setBoard(emptyBoard())
    setBlack(true)
    setWinner(null)
  }

  const status = winner
    ? `🎉 ${winner} 승리!`
    : `${black ? '⚫ 흑' : '⚪ 백'} 차례`

  return (
    <div className="game">
      <p className="game-message">{status}</p>
      <div className="gomoku-board">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              className="gomoku-cell"
              onClick={() => handleClick(r, c)}
            >
              {cell}
            </button>
          )),
        )}
      </div>
      <button type="button" className="game-reset" onClick={reset}>
        다시 하기
      </button>
    </div>
  )
}

export default Gomoku
