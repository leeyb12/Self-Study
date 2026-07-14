import { useState } from 'react'
import { wordChain } from '../api/ai.js'
import ScorePanel from '../components/ScorePanel.jsx'

function lastChar(w) {
  return w.charAt(w.length - 1)
}

function WordChain() {
  const [used, setUsed] = useState([]) // { word, by: 'me' | 'ai' }
  const [required, setRequired] = useState('') // 다음 단어가 시작해야 할 글자
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [over, setOver] = useState(null) // 승패 메시지
  const [round, setRound] = useState(0)

  const usedWords = used.map((u) => u.word)
  const myWordCount = used.filter((u) => u.by === 'me').length

  async function submit(e) {
    e.preventDefault()
    const word = input.trim()
    if (!word || loading || over) return
    setError(null)

    if (word.length < 2) return setError('두 글자 이상 입력하세요.')
    if (required && word[0] !== required) return setError(`'${required}'(으)로 시작해야 합니다.`)
    if (usedWords.includes(word)) return setError('이미 사용한 단어입니다.')

    const mine = { word, by: 'me' }
    const nextUsed = [...used, mine]
    setUsed(nextUsed)
    setInput('')

    const need = lastChar(word)
    setLoading(true)
    try {
      const res = await wordChain(need, nextUsed.map((u) => u.word))
      const aiWord = (res.word || '').trim()
      // AI가 포기했거나 규칙 위반이면 플레이어 승리
      if (!aiWord || aiWord[0] !== need || nextUsed.some((u) => u.word === aiWord)) {
        setOver('🎉 AI가 더 잇지 못했어요. 승리!')
        return
      }
      setUsed([...nextUsed, { word: aiWord, by: 'ai' }])
      setRequired(lastChar(aiWord))
    } catch (err) {
      setError(err.message)
      // 요청 실패 시 방금 낸 단어를 되돌린다
      setUsed(used)
      setInput(word)
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setUsed([])
    setRequired('')
    setInput('')
    setError(null)
    setOver(null)
    setRound((r) => r + 1)
  }

  return (
    <div className="game">
      <p className="game-message">
        {over || (required ? `'${required}'(으)로 시작하는 단어!` : '아무 단어나 먼저 입력하세요')}
      </p>

      <div className="ai-log">
        {used.map((u, i) => (
          <span key={i} className={`chain-word ${u.by}`}>
            {u.word}
          </span>
        ))}
      </div>

      {!over && (
        <form className="game-controls" onSubmit={submit}>
          <input
            type="text"
            value={input}
            placeholder={required ? `${required}…` : '단어 입력'}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading || input.trim() === ''}>
            {loading ? '…' : '제출'}
          </button>
        </form>
      )}

      {error && <p className="score-error">{error}</p>}
      <p className="game-info">두음법칙은 적용하지 않습니다 (끝 글자 그대로).</p>
      <button type="button" className="game-reset" onClick={reset}>
        새 게임
      </button>
      <ScorePanel
        key={round}
        gameId="word-chain"
        score={myWordCount}
        active={!!over}
        unit="단어"
      />
    </div>
  )
}

export default WordChain
