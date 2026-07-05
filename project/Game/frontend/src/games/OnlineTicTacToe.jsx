import { useState } from 'react'
import { useStompRoom, makeId } from '../hooks/useStompRoom.js'

function OnlineTicTacToe() {
  const [playerId] = useState(makeId)
  const [roomInput, setRoomInput] = useState('')
  const [room, setRoom] = useState(null)
  const { state, connected, error, publish } = useStompRoom('room', room, playerId)

  const mySymbol = state
    ? state.playerX === playerId
      ? 'X'
      : state.playerO === playerId
        ? 'O'
        : null
    : null
  const bothPresent = state && state.playerX && state.playerO
  const myTurn =
    connected && state && mySymbol && !state.winner && bothPresent && state.turn === mySymbol

  function cellClick(i) {
    if (!myTurn || state.board[i]) return
    publish('move', { playerId, index: i })
  }

  function join() {
    const code = roomInput.trim()
    if (code) setRoom(code)
  }

  if (!room) {
    return (
      <div className="game">
        <p className="game-message">방 코드로 입장하세요</p>
        <p className="game-info">같은 코드를 입력한 두 사람이 대결합니다.</p>
        <div className="game-controls">
          <input
            type="text"
            value={roomInput}
            placeholder="방 코드 (예: abc)"
            onChange={(e) => setRoomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && join()}
          />
          <button type="button" onClick={join}>입장</button>
        </div>
      </div>
    )
  }

  let status
  if (error) status = error
  else if (!connected || !state) status = '연결 중…'
  else if (!mySymbol) status = '방이 가득 찼습니다 (관전 중)'
  else if (!bothPresent) status = `상대를 기다리는 중… (방 코드: ${room})`
  else if (state.winner === 'draw') status = '무승부!'
  else if (state.winner) status = state.winner === mySymbol ? '🎉 승리!' : '패배 😢'
  else status = myTurn ? '내 차례' : '상대 차례'

  return (
    <div className="game">
      <p className="game-message">{status}</p>
      {mySymbol && <p className="game-info">내 기호: {mySymbol}</p>}

      <div className="ttt-board">
        {(state?.board ?? Array(9).fill(null)).map((cell, i) => (
          <button
            key={i}
            type="button"
            className="ttt-cell"
            onClick={() => cellClick(i)}
            disabled={!myTurn}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="game-controls">
        <button type="button" onClick={() => publish('reset')} disabled={!connected}>새 판</button>
        <button type="button" onClick={() => setRoom(null)}>나가기</button>
      </div>
    </div>
  )
}

export default OnlineTicTacToe
