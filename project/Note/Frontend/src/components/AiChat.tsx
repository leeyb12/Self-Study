import { useEffect, useRef, useState } from 'react'
import { api } from '../api/client'
import type { ChatMsg } from '../types'
import { renderMarkdown } from '../lib/markdown'

interface Props {
  onClose: () => void
}

const HISTORY_KEY = 'note.chatHistory'

function loadHistory(): ChatMsg[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as ChatMsg[]) : []
  } catch {
    return []
  }
}

export default function AiChat({ onClose }: Props) {
  const [messages, setMessages] = useState<ChatMsg[]>(loadHistory)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, loading])

  // 대화가 바뀔 때마다 브라우저에 저장한다.
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(messages))
  }, [messages])

  function clearHistory() {
    if (messages.length === 0) return
    if (window.confirm('채팅 기록을 모두 지울까요?')) {
      setMessages([])
      localStorage.removeItem(HISTORY_KEY)
    }
  }

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    const next: ChatMsg[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setError(null)
    setLoading(true)
    try {
      const res = await api.aiChat(next)
      setMessages([...next, { role: 'assistant', content: res.reply }])
    } catch (err) {
      setError(err instanceof Error ? err.message : '응답에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter 전송, Shift+Enter 줄바꿈
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
        <header className="chat-head">
          <span>🤖 AI에게 묻기</span>
          <div className="chat-head-actions">
            <button
              className="link-button"
              onClick={clearHistory}
              disabled={messages.length === 0}
            >
              🗑 기록 지우기
            </button>
            <button className="link-button" onClick={onClose}>
              ✕ 닫기
            </button>
          </div>
        </header>

        <div className="chat-body" ref={scrollRef}>
          {messages.length === 0 && !loading && (
            <p className="muted chat-empty">무엇이든 물어보세요. (Enter 전송, Shift+Enter 줄바꿈)</p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              {m.role === 'assistant' ? (
                <div
                  className="markdown-body"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
                />
              ) : (
                <span>{m.content}</span>
              )}
            </div>
          ))}
          {loading && <div className="chat-msg assistant muted">생각 중…</div>}
          {error && <p className="error">{error}</p>}
        </div>

        <div className="chat-input">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="질문을 입력하세요…"
            rows={2}
          />
          <button className="primary" onClick={send} disabled={loading || !input.trim()}>
            전송
          </button>
        </div>
      </div>
    </div>
  )
}
