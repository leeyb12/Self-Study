import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../api/client'
import type { AiToolAction, Attachment, Folder, Note, NoteInput } from '../types'
import { renderMarkdown } from '../lib/markdown'
import PdfViewer from './PdfViewer'

interface Props {
  note: Note | null // null 이면 새 노트
  folders: Folder[]
  defaultFolderId: number | null
  onSave: (input: NoteInput) => Promise<Note>
  onDelete?: () => Promise<void>
  onCancel: () => void
}

interface ToolResult {
  label: string
  text: string
}

const TRANSLATE_LANGS = ['English', '한국어', '日本語', '中文']

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isPdf(a: Attachment): boolean {
  return (
    (a.contentType ?? '').toLowerCase().includes('pdf') ||
    a.originalName.toLowerCase().endsWith('.pdf')
  )
}

export default function NoteEditor({
  note,
  folders,
  defaultFolderId,
  onSave,
  onDelete,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(note?.title ?? '')
  const [content, setContent] = useState(note?.content ?? '')
  const [folderId, setFolderId] = useState<number | null>(
    note ? note.folderId : defaultFolderId,
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [viewerAtt, setViewerAtt] = useState<Attachment | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [running, setRunning] = useState<string | null>(null) // 실행 중인 도구 키
  const [toolResult, setToolResult] = useState<ToolResult | null>(null)
  const [translateLang, setTranslateLang] = useState(TRANSLATE_LANGS[0])

  const noteId = note?.id ?? null

  const loadAttachments = useCallback(async (id: number) => {
    try {
      setAttachments(await api.listAttachments(id))
    } catch {
      /* 무시 */
    }
  }, [])

  useEffect(() => {
    if (noteId) loadAttachments(noteId)
  }, [noteId, loadAttachments])

  function currentInput(): NoteInput {
    return { title: title.trim(), content, folderId }
  }

  async function ensureSaved(): Promise<Note> {
    return onSave(currentInput())
  }

  // ---------- 마크다운 툴바 ----------
  function applyWrap(before: string, after = before) {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = content.slice(start, end)
    const next = content.slice(0, start) + before + selected + after + content.slice(end)
    setContent(next)
    requestAnimationFrame(() => {
      ta.focus()
      ta.selectionStart = start + before.length
      ta.selectionEnd = end + before.length
    })
  }

  function applyLinePrefix(prefix: string) {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const lineStart = content.lastIndexOf('\n', start - 1) + 1
    const block = content.slice(lineStart, end)
    const replaced = block
      .split('\n')
      .map((l) => prefix + l)
      .join('\n')
    const next = content.slice(0, lineStart) + replaced + content.slice(end)
    setContent(next)
    requestAnimationFrame(() => ta.focus())
  }

  // ---------- 저장 / 삭제 ----------
  async function handleSave() {
    if (!title.trim()) {
      setError('제목을 입력하세요.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSave(currentInput())
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (onDelete && confirm('이 노트를 삭제할까요?')) {
      await onDelete()
    }
  }

  // ---------- 첨부 ----------
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!title.trim()) {
      setError('파일을 첨부하려면 먼저 제목을 입력하세요.')
      e.target.value = ''
      return
    }
    setError(null)
    try {
      const saved = await ensureSaved()
      await api.uploadAttachment(saved.id, file)
      await loadAttachments(saved.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드에 실패했습니다.')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleDeleteAttachment(id: number) {
    if (!confirm('첨부파일을 삭제할까요?')) return
    await api.deleteAttachment(id)
    if (noteId) await loadAttachments(noteId)
  }

  function openAttachment(a: Attachment) {
    if (isPdf(a)) setViewerAtt(a)
    else api.openAttachment(a.id)
  }

  // ---------- AI 도구 ----------
  async function runSummary() {
    if (!title.trim()) {
      setError('요약하려면 먼저 제목을 입력하세요.')
      return
    }
    setRunning('summary')
    setError(null)
    setToolResult(null)
    try {
      const saved = await ensureSaved()
      const result = await api.summarizeNote(saved.id)
      setToolResult({ label: `요약 (${result.model})`, text: result.summary })
    } catch (err) {
      setError(err instanceof Error ? err.message : '요약에 실패했습니다.')
    } finally {
      setRunning(null)
    }
  }

  async function runTool(action: AiToolAction, label: string, targetLang?: string) {
    if (!content.trim()) {
      setError('처리할 본문을 입력하세요.')
      return
    }
    setRunning(action)
    setError(null)
    setToolResult(null)
    try {
      const r = await api.aiTool(action, content, targetLang)
      setToolResult({ label: `${label} (${r.model})`, text: r.result })
    } catch (err) {
      setError(err instanceof Error ? err.message : '처리에 실패했습니다.')
    } finally {
      setRunning(null)
    }
  }

  function replaceWithResult() {
    if (!toolResult) return
    setContent(toolResult.text)
    setToolResult(null)
  }
  function appendResult() {
    if (!toolResult) return
    setContent((prev) => (prev ? `${prev}\n\n${toolResult.text}` : toolResult.text))
    setToolResult(null)
  }

  const busy = running !== null

  return (
    <div className="editor-screen">
      <header className="editor-bar">
        <button className="link-button" onClick={onCancel}>
          ← 목록
        </button>
        <div className="editor-bar-actions">
          <select
            className="folder-select"
            value={folderId ?? ''}
            onChange={(e) =>
              setFolderId(e.target.value === '' ? null : Number(e.target.value))
            }
          >
            <option value="">미분류</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          {onDelete && (
            <button className="danger" onClick={handleDelete}>
              삭제
            </button>
          )}
          <button className="primary" onClick={handleSave} disabled={saving}>
            {saving ? '저장 중…' : '저장'}
          </button>
        </div>
      </header>

      {error && <p className="error editor-error">{error}</p>}

      <div className="editor-body">
        <input
          className="editor-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          autoFocus
        />

        {/* 서식 툴바 */}
        <div className="md-toolbar">
          <div className="md-tools">
            <button title="굵게" onClick={() => applyWrap('**')}><b>B</b></button>
            <button title="기울임" onClick={() => applyWrap('*')}><i>I</i></button>
            <button title="제목" onClick={() => applyLinePrefix('## ')}>H</button>
            <button title="목록" onClick={() => applyLinePrefix('- ')}>•</button>
            <button title="체크박스" onClick={() => applyLinePrefix('- [ ] ')}>☑</button>
            <button title="인용" onClick={() => applyLinePrefix('> ')}>❝</button>
            <button title="코드" onClick={() => applyWrap('`')}>{'</>'}</button>
            <button title="링크" onClick={() => applyWrap('[', '](url)')}>🔗</button>
          </div>
          <span className="md-hint">입력 ↔ 실시간 미리보기</span>
        </div>

        {/* 분할 보기: 왼쪽 입력 / 오른쪽 실시간 미리보기 */}
        <div className="editor-split">
          <textarea
            ref={textareaRef}
            className="editor-content split-pane"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="마크다운으로 작성할 수 있어요…"
          />
          <div
            className="markdown-body split-pane preview-pane"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        </div>

        {/* ===== AI 도구 ===== */}
        <section className="ai-section">
          <div className="section-head">
            <h4>AI 도구 (로컬 Ollama)</h4>
          </div>
          <div className="ai-tools">
            <button className="primary" onClick={runSummary} disabled={busy}>
              {running === 'summary' ? '요약 중…' : '✨ 요약'}
            </button>
            <button onClick={() => runTool('polish', '다듬기')} disabled={busy}>
              {running === 'polish' ? '처리 중…' : '🪄 다듬기'}
            </button>
            <button onClick={() => runTool('continue', '이어쓰기')} disabled={busy}>
              {running === 'continue' ? '처리 중…' : '➕ 이어쓰기'}
            </button>
            <span className="ai-translate">
              <select
                value={translateLang}
                onChange={(e) => setTranslateLang(e.target.value)}
                disabled={busy}
              >
                {TRANSLATE_LANGS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <button
                onClick={() => runTool('translate', '번역', translateLang)}
                disabled={busy}
              >
                {running === 'translate' ? '번역 중…' : '🌐 번역'}
              </button>
            </span>
          </div>

          {busy && (
            <p className="muted">로컬 모델이 처리 중입니다. 잠시만 기다려 주세요…</p>
          )}

          {toolResult && (
            <div className="result-panel">
              <div className="result-label">{toolResult.label}</div>
              <div className="result-text">{toolResult.text}</div>
              <div className="result-foot">
                <button className="link-button" onClick={() => setToolResult(null)}>
                  닫기
                </button>
                <div>
                  <button onClick={appendResult}>본문에 추가</button>
                  <button className="primary" onClick={replaceWithResult}>
                    본문 교체
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ===== 첨부파일 ===== */}
        <section className="attach-section">
          <div className="section-head">
            <h4>첨부파일</h4>
            <label className="upload-btn">
              + 파일 추가
              <input ref={fileInputRef} type="file" onChange={handleUpload} hidden />
            </label>
          </div>
          {attachments.length === 0 ? (
            <p className="muted">첨부된 파일이 없습니다. (PDF·텍스트는 요약에 포함됩니다)</p>
          ) : (
            <ul className="attach-list">
              {attachments.map((a) => (
                <li key={a.id}>
                  <button className="attach-name" onClick={() => openAttachment(a)}>
                    {isPdf(a) ? '📄' : '📎'} {a.originalName}
                  </button>
                  <span className="attach-meta">
                    {a.textExtractable && <span className="badge">요약대상</span>}
                    {formatSize(a.sizeBytes)}
                    <button
                      className="icon-btn"
                      title="삭제"
                      onClick={() => handleDeleteAttachment(a.id)}
                    >
                      🗑
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {viewerAtt && (
        <PdfViewer
          attachmentId={viewerAtt.id}
          fileName={viewerAtt.originalName}
          onClose={() => setViewerAtt(null)}
        />
      )}
    </div>
  )
}
