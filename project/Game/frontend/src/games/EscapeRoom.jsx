import { useState } from 'react'
import { streamEscape } from '../api/ai.js'
import { parseNarrative } from '../utils/narrative.js'

const MAX_CONTEXT = 2000

function EscapeRoom() {
  const [display, setDisplay] = useState('')
  const [node, setNode] = useState(null) // { choices, ended(=escaped) }
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [input, setInput] = useState('')
  const [started, setStarted] = useState(false)

  async function act(action, prevContext) {
    setLoading(true)
    setError(null)
    setInput('')
    setNode(null)
    setDisplay('')
    try {
      const full = await streamEscape(prevContext, action, (text) =>
        setDisplay(parseNarrative(text).narration),
      )
      const parsed = parseNarrative(full)
      setDisplay(parsed.narration)
      setNode({ choices: parsed.choices, ended: parsed.ended })
      setContext(`${prevContext}\n> ${action}\n${parsed.narration}`.slice(-MAX_CONTEXT))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function start() {
    setStarted(true)
    setContext('')
    act('시작', '')
  }

  function submitFree(e) {
    e.preventDefault()
    const text = input.trim()
    if (text && !loading) act(text, context)
  }

  if (!started) {
    return (
      <div className="game">
        <p className="game-message">🔒 AI 방탈출</p>
        <p className="game-info">단서를 찾아 잠긴 방을 탈출하세요. 직접 행동을 입력할 수 있습니다.</p>
        <button type="button" className="game-reset" onClick={start}>입장</button>
      </div>
    )
  }

  return (
    <div className="game">
      <p className="adv-text">
        {display}
        {loading && <span className="stream-caret">▌</span>}
      </p>

      {error ? (
        <>
          <p className="score-error">{error}</p>
          <button type="button" className="game-reset" onClick={start}>다시 시작</button>
        </>
      ) : (
        !loading &&
        node && (
          node.ended ? (
            <>
              <p className="game-message">🎉 탈출 성공!</p>
              <button type="button" className="game-reset" onClick={start}>새 방</button>
            </>
          ) : (
            <>
              <div className="adv-choices">
                {node.choices.map((choice, i) => (
                  <button
                    key={i}
                    type="button"
                    className="adv-choice"
                    onClick={() => act(choice, context)}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              <form className="game-controls" onSubmit={submitFree}>
                <input
                  type="text"
                  value={input}
                  placeholder="직접 행동 입력… (예: 서랍을 연다)"
                  onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" disabled={input.trim() === ''}>행동</button>
              </form>
            </>
          )
        )
      )}
    </div>
  )
}

export default EscapeRoom
