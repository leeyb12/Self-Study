import { useState } from 'react'
import { useStompRoom, makeId } from '../hooks/useStompRoom.js'

function OnlineQuiz() {
  const [playerId] = useState(makeId)
  const [roomInput, setRoomInput] = useState('')
  const [room, setRoom] = useState(null)
  const { state, connected, error, publish } = useStompRoom('quiz', room, playerId)

  const mySymbol = state
    ? state.playerX === playerId
      ? 'X'
      : state.playerO === playerId
        ? 'O'
        : null
    : null
  const iAnswered = state && (mySymbol === 'X' ? state.answeredX : state.answeredO)
  const myScore = state ? (mySymbol === 'X' ? state.scoreX : state.scoreO) : 0
  const oppScore = state ? (mySymbol === 'X' ? state.scoreO : state.scoreX) : 0
  const myPick = state ? (mySymbol === 'X' ? state.pickX : state.pickO) : -1

  function join() {
    const code = roomInput.trim()
    if (code) setRoom(code)
  }

  if (!room) {
    return (
      <div className="game">
        <p className="game-message">방 코드로 입장하세요</p>
        <p className="game-info">같은 코드를 입력한 두 사람이 실시간 퀴즈로 대결합니다.</p>
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

  if (error || !connected || !state) {
    return (
      <div className="game">
        <p className="game-message">{error || '연결 중…'}</p>
        <button type="button" className="game-reset" onClick={() => setRoom(null)}>나가기</button>
      </div>
    )
  }

  if (!mySymbol) {
    return (
      <div className="game">
        <p className="game-message">방이 가득 찼습니다 (관전 중)</p>
        <button type="button" className="game-reset" onClick={() => setRoom(null)}>나가기</button>
      </div>
    )
  }

  const phase = state.phase
  const scoreLine = `나 ${myScore} : ${oppScore} 상대`

  return (
    <div className="game">
      {phase === 'waiting' && (
        <p className="game-message">상대를 기다리는 중… (방 코드: {room})</p>
      )}

      {(phase === 'question' || phase === 'reveal') && (
        <>
          <p className="game-info">
            {state.qIndex + 1} / {state.total} · {scoreLine}
          </p>
          <p className="game-message">{state.question}</p>
          <div className="quiz-options">
            {state.options.map((opt, i) => {
              let cls = ''
              if (phase === 'reveal') {
                if (i === state.answer) cls = 'correct'
                else if (i === myPick) cls = 'wrong'
              }
              const disabled = phase === 'reveal' || iAnswered
              return (
                <button
                  key={i}
                  type="button"
                  className={`quiz-option ${cls}`}
                  onClick={() => publish('answer', { playerId, index: i })}
                  disabled={disabled}
                >
                  {opt}
                </button>
              )
            })}
          </div>
          {phase === 'question' && iAnswered && (
            <p className="game-info">상대가 답하기를 기다리는 중…</p>
          )}
          {phase === 'reveal' && (
            <button type="button" className="game-reset" onClick={() => publish('next')}>
              다음 문제
            </button>
          )}
        </>
      )}

      {phase === 'finished' && (
        <>
          <p className="game-message">
            {state.winner === 'draw'
              ? `무승부! (${scoreLine})`
              : state.winner === mySymbol
                ? `🎉 승리! (${scoreLine})`
                : `패배 😢 (${scoreLine})`}
          </p>
          <button type="button" className="game-reset" onClick={() => publish('reset')}>
            새 게임
          </button>
        </>
      )}

      <button type="button" onClick={() => setRoom(null)}>나가기</button>
    </div>
  )
}

export default OnlineQuiz
