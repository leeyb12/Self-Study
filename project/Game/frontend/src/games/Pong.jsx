import { useRef, useState, useEffect } from 'react'
import { useGameLoop } from '../hooks/useGameLoop.js'
import Difficulty from '../components/Difficulty.jsx'

const W = 400
const H = 300
const PADDLE_W = 10
const PADDLE_H = 60
const BALL_R = 6
const PLAYER_X = 16
const AI_X = W - 16 - PADDLE_W
const WIN_SCORE = 5

const DIFFICULTIES = [
  { label: '쉬움', value: 150 },
  { label: '보통', value: 220 },
  { label: '어려움', value: 320 },
]

function freshBall(dir) {
  return {
    x: W / 2,
    y: H / 2,
    vx: 200 * (dir ?? (Math.random() < 0.5 ? 1 : -1)),
    vy: (Math.random() * 2 - 1) * 140,
  }
}

function Pong() {
  const canvasRef = useRef(null)
  const gRef = useRef(null)
  const keysRef = useRef({})
  const aiSpeedRef = useRef(220)
  const [status, setStatus] = useState('ready') // ready | playing | over
  const [score, setScore] = useState({ p: 0, ai: 0 })
  const [winner, setWinner] = useState('')
  const [aiSpeed, setAiSpeed] = useState(220)

  useEffect(() => {
    aiSpeedRef.current = aiSpeed
  }, [aiSpeed])

  function start() {
    gRef.current = {
      playerY: (H - PADDLE_H) / 2,
      aiY: (H - PADDLE_H) / 2,
      ball: freshBall(),
      p: 0,
      ai: 0,
    }
    setScore({ p: 0, ai: 0 })
    setWinner('')
    setStatus('playing')
  }

  useEffect(() => {
    const down = (e) => {
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        keysRef.current[e.key] = true
        e.preventDefault()
      }
    }
    const up = (e) => { keysRef.current[e.key] = false }
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

    // 플레이어 패들 (키보드)
    if (keysRef.current.ArrowUp) g.playerY -= 300 * dt
    if (keysRef.current.ArrowDown) g.playerY += 300 * dt
    g.playerY = Math.max(0, Math.min(H - PADDLE_H, g.playerY))

    // AI 패들: 공을 따라가되 속도 제한
    const target = g.ball.y - PADDLE_H / 2
    const diff = target - g.aiY
    const aiSp = aiSpeedRef.current
    g.aiY += Math.max(-aiSp * dt, Math.min(aiSp * dt, diff))
    g.aiY = Math.max(0, Math.min(H - PADDLE_H, g.aiY))

    const b = g.ball
    b.x += b.vx * dt
    b.y += b.vy * dt

    // 위아래 벽
    if (b.y - BALL_R < 0) { b.y = BALL_R; b.vy *= -1 }
    if (b.y + BALL_R > H) { b.y = H - BALL_R; b.vy *= -1 }

    // 플레이어 패들 충돌
    if (
      b.vx < 0 &&
      b.x - BALL_R <= PLAYER_X + PADDLE_W &&
      b.x - BALL_R >= PLAYER_X &&
      b.y >= g.playerY &&
      b.y <= g.playerY + PADDLE_H
    ) {
      b.x = PLAYER_X + PADDLE_W + BALL_R
      b.vx *= -1.05
      b.vy += ((b.y - (g.playerY + PADDLE_H / 2)) / (PADDLE_H / 2)) * 100
    }
    // AI 패들 충돌
    if (
      b.vx > 0 &&
      b.x + BALL_R >= AI_X &&
      b.x + BALL_R <= AI_X + PADDLE_W &&
      b.y >= g.aiY &&
      b.y <= g.aiY + PADDLE_H
    ) {
      b.x = AI_X - BALL_R
      b.vx *= -1.05
      b.vy += ((b.y - (g.aiY + PADDLE_H / 2)) / (PADDLE_H / 2)) * 100
    }

    // 득점
    if (b.x < 0) {
      g.ai += 1
      setScore({ p: g.p, ai: g.ai })
      if (g.ai >= WIN_SCORE) return endGame('AI 승리 😢')
      g.ball = freshBall(1)
    } else if (b.x > W) {
      g.p += 1
      setScore({ p: g.p, ai: g.ai })
      if (g.p >= WIN_SCORE) return endGame('🎉 승리!')
      g.ball = freshBall(-1)
    }

    draw()
  }

  function endGame(msg) {
    setWinner(msg)
    setStatus('over')
  }

  function draw() {
    const canvas = canvasRef.current
    const g = gRef.current
    if (!canvas || !g) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0f1117'
    ctx.fillRect(0, 0, W, H)

    // 가운데 점선
    ctx.strokeStyle = '#374151'
    ctx.setLineDash([6, 8])
    ctx.beginPath()
    ctx.moveTo(W / 2, 0)
    ctx.lineTo(W / 2, H)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = '#e5e7eb'
    ctx.fillRect(PLAYER_X, g.playerY, PADDLE_W, PADDLE_H)
    ctx.fillRect(AI_X, g.aiY, PADDLE_W, PADDLE_H)

    ctx.beginPath()
    ctx.arc(g.ball.x, g.ball.y, BALL_R, 0, Math.PI * 2)
    ctx.fillStyle = '#c084fc'
    ctx.fill()
  }

  useGameLoop(update, status === 'playing')

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
      ctx.fillText(status === 'over' ? winner : `퐁 · 먼저 ${WIN_SCORE}점`, W / 2, H / 2)
    }
  }, [status, winner])

  return (
    <div className="game">
      <p className="game-message">
        나 {score.p} : {score.ai} AI
      </p>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="canvas-game"
        onMouseMove={(e) => {
          const g = gRef.current
          if (!g || status !== 'playing') return
          const rect = e.currentTarget.getBoundingClientRect()
          const y = ((e.clientY - rect.top) / rect.height) * H
          g.playerY = Math.max(0, Math.min(H - PADDLE_H, y - PADDLE_H / 2))
        }}
      />
      <p className="game-info">마우스 또는 ↑ ↓ 로 왼쪽 패들 조작</p>
      <Difficulty
        value={aiSpeed}
        onChange={setAiSpeed}
        options={DIFFICULTIES}
        disabled={status === 'playing'}
      />
      <button type="button" className="game-reset" onClick={start}>
        {status === 'playing' ? '다시 시작' : '게임 시작'}
      </button>
    </div>
  )
}

export default Pong
