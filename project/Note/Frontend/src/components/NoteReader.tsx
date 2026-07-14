import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Attachment, Folder, Note, Page } from '../types'
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
  const [pages, setPages] = useState<Page[]>([])
  const [index, setIndex] = useState(0)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [viewerAtt, setViewerAtt] = useState<Attachment | null>(null)

  const folderName = note.folderId
    ? folders.find((f) => f.id === note.folderId)?.name
    : null

  const load = useCallback(async (id: number) => {
    try {
      const [p, a] = await Promise.all([api.listPages(id), api.listAttachments(id)])
      setPages(p)
      setAttachments(a)
    } catch {
      /* 무시 */
    }
  }, [])

  useEffect(() => {
    load(note.id)
  }, [note.id, load])

  function openAttachment(a: Attachment) {
    if (isPdf(a)) setViewerAtt(a)
    else api.openAttachment(a.id)
  }

  async function handleDelete() {
    if (confirm('이 노트를 휴지통으로 옮길까요?')) await onDelete()
  }

  const current = pages[index]

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
          최종 수정 {new Date(note.updatedAt).toLocaleString()} · 총 {note.pageCount}페이지
        </p>

        {pages.length > 1 && (
          <div className="page-bar">
            <div className="page-nav">
              <button onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
                ◀
              </button>
              <span className="page-indicator">
                {current?.pageNo ?? 1} / {pages.length}
              </span>
              <button
                onClick={() => setIndex((i) => Math.min(pages.length - 1, i + 1))}
                disabled={index >= pages.length - 1}
              >
                ▶
              </button>
            </div>
          </div>
        )}

        {current?.content?.trim() ? (
          <div
            className={`markdown-body reader-content paper-${note.paper}`}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(current.content) }}
          />
        ) : (
          <p className="muted">이 페이지는 비어 있습니다.</p>
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
