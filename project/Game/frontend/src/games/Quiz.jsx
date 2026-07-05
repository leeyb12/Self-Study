import { useState } from 'react'
import ScorePanel from '../components/ScorePanel.jsx'

const QUESTIONS = [
  {
    q: '대한민국의 수도는?',
    options: ['부산', '서울', '인천', '대구'],
    answer: 1,
  },
  {
    q: '물의 화학식은?',
    options: ['CO2', 'O2', 'H2O', 'NaCl'],
    answer: 2,
  },
  {
    q: '1년은 몇 일인가? (평년)',
    options: ['360', '365', '366', '354'],
    answer: 1,
  },
  {
    q: '태양계에서 가장 큰 행성은?',
    options: ['지구', '토성', '목성', '화성'],
    answer: 2,
  },
  {
    q: 'HTML은 무엇의 약자인가?',
    options: [
      'Hyper Text Markup Language',
      'High Tech Modern Language',
      'Home Tool Markup Language',
      'Hyperlink Text Mode Language',
    ],
    answer: 0,
  },
]

function Quiz() {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState(null) // 선택한 옵션 인덱스
  const [done, setDone] = useState(false)
  const [round, setRound] = useState(0)

  const current = QUESTIONS[index]

  function handlePick(i) {
    if (picked !== null) return
    setPicked(i)
    if (i === current.answer) setScore((s) => s + 1)
  }

  function next() {
    if (index + 1 >= QUESTIONS.length) {
      setDone(true)
    } else {
      setIndex(index + 1)
      setPicked(null)
    }
  }

  function reset() {
    setIndex(0)
    setScore(0)
    setPicked(null)
    setDone(false)
    setRound((r) => r + 1)
  }

  if (done) {
    return (
      <div className="game">
        <p className="game-message">
          🎉 결과: {QUESTIONS.length}문제 중 {score}개 정답
        </p>
        <button type="button" className="game-reset" onClick={reset}>
          다시 풀기
        </button>
        <ScorePanel
          key={round}
          gameId="quiz"
          score={score}
          active
          unit={`/${QUESTIONS.length}`}
        />
      </div>
    )
  }

  return (
    <div className="game">
      <p className="game-info">
        {index + 1} / {QUESTIONS.length}
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

      {picked !== null && (
        <button type="button" className="game-reset" onClick={next}>
          {index + 1 >= QUESTIONS.length ? '결과 보기' : '다음 문제'}
        </button>
      )}
    </div>
  )
}

export default Quiz
