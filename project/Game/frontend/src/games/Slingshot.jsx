import { useRef, useState, useEffect } from 'react'
import { useGameLoop } from '../hooks/useGameLoop.js'
import ScorePanel from '../components/ScorePanel.jsx'

const W = 460
const H = 300
const GROUND = 270
const ANCHOR = { x: 70, y: 190 }
const BIRD_R = 12
const GRAVITY = 1100
const MAX_PULL = 90
const LAUNCH_K = 9
const TOTAL_BIRDS = 5

const TARGET_LAYOUT = [
  { x: 330, y: GROUND - 16, r: 16 },
  { x: 370, y: GROUND - 16, r: 16 },
  { x: 410, y: GROUND - 16, r: 16 },
  { x: 350, y: GROUND - 48, r: 16 },
  { x: 390, y: GROUND - 48, r: 16 },
  { x: 370, y: GROUND - 80, r: 16 },
]

function freshGame() {
  return {
    bird: { x: ANCHOR.x, y: ANCHOR.y, vx: 0, vy: 0, r: BIRD_R, flying: false },
    targets: TARGET_LAYOUT.map((t) => ({ ...t, alive: true })),
    birdsLeft: TOTAL_BIRDS,
  }
}

function Slingshot() {
  const canvasRef = useRef(null)
  const gRef = useRef(null)
  const aimRef = useRef({ active: false, x: 0, y: 0 })
  const [status, setStatus] = useState('ready') // ready | playing | won | lost
  const [shots, setShots] = useState(0)
  const [info, setInfo] = useState({ birds: TOTAL_BIRDS, targets: TARGET_LAYOUT.length })
  const [round, setRound] = useState(0)

  function start() {
    gRef.current = freshGame()
    aimRef.current = { active: false, x: 0, y: 0 }
    setShots(0)
    setInfo({ birds: TOTAL_BIRDS, targets: TARGET_LAYOUT.length })
    setStatus('playing')
    setRound((r) => r + 1)
  }

  function update(dt) {
    const g = gRef.current
    if (!g) return
    const bird = g.bird
    if (!bird.flying) {
      draw()
      return
    }

    bird.vy += GRAVITY * dt
    bird.x += bird.vx * dt
    bird.y += bird.vy * dt

    // 목표물 충돌
    let hitCount = 0
    for (const t of g.targets) {
      if (!t.alive) continue
      if (Math.hypot(bird.x - t.x, bird.y - t.y) < bird.r + t.r) {
        t.alive = false
        hitCount++
      }
    }
    const targetsLeft = g.targets.filter((t) => t.alive).length
    if (hitCount > 0) setInfo((prev) => ({ ...prev, targets: targetsLeft }))
    if (targetsLeft === 0) {
      setStatus('won')
      draw()
      return
    }

    // 착지 / 화면 밖 → 다음 새 준비
    if (bird.y > GROUND - bird.r || bird.x > W + 40 || bird.x < -40) {
      bird.flying = false
      bird.x = ANCHOR.x
      bird.y = ANCHOR.y
      bird.vx = 0
      bird.vy = 0
      if (g.birdsLeft <= 0) setStatus('lost')
    }

    draw()
  }

  function draw() {
    const canvas = canvasRef.current
    const g = gRef.current
    if (!canvas || !g) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#87ceeb'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#6b8e23'
    ctx.fillRect(0, GROUND, W, H - GROUND)

    // 새총 기둥
    ctx.strokeStyle = '#5b3a1e'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(ANCHOR.x, GROUND)
    ctx.lineTo(ANCHOR.x, ANCHOR.y)
    ctx.stroke()
    ctx.lineWidth = 1

    // 목표물
    for (const t of g.targets) {
      if (!t.alive) continue
      ctx.beginPath()
      ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2)
      ctx.fillStyle = '#2e8b57'
      ctx.fill()
      ctx.strokeStyle = '#1b5e20'
      ctx.stroke()
    }

    // 새 + 당김 밴드
    const bird = g.bird
    let bx = bird.x
    let by = bird.y
    if (aimRef.current.active && !bird.flying) {
      const dx = aimRef.current.x - ANCHOR.x
      const dy = aimRef.current.y - ANCHOR.y
      const len = Math.min(Math.hypot(dx, dy), MAX_PULL)
      const ang = Math.atan2(dy, dx)
      bx = ANCHOR.x + Math.cos(ang) * len
      by = ANCHOR.y + Math.sin(ang) * len
      ctx.strokeStyle = 'rgba(0,0,0,0.4)'
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(ANCHOR.x, ANCHOR.y)
      ctx.lineTo(bx, by)
      ctx.stroke()
      ctx.setLineDash([])
    }
    ctx.beginPath()
    ctx.arc(bx, by, bird.r, 0, Math.PI * 2)
    ctx.fillStyle = '#e53935'
    ctx.fill()
  }

  useGameLoop(update, status === 'playing')

  useEffect(() => {
    if (status === 'ready' || status === 'won' || status === 'lost') {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#87ceeb'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#333'
      ctx.font = '22px system-ui'
      ctx.textAlign = 'center'
      const msg =
        status === 'won' ? '🎉 클리어!' : status === 'lost' ? '💥 새 소진!' : '🐦 새총'
      ctx.fillText(msg, W / 2, H / 2)
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
    if (!g || status !== 'playing' || g.bird.flying || g.birdsLeft <= 0) return
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
    const dx = ANCHOR.x - aimRef.current.x
    const dy = ANCHOR.y - aimRef.current.y
    const pull = Math.min(Math.hypot(dx, dy), MAX_PULL)
    if (pull < 8) return
    const ang = Math.atan2(dy, dx)
    g.bird.x = ANCHOR.x
    g.bird.y = ANCHOR.y
    g.bird.vx = Math.cos(ang) * pull * LAUNCH_K
    g.bird.vy = Math.sin(ang) * pull * LAUNCH_K
    g.bird.flying = true
    g.birdsLeft -= 1
    setShots((s) => s + 1)
    setInfo((prev) => ({ ...prev, birds: g.birdsLeft }))
  }

  return (
    <div className="game">
      <p className="game-message">🐦 {info.birds} · 🎯 {info.targets}</p>
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
      <p className="game-info">새를 뒤로 당겨 발사해 목표물을 맞히세요</p>
      <button type="button" className="game-reset" onClick={start}>
        {status === 'playing' ? '다시 시작' : '게임 시작'}
      </button>
      <ScorePanel
        key={round}
        gameId="slingshot"
        score={shots}
        active={status === 'won'}
        order="asc"
        unit="발"
      />
    </div>
  )
}

export default Slingshot
