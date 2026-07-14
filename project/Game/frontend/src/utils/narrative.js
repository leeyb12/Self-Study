// 스트리밍 서사 텍스트에서 본문/선택지/종료를 파싱한다.
// 모델은 마지막 줄에 "CHOICES: a | b | c" 또는 "END" 를 붙이도록 프롬프트됨.
export function parseNarrative(full) {
  const ci = full.indexOf('CHOICES:')
  if (ci >= 0) {
    const narration = full.slice(0, ci).trim()
    const choices = full
      .slice(ci + 'CHOICES:'.length)
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean)
    return { narration, choices, ended: false }
  }
  const em = full.match(/\bEND\b/)
  if (em) {
    return { narration: full.slice(0, em.index).trim(), choices: [], ended: true }
  }
  return { narration: full.trim(), choices: [], ended: false }
}
