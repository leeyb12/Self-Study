import { useRef, useState, useEffect } from 'react'
import { useGameLoop } from '../hooks/useGameLoop.js'
import ScorePanel from '../components/ScorePanel.jsx'
import Difficulty from '../components/Difficulty.jsx'

const DIFFICULTIES = [
  { label: '쉬움', value: 1.4 },
  { label: '보통', value: 1.1 },
  { label: '어려움', value: 0.8 },
]

const W = 360
const H = 480
const PLAYER_W = 30
const PLAYER_Y = H - 50
const PLAYER_SPEED = 260
const BULLET_SPEED = 420
const ENEMY_W = 28
const ENEMY_SPEED = 90
const FIRE_COOLDOWN = 0.28

function randomEnemyX() {
  return ENEMY_W / 2 + Math.random() * (W - ENEMY_W)
}

function freshGame(spawnInterval = 1.1) {
  return {
    playerX: W / 2,
    bullets: [],
    enemies: [],
    spawnTimer: 0,
    spawnInterval,
    fireTimer: 0,
    score: 0,
  }
}

function ScrollShooter() {
  const canvasRef = useRef(null)
  const gRef = useRef(null)
  const keysRef = useRef({})
  const [status, setStatus] = useState('ready') // ready | playing | over
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [round, setRound] = useState(0)
  const [spawn, setSpawn] = useState(1.1) // 시작 스폰 간격(난이도)

  function start() {
    gRef.current = freshGame(spawn)
    keysRef.current = {}
    setScore(0)
    setStatus('playing')
    setRound((r) => r + 1)
  }

  useEffect(() => {
    const map = { ArrowLeft: 'left', ArrowRight: 'right', ' ': 'fire' }
    const keyOf = (e) => map[e.key] || (e.code === 'Space' ? 'fire' : null)
    const down = (e) => {
      const k = keyOf(e)
      if (!k) return
      keysRef.current[k] = true
      e.preventDefault()
    }
    const up = (e) => {
      const k = keyOf(e)
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
    const keys = keysRef.current

    // 이동
    if (keys.left) g.playerX -= PLAYER_SPEED * dt
    if (keys.right) g.playerX += PLAYER_SPEED * dt
    g.playerX = Math.max(PLAYER_W / 2, Math.min(W - PLAYER_W / 2, g.playerX))

    // 발사 (쿨다운)
    g.fireTimer -= dt
    if (keys.fire && g.fireTimer <= 0) {
      g.bullets.push({ x: g.playerX, y: PLAYER_Y })
      g.fireTimer = FIRE_COOLDOWN
    }

    // 총알 이동
    g.bullets.forEach((b) => { b.y -= BULLET_SPEED * dt })
    g.bullets = g.bullets.filter((b) => b.y > -10)

    // 적 스폰
    g.spawnTimer += dt
    if (g.spawnTimer >= g.spawnInterval) {
      g.spawnTimer = 0
      g.spawnInterval = Math.max(0.4, g.spawnInterval - 0.02)
      g.enemies.push({ x: randomEnemyX(), y: -ENEMY_W })
    }

    // 적 이동
    g.enemies.forEach((en) => { en.y += ENEMY_SPEED * dt })

    // 총알-적 충돌
    for (const en of g.enemies) {
      for (const b of g.bullets) {
        if (Math.abs(b.x - en.x) < ENEMY_W / 2 && Math.abs(b.y - en.y) < ENEMY_W / 2) {
          en.dead = true
          b.dead = true
          g.score += 1
          setScore(g.score)
        }
      }
    }
    g.bullets = g.bullets.filter((b) => !b.dead)
    g.enemies = g.enemies.filter((en) => !en.dead)

    // 적이 바닥 도달 또는 플레이어 충돌 → 게임오버
    for (const en of g.enemies) {
      const hitPlayer =
        Math.abs(en.x - g.playerX) < (ENEMY_W + PLAYER_W) / 2 &&
        Math.abs(en.y - PLAYER_Y) < (ENEMY_W + PLAYER_W) / 2
      if (en.y > H || hitPlayer) {
        setBest((bst) => Math.max(bst, g.score))
        setStatus('over')
        return
      }
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
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // 총알
    ctx.fillStyle = '#facc15'
    g.bullets.forEach((b) => ctx.fillRect(b.x - 2, b.y - 8, 4, 12))

    // 적
    ctx.font = '24px system-ui'
    g.enemies.forEach((en) => ctx.fillText('👾', en.x, en.y))

    // 플레이어
    ctx.font = '28px system-ui'
    ctx.fillText('🚀', g.playerX, PLAYER_Y)
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
      ctx.fillText(status === 'over' ? '💥 격추당했다!' : '스크롤 슈터', W / 2, H / 2)
    }
  }, [status])

  return (
    <div className="game">
      <p className="game-message">점수: {score} · 최고: {best}</p>
      <canvas ref={canvasRef} width={W} height={H} className="canvas-game" />

      <div className="tetris-pad">
        <button
          type="button"
          onPointerDown={() => { keysRef.current.left = true }}
          onPointerUp={() => { keysRef.current.left = false }}
          onPointerLeave={() => { keysRef.current.left = false }}
        >◀</button>
        <button
          type="button"
          onPointerDown={() => { keysRef.current.fire = true }}
          onPointerUp={() => { keysRef.current.fire = false }}
          onPointerLeave={() => { keysRef.current.fire = false }}
        >🔫</button>
        <button
          type="button"
          onPointerDown={() => { keysRef.current.right = true }}
          onPointerUp={() => { keysRef.current.right = false }}
          onPointerLeave={() => { keysRef.current.right = false }}
        >▶</button>
      </div>

      <p className="game-info">← → 이동 · Space 발사</p>
      <Difficulty
        value={spawn}
        onChange={setSpawn}
        options={DIFFICULTIES}
        disabled={status === 'playing'}
      />
      <button type="button" className="game-reset" onClick={start}>
        {status === 'playing' ? '다시 시작' : '게임 시작'}
      </button>
      <ScorePanel key={round} gameId={`shooter-${spawn}`} score={score} active={status === 'over'} />
    </div>
  )
}

export default ScrollShooter
