import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LyricsSidePanel from '../components/LyricsSidePanel';
import LyricsModal   from '../components/LyricsModal';
import UploadForm    from '../components/UploadForm';
import ChatPanel     from '../components/ChatPanel';
import Spinner       from '../components/Spinner';
import '../styles/Player.css';

function formatTime(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

export default function PlayerPage() {
    const audioRef     = useRef(null);
    const isPlayingRef = useRef(false);
    const navigate     = useNavigate();
    const { isLoggedIn, authReady } = useAuth();

    const [songs,           setSongs]           = useState([]);
    const [currentSong,     setCurrentSong]     = useState(null);
    const [isPlaying,       setIsPlaying]       = useState(false);
    const [currentTime,     setCurrentTime]     = useState(0);
    const [duration,        setDuration]        = useState(0);
    const [progress,        setProgress]        = useState(0);
    const [loading,         setLoading]         = useState(true);
    const [chatOpen,        setChatOpen]        = useState(false);
    const [lyricsModal,     setLyricsModal]     = useState(false);
    const [lyricsModalSong, setLyricsModalSong] = useState(null);

    const fetchSongs = useCallback(async (autoPlayLatest = false) => {
        if (!isLoggedIn) {
            setSongs([]);
            setLoading(false);
            return;
        }
        try {
            const res = await axios.get('/api/songs');
            setSongs(res.data);
            if (autoPlayLatest && res.data.length > 0) {
                setCurrentSong(res.data[0]);
                isPlayingRef.current = true;
                setIsPlaying(true);
            } else if (!autoPlayLatest && res.data.length > 0) {
                setCurrentSong(prev => prev ?? res.data[0]);
            }
        } catch (e) {
            console.error('곡 목록 불러오기 실패:', e);
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (authReady) fetchSongs(false);
    }, [authReady, fetchSongs]);

    useEffect(() => {
        if (!isLoggedIn) {
            setSongs([]);
            setCurrentSong(null);
            isPlayingRef.current = false;
            setIsPlaying(false);
            if (audioRef.current) audioRef.current.pause();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (!currentSong || !audioRef.current) return;
        audioRef.current.src = currentSong.fileUrl;
        audioRef.current.load();
        if (isPlayingRef.current) audioRef.current.play().catch(() => {});
    }, [currentSong]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            setProgress(audio.duration
                ? (audio.currentTime / audio.duration) * 100
                : 0);
        };
        const onLoaded = () => setDuration(audio.duration);
        const onEnded  = () => {
            isPlayingRef.current = false;
            setIsPlaying(false);
            setSongs(prev => {
                const idx = prev.findIndex(s => s.id === currentSong?.id);
                if (idx >= 0 && idx < prev.length - 1) {
                    setCurrentSong(prev[idx + 1]);
                    isPlayingRef.current = true;
                    setIsPlaying(true);
                }
                return prev;
            });
        };

        audio.addEventListener('timeupdate',     onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoaded);
        audio.addEventListener('ended',          onEnded);
        return () => {
            audio.removeEventListener('timeupdate',     onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoaded);
            audio.removeEventListener('ended',          onEnded);
        };
    }, [currentSong]);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;
        if (isPlayingRef.current) {
            audio.pause();
            isPlayingRef.current = false;
            setIsPlaying(false);
        } else {
            audio.play().catch(() => {});
            isPlayingRef.current = true;
            setIsPlaying(true);
        }
    }, [currentSong]);

    const seek = (e) => {
        const audio = audioRef.current;
        if (!audio || !duration) return;
        const rect  = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        audio.currentTime = ratio * duration;
    };

    const selectSong = (song) => {
        setCurrentSong(song);
        isPlayingRef.current = true;
        setIsPlaying(true);
    };

    if (!authReady || loading) {
        return (
            <div className="player-page">
                <Spinner text="불러오는 중..." />
            </div>
        );
    }

    return (
        <div className="player-page" style={{ justifyContent: 'flex-start', paddingTop: 0 }}>
            <audio ref={audioRef} />

            {/* 플레이어 + 가사 나란히 */}
            <div className="player-layout">

                {/* 왼쪽 — 플레이어 */}
                <div className="player-left">
                    <div className="player-card">

                        {/* CD */}
                        <div className="cd-wrapper" onClick={togglePlay}>
                            <div className={`cd-disc ${isPlaying ? 'playing' : ''}`}>
                                {currentSong?.imageUrl && (
                                    <img
                                        src={currentSong.imageUrl}
                                        alt="cover"
                                        className="cd-image"
                                    />
                                )}
                                <div className="cd-center" />
                            </div>
                        </div>

                        {/* 줄 */}
                        <div className="pull-string" onClick={togglePlay} />

                        {/* 곡 정보 */}
                        <div className="song-info">
                            <p className="song-title">
                                {currentSong
                                    ? currentSong.title
                                    : isLoggedIn
                                        ? '곡을 선택하세요'
                                        : '로그인 후 이용하세요'}
                            </p>
                            <p className="song-artist">{currentSong?.artist ?? ''}</p>
                        </div>

                        {/* 프로그레스 바 */}
                        <div className="progress-bar-wrapper" onClick={seek}>
                            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                        </div>

                        {/* 재생시간 */}
                        <div className="time-display">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* 채팅 버튼 */}
                    <button
                        onClick={() => setChatOpen(true)}
                        style={{
                            marginTop: '8px',
                            width: '100%',
                            padding: '9px 20px',
                            background: 'transparent',
                            border: '1px solid #ddd',
                            borderRadius: '2px',
                            color: '#888',
                            fontSize: '12px',
                            cursor: 'pointer',
                            letterSpacing: '0.06em',
                        }}
                    >
                        채팅 열기
                    </button>

                    {/* 로그인 상태 분기 */}
                    {isLoggedIn ? (
                        <>
                            <UploadForm onUploaded={() => fetchSongs(true)} />

                            <div className="song-list">
                                {songs.length === 0 ? (
                                    <p style={{
                                        textAlign: 'center', color: '#bbb',
                                        fontSize: '12px', padding: '24px 0',
                                        letterSpacing: '0.06em',
                                    }}>
                                        업로드된 음악이 없습니다
                                    </p>
                                ) : (
                                    songs.map(song => (
                                        <div
                                            key={song.id}
                                            className={`song-list-item ${currentSong?.id === song.id ? 'active' : ''}`}
                                        >
                                            <span
                                                style={{ flex: 1, cursor: 'pointer' }}
                                                onClick={() => selectSong(song)}
                                            >
                                                {song.title}
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span className="song-list-artist">{song.artist}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setLyricsModalSong(song);
                                                        setLyricsModal(true);
                                                    }}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        fontSize: '11px',
                                                        color: currentSong?.id === song.id ? '#aaa' : '#bbb',
                                                        cursor: 'pointer',
                                                        padding: '2px 6px',
                                                        letterSpacing: '0.04em',
                                                    }}
                                                >
                                                    가사
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{
                            marginTop: '12px',
                            padding: '24px',
                            background: '#fff',
                            borderRadius: '4px',
                            width: '340px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}>
                            <p style={{ fontSize: '13px', color: '#999', letterSpacing: '0.04em', margin: 0 }}>
                                로그인 후 음악을 업로드하고<br />재생할 수 있습니다
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                style={{ padding: '10px', background: '#1a1a1a', color: '#f5f0e8', border: 'none', borderRadius: '2px', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.06em' }}
                            >
                                로그인
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                style={{ padding: '10px', background: 'transparent', color: '#888', border: '1px solid #ddd', borderRadius: '2px', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.06em' }}
                            >
                                회원가입
                            </button>
                        </div>
                    )}
                </div>

                {/* 오른쪽 — 가사 패널 */}
                <LyricsSidePanel
                    song={currentSong}
                />
            </div>

            {/* 가사 모달 */}
            {lyricsModal && lyricsModalSong && (
                <LyricsModal
                    song={lyricsModalSong}
                    onClose={() => {
                        setLyricsModal(false);
                        setLyricsModalSong(null);
                    }}
                    onUpdated={(updatedSong) => {
                        if (updatedSong === null) {
                            if (currentSong?.id === lyricsModalSong.id) {
                                setCurrentSong(null);
                                isPlayingRef.current = false;
                                setIsPlaying(false);
                            }
                        } else {
                            if (currentSong?.id === updatedSong.id) {
                                setCurrentSong(updatedSong);
                            }
                        }
                        fetchSongs(false);
                        setLyricsModal(false);
                        setLyricsModalSong(null);
                    }}
                />
            )}

            {/* 채팅 패널 */}
            <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
    );
}