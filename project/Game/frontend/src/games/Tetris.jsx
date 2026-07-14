import { useRef, useState, useEffect } from 'react'
import { useGameLoop } from '../hooks/useGameLoop.js'
import ScorePanel from '../components/ScorePanel.jsx'
import Difficulty from '../components/Difficulty.jsx'

const DIFFICULTIES = [
  { label: '쉬움', value: 1.0 },
  { label: '보통', value: 0.8 },
  { label: '어려움', value: 0.5 },
]

const COLS = 10
const ROWS = 20
const CELL = 20
const W = COLS * CELL
const H = ROWS * CELL

const HOLD_GRID = 4
const HOLD_CELL = 18
const HOLD_W = HOLD_GRID * HOLD_CELL
const HOLD_H = HOLD_GRID * HOLD_CELL

const SHAPES = {
  I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
  J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
}
const COLORS = {
  I: '#22d3ee',
  O: '#facc15',
  T: '#c084fc',
  S: '#4ade80',
  Z: '#f87171',
  J: '#60a5fa',
  L: '#fb923c',
}
const KEYS = Object.keys(SHAPES)

const LINE_POINTS = [0, 100, 300, 500, 800]

function rotateCW(m) {
  const rows = m.length
  const cols = m[0].length
  const out = Array.from({ length: cols }, () => Array(rows).fill(0))
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) out[c][rows - 1 - r] = m[r][c]
  return out
}

function collision(board, matrix, px, py) {
  for (let r = 0; r < matrix.length; r++)
    for (let c = 0; c < matrix[r].length; c++) {
      if (!matrix[r][c]) continue
      const x = px + c
      const y = py + r
      if (x < 0 || x >= COLS || y >= ROWS) return true
      if (y >= 0 && board[y][x]) return true
    }
  return false
}

// 지정한 종류의 조각을 g에 세팅. 놓을 공간이 없으면 false(게임 오버).
function spawnFrom(g, key) {
  g.currentKey = key
  g.matrix = SHAPES[key].map((row) => row.slice())
  g.color = COLORS[key]
  g.px = Math.floor((COLS - g.matrix[0].length) / 2)
  g.py = 0
  return !collision(g.board, g.matrix, g.px, g.py)
}

// 무작위 새 조각.
function spawn(g) {
  return spawnFrom(g, KEYS[Math.floor(Math.random() * KEYS.length)])
}

// 홀드: 현재 조각을 보관하거나 보관된 조각과 교체(조각당 1회).
function holdPiece(g) {
  if (g.holdUsed) return
  const cur = g.currentKey
  let ok
  if (g.hold == null) {
    g.hold = cur
    ok = spawn(g)
  } else {
    const swap = g.hold
    g.hold = cur
    ok = spawnFrom(g, swap)
  }
  g.holdUsed = true
  return ok
}

function tryMove(g, dx, dy) {
  if (!collision(g.board, g.matrix, g.px + dx, g.py + dy)) {
    g.px += dx
    g.py += dy
    return true
  }
  return false
}

function tryRotate(g) {
  const rotated = rotateCW(g.matrix)
  // 간단한 월킥: 좌우로 조금 밀어 회전 가능 위치 탐색
  for (const off of [0, -1, 1, -2, 2]) {
    if (!collision(g.board, rotated, g.px + off, g.py)) {
      g.matrix = rotated
      g.px += off
      return
    }
  }
}

function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

