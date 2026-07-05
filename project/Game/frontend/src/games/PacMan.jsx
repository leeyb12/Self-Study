import { useRef, useState, useEffect } from 'react'
import { useGameLoop } from '../hooks/useGameLoop.js'
import Difficulty from '../components/Difficulty.jsx'

// # 벽 / . 도트 / (공백) 길 / P 팩맨 시작 / G 유령 시작
const MAZE = [
  '#############',
  '#...........#',
  '#.#.#.#.#.#.#',
  '#.....G.....#',
  '#.#.#.#.#.#.#',
  '#....G.G....#',
  '#.#.#.#.#.#.#',
  '#...........#',
  '#.#.#.#.#.#.#',
  '#.....P.....#',
  '#############',
]
const ROWS = MAZE.length
const COLS = MAZE[0].length
const CELL = 26
const W = COLS * CELL
const H = ROWS * CELL
const PAC_STEP = 0.16 // 초당 이동 간격
const GHOST_COLORS = ['#f87171', '#f9a8d4', '#22d3ee']

// 유령 이동 간격(작을수록 빠름) = 난이도
const DIFFICULTIES = [
  { label: '쉬움', value: 0.3 },
  { label: '보통', value: 0.22 },
  { label: '어려움', value: 0.16 },
]

const DIRS = {
  up: { r: -1, c: 0 },
  down: { r: 1, c: 0 },
  left: { r: 0, c: -1 },
  right: { r: 0, c: 1 },
}

function isWall(r, c) {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return true
  return MAZE[r][c] === '#'
}

function parseMaze() {
  const dots = new Set()
  let pac = null
  const ghosts = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const ch = MAZE[r][c]
      if (ch === '.') dots.add(`${r},${c}`)
      else if (ch === 'P') pac = { r, c }
      else if (ch === 'G') ghosts.push({ r, c })
    }
  }
  return { dots, pac, ghosts }
}

