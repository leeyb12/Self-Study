import { useState, useEffect } from 'react'
import {
  initialState,
  legalMoves,
  makeMove,
  getStatus,
  isInCheck,
  chooseAiMove,
} from './chessEngine.js'
import Difficulty from '../components/Difficulty.jsx'

const DIFFICULTIES = [
  { label: '쉬움', value: 2 },
  { label: '보통', value: 3 },
  { label: '어려움', value: 4 },
]

const SYM = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
}

function Chess() {
  const [state, setState] = useState(initialState)
  const [turn, setTurn] = useState('w') // 'w' 플레이어, 'b' AI
  const [selected, setSelected] = useState(null) // [r,c]
  const [message, setMessage] = useState('당신(백) 차례')
  const [over, setOver] = useState(false)
  const [depth, setDepth] = useState(3) // AI 탐색 깊이(난이도)

  // 선택한 기물의 이동 가능 칸
  const targets =
    selected && turn === 'w'
      ? legalMoves(state, 'w').filter(
          (m) => m.from[0] === selected[0] && m.from[1] === selected[1],
        )
      : []

  function finishAfter(ns, mover) {
    // mover가 둔 뒤, 상대 차례의 상태를 판정
    const next = mover === 'w' ? 'b' : 'w'
    const st = getStatus(ns, next)
    if (st === 'checkmate') {
      setOver(true)
      setMessage(mover === 'w' ? '🎉 체크메이트! 당신 승리' : '체크메이트 · AI 승리 😢')
      return
    }
    if (st === 'stalemate') {
      setOver(true)
      setMessage('스테일메이트 · 무승부')
      return
    }
    const check = isInCheck(ns, next)
    if (next === 'w') setMessage(check ? '체크! 당신(백) 차례' : '당신(백) 차례')
    else setMessage(check ? '체크! AI 생각 중…' : 'AI 생각 중…')
    setTurn(next)
  }

  // AI 차례
  useEffect(() => {
    if (turn !== 'b' || over) return
    const timer = setTimeout(() => {
      const move = chooseAiMove(state, 'b', depth)
      if (!move) return
      const ns = makeMove(state, move)
      setState(ns)
      finishAfter(ns, 'b')
    }, 300)
    return () => clearTimeout(timer)
  }, [turn, over, state, depth])

  function handleClick(r, c) {
    if (over || turn !== 'w') return
    const piece = state.board[r][c]

    if (selected) {
      const move = targets.find((m) => m.to[0] === r && m.to[1] === c)
      if (move) {
        const ns = makeMove(state, move)
        setState(ns)
        setSelected(null)
        finishAfter(ns, 'w')
        return
      }
      // 다른 자기 기물 선택
      if (piece && piece.c === 'w') setSelected([r, c])
      else setSelected(null)
      return
    }

    if (piece && piece.c === 'w') setSelected([r, c])
  }

  function reset() {
    setState(initialState())
    setTurn('w')
    setSelected(null)
    setMessage('당신(백) 차례')
    setOver(false)
  }

  const targetSet = new Set(targets.map((m) => `${m.to[0]},${m.to[1]}`))

  return (
    <div className="game">
      <p className="game-message">{message}</p>
      <div className="chess-board">
        {state.board.map((row, r) =>
          row.map((piece, c) => {
            const dark = (r + c) % 2 === 1
            const isSel = selected && selected[0] === r && selected[1] === c
            const isTarget = targetSet.has(`${r},${c}`)
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                className={
                  'chess-cell' +
                  (dark ? ' dark' : ' light') +
                  (isSel ? ' selected' : '') +
                  (isTarget ? ' target' : '')
                }
                onClick={() => handleClick(r, c)}
              >
                {piece ? SYM[piece.c][piece.t] : ''}
              </button>
            )
          }),
        )}
      </div>
      <p className="game-info">프로모션은 자동으로 퀸으로 승격됩니다</p>
      <Difficulty value={depth} onChange={setDepth} options={DIFFICULTIES} />
      <button type="button" className="game-reset" onClick={reset}>
        새 게임
      </button>
    </div>
  )
}

export default Chess
