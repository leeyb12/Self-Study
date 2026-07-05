import { useRef, useState, useEffect } from 'react'
import { useGameLoop } from '../hooks/useGameLoop.js'
import ScorePanel from '../components/ScorePanel.jsx'
import Difficulty from '../components/Difficulty.jsx'

const DIFFICULTIES = [
  { label: '쉬움', value: 0.8 },
  { label: '보통', value: 1.0 },
  { label: '어려움', value: 1.35 },
]

const W = 400
const H = 300
const PADDLE_W = 70
const PADDLE_H = 10
const PADDLE_Y = H - 20
const BALL_R = 6
const ROWS = 4
const COLS = 7
const BRICK_H = 16
const BRICK_GAP = 6
const BRICK_TOP = 30
const PADDLE_SPEED = 320
const BRICK_W = (W - BRICK_GAP * (COLS + 1)) / COLS
const ROW_COLORS = ['#f65e3b', '#f59563', '#edc850', '#4ade80']

function makeBricks() {
  const bricks = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      bricks.push({
        x: BRICK_GAP + c * (BRICK_W + BRICK_GAP),
        y: BRICK_TOP + r * (BRICK_H + BRICK_GAP),
        alive: true,
        color: ROW_COLORS[r],
      })
    }
  }
  return bricks
}

function freshBall(mult = 1) {
  return { x: W / 2, y: PADDLE_Y - BALL_R - 1, vx: 130 * mult, vy: -180 * mult }
}

function Breakout() {
  const canvasRef = useRef(null)
  const gRef = useRef(null)
  const keysRef = useRef({})
  const [status, setStatus] = useState('ready') // ready | playing | won | lost
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [round, setRound] = useState(0)
  const [mult, setMult] = useState(1.0) // 공 속도 배율(난이도)

  function init() {
    gRef.current = {
      paddleX: (W - PADDLE_W) / 2,
      ball: freshBall(mult),
      bricks: makeBricks(),
      score: 0,
      lives: 3,
      mult,
    }
  }

  function start() {
    init()
    setScore(0)
    setLives(3)
    setStatus('playing')
    setRound((r) => r + 1)
  }

  // 키보드 입력 추적
  useEffect(() => {
    const down = (e) => {
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        keysRef.current[e.key] = true
        e.preventDefault()
      }
    }
    const up = (e) => {
      keysRef.current[e.key] = false
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

    // 패들 이동 (키보드)
    if (keysRef.current.ArrowLeft) g.paddleX -= PADDLE_SPEED * dt
    if (keysRef.current.ArrowRight) g.paddleX += PADDLE_SPEED * dt
    g.paddleX = Math.max(0, Math.min(W - PADDLE_W, g.paddleX))

    const b = g.ball
    b.x += b.vx * dt
    b.y += b.vy * dt

    // 좌우 벽
    if (b.x - BALL_R < 0) { b.x = BALL_R; b.vx *= -1 }
    if (b.x + BALL_R > W) { b.x = W - BALL_R; b.vx *= -1 }
    // 천장
    if (b.y - BALL_R < 0) { b.y = BALL_R; b.vy *= -1 }

    // 패들 충돌
    if (
      b.vy > 0 &&
      b.y + BALL_R >= PADDLE_Y &&
      b.y + BALL_R <= PADDLE_Y + PADDLE_H &&
      b.x >= g.paddleX &&
      b.x <= g.paddleX + PADDLE_W
    ) {
      b.y = PADDLE_Y - BALL_R
      b.vy *= -1
      // 패들 어디에 맞았는지에 따라 각도 변화
      const hit = (b.x - (g.paddleX + PADDLE_W / 2)) / (PADDLE_W / 2)
      b.vx = hit * 200 * g.mult
    }

    // 벽돌 충돌
    for (const brick of g.bricks) {
      if (!brick.alive) continue
      if (
        b.x + BALL_R > brick.x &&
        b.x - BALL_R < brick.x + BRICK_W &&
        b.y + BALL_R > brick.y &&
        b.y - BALL_R < brick.y + BRICK_H
      ) {
        brick.alive = false
        b.vy *= -1
        g.score += 10
        setScore(g.score)
        break
      }
    }

    // 바닥 아래로 떨어짐 → 목숨 감소
    if (b.y - BALL_R > H) {
      g.lives -= 1
      setLives(g.lives)
      if (g.lives <= 0) {
        setStatus('lost')
        return
      }
      g.ball = freshBall(g.mult)
      g.paddleX = (W - PADDLE_W) / 2
    }

    // 클리어 판정
    if (g.bricks.every((br) => !br.alive)) {
      setStatus('won')
    }

    draw()
  }

  function draw() {
    const canvas = canvasRef.current
    const g = gRef.current
    if (!canvas || !g) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#0f1117'
    ctx.fillRect(0, 0, W, H)

    // 벽돌
    for (const brick of g.bricks) {
      if (!brick.alive) continue
      ctx.fillStyle = brick.color
      ctx.fillRect(brick.x, brick.y, BRICK_W, BRICK_H)
    }
    // 패들
    ctx.fillStyle = '#e5e7eb'
    ctx.fillRect(g.paddleX, PADDLE_Y, PADDLE_W, PADDLE_H)
    // 공
    ctx.beginPath()
    ctx.arc(g.ball.x, g.ball.y, BALL_R, 0, Math.PI * 2)
    ctx.fillStyle = '#c084fc'
    ctx.fill()
  }

  useGameLoop(update, status === 'playing')

  // 게임 시작 전/후 안내 화면 그리기
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
      const msg =
        status === 'won' ? '🎉 클리어!' : status === 'lost' ? '💥 게임 오버' : '벽돌 깨기'
      ctx.fillText(msg, W / 2, H / 2)
    }
  }, [status])

  return (
    <div className="game">
      <p className="game-message">
        점수: {score} · 목숨: {'❤️'.repeat(Math.max(0, lives))}
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
          const x = ((e.clientX - rect.left) / rect.width) * W
          g.paddleX = Math.max(0, Math.min(W - PADDLE_W, x - PADDLE_W / 2))
        }}
      />
      <p className="game-info">마우스 또는 ← → 로 패들 조작</p>
      <Difficulty
        value={mult}
        onChange={setMult}
        options={DIFFICULTIES}
        disabled={status === 'playing'}
      />
      <button type="button" className="game-reset" onClick={start}>
        {status === 'playing' ? '다시 시작' : '게임 시작'}
      </button>
      <ScorePanel
        key={round}
        gameId={`breakout-${mult}`}
        score={score}
        active={status === 'won' || status === 'lost'}
      />
    </div>
  )
}

export default Breakout
