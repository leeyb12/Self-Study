import { useRef, useState, useEffect, useCallback } from 'react'
import { useGameLoop } from '../hooks/useGameLoop.js'
import ScorePanel from '../components/ScorePanel.jsx'
import Difficulty from '../components/Difficulty.jsx'

const W = 360
const H = 400
const BIRD_X = 80
const BIRD_R = 12
const GRAVITY = 1300
const FLAP = -360
const PIPE_W = 52
const PIPE_SPEED = 140
const PIPE_INTERVAL = 220 // 픽셀 간격

const DIFFICULTIES = [
  { label: '쉬움', value: 165 },
  { label: '보통', value: 130 },
  { label: '어려움', value: 100 },
]

function makePipe(x, gap) {
  const top = 40 + Math.random() * (H - gap - 120)
  return { x, top, passed: false }
}

function freshGame(gap) {
  return {
    birdY: H / 2,
    vy: 0,
    gap,
    pipes: [makePipe(W + 40, gap), makePipe(W + 40 + PIPE_INTERVAL, gap)],
    score: 0,
  }
}

function FlappyBird() {
  const canvasRef = useRef(null)
  const gRef = useRef(null)
  const flapRef = useRef(false) // 대기 중인 날개짓 요청
  const resetRef = useRef(false) // 다음 프레임에 새 게임 초기화 요청
  const statusRef = useRef('ready') // effect 내부에서 최신 status 참조용
  const gapRef = useRef(130) // update가 새 게임 만들 때 참조할 간격(난이도)
  const [status, setStatus] = useState('ready') // ready | playing | over
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [round, setRound] = useState(0)
  const [gap, setGap] = useState(130)

  useEffect(() => {
    statusRef.current = status
  }, [status])

  useEffect(() => {
    gapRef.current = gap
  }, [gap])

  // gRef 초기화는 effect에서 도달 가능한 곳이 아니라 update(루프) 안에서만 수행한다.
  // start는 상태와 플래그만 건드려 lint의 불변성 규칙을 지킨다.
  const start = useCallback(() => {
    resetRef.current = true
    flapRef.current = false
    setScore(0)
    setStatus('playing')
    setRound((r) => r + 1)
  }, [])

  // 입력: 게임 중이면 날개짓 요청, 아니면 새 게임 시작
  const flapInput = useCallback(() => {
    if (statusRef.current === 'playing') {
      flapRef.current = true
    } else {
      start()
    }
  }, [start])

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault()
        flapInput()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flapInput])

  function update(dt) {
    if (resetRef.current) {
      gRef.current = freshGame(gapRef.current)
      resetRef.current = false
    }
    const g = gRef.current
    if (!g) return

    if (flapRef.current) {
      g.vy = FLAP
      flapRef.current = false
    }

    g.vy += GRAVITY * dt
    g.birdY += g.vy * dt

    // 바닥/천장 충돌 → 게임오버
    if (g.birdY + BIRD_R > H || g.birdY - BIRD_R < 0) {
      return gameOver(g)
    }

    for (const pipe of g.pipes) {
      pipe.x -= PIPE_SPEED * dt

      // 점수 (파이프 통과)
      if (!pipe.passed && pipe.x + PIPE_W < BIRD_X) {
        pipe.passed = true
        g.score += 1
        setScore(g.score)
      }

      // 충돌 판정
      const withinX = BIRD_X + BIRD_R > pipe.x && BIRD_X - BIRD_R < pipe.x + PIPE_W
      const hitGap = g.birdY - BIRD_R < pipe.top || g.birdY + BIRD_R > pipe.top + g.gap
      if (withinX && hitGap) return gameOver(g)
    }

    // 화면 밖 파이프 제거 & 새 파이프 추가
    if (g.pipes[0].x + PIPE_W < 0) {
      g.pipes.shift()
      const lastX = g.pipes[g.pipes.length - 1].x
      g.pipes.push(makePipe(lastX + PIPE_INTERVAL, g.gap))
    }

    draw()
  }

  function gameOver(g) {
    setBest((b) => Math.max(b, g.score))
    setStatus('over')
  }

  function draw() {
    const canvas = canvasRef.current
    const g = gRef.current
    if (!canvas || !g) return
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, W, H)

    // 파이프
    ctx.fillStyle = '#4ade80'
    for (const pipe of g.pipes) {
      ctx.fillRect(pipe.x, 0, PIPE_W, pipe.top)
      ctx.fillRect(pipe.x, pipe.top + g.gap, PIPE_W, H - pipe.top - g.gap)
    }

    // 새
    ctx.beginPath()
    ctx.arc(BIRD_X, g.birdY, BIRD_R, 0, Math.PI * 2)
    ctx.fillStyle = '#facc15'
    ctx.fill()
  }

  useGameLoop(update, status === 'playing')

  useEffect(() => {
    if (status !== 'playing') {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#e5e7eb'
      ctx.font = '18px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(
        status === 'over' ? '💥 부딪혔어요!' : '탭 / 스페이스로 시작',
        W / 2,
        H / 2 - 10,
      )
      ctx.font = '14px system-ui'
      ctx.fillText('클릭 또는 스페이스바로 날개짓', W / 2, H / 2 + 16)
    }
  }, [status])

  return (
    <div className="game">
      <p className="game-message">
        점수: {score} · 최고: {best}
      </p>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="canvas-game"
        onClick={flapInput}
      />
      <p className="game-info">클릭 또는 스페이스바로 날개짓</p>
      <Difficulty
        value={gap}
        onChange={setGap}
        options={DIFFICULTIES}
        disabled={status === 'playing'}
      />
      <ScorePanel key={round} gameId={`flappy-${gap}`} score={score} active={status === 'over'} />
    </div>
  )
}

export default FlappyBird
