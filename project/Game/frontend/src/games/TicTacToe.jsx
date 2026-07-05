import { useState } from 'react'

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // 가로
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // 세로
  [0, 4, 8], [2, 4, 6],            // 대각선
]

function calcWinner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return null
}

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xNext, setXNext] = useState(true)

  const winner = calcWinner(board)
  const full = board.every(Boolean)
  const status = winner
    ? `🎉 승자: ${winner}`
    : full
      ? '무승부!'
      : `다음 차례: ${xNext ? 'X' : 'O'}`

  function handleClick(i) {
    if (board[i] || winner) return
    const next = board.slice()
    next[i] = xNext ? 'X' : 'O'
    setBoard(next)
    setXNext(!xNext)
  }

  function reset() {
    setBoard(Array(9).fill(null))
    setXNext(true)
  }

  return (
    <div className="game">
      <p className="game-message">{status}</p>
      <div className="ttt-board">
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            className="ttt-cell"
            onClick={() => handleClick(i)}
          >
            {cell}
          </button>
        ))}
      </div>
      <button type="button" className="game-reset" onClick={reset}>
        다시 하기
      </button>
    </div>
  )
}

export default TicTacToe
