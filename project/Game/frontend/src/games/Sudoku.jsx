import { useState } from 'react'
import Difficulty from '../components/Difficulty.jsx'

function emptyGrid() {
  return Array.from({ length: 9 }, () => Array(9).fill(0))
}

function isValid(board, r, c, n) {
  for (let i = 0; i < 9; i++) {
    if (board[r][i] === n || board[i][c] === n) return false
  }
  const br = Math.floor(r / 3) * 3
  const bc = Math.floor(c / 3) * 3
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (board[br + i][bc + j] === n) return false
  return true
}

function shuffled(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 백트래킹으로 완성된 스도쿠 생성
function fillBoard(board) {
  for (let i = 0; i < 81; i++) {
    const r = Math.floor(i / 9)
    const c = i % 9
    if (board[r][c] === 0) {
      for (const n of shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
        if (isValid(board, r, c, n)) {
          board[r][c] = n
          if (fillBoard(board)) return true
          board[r][c] = 0
        }
      }
      return false
    }
  }
  return true
}

function findEmpty(board) {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) if (board[r][c] === 0) return [r, c]
  return null
}

// 해의 개수를 최대 2개까지만 센다(유일해 판정용)
function countSolutions(board) {
  const pos = findEmpty(board)
  if (!pos) return 1
  const [r, c] = pos
  let total = 0
  for (let n = 1; n <= 9; n++) {
    if (isValid(board, r, c, n)) {
      board[r][c] = n
      total += countSolutions(board)
      board[r][c] = 0
      if (total > 1) break
    }
  }
  return total
}

// 완성판을 만들고, 유일해가 유지되는 선에서 칸을 비워 퍼즐 생성
function freshData(holes = 44) {
  const puzzle = makePuzzle(holes)
  return { given: puzzle, values: puzzle.map((row) => row.slice()) }
}

function makePuzzle(holes = 44) {
  const solved = emptyGrid()
  fillBoard(solved)
  const puzzle = solved.map((row) => row.slice())
  let removed = 0
  for (const idx of shuffled([...Array(81).keys()])) {
    if (removed >= holes) break
    const r = Math.floor(idx / 9)
    const c = idx % 9
    const backup = puzzle[r][c]
    puzzle[r][c] = 0
    if (countSolutions(puzzle.map((row) => row.slice())) !== 1) {
      puzzle[r][c] = backup // 유일해가 깨지면 되돌림
    } else {
      removed++
    }
  }
  return puzzle
}

function addGroup(values, cells, bad) {
  const byVal = {}
  for (const [r, c] of cells) {
    const v = values[r][c]
    if (!v) continue
    ;(byVal[v] || (byVal[v] = [])).push(`${r},${c}`)
  }
  for (const v in byVal) if (byVal[v].length > 1) byVal[v].forEach((k) => bad.add(k))
}

function conflicts(values) {
  const bad = new Set()
  for (let r = 0; r < 9; r++)
    addGroup(values, Array.from({ length: 9 }, (_, c) => [r, c]), bad)
  for (let c = 0; c < 9; c++)
    addGroup(values, Array.from({ length: 9 }, (_, r) => [r, c]), bad)
  for (let br = 0; br < 3; br++)
    for (let bc = 0; bc < 3; bc++) {
      const cells = []
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 3; c++) cells.push([br * 3 + r, bc * 3 + c])
      addGroup(values, cells, bad)
    }
  return bad
}

const DIFFICULTIES = [
  { label: '쉬움', value: 38 },
  { label: '보통', value: 46 },
  { label: '어려움', value: 52 },
]

function Sudoku() {
  // 최초 퍼즐은 lazy 초기화로 생성(render 중 Math.random 직접 호출을 피함).
  const [holes, setHoles] = useState(46)
  const [data, setData] = useState(() => freshData(46))
  const [selected, setSelected] = useState(null)

  // 새 퍼즐 생성은 버튼(이벤트)에서만 호출한다.
  function newGame(nextHoles = holes) {
    setData(freshData(nextHoles))
    setSelected(null)
  }

  function changeDifficulty(v) {
    if (v === holes) return
    setHoles(v)
    newGame(v)
  }

  const bad = conflicts(data.values)
  const filled = data.values.every((row) => row.every((v) => v !== 0))
  const won = filled && bad.size === 0

  function input(n) {
    if (!selected) return
    const { r, c } = selected
    if (data.given[r][c] !== 0 || won) return
    const values = data.values.map((row) => row.slice())
    values[r][c] = n
    setData({ ...data, values })
  }

  return (
    <div className="game">
      <p className="game-message">{won ? '🎉 완성!' : '빈 칸을 채우세요'}</p>

      <div className="sudoku-board">
        {data.values.map((row, r) =>
          row.map((v, c) => {
            const given = data.given[r][c] !== 0
            const isSel = selected && selected.r === r && selected.c === c
            const conflict = bad.has(`${r},${c}`)
            const thickR = r % 3 === 0
            const thickC = c % 3 === 0
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                className={
                  'sudoku-cell' +
                  (given ? ' is-given' : '') +
                  (isSel ? ' is-selected' : '') +
                  (conflict ? ' is-conflict' : '') +
                  (thickR ? ' border-top' : '') +
                  (thickC ? ' border-left' : '')
                }
                onClick={() => setSelected({ r, c })}
              >
                {v !== 0 ? v : ''}
              </button>
            )
          }),
        )}
      </div>

      <div className="sudoku-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} type="button" onClick={() => input(n)}>
            {n}
          </button>
        ))}
        <button type="button" onClick={() => input(0)}>
          ⌫
        </button>
      </div>

      <Difficulty value={holes} onChange={changeDifficulty} options={DIFFICULTIES} />
      <button type="button" className="game-reset" onClick={() => newGame()}>
        새 퍼즐
      </button>
    </div>
  )
}

export default Sudoku
