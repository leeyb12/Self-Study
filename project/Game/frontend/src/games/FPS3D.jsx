import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import ScorePanel from '../components/ScorePanel.jsx'

const VIEW_W = 400
const VIEW_H = 300
const DURATION = 30 // 초
const TARGET_COUNT = 5

function randomTargetPos() {
  return new THREE.Vector3(
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 5 + 0.5,
    -4 - Math.random() * 6,
  )
}

function FPS3D() {
  const mountRef = useRef(null)
  const cameraRef = useRef(null)
  const targetsRef = useRef([])
  const raycasterRef = useRef(new THREE.Raycaster())
  const [status, setStatus] = useState('ready') // ready | playing | over
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(DURATION)
  const [round, setRound] = useState(0)

  function start() {
    setScore(0)
    setTime(DURATION)
    setStatus('playing')
    setRound((r) => r + 1)
  }

  useEffect(() => {
    if (status !== 'playing') return
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0b1020')
    const camera = new THREE.PerspectiveCamera(70, VIEW_W / VIEW_H, 0.1, 100)
    camera.position.set(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(VIEW_W, VIEW_H)
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.8))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
    dirLight.position.set(2, 5, 3)
    scene.add(dirLight)

    // 표적 (공유 지오메트리, 개별 머티리얼로 색상 구분)
    const targetGeo = new THREE.SphereGeometry(0.6, 24, 16)
    const targets = []
    for (let i = 0; i < TARGET_COUNT; i++) {
      const mat = new THREE.MeshStandardMaterial({ color: '#ef4444' })
      const mesh = new THREE.Mesh(targetGeo, mat)
      mesh.position.copy(randomTargetPos())
      scene.add(mesh)
      targets.push(mesh)
    }
    targetsRef.current = targets

    let raf
    let t0 = 0
    const tick = (t) => {
      if (t0 === 0) t0 = t
      const remaining = DURATION - (t - t0) / 1000
      setTime(Math.max(0, Math.ceil(remaining)))
      // 표적 살짝 흔들기
      targets.forEach((m, i) => {
        m.position.y += Math.sin(t / 400 + i) * 0.004
        m.rotation.y += 0.01
      })
      renderer.render(scene, camera)
      if (remaining <= 0) {
        setStatus('over')
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      targetGeo.dispose()
      targets.forEach((m) => m.material.dispose())
      renderer.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [status])

  function shoot(e) {
    if (status !== 'playing') return
    const camera = cameraRef.current
    const targets = targetsRef.current
    if (!camera || targets.length === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ndc = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    )
    const ray = raycasterRef.current
    ray.setFromCamera(ndc, camera)
    const hits = ray.intersectObjects(targets)
    if (hits.length > 0) {
      hits[0].object.position.copy(randomTargetPos())
      setScore((s) => s + 1)
    }
  }

  return (
    <div className="game">
      <p className="game-message">
        {status === 'over' ? `🎯 명중 ${score}개!` : `점수: ${score} · ⏱ ${time}s`}
      </p>

      {status === 'playing' ? (
        <div ref={mountRef} className="maze3d-view" onPointerDown={shoot} />
      ) : (
        <div className="maze3d-view maze3d-placeholder">🎯 3D 사격</div>
      )}

      <p className="game-info">표적을 클릭해서 제한시간 안에 최대한 많이 맞히세요</p>
      <button type="button" className="game-reset" onClick={start}>
        {status === 'playing' ? '다시 시작' : '게임 시작'}
      </button>
      <ScorePanel key={round} gameId="fps-3d" score={score} active={status === 'over'} unit="개" />
    </div>
  )
}

export default FPS3D
