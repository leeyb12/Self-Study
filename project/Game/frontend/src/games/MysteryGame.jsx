import { useState } from 'react'
import { mysteryStart, mysteryAsk } from '../api/ai.js'
import MatchRecord from '../components/MatchRecord.jsx'
import { loadRecord, saveRecord } from '../utils/matchStore.js'

function MysteryGame() {
  const [game, setGame] = useState(null) // { story, suspects, culprit(숨김) }
  const [log, setLog] = useState([]) // { q, a }
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null) // { correct, culprit }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [record, setRecord] = useState(() => loadRecord('mystery'))

  async function start() {
    setLoading(true)
    setError(null)
    try {
      const res = await mysteryStart()
      if (!res.story || !Array.isArray(res.suspects) || res.suspects.length === 0 || !res.culprit) {
        throw new Error('사건을 생성하지 못했습니다')
      }
      setGame({ story: res.story, suspects: res.suspects, culprit: res.culprit })
      setLog([])
      setInput('')
      setResult(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function investigate(e) {
    e.preventDefault()
    const q = input.trim()
    if (!q || loading || result) return
    setLoading(true)
    setError(null)
    setInput('')
    try {
      const res = await mysteryAsk(game.story, game.culprit, q)
      setLog((l) => [...l, { q, a: res.answer || '…' }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function accuse(name) {
    if (result) return
    const correct = name === game.culprit
    setResult({ correct, culprit: game.culprit })
    setRecord((prev) => {
      const next = { ...prev, [correct ? 'win' : 'lose']: prev[correct ? 'win' : 'lose'] + 1 }
      saveRecord('mystery', next)
      return next
    })
  }

  if (!game) {
    return (
      <div className="game">
        <p className="game-message">🕵️ AI 추리 게임</p>
        <p className="game-info">AI가 낸 사건을 조사해 진범을 지목하세요.</p>
        {error && <p className="score-error">{error}</p>}
        <button type="button" className="game-reset" onClick={start} disabled={loading}>
          {loading ? '사건 생성 중…' : '사건 시작'}
        </button>
      </div>
    )
  }

  return (
    <div className="game">
      <p className="adv-text">{game.story}</p>

      {result ? (
        <p className="game-message">
          {result.correct ? '🎉 정답! 진범을 찾았습니다.' : `틀렸어요. 진범은 '${result.culprit}'`}
        </p>
      ) : (
        <p className="game-info">조사한 뒤 아래에서 진범을 지목하세요.</p>
      )}

      <div className="ai-log">
        {log.map((e, i) => (
          <p key={i} className="qa-line">
            <b>🔎</b> {e.q} <b>→</b> {e.a}
          </p>
        ))}
      </div>

      {!result && (
        <>
          <form className="game-controls" onSubmit={investigate}>
            <input
              type="text"
              value={input}
              placeholder="조사/질문 (예: 알리바이를 물어본다)"
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || input.trim() === ''}>
              {loading ? '…' : '조사'}
            </button>
          </form>

          <div className="adv-choices">
            {game.suspects.map((name) => (
              <button
                key={name}
                type="button"
                className="adv-choice"
                onClick={() => accuse(name)}
              >
                🔪 {name} 지목
              </button>
            ))}
          </div>
        </>
      )}

      {error && <p className="score-error">{error}</p>}
      <MatchRecord record={record} />
      <button type="button" className="game-reset" onClick={start} disabled={loading}>
        새 사건
      </button>
    </div>
  )
}

export default MysteryGame
