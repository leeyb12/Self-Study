import { useRef, useState, useEffect } from 'react'
import { useGameLoop } from '../hooks/useGameLoop.js'
import ScorePanel from '../components/ScorePanel.jsx'

const W = 280
const H = 440
const LANE_L = 30
const LANE_R = W - 30
const BALL_R = 12
const PIN_R = 8
const BALL_MASS = 4
const PIN_MASS = 1
const FRICTION = 0.9
const STOP = 6
const MAX_PULL = 120
const MAX_SPEED = 900
const SUBSTEPS = 4

function rack() {
  // 볼링공 + 10핀 삼각 배치 (앞핀이 볼러 쪽)
  const ball = { x: W / 2, y: H - 40, vx: 0, vy: 0, r: BALL_R, m: BALL_MASS, pin: false }
  const pins = []
  for (let row = 0; row < 4; row++) {
    for (let i = 0; i <= row; i++) {
      const x = W / 2 + (i - row / 2) * 24
      const y = 150 - row * 26
      pins.push({ x, y, x0: x, y0: y, vx: 0, vy: 0, r: PIN_R, m: PIN_MASS, pin: true })
    }
  }
  return { ball, pins }
}

function collide(a, b) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const dist = Math.hypot(dx, dy)
  const minD = a.r + b.r
  if (dist <= 0 || dist >= minD) return
  const nx = dx / dist
  const ny = dy / dist
  // 겹침 분리 (질량 반비례)
  const overlap = minD - dist
  const total = a.m + b.m
  a.x -= nx * overlap * (b.m / total)
  a.y -= ny * overlap * (b.m / total)
  b.x += nx * overlap * (a.m / total)
  b.y += ny * overlap * (a.m / total)
  // 법선 방향 1D 탄성 충돌(질량 반영)
  const aN = a.vx * nx + a.vy * ny
  const bN = b.vx * nx + b.vy * ny
  if (bN - aN >= 0) return // 접근 중이 아님
  const aN2 = (aN * (a.m - b.m) + 2 * b.m * bN) / total
  const bN2 = (bN * (b.m - a.m) + 2 * a.m * aN) / total
  a.vx += (aN2 - aN) * nx
  a.vy += (aN2 - aN) * ny
  b.vx += (bN2 - bN) * nx
  b.vy += (bN2 - bN) * ny
}

function Bowling() {
  const canvasRef = useRef(null)
  const gRef = useRef(null)
  const aimRef = useRef({ active: false, x: 0, y: 0 })
  const thrownRef = useRef(false)
  const [status, setStatus] = useState('ready') // ready | playing
  const [done, setDone] = useState(false)
  const [knocked, setKnocked] = useState(0)
  const [round, setRound] = useState(0)

  function start() {
    gRef.current = rack()
    aimRef.current = { active: false, x: 0, y: 0 }
    thrownRef.current = false
    setDone(false)
    setKnocked(0)
    setStatus('playing')
    setRound((r) => r + 1)
  }

  const all = (g) => [g.ball, ...g.pins]

  function update(dt) {
    const g = gRef.current
    if (!g) return
    const balls = all(g)

    const decay = Math.exp(-FRICTION * dt)
    for (const b of balls) {
      b.vx *= decay
      b.vy *= decay
      if (Math.hypot(b.vx, b.vy) < STOP) { b.vx = 0; b.vy = 0 }
    }

    const sub = dt / SUBSTEPS
    for (let s = 0; s < SUBSTEPS; s++) {
      for (const b of balls) {
        b.x += b.vx * sub
        b.y += b.vy * sub
        // 레인 벽/상단 반사
        if (b.x < LANE_L + b.r) { b.x = LANE_L + b.r; b.vx = -b.vx * 0.8 }
        else if (b.x > LANE_R - b.r) { b.x = LANE_R - b.r; b.vx = -b.vx * 0.8 }
        if (b.y < b.r) { b.y = b.r; b.vy = -b.vy * 0.8 }
      }
      for (let i = 0; i < balls.length; i++)
        for (let j = i + 1; j < balls.length; j++) collide(balls[i], balls[j])
    }

    // 던진 뒤 모두 멈추면 쓰러진 핀 집계
    if (thrownRef.current && balls.every((b) => b.vx === 0 && b.vy === 0)) {
      const down = g.pins.filter((p) => Math.hypot(p.x - p.x0, p.y - p.y0) > 8).length
      setKnocked(down)
      setDone(true)
    }

    draw()
  }

  function draw() {
    const canvas = canvasRef.current
    const g = gRef.current
    if (!canvas || !g) return
    const ctx = canvas.getContext('2d')
    // 거터 + 레인
    ctx.fillStyle = '#1f2937'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#c8a06a'
    ctx.fillRect(LANE_L, 0, LANE_R - LANE_L, H)

    for (const p of g.pins) {
      const down = Math.hypot(p.x - p.x0, p.y - p.y0) > 8
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = down ? '#9ca3af' : '#fff'
      ctx.fill()
      ctx.strokeStyle = '#ef4444'
      ctx.stroke()
    }
    const b = g.ball
    ctx.beginPath()
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
    ctx.fillStyle = '#111827'
    ctx.fill()

    // 조준선
    if (aimRef.current.active && !thrownRef.current) {
      const dx = b.x - aimRef.current.x
      const dy = b.y - aimRef.current.y
      const len = Math.min(Math.hypot(dx, dy), MAX_PULL)
      const ang = Math.atan2(dy, dx)
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(b.x, b.y)
      ctx.lineTo(b.x + Math.cos(ang) * len * 1.5, b.y + Math.sin(ang) * len * 1.5)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }

  useGameLoop(update, status === 'playing' && !done)

  useEffect(() => {
    if (status === 'ready') {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#c8a06a'
      ctx.fillRect(LANE_L, 0, LANE_R - LANE_L, H)
      ctx.fillStyle = '#111827'
      ctx.font = '22px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('🎳 볼링', W / 2, H / 2)
    }
  }, [status])

  function canvasPos(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H,
    }
  }
  function onDown(e) {
    if (status !== 'playing' || thrownRef.current) return
    aimRef.current = { active: true, ...canvasPos(e) }
  }
  function onMove(e) {
    if (!aimRef.current.active) return
    aimRef.current = { active: true, ...canvasPos(e) }
  }
  function onUp() {
    const g = gRef.current
    if (!g || !aimRef.current.active) return
    aimRef.current.active = false
    const dx = g.ball.x - aimRef.current.x
    const dy = g.ball.y - aimRef.current.y
    const pull = Math.min(Math.hypot(dx, dy), MAX_PULL)
    if (pull < 8) return
    const ang = Math.atan2(dy, dx)
    const power = (pull / MAX_PULL) * MAX_SPEED
    g.ball.vx = Math.cos(ang) * power
    g.ball.vy = Math.sin(ang) * power
    thrownRef.current = true
  }

  return (
    <div className="game">
      <p className="game-message">
        {done ? `🎳 ${knocked} / 10 핀!` : '핀을 향해 공을 굴리세요'}
      </p>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="canvas-game"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      />
      <p className="game-info">공을 드래그해 반대 방향으로 발사</p>
      <button type="button" className="game-reset" onClick={start}>
        {status === 'playing' ? '다시 놓기' : '게임 시작'}
      </button>
      <ScorePanel key={round} gameId="bowling" score={knocked} active={done} unit="핀" />
    </div>
  )
}

export default Bowling
