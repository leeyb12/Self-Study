// 재사용 난이도 선택 칩.
// options: [{ label, value }], value/onChange로 제어.
function Difficulty({ value, onChange, options, disabled }) {
  return (
    <div className="difficulty">
      <span className="difficulty-label">난이도</span>
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          className={`diff-chip ${value === o.value ? 'is-active' : ''}`}
          onClick={() => onChange(o.value)}
          disabled={disabled}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default Difficulty
