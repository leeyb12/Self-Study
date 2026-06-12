import { useState } from 'react';
import axios from 'axios';
import '../styles/LyricsEditModal.css';

export default function LyricsEditModal({ song, onClose, onSaved }) {

    const toPlainText = (lyrics) => {
        if (!lyrics) return '';
        return lyrics
            .split('\n')
            .map(line => {
                const idx = line.indexOf(':');
                if (idx !== -1 && !isNaN(line.substring(0, idx).trim())) {
                    return line.substring(idx + 1).trim();
                }
                return line;
            })
            .join('\n');
    };

    const [lyrics,  setLyrics]  = useState(toPlainText(song.lyrics));
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState('');

    const handleSave = async (e) => {
        e.stopPropagation();
        if (!lyrics.trim()) { setError('가사를 입력해주세요.'); return; }
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            params.append('title',  song.title);
            params.append('artist', song.artist);
            params.append('lyrics', lyrics.trim());

            await axios.put(`/api/songs/${song.id}`, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            onSaved({ ...song, lyrics: lyrics.trim() });
            onClose();
        } catch (err) {
            setError(err.response?.data?.error ?? '저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-overlay" onClick={onClose}>
            <div className="edit-modal" onClick={e => e.stopPropagation()}>
                <div className="edit-header">
                    <div>
                        <p className="edit-title">가사 편집</p>
                        <p className="edit-subtitle">{song.title} — {song.artist}</p>
                    </div>
                    <button className="edit-close" onClick={(e) => { e.stopPropagation(); onClose(); }}>✕</button>
                </div>

                <hr className="edit-divider" />

                {error && <p className="edit-error">{error}</p>}

                <label className="edit-interval-label" style={{ marginBottom: '8px', display: 'block' }}>
                    가사를 입력하세요 (줄바꿈으로 구분)
                </label>

                <textarea
                    className="edit-textarea"
                    style={{ height: '300px' }}
                    placeholder={"첫번째 가사\n두번째 가사\n세번째 가사"}
                    value={lyrics}
                    onClick={e => e.stopPropagation()}
                    onChange={e => setLyrics(e.target.value)}
                />

                <div className="edit-buttons">
                    <button className="edit-btn-dark" disabled={loading} onClick={handleSave}>
                        {loading ? '저장 중...' : '저장'}
                    </button>
                    <button className="edit-btn-ghost" onClick={(e) => { e.stopPropagation(); setLyrics(''); }}>
                        초기화
                    </button>
                    <button className="edit-btn-ghost edit-btn-cancel" onClick={(e) => { e.stopPropagation(); onClose(); }}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}