function PacMan() {
  const canvasRef = useRef(null)
  const gRef = useRef(null)
  const nextDirRef = useRef(null) // 대기 중인 방향 입력
  const statusRef = useRef('ready')
  const ghostStepRef = useRef(0.22)
  const [status, setStatus] = useState('ready') // ready | playing | won | over
  const [score, setScore] = useState(0)
  const [ghostStep, setGhostStep] = useState(0.22)

  useEffect(() => {
    statusRef.current = status
  }, [status])

  useEffect(() => {
    ghostStepRef.current = ghostStep
  }, [ghostStep])

  function start() {
    const { dots, pac, ghosts } = parseMaze()
    gRef.current = {
      dots,
      pac: { ...pac, dir: null },
      ghosts: ghosts.map((gh, i) => ({ ...gh, dir: DIRS.up, color: GHOST_COLORS[i % GHOST_COLORS.length] })),
      pacTimer: 0,
      ghostTimer: 0,
      score: 0,
    }
    nextDirRef.current = null
    setScore(0)
    setStatus('playing')
  }

  useEffect(() => {
    const map = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    }
    const onKey = (e) => {
      const name = map[e.key]
      if (!name || statusRef.current !== 'playing') return
      e.preventDefault()
      nextDirRef.current = DIRS[name]
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function stepPac(g) {
    const p = g.pac
    const want = nextDirRef.current
    if (want && !isWall(p.r + want.r, p.c + want.c)) p.dir = want
    if (!p.dir) return
    const nr = p.r + p.dir.r
    const nc = p.c + p.dir.c
    if (isWall(nr, nc)) return
    p.r = nr
    p.c = nc

    const key = `${p.r},${p.c}`
    if (g.dots.has(key)) {
      g.dots.delete(key)
      g.score += 10
      setScore(g.score)
      if (g.dots.size === 0) setStatus('won')
    }
  }

  function stepGhosts(g) {
    for (const gh of g.ghosts) {
      const options = []
      for (const dir of Object.values(DIRS)) {
        // 왔던 길로 되돌아가는 것은 막다른 길이 아닌 한 배제
        if (dir.r === -gh.dir.r && dir.c === -gh.dir.c) continue
        if (!isWall(gh.r + dir.r, gh.c + dir.c)) options.push(dir)
      }
      if (options.length === 0) {
        // 막다른 길: 벽이 아니면 반대로, 그마저 막혔으면 멈춤
        const back = { r: -gh.dir.r, c: -gh.dir.c }
        if (!isWall(gh.r + back.r, gh.c + back.c)) options.push(back)
        else continue
      }
      // 20% 확률로 무작위, 아니면 팩맨에 가장 가까워지는 방향
      let choice
      if (Math.random() < 0.2) {
        choice = options[Math.floor(Math.random() * options.length)]
      } else {
        choice = options.reduce((best, dir) => {
          const d = Math.abs(gh.r + dir.r - g.pac.r) + Math.abs(gh.c + dir.c - g.pac.c)
          const bd = Math.abs(gh.r + best.r - g.pac.r) + Math.abs(gh.c + best.c - g.pac.c)
          return d < bd ? dir : best
        }, options[0])
      }
      gh.dir = choice
      gh.r += choice.r
      gh.c += choice.c
    }
  }

  function caught(g) {
    return g.ghosts.some((gh) => gh.r === g.pac.r && gh.c === g.pac.c)
  }

  function update(dt) {
    const g = gRef.current
    if (!g) return

    g.pacTimer += dt
    if (g.pacTimer >= PAC_STEP) {
      g.pacTimer = 0
      stepPac(g)
      if (caught(g)) return setStatus('over')
    }

    g.ghostTimer += dt
    if (g.ghostTimer >= ghostStepRef.current) {
      g.ghostTimer = 0
      stepGhosts(g)
      if (caught(g)) return setStatus('over')
    }

    draw()
  }

  function draw() {
    const canvas = canvasRef.current
    const g = gRef.current
    if (!canvas || !g) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0b1020'
    ctx.fillRect(0, 0, W, H)

    // 벽 & 도트
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (MAZE[r][c] === '#') {
          ctx.fillStyle = '#1e3a8a'
          ctx.fillRect(c * CELL + 2, r * CELL + 2, CELL - 4, CELL - 4)
        } else if (g.dots.has(`${r},${c}`)) {
          ctx.fillStyle = '#fcd34d'
          ctx.beginPath()
          ctx.arc(c * CELL + CELL / 2, r * CELL + CELL / 2, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // 팩맨
    ctx.fillStyle = '#facc15'
    ctx.beginPath()
    ctx.arc(g.pac.c * CELL + CELL / 2, g.pac.r * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2)
    ctx.fill()

    // 유령
    for (const gh of g.ghosts) {
      ctx.fillStyle = gh.color
      ctx.beginPath()
      ctx.arc(gh.c * CELL + CELL / 2, gh.r * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  useGameLoop(update, status === 'playing')

  useEffect(() => {
    if (status !== 'playing') {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#0b1020'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#e5e7eb'
      ctx.font = '18px system-ui'
      ctx.textAlign = 'center'
      const msg =
        status === 'won' ? '🎉 클리어!' : status === 'over' ? '👻 잡혔다!' : '팩맨'
      ctx.fillText(msg, W / 2, H / 2)
    }
  }, [status])

  const setDir = (name) => () => {
    if (statusRef.current === 'playing') nextDirRef.current = DIRS[name]
  }

  return (
    <div className="game">
      <p className="game-message">점수: {score}</p>
      <canvas ref={canvasRef} width={W} height={H} className="canvas-game" />

      <div className="pac-pad">
        <button type="button" onClick={setDir('up')}>▲</button>
        <div>
          <button type="button" onClick={setDir('left')}>◀</button>
          <button type="button" onClick={setDir('down')}>▼</button>
          <button type="button" onClick={setDir('right')}>▶</button>
        </div>
      </div>

      <p className="game-info">방향키로 이동 · 도트를 모두 먹으세요</p>
      <Difficulty
        value={ghostStep}
        onChange={setGhostStep}
        options={DIFFICULTIES}
        disabled={status === 'playing'}
      />
      <button type="button" className="game-reset" onClick={start}>
        {status === 'playing' ? '다시 시작' : '게임 시작'}
      </button>
    </div>
  )
}

export default PacMan
