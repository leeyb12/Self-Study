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
                if (idx === -1) return line;
                return line.substring(idx + 1).trim();
            })
            .join('\n');
    };

    const [plainLyrics, setPlainLyrics] = useState(toPlainText(song.lyrics));
    const [interval,    setIntervalSec] = useState(3);
    const [loading,     setLoading]     = useState(false);
    const [error,       setError]       = useState('');
    const [preview,     setPreview]     = useState(false);

    const toTimedLyrics = (text, sec) => {
        let time = 0;
        return text
            .split('\n')
            .map(line => {
                if (!line.trim()) return null;
                const result = `${time}:${line.trim()}`;
                time += sec;
                return result;
            })
            .filter(Boolean)
            .join('\n');
    };

    const handleSave = async (e) => {
        e.stopPropagation();
        if (!plainLyrics.trim()) { setError('가사를 입력해주세요.'); return; }
        setLoading(true);
        setError('');
        try {
            const timedLyrics = toTimedLyrics(plainLyrics, interval);
            const params = new URLSearchParams();
            params.append('title',  song.title);
            params.append('artist', song.artist);
            params.append('lyrics', timedLyrics);

            await axios.put(`/api/songs/${song.id}`, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            onSaved({ ...song, lyrics: timedLyrics });
            onClose();
        } catch (err) {
            setError(err.response?.data?.error ?? '저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const previewLines = toTimedLyrics(plainLyrics, interval)
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
        <div className="edit-overlay" onClick={onClose}>
            <div className="edit-modal" onClick={e => e.stopPropagation()}>

                {/* 헤더 */}
                <div className="edit-header">
                    <div>
                        <p className="edit-title">가사 편집</p>
                        <p className="edit-subtitle">{song.title} — {song.artist}</p>
                    </div>
                    <button
                        className="edit-close"
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                    >
                        ✕
                    </button>
                </div>

                <hr className="edit-divider" />

                {error && <p className="edit-error">{error}</p>}

                {/* 탭 */}
                <div className="edit-tabs">
                    <button
                        className={`edit-tab ${!preview ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setPreview(false); }}
                    >
                        편집
                    </button>
                    <button
                        className={`edit-tab ${preview ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setPreview(true); }}
                    >
                        미리보기
                    </button>
                </div>

                {!preview ? (
                    <>
                        {/* 간격 설정 */}
                        <div className="edit-interval-row">
                            <label className="edit-interval-label">줄당 간격</label>
                            <input
                                type="number"
                                min="1"
                                max="30"
                                className="edit-interval-input"
                                value={interval}
                                onClick={e => e.stopPropagation()}
                                onChange={e => setIntervalSec(Number(e.target.value))}
                            />
                            <span className="edit-interval-unit">초</span>
                            <span className="edit-interval-hint">
                                초 없이 가사만 입력하세요
                            </span>
                        </div>

                        {/* 가사 입력 */}
                        <textarea
                            className="edit-textarea"
                            placeholder={"너의 눈망울은 like 치와와\nI mean 귀여워\nWanna do 쓰당 쓰당 baby\n못 살겠다 너 때문에"}
                            value={plainLyrics}
                            onClick={e => e.stopPropagation()}
                            onChange={e => setPlainLyrics(e.target.value)}
                        />
                    </>
                ) : (
                    /* 미리보기 */
                    <div className="edit-preview">
                        {previewLines.length === 0 ? (
                            <p className="edit-preview-empty">가사를 입력해주세요</p>
                        ) : (
                            previewLines.map((line, i) => (
                                <div key={i} className="edit-preview-line">
                                    <span className="edit-preview-time">{line.time}s</span>
                                    <span className="edit-preview-text">{line.text}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* 버튼 */}
                <div className="edit-buttons">
                    <button
                        className="edit-btn-dark"
                        disabled={loading}
                        onClick={handleSave}
                    >
                        {loading ? '저장 중...' : '저장'}
                    </button>
                    <button
                        className="edit-btn-ghost"
                        onClick={(e) => { e.stopPropagation(); setPlainLyrics(''); }}
                    >
                        초기화
                    </button>
                    <button
                        className="edit-btn-ghost edit-btn-cancel"
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}