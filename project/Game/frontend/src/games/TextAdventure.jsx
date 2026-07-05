import { useState } from 'react'

// 선택지 기반 스토리. 각 노드: { text, choices?: [{ label, next }], ending? }
const STORY = {
  start: {
    text: '깊은 숲속에서 눈을 떴다. 앞에 갈림길이 있다.',
    choices: [
      { label: '왼쪽 어두운 동굴로', next: 'cave' },
      { label: '오른쪽 밝은 오솔길로', next: 'path' },
    ],
  },
  cave: {
    text: '동굴 안에서 반짝이는 상자를 발견했다.',
    choices: [
      { label: '상자를 연다', next: 'treasure' },
      { label: '무시하고 더 들어간다', next: 'dragon' },
    ],
  },
  path: {
    text: '오솔길 끝에서 작은 마을을 만났다. 노인이 도움을 청한다.',
    choices: [
      { label: '노인을 돕는다', next: 'hero' },
      { label: '그냥 지나친다', next: 'lost' },
    ],
  },
  treasure: { text: '💰 상자 안엔 금화가 가득! 부자가 되었다.', ending: '부자 엔딩' },
  dragon: { text: '🐉 잠자던 용을 깨우고 말았다…', ending: '배드 엔딩' },
  hero: { text: '🦸 노인은 사실 마법사였고, 당신에게 큰 힘을 주었다.', ending: '영웅 엔딩' },
  lost: { text: '🌫️ 길을 잃고 숲을 헤매게 되었다.', ending: '방랑자 엔딩' },
}

function TextAdventure() {
  const [nodeId, setNodeId] = useState('start')
  const node = STORY[nodeId]

  return (
    <div className="game">
      <p className="adv-text">{node.text}</p>

      {node.ending ? (
        <>
          <p className="game-message">— {node.ending} —</p>
          <button type="button" className="game-reset" onClick={() => setNodeId('start')}>
            처음부터
          </button>
        </>
      ) : (
        <div className="adv-choices">
          {node.choices.map((choice) => (
            <button
              key={choice.next}
              type="button"
              className="adv-choice"
              onClick={() => setNodeId(choice.next)}
            >
              {choice.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default TextAdventure
