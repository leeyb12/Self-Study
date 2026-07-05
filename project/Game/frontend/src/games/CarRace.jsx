import { useRef, useState, useEffect } from 'react'
import { useGameLoop } from '../hooks/useGameLoop.js'
import ScorePanel from '../components/ScorePanel.jsx'

const W = 460
const H = 320
const ACCEL = 260
const BRAKE = 320
const MAX_FWD = 300
const DRAG = 0.6 // 전진 감속(초당)
const GRIP = 6 // 측면 마찰(초당) — 클수록 접지력↑, 작을수록 드리프트↑
const STEER = 2.6
const CP_R = 26

// performance.now()를 update 본문에서 직접 부르면 purity 규칙에 걸리므로 헬퍼로 분리
const now = () => performance.now()

// 통과해야 할 체크포인트(순서대로) — 루프 형태
const CHECKPOINTS = [
  { x: 90, y: 250 },
  { x: 90, y: 70 },
  { x: 370, y: 70 },
  { x: 370, y: 250 },
  { x: 230, y: 250 },
]

function freshGame() {
  return {
    car: { x: CHECKPOINTS[0].x, y: CHECKPOINTS[0].y, angle: -Math.PI / 2, vx: 0, vy: 0 },
    cp: 0,
    startTime: null,
  }
}

function CarRace() {
  const canvasRef = useRef(null)
  const gRef = useRef(null)
  const keysRef = useRef({})
  const [status, setStatus] = useState('ready') // ready | playing | finished
  const [cp, setCp] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [finalMs, setFinalMs] = useState(0)
  const [round, setRound] = useState(0)

  function start() {
    gRef.current = freshGame()
    keysRef.current = {}
    setCp(0)
    setElapsed(0)
    setFinalMs(0)
    setStatus('playing')
    setRound((r) => r + 1)
  }

  useEffect(() => {
    const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }
    const down = (e) => {
      const k = map[e.key]
      if (!k) return
      keysRef.current[k] = true
      e.preventDefault()
    }
    const up = (e) => {
      const k = map[e.key]
      if (k) keysRef.current[k] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  function update(dt) {
    const g = gRef.current
    if (!g) return
    const c = g.car
    const keys = keysRef.current

    // 첫 가속에 타이머 시작
    if (g.startTime === null && (keys.up || keys.down)) g.startTime = now()

    // 헤딩/측면 벡터
    const hx = Math.cos(c.angle)
    const hy = Math.sin(c.angle)
    const rx = -hy
    const ry = hx
    let fwd = c.vx * hx + c.vy * hy
    let lat = c.vx * rx + c.vy * ry

    if (keys.up) fwd += ACCEL * dt
    if (keys.down) fwd -= BRAKE * dt
    fwd = Math.max(-MAX_FWD / 2, Math.min(MAX_FWD, fwd))
    fwd *= Math.exp(-DRAG * dt)
    lat *= Math.exp(-GRIP * dt) // 측면 속도 감쇠 = 접지력

    // 속도에 비례한 조향
    const steerAmt = STEER * dt * Math.max(-1, Math.min(1, fwd / 80))
    if (keys.left) c.angle -= steerAmt
    if (keys.right) c.angle += steerAmt

    c.vx = hx * fwd + rx * lat
    c.vy = hy * fwd + ry * lat
    c.x += c.vx * dt
    c.y += c.vy * dt

    // 벽 반사
    if (c.x < 16) { c.x = 16; c.vx *= -0.4 }
    else if (c.x > W - 16) { c.x = W - 16; c.vx *= -0.4 }
    if (c.y < 16) { c.y = 16; c.vy *= -0.4 }
    else if (c.y > H - 16) { c.y = H - 16; c.vy *= -0.4 }

    // 체크포인트 통과
    const target = CHECKPOINTS[g.cp]
    if (Math.hypot(c.x - target.x, c.y - target.y) < CP_R) {
      g.cp += 1
      setCp(g.cp)
      if (g.cp >= CHECKPOINTS.length) {
        const ms = Math.round(now() - (g.startTime ?? now()))
        setFinalMs(ms)
        setStatus('finished')
        draw()
        return
      }
    }

    if (g.startTime !== null) setElapsed(now() - g.startTime)
    draw()
  }

  function draw() {
    const canvas = canvasRef.current
    const g = gRef.current
    if (!canvas || !g) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#374151'
    ctx.fillRect(0, 0, W, H)

    // 체크포인트
    CHECKPOINTS.forEach((p, i) => {
      const passed = i < g.cp
      const current = i === g.cp
      ctx.beginPath()
      ctx.arc(p.x, p.y, CP_R, 0, Math.PI * 2)
      ctx.fillStyle = current ? 'rgba(250,204,21,0.35)' : passed ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.08)'
      ctx.fill()
      ctx.strokeStyle = current ? '#facc15' : passed ? '#4ade80' : '#6b7280'
      ctx.stroke()
      ctx.fillStyle = '#e5e7eb'
      ctx.font = '13px system-ui'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(i + 1), p.x, p.y)
    })

    // 자동차
    const c = g.car
    ctx.save()
    ctx.translate(c.x, c.y)
    ctx.rotate(c.angle)
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(-12, -7, 24, 14)
    ctx.fillStyle = '#111827'
    ctx.fillRect(6, -7, 5, 14) // 앞쪽 표시
    ctx.restore()
  }

  useGameLoop(update, status === 'playing')

  useEffect(() => {
    if (status === 'ready' || status === 'finished') {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#374151'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#fff'
      ctx.font = '20px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(
        status === 'finished' ? `🏁 ${(finalMs / 1000).toFixed(2)}초` : '🏎️ 타임 트라이얼',
        W / 2,
        H / 2,
      )
    }
  }, [status, finalMs])

  return (
    <div className="game">
      <p className="game-message">
        체크포인트 {Math.min(cp, CHECKPOINTS.length)}/{CHECKPOINTS.length} ·{' '}
        {status === 'finished' ? (finalMs / 1000).toFixed(2) : (elapsed / 1000).toFixed(2)}초
      </p>
      <canvas ref={canvasRef} width={W} height={H} className="canvas-game" />

      <div className="pac-pad">
        <button
          type="button"
          onPointerDown={() => { keysRef.current.up = true }}
          onPointerUp={() => { keysRef.current.up = false }}
          onPointerLeave={() => { keysRef.current.up = false }}
        >▲</button>
        <div>
          <button
            type="button"
            onPointerDown={() => { keysRef.current.left = true }}
            onPointerUp={() => { keysRef.current.left = false }}
            onPointerLeave={() => { keysRef.current.left = false }}
          >◀</button>
          <button
            type="button"
            onPointerDown={() => { keysRef.current.down = true }}
            onPointerUp={() => { keysRef.current.down = false }}
            onPointerLeave={() => { keysRef.current.down = false }}
          >▼</button>
          <button
            type="button"
            onPointerDown={() => { keysRef.current.right = true }}
            onPointerUp={() => { keysRef.current.right = false }}
            onPointerLeave={() => { keysRef.current.right = false }}
          >▶</button>
        </div>
      </div>

      <p className="game-info">방향키로 운전 · 번호 순서대로 체크포인트 통과</p>
      <button type="button" className="game-reset" onClick={start}>
        {status === 'playing' ? '다시 시작' : '게임 시작'}
      </button>
      <ScorePanel key={round} gameId="car-race" score={finalMs} active={status === 'finished'} order="asc" unit=" ms" />
    </div>
  )
}

export default CarRace
