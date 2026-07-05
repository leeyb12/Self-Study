import { useState, useEffect, useRef, useCallback } from 'react'
import ScorePanel from '../components/ScorePanel.jsx'
import Difficulty from '../components/Difficulty.jsx'

const SIZE = 15
const DIFFICULTIES = [
  { label: '느림', value: 180 },
  { label: '보통', value: 130 },
  { label: '빠름', value: 80 },
]

function randomFood(snake) {
  while (true) {
    const food = {
      x: Math.floor(Math.random() * SIZE),
      y: Math.floor(Math.random() * SIZE),
    }
    if (!snake.some((s) => s.x === food.x && s.y === food.y)) return food
  }
}

const START = [{ x: 7, y: 7 }]

function Snake() {
  const [snake, setSnake] = useState(START)
  const [food, setFood] = useState(() => randomFood(START))
  const [dir, setDir] = useState({ x: 1, y: 0 })
  const [over, setOver] = useState(false)
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [speed, setSpeed] = useState(130) // ms per step

  // 방향은 ref로도 추적해 한 스텝에 반대 방향으로 꺾이는 것을 방지
  const dirRef = useRef(dir)
  useEffect(() => {
    dirRef.current = dir
  }, [dir])

  const step = useCallback(() => {
    setSnake((prev) => {
      const d = dirRef.current
      const head = { x: prev[0].x + d.x, y: prev[0].y + d.y }

      // 벽 또는 자기 몸 충돌
      if (
        head.x < 0 || head.x >= SIZE ||
        head.y < 0 || head.y >= SIZE ||
        prev.some((s) => s.x === head.x && s.y === head.y)
      ) {
        setOver(true)
        setRunning(false)
        return prev
      }

      const ate = head.x === food.x && head.y === food.y
      const next = [head, ...prev]
      if (ate) {
        setFood(randomFood(next))
        setScore((s) => s + 1)
      } else {
        next.pop()
      }
      return next
    })
  }, [food])

  useEffect(() => {
    if (!running) return
    const id = setInterval(step, speed)
    return () => clearInterval(id)
  }, [running, step, speed])

  useEffect(() => {
    function onKey(e) {
      const map = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      }
      const nd = map[e.key]
      if (!nd) return
      e.preventDefault()
      const cur = dirRef.current
      // 반대 방향으로는 전환 불가
      if (nd.x === -cur.x && nd.y === -cur.y) return
      setDir(nd)
      if (!running && !over) setRunning(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [running, over])

  function reset() {
    setSnake(START)
    setFood(randomFood(START))
    setDir({ x: 1, y: 0 })
    setOver(false)
    setScore(0)
    setRunning(false)
    setRound((r) => r + 1)
  }

  function changeDifficulty(v) {
    if (v === speed) return
    setSpeed(v)
    reset()
  }

  const cells = []
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const isHead = snake[0].x === x && snake[0].y === y
      const isBody = !isHead && snake.some((s) => s.x === x && s.y === y)
      const isFood = food.x === x && food.y === y
      let cls = 'snake-cell'
      if (isHead) cls += ' is-head'
      else if (isBody) cls += ' is-body'
      else if (isFood) cls += ' is-food'
      cells.push(<div key={`${x}-${y}`} className={cls} />)
    }
  }

  return (
    <div className="game">
      <p className="game-message">점수: {score}</p>
      <div className="snake-board">{cells}</div>
      <p className="game-info">
        {over
          ? '게임 오버!'
          : running
            ? '방향키로 조작'
            : '방향키를 눌러 시작'}
      </p>
      <Difficulty value={speed} onChange={changeDifficulty} options={DIFFICULTIES} />
      <button type="button" className="game-reset" onClick={reset}>
        다시 하기
      </button>
      <ScorePanel key={round} gameId={`snake-${speed}`} score={score} active={over} />
    </div>
  )
}

export default Snake
