import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

// # 벽 / . 길 / S 시작 / E 출구
const MAZE = [
  '#########',
  '#S......#',
  '#.#.#.#.#',
  '#.#.#.#.#',
  '#.......#',
  '#.#.#.#.#',
  '#.#.#.#.#',
  '#......E#',
  '#########',
]
const ROWS = MAZE.length
const COLS = MAZE[0].length
const VIEW_W = 400
const VIEW_H = 300
const SPEED = 2.6
const ROT = 2.6

function find(ch) {
  for (let r = 0; r < ROWS; r++) {
    const c = MAZE[r].indexOf(ch)
    if (c >= 0) return { r, c }
  }
  return { r: 1, c: 1 }
}
const START = find('S')
const EXIT = find('E')

function isWall(r, c) {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return true
  return MAZE[r][c] === '#'
}

function Maze3D() {
  const mountRef = useRef(null)
  const keysRef = useRef({})
  const poseRef = useRef({ x: START.c, z: START.r, angle: Math.PI })
  const [status, setStatus] = useState('ready') // ready | playing | won

  function start() {
    poseRef.current = { x: START.c, z: START.r, angle: Math.PI }
    keysRef.current = {}
    setStatus('playing')
  }

  // 키보드 입력 (refs만 참조)
  useEffect(() => {
    const map = { ArrowUp: 'f', ArrowDown: 'b', ArrowLeft: 'l', ArrowRight: 'r' }
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

  // three.js 씬 (playing 동안만 생성)
  useEffect(() => {
    if (status !== 'playing') return
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0b1020')
    const camera = new THREE.PerspectiveCamera(72, VIEW_W / VIEW_H, 0.05, 100)
    camera.rotation.order = 'YXZ'
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(VIEW_W, VIEW_H)
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
    dirLight.position.set(3, 10, 4)
    scene.add(dirLight)

    // 바닥
    const floorGeo = new THREE.PlaneGeometry(COLS, ROWS)
    const floorMat = new THREE.MeshStandardMaterial({ color: '#1f2937' })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(COLS / 2 - 0.5, 0, ROWS / 2 - 0.5)
    scene.add(floor)

    // 벽 (지오메트리/머티리얼 공유)
    const wallGeo = new THREE.BoxGeometry(1, 1, 1)
    const wallMat = new THREE.MeshStandardMaterial({ color: '#3b82f6' })
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (MAZE[r][c] === '#') {
          const wall = new THREE.Mesh(wallGeo, wallMat)
          wall.position.set(c, 0.5, r)
          scene.add(wall)
        }
      }
    }

    // 출구 표시
    const exitGeo = new THREE.BoxGeometry(0.7, 1, 0.7)
    const exitMat = new THREE.MeshStandardMaterial({
      color: '#22c55e',
      transparent: true,
      opacity: 0.55,
    })
    const exit = new THREE.Mesh(exitGeo, exitMat)
    exit.position.set(EXIT.c, 0.5, EXIT.r)
    scene.add(exit)

    let raf
    let last = 0
    let stopped = false
    const tick = (t) => {
      if (last === 0) last = t
      const dt = Math.min((t - last) / 1000, 0.05)
      last = t
      const p = poseRef.current
      const k = keysRef.current

      if (k.l) p.angle += ROT * dt
      if (k.r) p.angle -= ROT * dt
      const fx = -Math.sin(p.angle)
      const fz = -Math.cos(p.angle)
      let mv = 0
      if (k.f) mv += 1
      if (k.b) mv -= 1
      if (mv !== 0) {
        const nx = p.x + fx * SPEED * dt * mv
        const nz = p.z + fz * SPEED * dt * mv
        // 축별 이동으로 벽을 따라 미끄러지게
        if (!isWall(Math.round(p.z), Math.round(nx))) p.x = nx
        if (!isWall(Math.round(nz), Math.round(p.x))) p.z = nz
      }

      camera.position.set(p.x, 0.5, p.z)
      camera.rotation.y = p.angle
      renderer.render(scene, camera)

      if (!stopped && Math.round(p.x) === EXIT.c && Math.round(p.z) === EXIT.r) {
        stopped = true
        setStatus('won')
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      floorGeo.dispose()
      floorMat.dispose()
      wallGeo.dispose()
      wallMat.dispose()
      exitGeo.dispose()
      exitMat.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [status])

  return (
    <div className="game">
      <p className="game-message">
        {status === 'won' ? '🎉 탈출 성공!' : '초록색 출구를 찾아 탈출하세요'}
      </p>

      {status === 'playing' ? (
        <div ref={mountRef} className="maze3d-view" />
      ) : (
        <div className="maze3d-view maze3d-placeholder">🧭 3D 미로</div>
      )}

      <div className="pac-pad">
        <button
          type="button"
          onPointerDown={() => { keysRef.current.f = true }}
          onPointerUp={() => { keysRef.current.f = false }}
          onPointerLeave={() => { keysRef.current.f = false }}
        >▲</button>
        <div>
          <button
            type="button"
            onPointerDown={() => { keysRef.current.l = true }}
            onPointerUp={() => { keysRef.current.l = false }}
            onPointerLeave={() => { keysRef.current.l = false }}
          >↰</button>
          <button
            type="button"
            onPointerDown={() => { keysRef.current.b = true }}
            onPointerUp={() => { keysRef.current.b = false }}
            onPointerLeave={() => { keysRef.current.b = false }}
          >▼</button>
          <button
            type="button"
            onPointerDown={() => { keysRef.current.r = true }}
            onPointerUp={() => { keysRef.current.r = false }}
            onPointerLeave={() => { keysRef.current.r = false }}
          >↱</button>
        </div>
      </div>

      <p className="game-info">방향키: ↑↓ 전진/후진 · ←→ 회전</p>
      <button type="button" className="game-reset" onClick={start}>
        {status === 'playing' ? '다시 시작' : '게임 시작'}
      </button>
    </div>
  )
}

export default Maze3D
