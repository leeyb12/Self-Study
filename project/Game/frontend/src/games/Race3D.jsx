import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import ScorePanel from '../components/ScorePanel.jsx'

const VIEW_W = 440
const VIEW_H = 300
const ACCEL = 20
const BRAKE = 26
const MAX_FWD = 30
const DRAG = 0.7
const GRIP = 5
const STEER = 1.9
const CP_R = 4.5
const BOUND = 46

// 통과해야 할 체크포인트(순서대로) — 루프
const CHECKPOINTS = [
  { x: 0, z: -20 },
  { x: 20, z: -12 },
  { x: 20, z: 14 },
  { x: 0, z: 22 },
  { x: -20, z: 14 },
  { x: -20, z: -12 },
]

function Race3D() {
  const mountRef = useRef(null)
  const keysRef = useRef({})
  const poseRef = useRef({ x: 0, z: 0, angle: 0, vx: 0, vz: 0 })
  const cpRef = useRef(0)
  const [status, setStatus] = useState('ready') // ready | playing | finished
  const [cp, setCp] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [finalMs, setFinalMs] = useState(0)
  const [round, setRound] = useState(0)

  function start() {
    poseRef.current = { x: 0, z: 0, angle: 0, vx: 0, vz: 0 }
    cpRef.current = 0
    keysRef.current = {}
    setCp(0)
    setElapsed(0)
    setFinalMs(0)
    setStatus('playing')
    setRound((r) => r + 1)
  }

  // 키보드 입력 (refs만 참조)
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

  useEffect(() => {
    if (status !== 'playing') return
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0b1226')
    const camera = new THREE.PerspectiveCamera(70, VIEW_W / VIEW_H, 0.1, 300)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(VIEW_W, VIEW_H)
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.75))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7)
    dirLight.position.set(10, 20, 8)
    scene.add(dirLight)

    // 바닥 + 그리드
    const groundGeo = new THREE.PlaneGeometry(120, 120)
    const groundMat = new THREE.MeshStandardMaterial({ color: '#1e293b' })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)
    const grid = new THREE.GridHelper(120, 40, 0x334155, 0x334155)
    scene.add(grid)

    // 체크포인트 링(바닥에 눕힘)
    const cpGeo = new THREE.TorusGeometry(CP_R, 0.35, 10, 32)
    const cpMeshes = CHECKPOINTS.map((p) => {
      const mat = new THREE.MeshStandardMaterial({ color: '#64748b' })
      const ring = new THREE.Mesh(cpGeo, mat)
      ring.rotation.x = Math.PI / 2
      ring.position.set(p.x, 0.1, p.z)
      scene.add(ring)
      return ring
    })

    // 자동차 (본체 + 앞쪽 표시)
    const car = new THREE.Group()
    const bodyGeo = new THREE.BoxGeometry(1.6, 0.7, 3)
    const bodyMat = new THREE.MeshStandardMaterial({ color: '#ef4444' })
    car.add(new THREE.Mesh(bodyGeo, bodyMat))
    const noseGeo = new THREE.BoxGeometry(1.2, 0.5, 0.5)
    const noseMat = new THREE.MeshStandardMaterial({ color: '#111827' })
    const nose = new THREE.Mesh(noseGeo, noseMat)
    nose.position.set(0, 0.1, -1.4) // 로컬 -Z가 진행 방향
    car.add(nose)
    scene.add(car)

    let raf
    let last = 0
    let tStart = 0
    const updateCpColors = () => {
      cpMeshes.forEach((m, i) => {
        m.material.color.set(
          i < cpRef.current ? '#4ade80' : i === cpRef.current ? '#facc15' : '#64748b',
        )
      })
    }
    updateCpColors()

    const tick = (t) => {
      if (last === 0) last = t
      const dt = Math.min((t - last) / 1000, 0.05)
      last = t
      const p = poseRef.current
      const k = keysRef.current

      if (tStart === 0 && (k.up || k.down)) tStart = t
      if (tStart !== 0) setElapsed(t - tStart)

      // 아케이드 드리프트 물리 (x,z 평면)
      const hx = -Math.sin(p.angle)
      const hz = -Math.cos(p.angle)
      const rx = Math.cos(p.angle)
      const rz = -Math.sin(p.angle)
      let fwd = p.vx * hx + p.vz * hz
      let lat = p.vx * rx + p.vz * rz
      if (k.up) fwd += ACCEL * dt
      if (k.down) fwd -= BRAKE * dt
      fwd = Math.max(-MAX_FWD / 2, Math.min(MAX_FWD, fwd))
      fwd *= Math.exp(-DRAG * dt)
      lat *= Math.exp(-GRIP * dt)
      const steerAmt = STEER * dt * Math.max(-1, Math.min(1, fwd / 8))
      if (k.left) p.angle += steerAmt
      if (k.right) p.angle -= steerAmt
      p.vx = hx * fwd + rx * lat
      p.vz = hz * fwd + rz * lat
      p.x = Math.max(-BOUND, Math.min(BOUND, p.x + p.vx * dt))
      p.z = Math.max(-BOUND, Math.min(BOUND, p.z + p.vz * dt))

      // 자동차 배치
      car.position.set(p.x, 0.5, p.z)
      car.rotation.y = p.angle

      // 추적 카메라
      camera.position.set(p.x - hx * 9, 5.5, p.z - hz * 9)
      camera.lookAt(p.x + hx * 3, 1, p.z + hz * 3)

      // 체크포인트 통과
      const target = CHECKPOINTS[cpRef.current]
      if (target && Math.hypot(p.x - target.x, p.z - target.z) < CP_R) {
        cpRef.current += 1
        setCp(cpRef.current)
        updateCpColors()
        if (cpRef.current >= CHECKPOINTS.length) {
          setFinalMs(tStart === 0 ? 0 : t - tStart)
          setStatus('finished')
          renderer.render(scene, camera)
          return
        }
      }

      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      groundGeo.dispose()
      groundMat.dispose()
      grid.geometry.dispose()
      grid.material.dispose()
      cpGeo.dispose()
      cpMeshes.forEach((m) => m.material.dispose())
      bodyGeo.dispose()
      bodyMat.dispose()
      noseGeo.dispose()
      noseMat.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [status])

  return (
    <div className="game">
      <p className="game-message">
        체크포인트 {Math.min(cp, CHECKPOINTS.length)}/{CHECKPOINTS.length} ·{' '}
        {status === 'finished' ? (finalMs / 1000).toFixed(2) : (elapsed / 1000).toFixed(2)}초
      </p>

      {status === 'playing' ? (
        <div ref={mountRef} className="race3d-view" />
      ) : (
        <div className="race3d-view maze3d-placeholder">
          {status === 'finished' ? `🏁 ${(finalMs / 1000).toFixed(2)}초` : '🏎️ 3D 레이싱'}
        </div>
      )}

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

      <p className="game-info">방향키로 운전 · 노란 링(체크포인트)을 순서대로 통과</p>
      <button type="button" className="game-reset" onClick={start}>
        {status === 'playing' ? '다시 시작' : '게임 시작'}
      </button>
      <ScorePanel
        key={round}
        gameId="race-3d"
        score={finalMs}
        active={status === 'finished'}
        order="asc"
        unit=" ms"
      />
    </div>
  )
}

export default Race3D
