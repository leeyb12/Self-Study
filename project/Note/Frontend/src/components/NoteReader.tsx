import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Attachment, Folder, Note } from '../types'
import { renderMarkdown } from '../lib/markdown'
import PdfViewer from './PdfViewer'

interface Props {
  note: Note
  folders: Folder[]
  onEdit: () => void
  onDelete: () => Promise<void>
  onClose: () => void
}

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

export default function NoteReader({ note, folders, onEdit, onDelete, onClose }: Props) {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [viewerAtt, setViewerAtt] = useState<Attachment | null>(null)

  const folderName = note.folderId
    ? folders.find((f) => f.id === note.folderId)?.name
    : null

  const loadAttachments = useCallback(async (id: number) => {
    try {
      setAttachments(await api.listAttachments(id))
    } catch {
      /* 무시 */
    }
  }, [])

  useEffect(() => {
    loadAttachments(note.id)
  }, [note.id, loadAttachments])

  function openAttachment(a: Attachment) {
    if (isPdf(a)) setViewerAtt(a)
    else api.openAttachment(a.id)
  }

  async function handleDelete() {
    if (confirm('이 노트를 삭제할까요?')) await onDelete()
  }

  return (
    <div className="editor-screen">
      <header className="editor-bar">
        <button className="link-button" onClick={onClose}>
          ← 목록
        </button>
        <div className="editor-bar-actions">
          {folderName && <span className="reader-folder">📁 {folderName}</span>}
          <button className="danger" onClick={handleDelete}>
            삭제
          </button>
          <button className="primary" onClick={onEdit}>
            ✏️ 편집
          </button>
        </div>
      </header>

      <div className="editor-body reader-body">
        <h1 className="reader-title">{note.title || '제목 없음'}</h1>
        <p className="muted reader-meta">
          최종 수정 {new Date(note.updatedAt).toLocaleString()}
        </p>

        {note.content?.trim() ? (
          <div
            className="markdown-body reader-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content) }}
          />
        ) : (
          <p className="muted">내용이 없습니다.</p>
        )}

        {attachments.length > 0 && (
          <section className="attach-section">
            <div className="section-head">
              <h4>첨부파일</h4>
            </div>
            <ul className="attach-list">
              {attachments.map((a) => (
                <li key={a.id}>
                  <button className="attach-name" onClick={() => openAttachment(a)}>
                    {isPdf(a) ? '📄' : '📎'} {a.originalName}
                  </button>
                  <span className="attach-meta">{formatSize(a.sizeBytes)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
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
