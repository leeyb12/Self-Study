import type { Note } from '../types'

interface Props {
  notes: Note[]
  loading: boolean
  error: string | null
  onRestore: (id: number) => Promise<void>
  onDeletePermanent: (id: number) => Promise<void>
  onEmptyTrash: () => Promise<void>
}

export default function TrashGrid({
  notes,
  loading,
  error,
  onRestore,
  onDeletePermanent,
  onEmptyTrash,
}: Props) {
  async function handlePermanent(note: Note) {
    if (window.confirm(`'${note.title || '제목 없음'}'을(를) 완전히 삭제할까요? 되돌릴 수 없습니다.`)) {
      await onDeletePermanent(note.id)
    }
  }

  async function handleEmpty() {
    if (window.confirm('휴지통을 비울까요? 모든 노트가 영구 삭제됩니다.')) {
      await onEmptyTrash()
      window.alert('휴지통을 비웠습니다.')
    }
  }

  return (
    <div className="grid-container">
      <header className="grid-header">
        <h2>🗑 휴지통</h2>
        <div className="grid-header-actions">
          <button
            className="danger-solid"
            onClick={handleEmpty}
            disabled={notes.length === 0}
          >
            휴지통 비우기
          </button>
        </div>
      </header>

      <p className="muted">삭제한 노트는 여기에 보관됩니다. 복원하거나 완전히 삭제할 수 있어요.</p>

      {loading && <p className="muted">불러오는 중…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && notes.length === 0 && (
        <div className="empty-state">
          <p>휴지통이 비어 있습니다.</p>
        </div>
      )}

      <div className="note-grid">
        {notes.map((note) => (
          <div key={note.id} className={`book-card cover-${note.cover} trash-card`}>
            <span className="book-spine" />
            <h3 className="book-title">{note.title || '제목 없음'}</h3>
            <div className="trash-actions">
              <button onClick={() => onRestore(note.id)}>↩ 복원</button>
              <button className="danger" onClick={() => handlePermanent(note)}>
                완전 삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
