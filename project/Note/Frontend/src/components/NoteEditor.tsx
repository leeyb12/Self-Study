import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../api/client'
import type {
  AiToolAction,
  Attachment,
  Cover,
  Folder,
  Note,
  NoteInput,
  Page,
  Paper,
} from '../types'
import { COVERS, PAPERS } from '../types'
import { imageMarkdown, renderMarkdown } from '../lib/markdown'
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
// 아직 저장되지 않은 새 노트의 임시 페이지 id
const DRAFT_PAGE_ID = -1

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
  const [folderId, setFolderId] = useState<number | null>(
    note ? note.folderId : defaultFolderId,
  )
  const [cover, setCover] = useState<Cover>(note?.cover ?? 'classic')
  const [paper, setPaper] = useState<Paper>(note?.paper ?? 'plain')

  const [pages, setPages] = useState<Page[]>([
    { id: DRAFT_PAGE_ID, pageNo: 1, content: '' },
  ])
  const [index, setIndex] = useState(0)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [viewerAtt, setViewerAtt] = useState<Attachment | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [running, setRunning] = useState<string | null>(null)
  const [toolResult, setToolResult] = useState<ToolResult | null>(null)
  const [translateLang, setTranslateLang] = useState(TRANSLATE_LANGS[0])

  const noteId = note?.id ?? null
  const current = pages[index] ?? pages[0]

  const loadAttachments = useCallback(async (id: number) => {
    try {
      setAttachments(await api.listAttachments(id))
    } catch {
      /* 무시 */
    }
  }, [])

  const loadPages = useCallback(async (id: number) => {
    try {
      const list = await api.listPages(id)
      if (list.length > 0) setPages(list)
    } catch {
      /* 무시 */
    }
  }, [])

  useEffect(() => {
    if (noteId) {
      loadPages(noteId)
      loadAttachments(noteId)
    }
  }, [noteId, loadPages, loadAttachments])

  function setCurrentContent(content: string) {
    setPages((prev) => prev.map((p, i) => (i === index ? { ...p, content } : p)))
  }

  function meta(): NoteInput {
    return { title: title.trim(), folderId, cover, paper }
  }

  /** 노트 메타 + 모든 페이지 내용을 저장하고, 저장된 노트를 반환한다. */
  const saveAll = useCallback(
    async (): Promise<Note> => {
      const saved = await onSave(meta())

      // 새 노트였다면 백엔드가 만든 실제 페이지 id 를 받아와 로컬 내용과 합친다.
      let target = pages
      if (pages.some((p) => p.id === DRAFT_PAGE_ID)) {
        const real = await api.listPages(saved.id)
        target = real.map((p, i) => ({ ...p, content: pages[i]?.content ?? p.content }))
      }

      const updated = await Promise.all(
        target.map((p) => api.updatePage(p.id, p.content)),
      )
      setPages(updated)
      return saved
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pages, title, folderId, cover, paper, onSave],
  )

  // ---------- 마크다운 툴바 ----------
  function applyWrap(before: string, after = before) {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const text = current.content
    const selected = text.slice(start, end)
    setCurrentContent(text.slice(0, start) + before + selected + after + text.slice(end))
    requestAnimationFrame(() => {
      ta.focus()
      ta.selectionStart = start + before.length
      ta.selectionEnd = end + before.length
    })
  }

  /** 커서 위치에 텍스트를 끼워 넣는다. */
  function insertAtCursor(text: string) {
    const ta = textareaRef.current
    const content = current.content
    if (!ta) {
      setCurrentContent(content + text)
      return
    }
    const start = ta.selectionStart
    const end = ta.selectionEnd
    setCurrentContent(content.slice(0, start) + text + content.slice(end))
    requestAnimationFrame(() => {
      ta.focus()
      const caret = start + text.length
      ta.selectionStart = caret
      ta.selectionEnd = caret
    })
  }

  /** 이미지를 첨부로 업로드하고 현재 페이지에 마크다운으로 삽입한다. */
  async function handleInsertImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!title.trim()) {
      setError('이미지를 넣으려면 먼저 제목을 입력하세요.')
      e.target.value = ''
      return
    }
    setError(null)
    try {
      const saved = await saveAll() // 새 노트면 먼저 저장 (첨부에 noteId 필요)
      const att = await api.uploadAttachment(saved.id, file)
      insertAtCursor(`\n${imageMarkdown(att.id, att.originalName)}\n`)
      await loadAttachments(saved.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 삽입에 실패했습니다.')
    } finally {
      if (imageInputRef.current) imageInputRef.current.value = ''
    }
  }

  /** 선택 영역이 걸친 줄들을 통째로 변환한다. */
  function transformLines(fn: (lines: string[]) => string[]) {
    const ta = textareaRef.current
    if (!ta) return
    const text = current.content
    const lineStart = text.lastIndexOf('\n', ta.selectionStart - 1) + 1
    let lineEnd = text.indexOf('\n', ta.selectionEnd)
    if (lineEnd === -1) lineEnd = text.length

    const replaced = fn(text.slice(lineStart, lineEnd).split('\n')).join('\n')
    setCurrentContent(text.slice(0, lineStart) + replaced + text.slice(lineEnd))
    requestAnimationFrame(() => {
      ta.focus()
      ta.selectionStart = lineStart
      ta.selectionEnd = lineStart + replaced.length
    })
  }

  const indentOf = (line: string) => line.match(/^\s*/)?.[0] ?? ''

  /** 이미 모든 줄에 접두사가 있으면 제거하고, 아니면 붙인다. */
  function toggleLinePrefix(prefix: string) {
    transformLines((lines) => {
      const applied = lines.every((l) => l.trimStart().startsWith(prefix))
      return lines.map((l) => {
        const indent = indentOf(l)
        const body = l.slice(indent.length)
        return applied ? indent + body.slice(prefix.length) : indent + prefix + body
      })
    })
  }

  const ORDERED = /^(\s*)\d+\.\s+/

  /** 번호 목록 토글. 붙일 때는 1부터 다시 번호를 매긴다. */
  function toggleOrderedList() {
    transformLines((lines) => {
      const applied = lines.every((l) => ORDERED.test(l))
      if (applied) return lines.map((l) => l.replace(ORDERED, '$1'))
      return lines.map((l, i) => {
        const indent = indentOf(l)
        return `${indent}${i + 1}. ${l.slice(indent.length)}`
      })
    })
  }

  function indentLines() {
    transformLines((lines) => lines.map((l) => '  ' + l))
  }

  function outdentLines() {
    transformLines((lines) =>
      lines.map((l) => (l.startsWith('  ') ? l.slice(2) : l.replace(/^\s+/, ''))),
    )
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
      await saveAll()
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (onDelete && confirm('이 노트를 휴지통으로 옮길까요?')) {
      await onDelete()
    }
  }

  // ---------- 페이지 ----------
  async function handleAddPage() {
    if (!title.trim()) {
      setError('페이지를 추가하려면 먼저 제목을 입력하세요.')
      return
    }
    setError(null)
    try {
      const saved = await saveAll()
      const added = await api.addPage(saved.id)
      setPages((prev) => [...prev, added])
      setIndex(pages.length)
    } catch (err) {
      setError(err instanceof Error ? err.message : '페이지 추가에 실패했습니다.')
    }
  }

  async function handleDeletePage() {
    if (pages.length <= 1) {
      setError('마지막 페이지는 삭제할 수 없습니다.')
      return
    }
    if (!confirm(`${current.pageNo}페이지를 삭제할까요?`)) return
    setError(null)
    try {
      await api.deletePage(current.id)
      const reloaded = await api.listPages(noteId!)
      setPages(reloaded)
      setIndex(Math.min(index, reloaded.length - 1))
    } catch (err) {
      setError(err instanceof Error ? err.message : '페이지 삭제에 실패했습니다.')
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
      const saved = await saveAll()
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

  // ---------- AI ----------
  async function runSummary() {
    if (!title.trim()) {
      setError('요약하려면 먼저 제목을 입력하세요.')
      return
    }
    setRunning('summary')
    setError(null)
    setToolResult(null)
    try {
      const saved = await saveAll()
      const result = await api.summarizeNote(saved.id)
      setToolResult({ label: `요약 (${result.model})`, text: result.summary })
    } catch (err) {
      setError(err instanceof Error ? err.message : '요약에 실패했습니다.')
    } finally {
      setRunning(null)
    }
  }

  async function runTool(action: AiToolAction, label: string, targetLang?: string) {
    if (!current.content.trim()) {
      setError('처리할 페이지 내용을 입력하세요.')
      return
    }
    setRunning(action)
    setError(null)
    setToolResult(null)
    try {
      const r = await api.aiTool(action, current.content, targetLang)
      setToolResult({ label: `${label} (${r.model})`, text: r.result })
    } catch (err) {
      setError(err instanceof Error ? err.message : '처리에 실패했습니다.')
    } finally {
      setRunning(null)
    }
  }

  function replaceWithResult() {
    if (!toolResult) return
    setCurrentContent(toolResult.text)
    setToolResult(null)
  }
  function appendResult() {
    if (!toolResult) return
    setCurrentContent(
      current.content ? `${current.content}\n\n${toolResult.text}` : toolResult.text,
    )
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

          <select
            className="folder-select"
            value={cover}
            onChange={(e) => setCover(e.target.value as Cover)}
            title="책 표지"
          >
            {COVERS.map((c) => (
              <option key={c.key} value={c.key}>
                📕 {c.label}
              </option>
            ))}
          </select>

          <select
            className="folder-select"
            value={paper}
            onChange={(e) => setPaper(e.target.value as Paper)}
            title="종이 스타일"
          >
            {PAPERS.map((p) => (
              <option key={p.key} value={p.key}>
                📄 {p.label}
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

        {/* 페이지 네비게이션 */}
        <div className="page-bar">
          <div className="page-nav">
            <button onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
              ◀
            </button>
            <span className="page-indicator">
              {current.pageNo} / {pages.length}
            </span>
            <button
              onClick={() => setIndex((i) => Math.min(pages.length - 1, i + 1))}
              disabled={index >= pages.length - 1}
            >
              ▶
            </button>
          </div>
          <div className="page-actions">
            <button onClick={handleAddPage}>+ 페이지 추가</button>
            <button className="danger" onClick={handleDeletePage} disabled={pages.length <= 1}>
              페이지 삭제
            </button>
          </div>
        </div>

        {/* 서식 툴바 */}
        <div className="md-toolbar">
          <div className="md-tools">
            <button title="굵게" onClick={() => applyWrap('**')}><b>B</b></button>
            <button title="기울임" onClick={() => applyWrap('*')}><i>I</i></button>
            <button title="제목" onClick={() => toggleLinePrefix('## ')}>H</button>

            <span className="md-divider" />
            <button title="글머리 목록" onClick={() => toggleLinePrefix('- ')}>•</button>
            <button title="번호 목록" onClick={toggleOrderedList}>1.</button>
            <button title="체크박스" onClick={() => toggleLinePrefix('- [ ] ')}>☐</button>
            <button title="완료된 체크박스" onClick={() => toggleLinePrefix('- [x] ')}>☑</button>
            <button title="들여쓰기" onClick={indentLines}>⇥</button>
            <button title="내어쓰기" onClick={outdentLines}>⇤</button>
            <span className="md-divider" />

            <button title="인용" onClick={() => toggleLinePrefix('> ')}>❝</button>
            <button title="코드" onClick={() => applyWrap('`')}>{'</>'}</button>
            <button title="링크" onClick={() => applyWrap('[', '](url)')}>🔗</button>
            <button title="이미지 삽입" onClick={() => imageInputRef.current?.click()}>
              🖼
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleInsertImage}
            />
          </div>
          <span className="md-hint">입력 ↔ 실시간 미리보기</span>
        </div>

        {/* 분할 보기 */}
        <div className="editor-split">
          <textarea
            ref={textareaRef}
            className={`editor-content split-pane paper-${paper}`}
            value={current.content}
            onChange={(e) => setCurrentContent(e.target.value)}
            placeholder="마크다운으로 작성할 수 있어요…"
          />
          <div
            className={`markdown-body split-pane preview-pane paper-${paper}`}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(current.content) }}
          />
        </div>

        {/* AI 도구 */}
        <section className="ai-section">
          <div className="section-head">
            <h4>AI 도구 (로컬 Ollama)</h4>
          </div>
          <div className="ai-tools">
            <button className="primary" onClick={runSummary} disabled={busy}>
              {running === 'summary' ? '요약 중…' : '✨ 요약 (노트 전체)'}
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

          {busy && <p className="muted">로컬 모델이 처리 중입니다. 잠시만 기다려 주세요…</p>}

          {toolResult && (
            <div className="result-panel">
              <div className="result-label">{toolResult.label}</div>
              <div className="result-text">{toolResult.text}</div>
              <div className="result-foot">
                <button className="link-button" onClick={() => setToolResult(null)}>
                  닫기
                </button>
                <div>
                  <button onClick={appendResult}>현재 페이지에 추가</button>
                  <button className="primary" onClick={replaceWithResult}>
                    현재 페이지 교체
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 첨부파일 */}
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
