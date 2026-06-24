import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Folder, FolderFilter, Note, NoteInput } from '../types'
import FolderSidebar from './FolderSidebar'
import NoteGrid from './NoteGrid'
import TrashGrid from './TrashGrid'
import NoteEditor from './NoteEditor'
import NoteReader from './NoteReader'
import AiChat from './AiChat'

interface Props {
  email: string
  onLogout: () => void
}

type View =
  | { mode: 'grid' }
  | { mode: 'read'; note: Note } // 읽기 전용
  | { mode: 'edit'; note: Note | null } // note === null 이면 새 노트

export default function NoteWorkspace({ email, onLogout }: Props) {
  const [folders, setFolders] = useState<Folder[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [filter, setFilter] = useState<FolderFilter>('all')
  const [view, setView] = useState<View>({ mode: 'grid' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)

  const loadFolders = useCallback(async () => {
    setFolders(await api.listFolders())
  }, [])

  const loadNotes = useCallback(async (f: FolderFilter) => {
    setLoading(true)
    setError(null)
    try {
      setNotes(f === 'trash' ? await api.listTrash() : await api.listNotes(f))
    } catch (err) {
      setError(err instanceof Error ? err.message : '노트를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFolders().catch(() => {})
  }, [loadFolders])

  useEffect(() => {
    loadNotes(filter)
  }, [filter, loadNotes])

  // ---- 폴더 ----
  async function handleAddFolder(name: string) {
    await api.createFolder(name)
    await loadFolders()
  }
  async function handleRenameFolder(id: number, name: string) {
    await api.renameFolder(id, name)
    await loadFolders()
  }
  async function handleDeleteFolder(id: number) {
    await api.deleteFolder(id)
    await loadFolders()
    if (filter === id) setFilter('all')
    else loadNotes(filter)
  }

  // ---- 노트 ----
  function openNew() {
    setView({ mode: 'edit', note: null })
  }
  function openRead(note: Note) {
    setView({ mode: 'read', note })
  }
  // 저장 후 에디터를 유지한다(새 노트도 id 가 생겨 첨부/요약 가능). 저장된 노트를 반환.
  async function handleSave(input: NoteInput, editing: Note | null): Promise<Note> {
    const saved = editing
      ? await api.updateNote(editing.id, input)
      : await api.createNote(input)
    setView({ mode: 'edit', note: saved })
    loadNotes(filter) // 목록은 백그라운드 갱신
    return saved
  }
  async function handleDelete(id: number) {
    await api.deleteNote(id)
    setView({ mode: 'grid' })
    await loadNotes(filter)
  }
  // 카드 다중 선택 삭제
  async function handleDeleteMany(ids: number[]) {
    setError(null)
    try {
      await Promise.all(ids.map((id) => api.deleteNote(id)))
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제에 실패했습니다.')
    } finally {
      await loadNotes(filter)
    }
  }

  // ---- 휴지통 ----
  async function handleRestore(id: number) {
    await api.restoreNote(id)
    await loadNotes('trash')
  }
  async function handleDeletePermanent(id: number) {
    await api.deleteNotePermanent(id)
    await loadNotes('trash')
  }
  async function handleEmptyTrash() {
    await api.emptyTrash()
    await loadNotes('trash')
  }

  // 파일 업로드로 새 노트 생성 → 파일을 첨부하고 편집 화면으로 연다.
  async function handleUploadFiles(files: FileList) {
    const list = Array.from(files)
    const baseName = list[0].name.replace(/\.[^.]+$/, '')
    const title =
      list.length === 1 ? baseName : `${baseName} 외 ${list.length - 1}건`
    const folderId = typeof filter === 'number' ? filter : null
    setError(null)
    try {
      const note = await api.createNote({ title, content: '', folderId })
      for (const file of list) {
        await api.uploadAttachment(note.id, file)
      }
      setView({ mode: 'edit', note })
      loadNotes(filter)
    } catch (err) {
      setError(err instanceof Error ? err.message : '파일 업로드에 실패했습니다.')
    }
  }

  if (view.mode === 'read') {
    return (
      <NoteReader
        note={view.note}
        folders={folders}
        onEdit={() => setView({ mode: 'edit', note: view.note })}
        onDelete={() => handleDelete(view.note.id)}
        onClose={() => setView({ mode: 'grid' })}
      />
    )
  }

  if (view.mode === 'edit') {
    // 새 노트는 현재 선택된 폴더를 기본값으로
    const defaultFolderId =
      typeof filter === 'number' ? filter : null
    return (
      <NoteEditor
        note={view.note}
        folders={folders}
        defaultFolderId={defaultFolderId}
        onSave={(input) => handleSave(input, view.note)}
        onDelete={view.note ? () => handleDelete(view.note!.id) : undefined}
        onCancel={() => setView({ mode: 'grid' })}
      />
    )
  }

  return (
    <div className="workspace">
      <FolderSidebar
        email={email}
        folders={folders}
        filter={filter}
        onSelect={setFilter}
        onAdd={handleAddFolder}
        onRename={handleRenameFolder}
        onDelete={handleDeleteFolder}
        onLogout={onLogout}
      />
      <main className="grid-pane">
        {filter === 'trash' ? (
          <TrashGrid
            notes={notes}
            loading={loading}
            error={error}
            onRestore={handleRestore}
            onDeletePermanent={handleDeletePermanent}
            onEmptyTrash={handleEmptyTrash}
          />
        ) : (
          <NoteGrid
            notes={notes}
            folders={folders}
            loading={loading}
            error={error}
            title={filterTitle(filter, folders)}
            onNew={openNew}
            onOpen={openRead}
            onAskAi={() => setChatOpen(true)}
            onUploadFiles={handleUploadFiles}
            onDeleteMany={handleDeleteMany}
          />
        )}
      </main>
      {chatOpen && <AiChat onClose={() => setChatOpen(false)} />}
    </div>
  )
}

function filterTitle(filter: FolderFilter, folders: Folder[]): string {
  if (filter === 'all') return '전체 노트'
  if (filter === 'none') return '미분류'
  if (filter === 'trash') return '휴지통'
  return folders.find((f) => f.id === filter)?.name ?? '폴더'
}
