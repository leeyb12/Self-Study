// 점수/랭킹 백엔드 API 클라이언트.
// 백엔드 주소는 VITE_API_URL 환경변수로 바꿀 수 있고, 기본은 로컬 Spring Boot(8080).
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export async function submitScore({ gameId, playerName, score }) {
  const res = await fetch(`${BASE}/api/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId, playerName, score }),
  })
  if (!res.ok) throw new Error(`점수 등록 실패 (${res.status})`)
  return res.json()
}

export async function fetchTopScores({ gameId, limit = 10, order = 'desc' }) {
  const params = new URLSearchParams({ gameId, limit: String(limit), order })
  const res = await fetch(`${BASE}/api/scores?${params}`)
  if (!res.ok) throw new Error(`랭킹 조회 실패 (${res.status})`)
  return res.json()
}
