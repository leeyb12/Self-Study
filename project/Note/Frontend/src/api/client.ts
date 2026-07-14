import type {
  AuthResult,
  Attachment,
  Folder,
  FolderFilter,
  Note,
  NoteInput,
  SummaryResult,
  AiToolAction,
  AiToolResult,
  ChatMsg,
  ChatReply,
  Page,
} from '../types'

const TOKEN_KEY = 'note.accessToken'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  // 401(인증 만료) / 403(권한 없음) 모두 세션이 끊긴 상태로 보고 로그인 화면으로 되돌린다.
  if (res.status === 401 || res.status === 403) {
    setToken(null)
    window.location.reload()
    throw new Error('인증이 만료되었습니다. 다시 로그인해 주세요.')
  }

  if (!res.ok) {
    let message = `요청에 실패했습니다 (${res.status})`
    try {
      const body = await res.json()
      if (body?.message) message = body.message
    } catch {
      /* JSON 아님 — 기본 메시지 사용 */
    }
    throw new Error(message)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

function notesQuery(filter: FolderFilter): string {
  if (filter === 'all') return ''
  if (filter === 'none') return '?folderId=0'
  return `?folderId=${filter}`
}

export const api = {
  signup: (email: string, password: string) =>
    request<AuthResult>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // ---- folders ----
  listFolders: () => request<Folder[]>('/folders'),

  createFolder: (name: string) =>
    request<Folder>('/folders', { method: 'POST', body: JSON.stringify({ name }) }),

  renameFolder: (id: number, name: string) =>
    request<Folder>(`/folders/${id}`, { method: 'PUT', body: JSON.stringify({ name }) }),

  deleteFolder: (id: number) =>
    request<void>(`/folders/${id}`, { method: 'DELETE' }),

  // ---- notes ----
  listNotes: (filter: FolderFilter = 'all') =>
    request<Note[]>(`/notes${notesQuery(filter)}`),

  createNote: (input: NoteInput) =>
    request<Note>('/notes', { method: 'POST', body: JSON.stringify(input) }),

  updateNote: (id: number, input: NoteInput) =>
    request<Note>(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(input) }),

  deleteNote: (id: number) =>
    request<void>(`/notes/${id}`, { method: 'DELETE' }),

  // ---- 페이지 ----
  listPages: (noteId: number) => request<Page[]>(`/notes/${noteId}/pages`),

  addPage: (noteId: number) =>
    request<Page>(`/notes/${noteId}/pages`, { method: 'POST' }),

  updatePage: (pageId: number, content: string) =>
    request<Page>(`/pages/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),

  deletePage: (pageId: number) =>
    request<void>(`/pages/${pageId}`, { method: 'DELETE' }),

  // ---- 휴지통 ----
  listTrash: () => request<Note[]>('/notes/trash'),

  restoreNote: (id: number) =>
    request<Note>(`/notes/${id}/restore`, { method: 'POST' }),

  deleteNotePermanent: (id: number) =>
    request<void>(`/notes/${id}/permanent`, { method: 'DELETE' }),

  emptyTrash: () => request<void>('/notes/trash', { method: 'DELETE' }),

  summarizeNote: (id: number) =>
    request<SummaryResult>(`/notes/${id}/summarize`, { method: 'POST' }),

  // ---- attachments ----
  listAttachments: (noteId: number) =>
    request<Attachment[]>(`/notes/${noteId}/attachments`),

  uploadAttachment: async (noteId: number, file: File): Promise<Attachment> => {
    const token = getToken()
    const form = new FormData()
    form.append('file', file)
    // FormData 사용 시 Content-Type 은 브라우저가 boundary 와 함께 자동 설정한다.
    const res = await fetch(`/api/notes/${noteId}/attachments`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    })
    if (!res.ok) {
      let message = `업로드에 실패했습니다 (${res.status})`
      try {
        const body = await res.json()
        if (body?.message) message = body.message
      } catch {
        /* noop */
      }
      throw new Error(message)
    }
    return res.json() as Promise<Attachment>
  },

  deleteAttachment: (id: number) =>
    request<void>(`/attachments/${id}`, { method: 'DELETE' }),

  // 토큰이 필요하므로 fetch 로 받아 blob URL 을 반환한다. (호출 측에서 revoke)
  attachmentObjectUrl: async (id: number): Promise<string> => {
    const token = getToken()
    const res = await fetch(`/api/attachments/${id}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) throw new Error('파일을 불러올 수 없습니다.')
    const blob = await res.blob()
    return URL.createObjectURL(blob)
  },

  // PDF 외 파일은 새 탭에서 연다.
  openAttachment: async (id: number) => {
    const url = await api.attachmentObjectUrl(id)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  },

  // ---- AI 도구 ----
  aiTool: (action: AiToolAction, text: string, targetLang?: string) =>
    request<AiToolResult>('/ai/tools', {
      method: 'POST',
      body: JSON.stringify({ action, text, targetLang }),
    }),

  aiChat: (messages: ChatMsg[]) =>
    request<ChatReply>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    }),
}
