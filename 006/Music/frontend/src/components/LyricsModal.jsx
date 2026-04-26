import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/LyricsModal.css';

export default function LyricsModal({ song, onClose, onUpdated }) {
    const { isLoggedIn } = useAuth();

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        title:  song.title,
        artist: song.artist,
        lyrics: song.lyrics ?? '',
    });
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState('');

    const isOwner = isLoggedIn;

    useEffect(() => {
        setForm({
            title:  song.title,
            artist: song.artist,
            lyrics: song.lyrics ?? '',
        });
        setEditing(false);
        setError('');
    }, [song]);

    const sourceLyrics = editing ? form.lyrics : (song.lyrics ?? '');

    const isValidLyrics = (lyrics) => {
        return lyrics.split('\n').every(line => {
            if (!line.trim()) return true;
            return line.includes(':');
        });
    };

    // 자동 형식 변환 — 초 없으면 2초 간격으로 자동 부여
    const autoFormat = (e) => {
        e.stopPropagation();
        const lines = form.lyrics.split('\n').filter(l => l.trim());
        const needsFormat = lines.some(l => !l.includes(':'));
        if (!needsFormat) return;

        let time = 0;
        const formatted = lines.map(line => {
            if (line.includes(':')) return line;
            const result = `${time}:${line}`;
            time += 2;
            return result;
        }).join('\n');

        setForm({ ...form, lyrics: formatted });
    };

    const handleSave = async (e) => {
        e.stopPropagation();
        if (!isValidLyrics(form.lyrics)) {
            setError('가사 형식이 올바르지 않습니다. (초:내용)');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            params.append('title',  form.title);
            params.append('artist', form.artist);
            params.append('lyrics', form.lyrics);

            await axios.put(`/api/songs/${song.id}`, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            const updatedSong = {
                ...song,
                title:  form.title,
                artist: form.artist,
                lyrics: form.lyrics,
            };
            onUpdated(updatedSong);
            onClose();
        } catch (err) {
            setError(err.response?.data?.error ?? '수정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm('곡을 삭제하시겠습니까?')) return;
        try {
            await axios.delete(`/api/songs/${song.id}`);
            onUpdated(null);
            onClose();
        } catch (err) {
            setError(err.response?.data?.error ?? '삭제에 실패했습니다.');
        }
    };

    const handleEdit   = (e) => { e.stopPropagation(); setEditing(true); };
    const handleCancel = (e) => { e.stopPropagation(); setEditing(false); setError(''); };
    const handleClose  = (e) => { e.stopPropagation(); onClose(); };

    const parsedLyrics = sourceLyrics
        .split('\n')
        .map(line => {
            const idx = line.indexOf(':');
            if (idx === -1) return null;
            return {
                time: line.substring(0, idx),
                text: line.substring(idx + 1).trim(),
            };
        })
        .filter(Boolean);

    return (
        <div className="lyrics-overlay" onClick={onClose}>
            <div className="lyrics-modal" onClick={e => e.stopPropagation()}>

                {/* 헤더 */}
                <div className="lyrics-header">
                    <div style={{ flex: 1, marginRight: '12px' }}>
                        {editing ? (
                            <input
                                className="lyrics-input"
                                style={{ fontSize: '15px', fontWeight: 500 }}
                                value={form.title}
                                onClick={e => e.stopPropagation()}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                            />
                        ) : (
                            <p className="lyrics-title">{song.title}</p>
                        )}
                        {editing ? (
                            <input
                                className="lyrics-input"
                                style={{ fontSize: '12px', marginTop: '6px' }}
                                value={form.artist}
                                onClick={e => e.stopPropagation()}
                                onChange={e => setForm({ ...form, artist: e.target.value })}
                            />
                        ) : (
                            <p className="lyrics-artist">{song.artist}</p>
                        )}
                    </div>
                    <button className="close-btn" onClick={handleClose}>✕</button>
                </div>

                <hr className="lyrics-divider" />

                {error && <p className="lyrics-error">{error}</p>}

                {/* 가사 영역 */}
                {editing ? (
                    <div className="lyrics-edit-area">
                        <div className="lyrics-edit-header">
                            <label className="lyrics-label">가사 형식: 초:가사내용</label>
                            <button className="lyrics-auto-btn" onClick={autoFormat}>
                                자동 형식 변환
                            </button>
                        </div>
                        <textarea
                            className="lyrics-input lyrics-textarea"
                            placeholder={"0:첫번째 가사\n5:두번째 가사\n12:세번째 가사\n\n또는 형식 없이 입력 후\n자동 형식 변환 버튼 클릭"}
                            value={form.lyrics}
                            onClick={e => e.stopPropagation()}
                            onChange={e => setForm({ ...form, lyrics: e.target.value })}
                        />
                    </div>
                ) : (
                    <div className="lyrics-box">
                        {parsedLyrics.length === 0 ? (
                            <p className="lyrics-empty">가사가 없습니다</p>
                        ) : (
                            parsedLyrics.map((line, i) => (
                                <div key={i} className="lyrics-line">
                                    <span className="lyrics-time">{line.time}s</span>
                                    <span className="lyrics-text">{line.text}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* 버튼 */}
                {isOwner && (
                    <div className="lyrics-buttons">
                        {editing ? (
                            <>
                                <button
                                    className="btn-dark"
                                    disabled={loading}
                                    onClick={handleSave}
                                >
                                    {loading ? '저장 중...' : '저장'}
                                </button>
                                <button
                                    className="btn-ghost"
                                    onClick={handleCancel}
                                >
                                    취소
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="btn-dark"
                                    onClick={handleEdit}
                                >
                                    수정
                                </button>
                                <button
                                    className="btn-ghost btn-danger"
                                    onClick={handleDelete}
                                >
                                    삭제
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}