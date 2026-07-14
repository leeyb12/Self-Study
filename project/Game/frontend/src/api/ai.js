// 로컬 LLM(Ollama) 프록시 API 클라이언트. 백엔드 /api/ai/* 를 호출한다.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  })
  if (!res.ok) {
    let msg = `요청 실패 (${res.status})`
    try {
      const data = await res.json()
      if (data.message) msg = data.message
    } catch {
      /* 본문 없음 */
    }
    throw new Error(msg)
  }
  return res.json()
}

// 스트리밍(평문): onText(누적문자열)을 토큰마다 호출, 최종 전체 문자열 반환
async function stream(path, body, onText) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  })
  if (!res.ok || !res.body) throw new Error(`요청 실패 (${res.status})`)
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let full = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    full += decoder.decode(value, { stream: true })
    onText(full)
  }
  return full
}

export const streamStory = (context, action, onText) =>
  stream('/api/ai/story-stream', { context, action }, onText)
export const streamEscape = (context, action, onText) =>
  stream('/api/ai/escape-stream', { context, action }, onText)

// { narration, choices: string[], ending: boolean } (비스트리밍, 예비용)
export const generateStory = (context, action) => post('/api/ai/story', { context, action })

// { questions: [{ q, options[4], answer }] }
export const generateQuiz = (difficulty, count = 5, topic = '') =>
  post('/api/ai/quiz', { difficulty, count, topic })

// { sentence }
export const generateTyping = (difficulty) => post('/api/ai/typing', { difficulty })

// 끝말잇기: { word } ('' 이면 AI가 포기)
export const wordChain = (last, used) => post('/api/ai/wordchain', { last, used })

// 단어 맞히기: { word, hints: string[] }
export const wordGuess = (category = '') => post('/api/ai/wordguess', { category })

// 스무고개
export const twentyStart = () => post('/api/ai/twenty/start')
export const twentyAsk = (secret, question) => post('/api/ai/twenty/ask', { secret, question })

// 방탈출: { narration, choices, escaped }
export const escapeStep = (context, action) => post('/api/ai/escape', { context, action })

// 추리: start { story, suspects, culprit } / ask { answer }
export const mysteryStart = () => post('/api/ai/mystery/start')
export const mysteryAsk = (story, culprit, question) =>
  post('/api/ai/mystery/ask', { story, culprit, question })
