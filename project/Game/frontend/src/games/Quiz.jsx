import { useState } from 'react'
import ScorePanel from '../components/ScorePanel.jsx'
import Difficulty from '../components/Difficulty.jsx'
import { generateQuiz } from '../api/ai.js'

const QUESTION_SETS = {
  easy: [
    { q: '대한민국의 수도는?', options: ['부산', '서울', '인천', '대구'], answer: 1 },
    { q: '물의 화학식은?', options: ['CO2', 'O2', 'H2O', 'NaCl'], answer: 2 },
    { q: '1년은 몇 일인가? (평년)', options: ['360', '365', '366', '354'], answer: 1 },
    { q: '태양계에서 가장 큰 행성은?', options: ['지구', '토성', '목성', '화성'], answer: 2 },
    { q: '무지개는 몇 가지 색인가?', options: ['5', '6', '7', '8'], answer: 2 },
  ],
  normal: [
    { q: 'HTML은 무엇의 약자인가?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink Text Mode Language'], answer: 0 },
    { q: '빛의 속도는 약 몇 km/s인가?', options: ['3천', '3만', '30만', '300만'], answer: 2 },
    { q: '피보나치 수열에서 8 다음 수는?', options: ['11', '12', '13', '15'], answer: 2 },
    { q: '대한민국의 광복절은?', options: ['3월 1일', '6월 6일', '8월 15일', '10월 3일'], answer: 2 },
    { q: 'JavaScript에서 배열 길이 속성은?', options: ['size', 'count', 'length', 'len'], answer: 2 },
  ],
  hard: [
    { q: '이진수 1011은 십진수로?', options: ['9', '11', '13', '15'], answer: 1 },
    { q: '지구에서 가장 깊은 해구는?', options: ['일본 해구', '마리아나 해구', '푸에르토리코 해구', '통가 해구'], answer: 1 },
    { q: 'HTTP 상태 코드 404의 의미는?', options: ['서버 오류', '권한 없음', '찾을 수 없음', '요청 시간 초과'], answer: 2 },
    { q: '원주율 π의 소수점 둘째 자리까지는?', options: ['3.12', '3.14', '3.16', '3.18'], answer: 1 },
    { q: '노벨상에 없는 분야는?', options: ['문학', '평화', '수학', '화학'], answer: 2 },
  ],
}
const DIFFICULTIES = [
  { label: '쉬움', value: 'easy' },
  { label: '보통', value: 'normal' },
  { label: '어려움', value: 'hard' },
  { label: '🤖 AI', value: 'ai' },
]

function validQuestion(q) {
  return (
    q && typeof q.q === 'string' && Array.isArray(q.options) &&
    q.options.length === 4 && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4
  )
}

function Quiz() {
  const [difficulty, setDifficulty] = useState('easy')
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState(null)
  const [done, setDone] = useState(false)
  const [round, setRound] = useState(0)
  const [aiQuestions, setAiQuestions] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(null)

  const questions = difficulty === 'ai' ? aiQuestions : QUESTION_SETS[difficulty]

  function resetProgress() {
    setIndex(0)
    setScore(0)
    setPicked(null)
    setDone(false)
    setRound((r) => r + 1)
  }

  async function loadAi() {
    setAiLoading(true)
    setAiError(null)
    try {
      const res = await generateQuiz('보통', 5)
      const qs = (res.questions || []).filter(validQuestion)
      if (qs.length === 0) throw new Error('생성된 문제가 없습니다')
      setAiQuestions(qs)
      resetProgress()
    } catch (e) {
      setAiError(e.message)
    } finally {
      setAiLoading(false)
    }
  }

  function changeDifficulty(v) {
    if (v === difficulty && v !== 'ai') return
    setDifficulty(v)
    if (v === 'ai') loadAi()
    else resetProgress()
  }

  function handlePick(i) {
    if (picked !== null) return
    setPicked(i)
    if (i === questions[index].answer) setScore((s) => s + 1)
  }

  function next() {
    if (index + 1 >= questions.length) setDone(true)
    else {
      setIndex(index + 1)
      setPicked(null)
    }
  }

  // AI 모드 로딩/에러/미로딩 처리
  if (difficulty === 'ai' && (aiLoading || aiError || !aiQuestions)) {
    return (
      <div className="game">
        {aiLoading ? (
          <p className="game-message">🤖 AI가 문제를 만드는 중…</p>
        ) : (
          <>
            <p className="score-error">{aiError || '문제를 불러오지 못했습니다'}</p>
            <p className="game-info">Ollama 실행/모델 준비 여부를 확인하세요.</p>
            <div className="game-controls">
              <button type="button" onClick={loadAi}>다시 시도</button>
              <button type="button" onClick={() => changeDifficulty('easy')}>기본 문제로</button>
            </div>
          </>
        )}
        <Difficulty value={difficulty} onChange={changeDifficulty} options={DIFFICULTIES} />
      </div>
    )
  }

  if (done) {
    return (
      <div className="game">
        <p className="game-message">
          🎉 결과: {questions.length}문제 중 {score}개 정답
        </p>
        <Difficulty value={difficulty} onChange={changeDifficulty} options={DIFFICULTIES} />
        <div className="game-controls">
          {difficulty === 'ai' && (
            <button type="button" onClick={loadAi}>새 AI 문제</button>
          )}
          <button type="button" className="game-reset" onClick={resetProgress}>
            다시 풀기
          </button>
        </div>
        <ScorePanel
          key={round}
          gameId={`quiz-${difficulty}`}
          score={score}
          active
          unit={`/${questions.length}`}
        />
      </div>
    )
  }

  const current = questions[index]

  return (
    <div className="game">
      <p className="game-info">
        {index + 1} / {questions.length}
      </p>
      <p className="game-message">{current.q}</p>

      <div className="quiz-options">
        {current.options.map((opt, i) => {
          let cls = ''
          if (picked !== null) {
            if (i === current.answer) cls = 'correct'
            else if (i === picked) cls = 'wrong'
          }
          return (
            <button
              key={i}
              type="button"
              className={`quiz-option ${cls}`}
              onClick={() => handlePick(i)}
              disabled={picked !== null}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {picked !== null ? (
        <button type="button" className="game-reset" onClick={next}>
          {index + 1 >= questions.length ? '결과 보기' : '다음 문제'}
        </button>
      ) : (
        <Difficulty value={difficulty} onChange={changeDifficulty} options={DIFFICULTIES} />
      )}
    </div>
  )
}

export default Quiz
