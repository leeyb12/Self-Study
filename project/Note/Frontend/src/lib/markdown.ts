import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({
  breaks: true, // 줄바꿈을 <br> 로
  gfm: true, // GitHub 스타일 (체크박스, 표 등)
})

/** 마크다운 문자열을 안전한 HTML 로 변환한다. */
export function renderMarkdown(md: string): string {
  const raw = marked.parse(md ?? '', { async: false }) as string
  return DOMPurify.sanitize(raw)
}
