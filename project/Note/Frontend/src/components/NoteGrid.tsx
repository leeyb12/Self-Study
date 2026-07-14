import { useRef, useState } from 'react'
import type { Note } from '../types'

interface Props {
  notes: Note[]
  loading: boolean
  error: string | null
  title: string
  onNew: () => void
  onOpen: (note: Note) => void
  onAskAi: () => void
  onUploadFiles: (files: FileList) => void
  onDeleteMany: (ids: number[]) => Promise<void>
}

export default function NoteGrid({
  notes,
  loading,
  error,
  title,
  onNew,
  onOpen,
  onAskAi,
  onUploadFiles,
  onDeleteMany,
}: Props) {
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState<Set<number>>(new Set())

  function handleUploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      onUploadFiles(e.target.files)
    }
    e.target.value = '' // 같은 파일 재선택 허용
  }

  function exitSelect() {
    setSelectMode(false)
    setSelected(new Set())
  }

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleCardClick(note: Note) {
    if (selectMode) toggleSelect(note.id)
    else onOpen(note)
  }

  async function handleDeleteSelected() {
    if (selected.size === 0) return
    const ok = window.confirm(`선택한 노트 ${selected.size}개를 삭제할까요? 되돌릴 수 없습니다.`)
    if (!ok) return
    await onDeleteMany([...selected])
    window.alert(`${selected.size}개의 노트를 삭제했습니다.`)
    exitSelect()
  }

  return (
    <div className="grid-container">
      <header className="grid-header">
        <h2>{title}</h2>
        <div className="grid-header-actions">
          {selectMode ? (
            <>
              <button
                className="danger-solid"
                onClick={handleDeleteSelected}
                disabled={selected.size === 0}
              >
                🗑 삭제 ({selected.size})
              </button>
              <button onClick={exitSelect}>취소</button>
            </>
          ) : (
            <>
              <button className="primary" onClick={onNew}>
                + 새 노트
              </button>
              <button className="success" onClick={() => uploadInputRef.current?.click()}>
                📎 업로드
              </button>
              <button onClick={onAskAi}>🤖 AI에게 묻기</button>
              <button
                className="warning"
                onClick={() => setSelectMode(true)}
                disabled={notes.length === 0}
              >
                ☑ 선택
              </button>
            </>
          )}
          <input
            ref={uploadInputRef}
            type="file"
            multiple
            hidden
            onChange={handleUploadChange}
          />
        </div>
      </header>

      {loading && <p className="muted">불러오는 중…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && notes.length === 0 && (
        <div className="empty-state">
          <p>노트가 없습니다. 새 노트를 작성해 보세요.</p>
        </div>
      )}

      <div className="note-grid">
        {notes.map((note) => {
          const isSelected = selected.has(note.id)
          return (
            <button
              key={note.id}
              className={`book-card cover-${note.cover} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleCardClick(note)}
            >
              {selectMode && (
                <span className={`card-check ${isSelected ? 'checked' : ''}`}>
                  {isSelected ? '✓' : ''}
                </span>
              )}
              <span className="book-spine" />
              <h3 className="book-title">{note.title || '제목 없음'}</h3>
            </button>
          )
        })}
      </div>
    </div>
  )
}
