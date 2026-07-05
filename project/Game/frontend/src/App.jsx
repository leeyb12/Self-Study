import { useState, Suspense } from 'react'
import { games, getGame, categories } from './games/registry.js'
import './App.css'

const ALL = '전체'

function App() {
  // 현재 선택된 게임 id. null이면 허브(홈) 화면.
  const [activeId, setActiveId] = useState(null)
  const [filter, setFilter] = useState(ALL)
  const active = activeId ? getGame(activeId) : null

  const visible = filter === ALL ? games : games.filter((g) => g.category === filter)

  return (
    <div className="app">
      <header className="app-header">
        <h1
          className="app-title"
          role="button"
          tabIndex={0}
          onClick={() => setActiveId(null)}
        >
          🎮 미니게임
        </h1>
        {active && (
          <button
            type="button"
            className="back-button"
            onClick={() => setActiveId(null)}
          >
            ← 목록으로
          </button>
        )}
      </header>

      <main className="app-main">
        {active ? (
          <section className="game-view">
            <h2>{active.emoji} {active.title}</h2>
            <Suspense fallback={<p className="game-info">불러오는 중…</p>}>
              <active.component />
            </Suspense>
          </section>
        ) : (
          <>
            <div className="filter-bar">
              {[ALL, ...categories].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-chip ${filter === cat ? 'is-active' : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="game-grid">
              {visible.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  className="game-card"
                  onClick={() => setActiveId(game.id)}
                >
                  <span className="game-card-emoji">{game.emoji}</span>
                  <span className="game-card-title">{game.title}</span>
                  <span className="game-card-desc">{game.description}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App
