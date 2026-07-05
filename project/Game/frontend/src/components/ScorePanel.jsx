import { useState, useEffect } from 'react'
import { submitScore, fetchTopScores } from '../api/scores.js'

// 재사용 랭킹 패널.
// props:
//  - gameId: 게임 식별자
//  - score: 이번 판 점수
//  - active: 점수 등록이 가능한 시점(보통 게임 오버)
//  - order: 'desc'(높을수록 좋음, 기본) | 'asc'(낮을수록 좋음)
//  - unit: 점수 단위 표시(선택)
// 새 판이 시작되면 부모에서 key를 바꿔 이 컴포넌트를 리마운트하면 상태가 초기화된다.
function ScorePanel({ gameId, score, active, order = 'desc', unit = '' }) {
  const [scores, setScores] = useState([])
  const [name, setName] = useState(() => localStorage.getItem('playerName') || '')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // 마운트 시 랭킹 조회
  useEffect(() => {
    let cancelled = false
    fetchTopScores({ gameId, order })
      .then((list) => { if (!cancelled) setScores(list) })
      .catch((e) => { if (!cancelled) setError(e.message) })
    return () => { cancelled = true }
  }, [gameId, order])

  async function handleSubmit() {
    const trimmed = name.trim() || '익명'
    localStorage.setItem('playerName', trimmed)
    setSubmitting(true)
    setError(null)
    try {
      await submitScore({ gameId, playerName: trimmed, score })
      setSubmitted(true)
      const list = await fetchTopScores({ gameId, order })
      setScores(list)
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = active && !submitted && score > 0

  return (
    <div className="score-panel">
      <h3 className="score-title">🏆 랭킹</h3>

      {canSubmit && (
        <div className="score-submit">
          <input
            type="text"
            value={name}
            maxLength={20}
            placeholder="이름"
            onChange={(e) => setName(e.target.value)}
          />
          <button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? '등록 중…' : `점수 등록 (${score}${unit})`}
          </button>
        </div>
      )}
      {submitted && <p className="score-msg">등록 완료!</p>}

      {error ? (
        <p className="score-error">랭킹 서버에 연결할 수 없습니다</p>
      ) : scores.length === 0 ? (
        <p className="score-msg">아직 기록이 없습니다</p>
      ) : (
        <ol className="score-list">
          {scores.map((s) => (
            <li key={s.id}>
              <span className="score-rank">{s.rank}</span>
              <span className="score-name">{s.playerName}</span>
              <span className="score-value">{s.score}{unit}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default ScorePanel
