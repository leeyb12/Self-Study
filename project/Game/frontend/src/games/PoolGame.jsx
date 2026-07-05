import { useRef, useState, useEffect } from 'react'
import { useGameLoop } from '../hooks/useGameLoop.js'
import ScorePanel from '../components/ScorePanel.jsx'

const W = 440
const H = 240
const RAIL = 20 // 쿠션 두께
const R = 9 // 공 반지름
const POCKET = 15 // 포켓 반지름
const FRICTION = 1.1 // 마찰 계수(초당 감속)
const STOP = 6 // 이 속도 이하이면 정지로 간주
const MAX_PULL = 120 // 최대 당김 거리
const MAX_SPEED = 820
const SUBSTEPS = 4

const LEFT = RAIL + R
const RIGHT = W - RAIL - R
const TOP = RAIL + R
const BOTTOM = H - RAIL - R
const CY = H / 2
const CUE_START = { x: RAIL + 80, y: CY }

const OBJECT_COLORS = ['#f6c945', '#e53935', '#8e24aa', '#1e88e5', '#fb8c00', '#43a047']

const POCKETS = [
  { x: RAIL, y: RAIL },
  { x: W / 2, y: RAIL - 2 },
  { x: W - RAIL, y: RAIL },
  { x: RAIL, y: H - RAIL },
  { x: W / 2, y: H - RAIL + 2 },
  { x: W - RAIL, y: H - RAIL },
]

function rackBalls() {
  // 큐볼 + 삼각 배치된 오브젝트 볼 6개
  const balls = [{ x: CUE_START.x, y: CUE_START.y, vx: 0, vy: 0, cue: true, sunk: false }]
  const apexX = W - RAIL - 70
  let idx = 0
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i <= row; i++) {
      balls.push({
        x: apexX + row * (R * 1.9),
        y: CY + (i - row / 2) * (R * 2.05),
        vx: 0,
        vy: 0,
        cue: false,
        sunk: false,
        color: OBJECT_COLORS[idx++],
      })
    }
  }
  return balls
}

function speed(b) {
  return Math.hypot(b.vx, b.vy)
}

function allStopped(balls) {
  return balls.every((b) => b.sunk || (b.vx === 0 && b.vy === 0))
}

// 벽 반사 + 포켓 흡수 (한 서브스텝)
function integrate(balls, dt) {
  for (const b of balls) {
    if (b.sunk) continue
    b.x += b.vx * dt
    b.y += b.vy * dt

    // 포켓에 빠졌는지
    let pocketed = false
    for (const p of POCKETS) {
      if (Math.hypot(b.x - p.x, b.y - p.y) < POCKET) {
        pocketed = true
        break
      }
    }
    if (pocketed) {
      b.sunk = true
      b.vx = 0
      b.vy = 0
      continue
    }

    // 쿠션 반사
    if (b.x < LEFT) { b.x = LEFT; b.vx = -b.vx * 0.92 }
    else if (b.x > RIGHT) { b.x = RIGHT; b.vx = -b.vx * 0.92 }
    if (b.y < TOP) { b.y = TOP; b.vy = -b.vy * 0.92 }
    else if (b.y > BOTTOM) { b.y = BOTTOM; b.vy = -b.vy * 0.92 }
  }

  // 공끼리 탄성 충돌 (동일 질량)
  for (let i = 0; i < balls.length; i++) {
    const a = balls[i]
    if (a.sunk) continue
    for (let j = i + 1; j < balls.length; j++) {
      const b = balls[j]
      if (b.sunk) continue
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy)
      if (dist > 0 && dist < 2 * R) {
        const nx = dx / dist
        const ny = dy / dist
        // 겹침 분리
        const overlap = 2 * R - dist
        a.x -= (nx * overlap) / 2
        a.y -= (ny * overlap) / 2
        b.x += (nx * overlap) / 2
        b.y += (ny * overlap) / 2
        // 법선 방향 속도 성분 교환(접근 중일 때만)
        const aN = a.vx * nx + a.vy * ny
        const bN = b.vx * nx + b.vy * ny
        if (bN - aN < 0) {
          const diff = bN - aN
          a.vx += diff * nx
          a.vy += diff * ny
          b.vx -= diff * nx
          b.vy -= diff * ny
        }
      }
    }
  }
}

