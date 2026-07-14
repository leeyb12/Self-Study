export type Cover =
  | 'classic'
  | 'navy'
  | 'forest'
  | 'crimson'
  | 'craft'
  | 'mint'
  | 'charcoal'
  | 'plum'
  | 'ocean'
  | 'rose'
  | 'amber'
  | 'lavender'

export type Paper = 'plain' | 'lined' | 'grid' | 'dotted'

export const COVERS: { key: Cover; label: string }[] = [
  { key: 'classic', label: '클래식 브라운' },
  { key: 'navy', label: '네이비' },
  { key: 'forest', label: '포레스트 그린' },
  { key: 'crimson', label: '크림슨 레드' },
  { key: 'craft', label: '크래프트 베이지' },
  { key: 'mint', label: '민트' },
  { key: 'charcoal', label: '차콜 그레이' },
  { key: 'plum', label: '플럼 퍼플' },
  { key: 'ocean', label: '오션 블루' },
  { key: 'rose', label: '로즈 핑크' },
  { key: 'amber', label: '앰버 옐로' },
  { key: 'lavender', label: '라벤더' },
]

export const PAPERS: { key: Paper; label: string }[] = [
  { key: 'plain', label: '무지' },
  { key: 'grid', label: '모눈' },
  { key: 'dotted', label: '도트' },
]

export interface Note {
  id: number
  title: string
  folderId: number | null
  cover: Cover
  paper: Paper
  pageCount: number
  /** 카드 미리보기용 (첫 페이지 일부) */
  preview: string
  createdAt: string
  updatedAt: string
}

export interface Page {
  id: number
  pageNo: number
  content: string
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
  folderId: number | null
  cover: Cover
  paper: Paper
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
  // LLM 이 실제로 수행한 작업 (없으면 null)
  action: 'create_note' | 'create_folder' | null
  createdId: number | null
}

// 노트 목록 필터: 'all' 전체, 'none' 미분류, 'trash' 휴지통, number 특정 폴더
export type FolderFilter = 'all' | 'none' | 'trash' | number
