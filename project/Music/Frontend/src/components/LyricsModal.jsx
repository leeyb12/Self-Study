import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import LyricsEditModal from './LyricsEditModal';
import SongInfoModal   from './SongInfoModal';
import '../styles/LyricsModal.css';

export default function LyricsModal({ song: initialSong, onClose, onUpdated }) {
    const { isLoggedIn }  = useAuth();
    const [song,          setSong]          = useState(initialSong);
    const [showLyricEdit, setShowLyricEdit] = useState(false);
    const [showInfoEdit,  setShowInfoEdit]  = useState(false);

    useEffect(() => { setSong(initialSong); }, [initialSong]);

    const lines = useMemo(() => {
        if (!song?.lyrics) return [];
        return song.lyrics
            .split('\n')
            .map(line => {
                if (!line.trim()) return null;
                const idx = line.indexOf(':');
                if (idx !== -1 && !isNaN(line.substring(0, idx).trim())) {
                    return line.substring(idx + 1).trim();
                }
                return line.trim();
            })
            .filter(Boolean);
    }, [song?.lyrics]);

    const handleLyricSaved = (updatedSong) => {
        setSong(updatedSong);
        onUpdated(updatedSong);
        setShowLyricEdit(false);
    };

    const handleInfoSaved = (updatedSong) => {
        setSong(updatedSong);
        onUpdated(updatedSong);
        setShowInfoEdit(false);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm('곡을 삭제하시겠습니까?')) return;
        try {
            const axios = (await import('axios')).default;
            await axios.delete(`/api/songs/${song.id}`);
            onUpdated(null);
            onClose();
        } catch (err) {
            alert(err.response?.data?.error ?? '삭제에 실패했습니다.');
        }
    };

    return (
        <>
            <div className="lyrics-overlay" onClick={onClose}>
                <div className="lyrics-modal" onClick={e => e.stopPropagation()}>

                    {/* 헤더 */}
                    <div className="lyrics-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                            {/* 미니 CD */}
                            <div
                                style={{
                                    width: '52px', height: '52px', borderRadius: '50%',
                                    background: '#1a1a1a', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, overflow: 'hidden', position: 'relative',
                                    cursor: isLoggedIn ? 'pointer' : 'default',
                                    border: '3px solid #2c2c2c',
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isLoggedIn) setShowInfoEdit(true);
                                }}
                            >
                                {song.imageUrl ? (
                                    <img
                                        src={song.imageUrl}
                                        alt="cover"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                    />
                                ) : (
                                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#f5f0e8' }} />
                                )}
                                {isLoggedIn && (
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                        borderRadius: '50%', background: 'rgba(0,0,0,0.45)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        opacity: song.imageUrl ? 0 : 1, transition: 'opacity 0.2s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = song.imageUrl ? '0' : '1'}
                                    >
                                        <span style={{ fontSize: '18px', color: '#fff', lineHeight: 1 }}>+</span>
                                    </div>
                                )}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p className="lyrics-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {song.title}
                                </p>
                                <p className="lyrics-artist">{song.artist}</p>
                                {!song.imageUrl && isLoggedIn && (
                                    <p style={{ fontSize: '10px', color: '#ccc', margin: '2px 0 0', letterSpacing: '0.04em' }}>
                                        CD 클릭으로 이미지 추가
                                    </p>
                                )}
                            </div>
                        </div>
                        <button className="close-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}>✕</button>
                    </div>

                    <hr className="lyrics-divider" />

                    {/* 가사 보기 */}
                    <div className="lyrics-box">
                        {lines.length === 0 ? (
                            <p className="lyrics-empty">
                                {isLoggedIn ? '가사 수정으로 가사를 추가해보세요' : '가사가 없습니다'}
                            </p>
                        ) : (
                            lines.map((line, i) => (
                                <p key={i} style={{
                                    fontSize: '13px', color: '#444',
                                    lineHeight: '1.9', margin: 0, padding: '1px 0',
                                    letterSpacing: '0.04em',
                                }}>
                                    {line}
                                </p>
                            ))
                        )}
                    </div>

                    {/* 버튼 */}
                    {isLoggedIn && (
                        <div className="lyrics-buttons">
                            <button className="btn-dark" onClick={(e) => { e.stopPropagation(); setShowLyricEdit(true); }}>
                                가사 수정
                            </button>
                            <button className="btn-ghost" onClick={(e) => { e.stopPropagation(); setShowInfoEdit(true); }}>
                                정보 수정
                            </button>
                            <button className="btn-ghost btn-danger" onClick={handleDelete} style={{ marginLeft: 'auto' }}>
                                삭제
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showLyricEdit && (
                <LyricsEditModal
                    song={song}
                    onClose={() => setShowLyricEdit(false)}
                    onSaved={handleLyricSaved}
                />
            )}

            {showInfoEdit && (
                <SongInfoModal
                    song={song}
                    onClose={() => setShowInfoEdit(false)}
                    onSaved={handleInfoSaved}
                />
            )}
        </>
    );
}