export interface Note {
  id: number
  title: string
  content: string
  folderId: number | null
  createdAt: string
  updatedAt: string
}

export interface Folder {
  id: number
  name: string
}

export interface AuthResult {
  accessToken: string
  tokenType: string
  userId: number
  email: string
}

export interface NoteInput {
  title: string
  content: string
  folderId: number | null
}

export interface Attachment {
  id: number
  originalName: string
  contentType: string | null
  sizeBytes: number
  textExtractable: boolean
  createdAt: string
}

export interface SummaryResult {
  summary: string
  model: string
}

export type AiToolAction = 'translate' | 'polish' | 'continue'

export interface AiToolResult {
  result: string
  model: string
}

export interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatReply {
  reply: string
  model: string
}

// 노트 목록 필터: 'all' 전체, 'none' 미분류, 'trash' 휴지통, number 특정 폴더
export type FolderFilter = 'all' | 'none' | 'trash' | number
