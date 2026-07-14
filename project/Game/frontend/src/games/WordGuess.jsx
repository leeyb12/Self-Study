import { useState } from 'react'
import { wordGuess } from '../api/ai.js'
import ScorePanel from '../components/ScorePanel.jsx'

const normalize = (s) => s.trim().replace(/\s+/g, '').toLowerCase()

function WordGuess() {
  const [secret, setSecret] = useState(null)
  const [hints, setHints] = useState([])
  const [revealed, setRevealed] = useState(1) // 공개된 힌트 수
  const [input, setInput] = useState('')
  const [wrong, setWrong] = useState([])
  const [solved, setSolved] = useState(false)
  const [gaveUp, setGaveUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [round, setRound] = useState(0)

  async function start() {
    setLoading(true)
    setError(null)
    try {
      const res = await wordGuess()
      const hs = Array.isArray(res.hints) ? res.hints.filter(Boolean) : []
      if (!res.word || hs.length === 0) throw new Error('문제를 생성하지 못했습니다')
      setSecret(res.word)
      setHints(hs)
      setRevealed(1)
      setInput('')
      setWrong([])
      setSolved(false)
      setGaveUp(false)
      setRound((r) => r + 1)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function submit(e) {
    e.preventDefault()
    const guess = input.trim()
    if (!guess || solved) return
    if (normalize(guess) === normalize(secret)) {
      setSolved(true)
    } else {
      setWrong((w) => [...w, guess])
      setRevealed((r) => Math.min(r + 1, hints.length))
      setInput('')
    }
  }

  if (!secret) {
    return (
      <div className="game">
        <p className="game-message">🤖 AI가 낸 설명을 보고 단어를 맞혀보세요</p>
        {error && <p className="score-error">{error}</p>}
        <button type="button" className="game-reset" onClick={start} disabled={loading}>
          {loading ? '생성 중…' : '시작'}
        </button>
      </div>
    )
  }

  return (
    <div className="game">
      <p className="game-message">
        {solved ? `🎉 정답! ${secret}` : gaveUp ? `정답: ${secret}` : '이 단어는 무엇일까요?'}
      </p>

      <div className="ai-log">
        {hints.slice(0, revealed).map((h, i) => (
          <p key={i} className="hint-line">💡 {h}</p>
        ))}
      </div>

      {wrong.length > 0 && !solved && (
        <p className="game-info">틀린 시도: {wrong.join(', ')}</p>
      )}

      {!solved && !gaveUp && (
        <form className="game-controls" onSubmit={submit}>
          <input
            type="text"
            value={input}
            placeholder="정답 입력"
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <button type="submit" disabled={input.trim() === ''}>확인</button>
        </form>
      )}

      <div className="game-controls">
        {!solved && !gaveUp && (
          <button type="button" onClick={() => setGaveUp(true)}>포기(정답 보기)</button>
        )}
        <button type="button" className="game-reset" onClick={start} disabled={loading}>
          {loading ? '생성 중…' : '새 문제'}
        </button>
      </div>
      <ScorePanel
        key={round}
        gameId="word-guess"
        score={revealed}
        active={solved}
        order="asc"
        unit="힌트"
      />
    </div>
  )
}

export default WordGuess
