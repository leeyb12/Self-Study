import { useState } from 'react'
import { twentyStart, twentyAsk } from '../api/ai.js'
import ScorePanel from '../components/ScorePanel.jsx'

const MAX = 20
const normalize = (s) => s.trim().replace(/\s+/g, '').toLowerCase()

function TwentyQuestions() {
  const [secret, setSecret] = useState(null) // 화면에 표시하지 않음
  const [log, setLog] = useState([]) // { q, a }
  const [remaining, setRemaining] = useState(MAX)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null) // 'won' | 'lost' | null
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [round, setRound] = useState(0)

  async function start() {
    setLoading(true)
    setError(null)
    try {
      const res = await twentyStart()
      if (!res.secret) throw new Error('답을 정하지 못했습니다')
      setSecret(res.secret)
      setLog([])
      setRemaining(MAX)
      setInput('')
      setResult(null)
      setRound((r) => r + 1)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function ask(e) {
    e.preventDefault()
    const q = input.trim()
    if (!q || loading || result) return
    setLoading(true)
    setError(null)
    setInput('')
    try {
      const res = await twentyAsk(secret, q)
      const answer = res.answer || '애매함'
      const nextLog = [...log, { q, a: answer }]
      setLog(nextLog)
      const left = remaining - 1
      setRemaining(left)
      if (left <= 0) setResult('lost')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function guess() {
    const g = input.trim()
    if (!g || result) return
    if (normalize(g) === normalize(secret)) {
      setResult('won')
    } else {
      // 틀린 추측은 한 번의 기회를 소모
      const left = remaining - 1
      setRemaining(left)
      setLog((l) => [...l, { q: `[정답 시도] ${g}`, a: '❌ 아니에요' }])
      setInput('')
      if (left <= 0) setResult('lost')
    }
  }

  if (!secret) {
    return (
      <div className="game">
        <p className="game-message">🤖 AI가 정한 것을 20번 안에 알아맞혀 보세요</p>
        <p className="game-info">예/아니오로 답할 수 있는 질문을 하세요.</p>
        {error && <p className="score-error">{error}</p>}
        <button type="button" className="game-reset" onClick={start} disabled={loading}>
          {loading ? '준비 중…' : '시작'}
        </button>
      </div>
    )
  }

  return (
    <div className="game">
      <p className="game-message">
        {result === 'won'
          ? `🎉 정답! (${secret})`
          : result === 'lost'
            ? `아쉬워요! 정답은 '${secret}'`
            : `남은 질문: ${remaining}`}
      </p>

      <div className="ai-log">
        {log.map((e, i) => (
          <p key={i} className="qa-line">
            <b>Q.</b> {e.q} <b>→</b> {e.a}
          </p>
        ))}
      </div>

      {!result && (
        <>
          <form className="game-controls" onSubmit={ask}>
            <input
              type="text"
              value={input}
              placeholder="예/아니오 질문 또는 정답"
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button type="submit" disabled={loading || input.trim() === ''}>
              {loading ? '…' : '질문'}
            </button>
          </form>
          <button type="button" onClick={guess} disabled={loading || input.trim() === ''}>
            이거다! (정답 시도)
          </button>
        </>
      )}

      {error && <p className="score-error">{error}</p>}
      <button type="button" className="game-reset" onClick={start} disabled={loading}>
        새 게임
      </button>
      <ScorePanel
        key={round}
        gameId="twenty"
        score={remaining}
        active={result === 'won'}
        unit=" 질문 남김"
      />
    </div>
  )
}

export default TwentyQuestions
