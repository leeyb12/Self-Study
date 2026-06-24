import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Props {
  attachmentId: number
  fileName: string
  onClose: () => void
}

export default function PdfViewer({ attachmentId, fileName, onClose }: Props) {
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let revoked: string | null = null
    api
      .attachmentObjectUrl(attachmentId)
      .then((u) => {
        revoked = u
        setUrl(u)
      })
      .catch((e) => setError(e instanceof Error ? e.message : '불러오기 실패'))
    return () => {
      if (revoked) URL.revokeObjectURL(revoked)
    }
  }, [attachmentId])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
        <header className="pdf-modal-head">
          <span className="pdf-modal-title">📄 {fileName}</span>
          <button className="link-button" onClick={onClose}>
            ✕ 닫기
          </button>
        </header>
        {error && <p className="error" style={{ padding: '1rem' }}>{error}</p>}
        {!error && !url && <p className="muted" style={{ padding: '1rem' }}>불러오는 중…</p>}
        {url && <iframe className="pdf-frame" src={url} title={fileName} />}
      </div>
    </div>
  )
}
