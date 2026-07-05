import { useRef, useEffect } from 'react'

// requestAnimationFrame 기반 게임 루프.
// - callback(dt): 매 프레임 호출, dt는 직전 프레임과의 시간차(초)
// - running: false이면 루프를 멈춤
// callback은 ref로 보관해 매 렌더마다 최신 클로저를 사용하되,
// 루프 자체는 running 값이 바뀔 때만 재시작한다.
export function useGameLoop(callback, running = true) {
  const cbRef = useRef(callback)
  useEffect(() => {
    cbRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!running) return
    let frame
    let last = performance.now()
    const tick = (now) => {
      // 탭 전환 등으로 dt가 튀는 것을 방지하기 위해 상한을 둔다.
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      cbRef.current(dt)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [running])
}
