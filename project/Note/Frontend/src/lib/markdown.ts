import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { getToken } from '../api/client'

marked.setOptions({
  breaks: true, // 줄바꿈을 <br> 로
  gfm: true, // GitHub 스타일 (체크박스, 표 등)
})

/**
 * 첨부 이미지(<img src="/api/attachments/{id}/download">)는 인증이 필요한데
 * img 태그에는 헤더를 붙일 수 없으므로, 렌더 시점에 토큰을 쿼리로 덧붙인다.
 * (토큰은 노트 본문에 저장되지 않고 렌더링된 HTML 에만 들어간다.)
 */
function authorizeAttachmentImages(html: string): string {
  const token = getToken()
  if (!token) return html
  return html.replace(
    /src="(\/api\/attachments\/\d+\/download)"/g,
    (_match, url: string) => `src="${url}?token=${encodeURIComponent(token)}"`,
  )
}

/** 마크다운 문자열을 안전한 HTML 로 변환한다. */
export function renderMarkdown(md: string): string {
  const raw = marked.parse(md ?? '', { async: false }) as string
  return authorizeAttachmentImages(DOMPurify.sanitize(raw))
}

/** 첨부 id 로 노트 본문에 넣을 이미지 마크다운을 만든다. */
export function imageMarkdown(attachmentId: number, altText: string): string {
  return `![${altText}](/api/attachments/${attachmentId}/download)`
}
