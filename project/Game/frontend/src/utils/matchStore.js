// AI 대전 게임의 승/패/무 전적을 localStorage에 저장/조회한다.
const keyOf = (gameId) => `record:${gameId}`

export function loadRecord(gameId) {
  try {
    return JSON.parse(localStorage.getItem(keyOf(gameId))) || { win: 0, lose: 0, draw: 0 }
  } catch {
    return { win: 0, lose: 0, draw: 0 }
  }
}

export function saveRecord(gameId, rec) {
  try {
    localStorage.setItem(keyOf(gameId), JSON.stringify(rec))
  } catch {
    /* 저장 실패는 무시 */
  }
}
