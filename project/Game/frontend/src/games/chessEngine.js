// 순수 함수형 체스 엔진.
// 좌표: board[r][c], r=0 최상단(흑 진영), r=7 최하단(백 진영).
// 백(w)은 위쪽(-r 방향)으로 전진, 흑(b)은 아래쪽(+r).
// state = { board, castling:{wK,wQ,bK,bQ}, ep:[r,c]|null }

const BACK = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']

export function initialState() {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null))
  for (let c = 0; c < 8; c++) {
    board[0][c] = { t: BACK[c], c: 'b' }
    board[1][c] = { t: 'p', c: 'b' }
    board[6][c] = { t: 'p', c: 'w' }
    board[7][c] = { t: BACK[c], c: 'w' }
  }
  return {
    board,
    castling: { wK: true, wQ: true, bK: true, bQ: true },
    ep: null,
  }
}

const opp = (color) => (color === 'w' ? 'b' : 'w')
const inBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8

const KNIGHT = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [1, -2], [1, 2], [2, -1], [2, 1],
]
const KING = [
  [-1, -1], [-1, 0], [-1, 1], [0, -1],
  [0, 1], [1, -1], [1, 0], [1, 1],
]
const BISHOP_DIR = [[-1, -1], [-1, 1], [1, -1], [1, 1]]
const ROOK_DIR = [[-1, 0], [1, 0], [0, -1], [0, 1]]

// (r,c)가 byColor에게 공격받는지. generatePseudo와 독립적으로 구현(재귀 방지).
export function isSquareAttacked(board, r, c, byColor) {
  // 폰
  const pdir = byColor === 'w' ? 1 : -1 // byColor 폰이 위치한 행은 (r+pdir)
  for (const dc of [-1, 1]) {
    const pr = r + pdir
    const pc = c + dc
    if (inBounds(pr, pc)) {
      const p = board[pr][pc]
      if (p && p.c === byColor && p.t === 'p') return true
    }
  }
  // 나이트
  for (const [dr, dc] of KNIGHT) {
    const nr = r + dr
    const nc = c + dc
    if (inBounds(nr, nc)) {
      const p = board[nr][nc]
      if (p && p.c === byColor && p.t === 'n') return true
    }
  }
  // 킹
  for (const [dr, dc] of KING) {
    const nr = r + dr
    const nc = c + dc
    if (inBounds(nr, nc)) {
      const p = board[nr][nc]
      if (p && p.c === byColor && p.t === 'k') return true
    }
  }
  // 대각선 슬라이딩(비숍/퀸)
  for (const [dr, dc] of BISHOP_DIR) {
    let nr = r + dr
    let nc = c + dc
    while (inBounds(nr, nc)) {
      const p = board[nr][nc]
      if (p) {
        if (p.c === byColor && (p.t === 'b' || p.t === 'q')) return true
        break
      }
      nr += dr
      nc += dc
    }
  }
  // 직선 슬라이딩(룩/퀸)
  for (const [dr, dc] of ROOK_DIR) {
    let nr = r + dr
    let nc = c + dc
    while (inBounds(nr, nc)) {
      const p = board[nr][nc]
      if (p) {
        if (p.c === byColor && (p.t === 'r' || p.t === 'q')) return true
        break
      }
      nr += dr
      nc += dc
    }
  }
  return false
}

function findKing(board, color) {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (p && p.c === color && p.t === 'k') return [r, c]
    }
  return null
}

export function isInCheck(state, color) {
  const king = findKing(state.board, color)
  if (!king) return false
  return isSquareAttacked(state.board, king[0], king[1], opp(color))
}

// 의사 합법수(자기 킹 노출 여부는 아직 검사하지 않음)
function generatePseudo(state, color) {
  const { board, ep } = state
  const moves = []
  const add = (from, to, extra) => moves.push({ from, to, ...extra })

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (!p || p.c !== color) continue

      if (p.t === 'p') {
        const dir = color === 'w' ? -1 : 1
        const start = color === 'w' ? 6 : 1
        const promoRow = color === 'w' ? 0 : 7
        const one = r + dir
        const pushPawn = (to, extra) => {
          if (to[0] === promoRow) add([r, c], to, { ...extra, promotion: true })
          else add([r, c], to, extra)
        }
        // 전진
        if (inBounds(one, c) && !board[one][c]) {
          pushPawn([one, c])
          const two = r + 2 * dir
          if (r === start && !board[two][c]) add([r, c], [two, c])
        }
        // 대각 캡처 & 앙파상
        for (const dc of [-1, 1]) {
          const nc = c + dc
          if (!inBounds(one, nc)) continue
          const target = board[one][nc]
          if (target && target.c !== color) pushPawn([one, nc])
          else if (ep && ep[0] === one && ep[1] === nc) add([r, c], [one, nc], { enPassant: true })
        }
      } else if (p.t === 'n') {
        for (const [dr, dc] of KNIGHT) {
          const nr = r + dr
          const nc = c + dc
          if (!inBounds(nr, nc)) continue
          const t = board[nr][nc]
          if (!t || t.c !== color) add([r, c], [nr, nc])
        }
      } else if (p.t === 'k') {
        for (const [dr, dc] of KING) {
          const nr = r + dr
          const nc = c + dc
          if (!inBounds(nr, nc)) continue
          const t = board[nr][nc]
          if (!t || t.c !== color) add([r, c], [nr, nc])
        }
        addCastling(state, color, r, c, add)
      } else {
        const dirs =
          p.t === 'b' ? BISHOP_DIR : p.t === 'r' ? ROOK_DIR : [...BISHOP_DIR, ...ROOK_DIR]
        for (const [dr, dc] of dirs) {
          let nr = r + dr
          let nc = c + dc
          while (inBounds(nr, nc)) {
            const t = board[nr][nc]
            if (!t) add([r, c], [nr, nc])
            else {
              if (t.c !== color) add([r, c], [nr, nc])
              break
            }
            nr += dr
            nc += dc
          }
        }
      }
    }
  }
  return moves
}