function Tetris() {
  const canvasRef = useRef(null)
  const holdCanvasRef = useRef(null)
  const gRef = useRef(null)
  const inputRef = useRef([]) // 대기 중인 입력 큐
  const statusRef = useRef('ready')
  const [status, setStatus] = useState('ready') // ready | playing | over
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [round, setRound] = useState(0)
  const [startInterval, setStartInterval] = useState(0.8) // 시작 낙하 간격(난이도)

  useEffect(() => {
    statusRef.current = status
  }, [status])

  function start() {
    const g = {
      board: emptyBoard(),
      dropTimer: 0,
      dropInterval: startInterval,
      baseInterval: startInterval,
      score: 0,
      lines: 0,
      level: 1,
      matrix: null,
      color: null,
      px: 0,
      py: 0,
      currentKey: null,
      hold: null, // 보관된 조각 종류
      holdUsed: false, // 이번 조각에서 홀드를 이미 썼는지
    }
    spawn(g)
    gRef.current = g
    inputRef.current = []
    setScore(0)
    setLines(0)
    setLevel(1)
    setStatus('playing')
    setRound((r) => r + 1)
  }

  function lock(g) {
    // 보드에 병합
    g.matrix.forEach((row, r) =>
      row.forEach((v, c) => {
        if (v && g.py + r >= 0) g.board[g.py + r][g.px + c] = g.color
      }),
    )
    // 꽉 찬 줄 제거
    let cleared = 0
    g.board = g.board.filter((row) => {
      if (row.every((cell) => cell)) {
        cleared++
        return false
      }
      return true
    })
    while (g.board.length < ROWS) g.board.unshift(Array(COLS).fill(null))

    if (cleared > 0) {
      g.score += LINE_POINTS[cleared] * g.level
      g.lines += cleared
      g.level = Math.floor(g.lines / 10) + 1
      g.dropInterval = Math.max(0.1, g.baseInterval - (g.level - 1) * 0.07)
      setScore(g.score)
      setLines(g.lines)
      setLevel(g.level)
    }

    const ok = spawn(g)
    g.holdUsed = false // 새 조각이 나왔으니 홀드 다시 가능
    if (!ok) setStatus('over')
  }

  function hardDrop(g) {
    while (tryMove(g, 0, 1)) {
      /* 바닥까지 */
    }
    lock(g)
  }

  function update(dt) {
    const g = gRef.current
    if (!g) return

    // 입력 큐 소비
    while (inputRef.current.length) {
      const action = inputRef.current.shift()
      if (action === 'left') tryMove(g, -1, 0)
      else if (action === 'right') tryMove(g, 1, 0)
      else if (action === 'soft') tryMove(g, 0, 1)
      else if (action === 'rotate') tryRotate(g)
      else if (action === 'hold') {
        if (holdPiece(g) === false) return // 홀드 직후 게임오버면 중단
      } else if (action === 'hard') {
        hardDrop(g)
        return
      }
    }

    // 중력
    g.dropTimer += dt
    if (g.dropTimer >= g.dropInterval) {
      g.dropTimer = 0
      if (!tryMove(g, 0, 1)) lock(g)
    }

    draw()
  }

  function draw() {
    const canvas = canvasRef.current
    const g = gRef.current
    if (!canvas || !g) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0f1117'
    ctx.fillRect(0, 0, W, H)

    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (g.board[r][c]) drawCell(ctx, c, r, g.board[r][c])

    g.matrix.forEach((row, r) =>
      row.forEach((v, c) => {
        if (v) drawCell(ctx, g.px + c, g.py + r, g.color)
      }),
    )

    drawHold()
  }

  function drawHold() {
    const canvas = holdCanvasRef.current
    const g = gRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0f1117'
    ctx.fillRect(0, 0, HOLD_W, HOLD_H)
    if (!g || !g.hold) return
    const shape = SHAPES[g.hold]
    const color = COLORS[g.hold]
    const offX = Math.floor((HOLD_GRID - shape[0].length) / 2)
    const offY = Math.floor((HOLD_GRID - shape.length) / 2)
    shape.forEach((row, r) =>
      row.forEach((v, c) => {
        if (v) {
          ctx.fillStyle = color
          ctx.fillRect((offX + c) * HOLD_CELL, (offY + r) * HOLD_CELL, HOLD_CELL - 1, HOLD_CELL - 1)
        }
      }),
    )
  }

  function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color
    ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1)
  }

  useGameLoop(update, status === 'playing')

  // 키보드 입력 → 큐에 push (effect는 refs만 참조)
  useEffect(() => {
    const map = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowDown: 'soft',
      ArrowUp: 'rotate',
    }
    const onKey = (e) => {
      if (statusRef.current !== 'playing') return
      let action = map[e.key]
      if (!action) {
        if (e.key === ' ' || e.code === 'Space') action = 'hard'
        else if (e.key === 'c' || e.key === 'C' || e.key === 'Shift') action = 'hold'
      }
      if (!action) return
      e.preventDefault()
      inputRef.current.push(action)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // 시작 전/게임 오버 화면
  useEffect(() => {
    if (status !== 'playing') {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#0f1117'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#e5e7eb'
      ctx.font = '18px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(status === 'over' ? '💥 게임 오버' : '테트리스', W / 2, H / 2)

      // 홀드 미리보기도 비운다
      const hold = holdCanvasRef.current
      if (hold) {
        const hctx = hold.getContext('2d')
        hctx.fillStyle = '#0f1117'
        hctx.fillRect(0, 0, HOLD_W, HOLD_H)
      }
    }
  }, [status])

  const push = (action) => {
    if (statusRef.current === 'playing') inputRef.current.push(action)
  }

  return (
    <div className="game">
      <p className="game-message">
        점수 {score} · 라인 {lines} · Lv {level}
      </p>
      <div className="tetris-layout">
        <canvas ref={canvasRef} width={W} height={H} className="canvas-game" />
        <div className="tetris-hold-box">
          <span className="tetris-hold-label">HOLD</span>
          <canvas ref={holdCanvasRef} width={HOLD_W} height={HOLD_H} className="tetris-hold" />
        </div>
      </div>

      <div className="tetris-pad">
        <button type="button" onClick={() => push('left')}>◀</button>
        <button type="button" onClick={() => push('rotate')}>↻</button>
        <button type="button" onClick={() => push('right')}>▶</button>
        <button type="button" onClick={() => push('soft')}>▼</button>
        <button type="button" onClick={() => push('hard')}>⤓</button>
        <button type="button" onClick={() => push('hold')}>HOLD</button>
      </div>

      <p className="game-info">← → 이동 · ↑ 회전 · ↓ 소프트드롭 · Space 하드드롭 · C 홀드</p>
      <Difficulty
        value={startInterval}
        onChange={setStartInterval}
        options={DIFFICULTIES}
        disabled={status === 'playing'}
      />
      <button type="button" className="game-reset" onClick={start}>
        {status === 'playing' ? '다시 시작' : '게임 시작'}
      </button>
      <ScorePanel key={round} gameId={`tetris-${startInterval}`} score={score} active={status === 'over'} />
    </div>
  )
}

export default Tetris
