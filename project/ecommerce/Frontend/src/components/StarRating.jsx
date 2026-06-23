export default function StarRating({ value, onChange, readonly = false }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="star-rating">
      {stars.map((s) => (
        <span
          key={s}
          className={`star ${s <= (value || 0) ? 'star--filled' : ''} ${!readonly ? 'star--clickable' : ''}`}
          onClick={() => !readonly && onChange && onChange(s)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
