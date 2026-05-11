import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LyricsSidePanel from '../components/LyricsSidePanel';
import UploadForm      from '../components/UploadForm';
import ChatPanel       from '../components/ChatPanel';
import Spinner         from '../components/Spinner';
import '../styles/Player.css';

function formatTime(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

export default function PlayerPage() {
    const audioRef = useRef(null);
    const { isLoggedIn, authReady } = useAuth();

    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [chatOpen, setChatOpen] = useState(false);
    const [sortMode, setSortMode] = useState('default');

    // 곡 목록 가져오기 (autoPlay 매개변수 추가)
    const fetchSongs = useCallback(async (autoPlay = false) => {
        if (!isLoggedIn) return;
        try {
            const res = await axios.get('/api/songs');
            const songList = res.data;
            setSongs(songList);

            if (songList.length > 0) {
                if (autoPlay) {
                    // 업로드 직후 가장 최신 곡(보통 인덱스 0) 자동 선택 및 재생
                    setCurrentSong(songList[0]);
                    setIsPlaying(true);
                } else if (!currentSong) {
                    setCurrentSong(songList[0]);
                }
            }
        } catch (e) {
            console.error('목록 로드 실패:', e);
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn, currentSong]);

    useEffect(() => {
        if (authReady) fetchSongs();
    }, [authReady, fetchSongs]);

    const sortedSongs = useMemo(() => {
        let list = [...songs];
        if (sortMode === 'abc') return list.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
        if (sortMode === 'random') return list.sort(() => Math.random() - 0.5);
        return list;
    }, [songs, sortMode]);

    const handleDelete = async (e, songId) => {
        e.stopPropagation();
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await axios.delete(`/api/songs/${songId}`);
            if (currentSong?.id === songId) {
                setIsPlaying(false);
                setCurrentSong(null);
            }
            fetchSongs();
        } catch (err) {
            alert("삭제 실패");
        }
    };

    // 재생 및 AbortError 방지
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;

        if (audio.src !== currentSong.fileUrl) {
            audio.pause(); 
            audio.src = currentSong.fileUrl;
            audio.load();
        }

        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    if (error.name !== 'AbortError') console.error("재생 실패:", error);
                });
            }
        } else {
            audio.pause();
        }
    }, [currentSong, isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const update = () => {
            setCurrentTime(audio.currentTime);
            setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
        };
        const meta = () => setDuration(audio.duration);
        const ended = () => {
            const idx = sortedSongs.findIndex(s => s.id === currentSong?.id);
            if (idx >= 0 && idx < sortedSongs.length - 1) {
                setCurrentSong(sortedSongs[idx + 1]);
                setIsPlaying(true);
            } else {
                setIsPlaying(false);
            }
        };
        audio.addEventListener('timeupdate', update);
        audio.addEventListener('loadedmetadata', meta);
        audio.addEventListener('ended', ended);
        return () => {
            audio.removeEventListener('timeupdate', update);
            audio.removeEventListener('loadedmetadata', meta);
            audio.removeEventListener('ended', ended);
        };
    }, [currentSong, sortedSongs]);

    const togglePlay = () => setIsPlaying(!isPlaying);
    const selectSong = (song) => { setCurrentSong(song); setIsPlaying(true); };
    const seek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = ratio * duration;
    };

    if (!authReady || loading) return <div className="player-page"><Spinner /></div>;

    const currentIdx = sortedSongs.findIndex(s => s.id === currentSong?.id);

    return (
        <div className="player-page">
            <audio ref={audioRef} />
            <div className="player-layout">
                {/* [왼쪽] 플레이리스트 패널 */}
                <div className="player-side-panel">
                    <div className="panel-header">
                        <span className="panel-title">MY PLAYLIST</span>
                        <div className="sort-box">
                            <button className={`action-btn ${sortMode === 'abc' ? 'active' : ''}`} onClick={() => setSortMode('abc')}>가나다</button>
                            <button className={`action-btn ${sortMode === 'random' ? 'active' : ''}`} onClick={() => setSortMode('random')}>랜덤</button>
                        </div>
                    </div>
                    <div className="side-song-list">
                        {sortedSongs.map(song => (
                            <div key={song.id} className={`side-song-item ${currentSong?.id === song.id ? 'active' : ''}`} onClick={() => selectSong(song)}>
                                <div className="song-info-mini">
                                    <span className="song-name">{song.title}</span>
                                    <span className="song-artist-mini">{song.artist}</span>
                                </div>
                                <div className="item-actions">
                                    <button className="action-btn delete-btn" onClick={(e) => handleDelete(e, song.id)}>삭제</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* 업로드 완료 시 fetchSongs(true) 호출 */}
                    <UploadForm onUploaded={() => fetchSongs(true)} />
                </div>

                {/* [중앙] 플레이어 */}
                <div className="player-center">
                    <div className="player-card">
                        <div className="cd-wrapper" onClick={togglePlay}>
                            <div className={`cd-disc ${isPlaying ? 'playing' : ''}`}>
                                {currentSong?.imageUrl && <img src={currentSong.imageUrl} alt="cover" className="cd-image" />}
                                <div className="cd-center" />
                            </div>
                        </div>
                        <div className="pull-string" onClick={togglePlay} />
                        <div className="song-info">
                            <div className="marquee-container">
                                <p className={`song-title ${currentSong?.title?.length > 15 ? 'marquee' : ''}`}>
                                    {currentSong?.title || '곡을 선택하세요'}
                                </p>
                            </div>
                            <p className="song-artist">{currentSong?.artist || 'Artist'}</p>
                        </div>
                        <div className="player-controls">
                            <button className="ctrl-btn" disabled={currentIdx <= 0} onClick={() => selectSong(sortedSongs[currentIdx-1])}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
                            </button>
                            <button className="ctrl-btn ctrl-btn-play" onClick={togglePlay}>
                                {isPlaying ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                )}
                            </button>
                            <button className="ctrl-btn" disabled={currentIdx >= sortedSongs.length - 1} onClick={() => selectSong(sortedSongs[currentIdx+1])}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                            </button>
                        </div>
                        <div className="progress-bar-wrapper" onClick={seek}>
                            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="time-display">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                    <button className="action-btn chat-open-btn" style={{ width: '100%', marginTop: '10px' }} onClick={() => setChatOpen(true)}>채팅 열기</button>
                </div>

                {/* [오른쪽] 가사 패널 */}
                <LyricsSidePanel song={currentSong} currentTime={currentTime} />
            </div>
            <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
    );
}