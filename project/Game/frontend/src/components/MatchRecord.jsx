// AI 대전 게임의 승/패/무 전적 표시(순수 표시 컴포넌트).
// 저장/조회 헬퍼는 '../utils/matchStore.js' 참고.
function MatchRecord({ record }) {
  return (
    <p className="match-record">
      전적 <b>{record.win}</b>승 <b>{record.lose}</b>패 <b>{record.draw}</b>무
    </p>
  )
}

export default MatchRecord
