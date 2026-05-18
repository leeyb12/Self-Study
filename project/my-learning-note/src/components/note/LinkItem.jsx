const LinkItem = ({ item, index, onItemClick }) => {
  return (
    <a 
      className="link-item" 
      onClick={(e) => {
        e.preventDefault(); // 기본 링크 동작 방지
        onItemClick(item);
      }}
    >
      <span className="item-num">{String(index + 1).padStart(2, '0')}</span>
      <span className="item-name">{item.name}</span>
      <span className="arrow">→</span>
    </a>
  );
};

export default LinkItem;