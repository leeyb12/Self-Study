import { useState } from 'react'
import type { Folder, FolderFilter } from '../types'
import ThemeToggle from './ThemeToggle'

interface Props {
  email: string
  folders: Folder[]
  filter: FolderFilter
  onSelect: (filter: FolderFilter) => void
  onAdd: (name: string) => Promise<void>
  onRename: (id: number, name: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onLogout: () => void
}

export default function FolderSidebar({
  email,
  folders,
  filter,
  onSelect,
  onAdd,
  onRename,
  onDelete,
  onLogout,
}: Props) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')

  async function submitNew(e: React.FormEvent) {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    await onAdd(name)
    setNewName('')
    setAdding(false)
  }

  async function handleRename(folder: Folder) {
    const name = prompt('폴더 이름 변경', folder.name)?.trim()
    if (name && name !== folder.name) await onRename(folder.id, name)
  }

  async function handleDelete(folder: Folder) {
    if (confirm(`'${folder.name}' 폴더를 삭제할까요? (노트는 미분류로 이동)`)) {
      await onDelete(folder.id)
    }
  }

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <div>
          <strong>📝 Note</strong>
          <span className="user-email">{email}</span>
        </div>
        <div className="header-actions">
          <ThemeToggle />
          <button className="link-button" onClick={onLogout}>
            로그아웃
          </button>
        </div>
      </header>

      <nav className="folder-nav">
        <button
          className={`folder-item ${filter === 'all' ? 'active' : ''}`}
          onClick={() => onSelect('all')}
        >
          🗂 전체 노트
        </button>
        <button
          className={`folder-item ${filter === 'none' ? 'active' : ''}`}
          onClick={() => onSelect('none')}
        >
          📥 미분류
        </button>
        <button
          className={`folder-item ${filter === 'trash' ? 'active' : ''}`}
          onClick={() => onSelect('trash')}
        >
          🗑 휴지통
        </button>

        <div className="folder-section-label">
          <span>폴더</span>
          <button className="link-button" onClick={() => setAdding((v) => !v)}>
            + 추가
          </button>
        </div>

        {adding && (
          <form onSubmit={submitNew} className="folder-add">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="새 폴더 이름"
            />
          </form>
        )}

        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`folder-item folder-row ${filter === folder.id ? 'active' : ''}`}
            onClick={() => onSelect(folder.id)}
          >
            <span className="folder-name">📁 {folder.name}</span>
            <span className="folder-actions">
              <button
                className="icon-btn"
                title="이름 변경"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRename(folder)
                }}
              >
                ✎
              </button>
              <button
                className="icon-btn"
                title="삭제"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(folder)
                }}
              >
                🗑
              </button>
            </span>
          </div>
        ))}

        {folders.length === 0 && !adding && (
          <p className="muted folder-empty">폴더가 없습니다.</p>
        )}
      </nav>
    </aside>
  )
}
