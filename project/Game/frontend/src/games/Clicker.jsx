import { useState, useEffect } from 'react'

function Clicker() {
  const [points, setPoints] = useState(0)
  const [perClick, setPerClick] = useState(1)
  const [perSecond, setPerSecond] = useState(0)

  // 초당 자동 생산
  useEffect(() => {
    if (perSecond === 0) return
    const id = setInterval(() => setPoints((p) => p + perSecond), 1000)
    return () => clearInterval(id)
  }, [perSecond])

  const clickUpgradeCost = perClick * 10
  const autoUpgradeCost = (perSecond + 1) * 25

  function buyClickUpgrade() {
    if (points < clickUpgradeCost) return
    setPoints((p) => p - clickUpgradeCost)
    setPerClick((c) => c + 1)
  }

  function buyAutoUpgrade() {
    if (points < autoUpgradeCost) return
    setPoints((p) => p - autoUpgradeCost)
    setPerSecond((s) => s + 1)
  }

  return (
    <div className="game">
      <p className="game-message">🍪 {Math.floor(points)} 점</p>
      <p className="game-info">
        클릭당 +{perClick} · 초당 +{perSecond}
      </p>

      <button
        type="button"
        className="clicker-cookie"
        onClick={() => setPoints((p) => p + perClick)}
      >
        🍪
      </button>

      <div className="clicker-shop">
        <button
          type="button"
          onClick={buyClickUpgrade}
          disabled={points < clickUpgradeCost}
        >
          클릭 파워 +1 ({clickUpgradeCost})
        </button>
        <button
          type="button"
          onClick={buyAutoUpgrade}
          disabled={points < autoUpgradeCost}
        >
          자동 생산 +1 ({autoUpgradeCost})
        </button>
      </div>
    </div>
  )
}

export default Clicker
