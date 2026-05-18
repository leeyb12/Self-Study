import { useState, useEffect } from 'react';
import './assets/styles/main.css';
import Header from './components/layout/Header';
import SearchBar from './components/SearchBar';
import CategoryColumn from './components/note/CategoryColumn';
import Viewer from './components/Viewer';
import { CATEGORIES } from './data/learningData';

function App() {
  const [activeNote, setActiveNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLight, setIsLight] = useState(false);

  // 테마 전환
  useEffect(() => {
    document.documentElement.classList.toggle('light', isLight);
  }, [isLight]);

  // 검색 필터링 로직
  const filteredData = CATEGORIES.map(cat => ({
    ...cat,
    folders: cat.folders.map(folder => ({
      ...folder,
      items: folder.items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(f => f.items.length > 0)
  }));

  return (
    <div className="app">
      <div id="home-view" className={activeNote ? 'hidden' : ''}>
        <Header />
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="columns">
          {filteredData.map(cat => (
            <CategoryColumn 
              key={cat.id} 
              category={cat} 
              onItemClick={setActiveNote} 
            />
          ))}
        </div>
      </div>

      <Viewer note={activeNote} onClose={() => setActiveNote(null)} />

      <button id="theme-toggle" onClick={() => setIsLight(!isLight)}>
        {isLight ? '🌙' : '☀️'}
      </button>
    </div>
  );
}

export default App;