function PoolGame() {
  const canvasRef = useRef(null)
  const gRef = useRef(null)
  const aimRef = useRef({ active: false, x: 0, y: 0 })
  const [status, setStatus] = useState('ready') // ready | playing | won
  const [shots, setShots] = useState(0)
  const [remaining, setRemaining] = useState(6)
  const [round, setRound] = useState(0)

  function start() {
    gRef.current = { balls: rackBalls() }
    aimRef.current = { active: false, x: 0, y: 0 }
    setShots(0)
    setRemaining(6)
    setStatus('playing')
    setRound((r) => r + 1)
  }

  function update(dt) {
    const g = gRef.current
    if (!g) return
    const balls = g.balls

    // 마찰
    const decay = Math.exp(-FRICTION * dt)
    for (const b of balls) {
      if (b.sunk) continue
      b.vx *= decay
      b.vy *= decay
      if (speed(b) < STOP) { b.vx = 0; b.vy = 0 }
    }

    // 서브스텝으로 이동/충돌 처리(고속 관통 방지)
    const sub = dt / SUBSTEPS
    for (let s = 0; s < SUBSTEPS; s++) integrate(balls, sub)

    // 스크래치: 큐볼이 빠졌고 모두 멈추면 되돌려 놓기
    const cue = balls[0]
    if (cue.sunk && balls.every((b) => b.cue || b.sunk || (b.vx === 0 && b.vy === 0))) {
      cue.sunk = false
      cue.x = CUE_START.x
      cue.y = CUE_START.y
      cue.vx = 0
      cue.vy = 0
    }

    const left = balls.filter((b) => !b.cue && !b.sunk).length
    setRemaining(left)
    if (left === 0) setStatus('won')

    draw()
  }

  function draw() {
    const canvas = canvasRef.current
    const g = gRef.current
    if (!canvas || !g) return
    const ctx = canvas.getContext('2d')

    // 테이블
    ctx.fillStyle = '#5b3a1e'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#2e7d32'
    ctx.fillRect(RAIL - 4, RAIL - 4, W - 2 * RAIL + 8, H - 2 * RAIL + 8)

    // 포켓
    ctx.fillStyle = '#0a0a0a'
    for (const p of POCKETS) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, POCKET, 0, Math.PI * 2)
      ctx.fill()
    }

    // 공
    for (const b of g.balls) {
      if (b.sunk) continue
      ctx.beginPath()
      ctx.arc(b.x, b.y, R, 0, Math.PI * 2)
      ctx.fillStyle = b.cue ? '#fafafa' : b.color
      ctx.fill()
      ctx.strokeStyle = 'rgba(0,0,0,0.25)'
      ctx.stroke()
    }

    // 조준선 (당긴 반대 방향으로 발사)
    const cue = g.balls[0]
    if (aimRef.current.active && !cue.sunk) {
      const dx = cue.x - aimRef.current.x
      const dy = cue.y - aimRef.current.y
      const len = Math.min(Math.hypot(dx, dy), MAX_PULL)
      const ang = Math.atan2(dy, dx)
      ctx.strokeStyle = 'rgba(255,255,255,0.7)'
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(cue.x, cue.y)
      ctx.lineTo(cue.x + Math.cos(ang) * len * 1.5, cue.y + Math.sin(ang) * len * 1.5)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }

  useGameLoop(update, status === 'playing')

  // ready / won 화면
  useEffect(() => {
    if (status !== 'playing') {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#5b3a1e'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#2e7d32'
      ctx.fillRect(RAIL - 4, RAIL - 4, W - 2 * RAIL + 8, H - 2 * RAIL + 8)
      ctx.fillStyle = '#fff'
      ctx.font = '20px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(status === 'won' ? '🎉 클리어!' : '🎱 당구', W / 2, H / 2)
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
    const g = gRef.current
    if (!g || status !== 'playing' || !allStopped(g.balls) || g.balls[0].sunk) return
    const pos = canvasPos(e)
    aimRef.current = { active: true, x: pos.x, y: pos.y }
  }

  function onMove(e) {
    if (!aimRef.current.active) return
    const pos = canvasPos(e)
    aimRef.current = { active: true, x: pos.x, y: pos.y }
  }

  function onUp() {
    const g = gRef.current
    if (!g || !aimRef.current.active) return
    aimRef.current.active = false
    const cue = g.balls[0]
    const dx = cue.x - aimRef.current.x
    const dy = cue.y - aimRef.current.y
    const pull = Math.min(Math.hypot(dx, dy), MAX_PULL)
    if (pull < 6) return
    const ang = Math.atan2(dy, dx)
    const power = (pull / MAX_PULL) * MAX_SPEED
    cue.vx = Math.cos(ang) * power
    cue.vy = Math.sin(ang) * power
    setShots((s) => s + 1)
  }

  return (
    <div className="game">
      <p className="game-message">샷: {shots} · 남은 공: {remaining}</p>
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
      <p className="game-info">큐볼을 드래그해 반대 방향으로 발사 (당길수록 세게)</p>
      <button type="button" className="game-reset" onClick={start}>
        {status === 'playing' ? '다시 놓기' : '게임 시작'}
      </button>
      <ScorePanel
        key={round}
        gameId="pool"
        score={shots}
        active={status === 'won'}
        order="asc"
        unit="샷"
      />
    </div>
  )
}

export default PoolGame