function addCastling(state, color, r, c, add) {
  const { board, castling } = state
  const row = color === 'w' ? 7 : 0
  if (r !== row || c !== 4) return // 킹이 시작 위치에 있을 때만
  const enemy = opp(color)
  const kSide = color === 'w' ? castling.wK : castling.bK
  const qSide = color === 'w' ? castling.wQ : castling.bQ
  const rook = (cc) => board[row][cc] && board[row][cc].t === 'r' && board[row][cc].c === color

  if (kSide && !board[row][5] && !board[row][6] && rook(7)) {
    if (
      !isSquareAttacked(board, row, 4, enemy) &&
      !isSquareAttacked(board, row, 5, enemy) &&
      !isSquareAttacked(board, row, 6, enemy)
    ) {
      add([row, 4], [row, 6], { castle: 'K' })
    }
  }
  if (qSide && !board[row][1] && !board[row][2] && !board[row][3] && rook(0)) {
    if (
      !isSquareAttacked(board, row, 4, enemy) &&
      !isSquareAttacked(board, row, 3, enemy) &&
      !isSquareAttacked(board, row, 2, enemy)
    ) {
      add([row, 4], [row, 2], { castle: 'Q' })
    }
  }
}

export function makeMove(state, m) {
  const board = state.board.map((row) => row.slice())
  const castling = { ...state.castling }
  let ep = null
  const piece = board[m.from[0]][m.from[1]]

  board[m.from[0]][m.from[1]] = null
  if (m.enPassant) board[m.from[0]][m.to[1]] = null // 지나친 폰 제거
  board[m.to[0]][m.to[1]] = m.promotion ? { t: 'q', c: piece.c } : piece

  // 캐슬링 시 룩 이동
  if (m.castle === 'K') {
    board[m.from[0]][5] = board[m.from[0]][7]
    board[m.from[0]][7] = null
  } else if (m.castle === 'Q') {
    board[m.from[0]][3] = board[m.from[0]][0]
    board[m.from[0]][0] = null
  }

  // 캐슬링 권리 갱신
  if (piece.t === 'k') {
    if (piece.c === 'w') { castling.wK = false; castling.wQ = false }
    else { castling.bK = false; castling.bQ = false }
  }
  const clearRookRight = (r, c) => {
    if (r === 7 && c === 0) castling.wQ = false
    else if (r === 7 && c === 7) castling.wK = false
    else if (r === 0 && c === 0) castling.bQ = false
    else if (r === 0 && c === 7) castling.bK = false
  }
  clearRookRight(m.from[0], m.from[1]) // 룩이 움직임
  clearRookRight(m.to[0], m.to[1]) // 코너의 룩이 잡힘

  // 폰 2칸 전진 → 앙파상 타겟 설정
  if (piece.t === 'p' && Math.abs(m.to[0] - m.from[0]) === 2) {
    ep = [(m.from[0] + m.to[0]) / 2, m.from[1]]
  }

  return { board, castling, ep }
}

export function legalMoves(state, color) {
  return generatePseudo(state, color).filter((m) => {
    const ns = makeMove(state, m)
    return !isInCheck(ns, color)
  })
}

// 'playing' | 'checkmate' | 'stalemate' — color가 둘 차례일 때
export function getStatus(state, color) {
  if (legalMoves(state, color).length > 0) return 'playing'
  return isInCheck(state, color) ? 'checkmate' : 'stalemate'
}

// ---- AI (알파-베타 네가맥스) ----
const VALUE = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 }
const AI_DEPTH = 3

function evaluate(board) {
  let score = 0
  for (const row of board)
    for (const cell of row)
      if (cell) score += (cell.c === 'w' ? 1 : -1) * VALUE[cell.t]
  return score
}

function negamax(state, color, depth, alpha, beta) {
  const moves = legalMoves(state, color)
  if (moves.length === 0) {
    // 체크메이트면 매우 나쁨(depth로 빠른 메이트 선호), 스테일메이트는 0
    return isInCheck(state, color) ? -100000 - depth : 0
  }
  if (depth === 0) return (color === 'w' ? 1 : -1) * evaluate(state.board)

  let best = -Infinity
  for (const m of moves) {
    const ns = makeMove(state, m)
    const v = -negamax(ns, opp(color), depth - 1, -beta, -alpha)
    if (v > best) best = v
    if (best > alpha) alpha = best
    if (alpha >= beta) break
  }
  return best
}

export function chooseAiMove(state, color = 'b', depth = AI_DEPTH) {
  const moves = legalMoves(state, color)
  if (moves.length === 0) return null
  // 약간의 무작위성을 위해 섞은 뒤 평가
  for (let i = moves.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[moves[i], moves[j]] = [moves[j], moves[i]]
  }
  let best = moves[0]
  let bestV = -Infinity
  for (const m of moves) {
    const ns = makeMove(state, m)
    const v = -negamax(ns, opp(color), depth - 1, -Infinity, Infinity)
    if (v > bestV) {
      bestV = v
      best = m
    }
  }
  return best
}
