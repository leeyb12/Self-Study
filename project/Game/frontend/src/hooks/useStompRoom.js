import { useState, useEffect, useRef } from 'react'
import { Client } from '@stomp/stompjs'

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws'

// 브라우저별 고유 playerId. render 중 impure 호출을 피하려 모듈 헬퍼로 분리.
export function makeId() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}

// 방 코드 기반 STOMP 연결 훅.
// kind: 'room'(틱택토) | 'omok' 등 → /topic/{kind}/{room}, /app/{kind}/{room}/{action}
// room이 null이면 연결하지 않는다.
export function useStompRoom(kind, room, playerId) {
  const [state, setState] = useState(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)
  const clientRef = useRef(null)

  useEffect(() => {
    if (!room) return
    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 3000,
      onConnect: () => {
        setConnected(true)
        setError(null)
        client.subscribe(`/topic/${kind}/${room}`, (msg) => setState(JSON.parse(msg.body)))
        client.publish({
          destination: `/app/${kind}/${room}/join`,
          body: JSON.stringify({ playerId }),
        })
      },
      onStompError: () => setError('서버 오류가 발생했습니다'),
      onWebSocketError: () => setError('서버에 연결할 수 없습니다'),
      onWebSocketClose: () => setConnected(false),
    })
    client.activate()
    clientRef.current = client
    return () => {
      clientRef.current = null
      client.deactivate()
    }
  }, [kind, room, playerId])

  function publish(action, payload) {
    const c = clientRef.current
    if (!c || !c.connected || !room) return
    c.publish({
      destination: `/app/${kind}/${room}/${action}`,
      body: JSON.stringify(payload ?? {}),
    })
  }

  return { state, connected, error, publish }
}
