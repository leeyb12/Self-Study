const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="search-bar-wrap">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="주제로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear visible" onClick={() => setSearchQuery("")}>
            ESC
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;