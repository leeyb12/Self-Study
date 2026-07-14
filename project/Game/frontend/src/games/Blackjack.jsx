import { useState } from 'react'
import MatchRecord from '../components/MatchRecord.jsx'
import { loadRecord, saveRecord } from '../utils/matchStore.js'

const SUITS = ['♠', '♥', '♦', '♣']
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

function buildDeck() {
  const deck = []
  for (const s of SUITS)
    for (const r of RANKS) deck.push({ suit: s, rank: r })
  return deck.sort(() => Math.random() - 0.5)
}

function handValue(hand) {
  let total = 0
  let aces = 0
  for (const card of hand) {
    if (card.rank === 'A') {
      aces++
      total += 11
    } else if (['K', 'Q', 'J'].includes(card.rank)) {
      total += 10
    } else {
      total += Number(card.rank)
    }
  }
  // A를 1로 낮춰 21 초과 방지
  while (total > 21 && aces > 0) {
    total -= 10
    aces--
  }
  return total
}

function Card({ card, hidden }) {
  if (hidden) return <span className="bj-card bj-hidden">🂠</span>
  const red = card.suit === '♥' || card.suit === '♦'
  return (
    <span className={`bj-card ${red ? 'bj-red' : ''}`}>
      {card.rank}
      {card.suit}
    </span>
  )
}

function Blackjack() {
  const [deck, setDeck] = useState([])
  const [player, setPlayer] = useState([])
  const [dealer, setDealer] = useState([])
  const [phase, setPhase] = useState('idle') // idle | player | done
  const [result, setResult] = useState('')
  const [record, setRecord] = useState(() => loadRecord('blackjack'))

  function recordOutcome(outcome) {
    setRecord((prev) => {
      const next = { ...prev, [outcome]: prev[outcome] + 1 }
      saveRecord('blackjack', next)
      return next
    })
  }

  function deal() {
    const d = buildDeck()
    const p = [d.pop(), d.pop()]
    const dl = [d.pop(), d.pop()]
    setDeck(d)
    setPlayer(p)
    setDealer(dl)
    setResult('')
    if (handValue(p) === 21) {
      finish(p, dl, d, true)
    } else {
      setPhase('player')
    }
  }

  function hit() {
    const d = deck.slice()
    const p = [...player, d.pop()]
    setDeck(d)
    setPlayer(p)
    if (handValue(p) > 21) {
      setPhase('done')
      setResult('버스트! 딜러 승리 💥')
      recordOutcome('lose')
    }
  }

  function stand() {
    finish(player, dealer, deck, false)
  }

  function finish(p, dl, d, playerBlackjack) {
    const deckCopy = d.slice()
    const dealerHand = dl.slice()
    // 딜러는 17 이상이 될 때까지 뽑음
    while (handValue(dealerHand) < 17 && deckCopy.length > 0) {
      dealerHand.push(deckCopy.pop())
    }
    setDealer(dealerHand)
    setDeck(deckCopy)
    setPhase('done')

    const pv = handValue(p)
    const dv = handValue(dealerHand)
    if (playerBlackjack) {
      setResult('블랙잭! 🎉 승리')
      recordOutcome('win')
    } else if (dv > 21) {
      setResult('딜러 버스트! 🎉 승리')
      recordOutcome('win')
    } else if (pv > dv) {
      setResult('🎉 승리!')
      recordOutcome('win')
    } else if (pv < dv) {
      setResult('딜러 승리 😢')
      recordOutcome('lose')
    } else {
      setResult('무승부')
      recordOutcome('draw')
    }
  }

  const dealerShown = phase === 'player'

  return (
    <div className="game">
      {phase === 'idle' ? (
        <>
          <p className="game-message">블랙잭 (21에 가깝게!)</p>
          <button type="button" className="game-reset" onClick={deal}>
            게임 시작
          </button>
        </>
      ) : (
        <>
          <div className="bj-hand">
            <span className="bj-label">
              딜러 {dealerShown ? '' : `(${handValue(dealer)})`}
            </span>
            <div>
              {dealer.map((c, i) => (
                <Card key={i} card={c} hidden={dealerShown && i === 1} />
              ))}
            </div>
          </div>

          <div className="bj-hand">
            <span className="bj-label">나 ({handValue(player)})</span>
            <div>
              {player.map((c, i) => (
                <Card key={i} card={c} />
              ))}
            </div>
          </div>

          {result && <p className="game-message">{result}</p>}

          {phase === 'player' ? (
            <div className="game-controls">
              <button type="button" onClick={hit}>
                히트
              </button>
              <button type="button" onClick={stand}>
                스탠드
              </button>
            </div>
          ) : (
            <button type="button" className="game-reset" onClick={deal}>
              다시 하기
            </button>
          )}
          <MatchRecord record={record} />
        </>
      )}
    </div>
  )
}

export default Blackjack
