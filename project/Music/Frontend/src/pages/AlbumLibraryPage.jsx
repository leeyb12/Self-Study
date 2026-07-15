import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AlbumLibraryPage() {
    const { username, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const storageKey = `albumLibrary_${username}`;
    const queueKey   = `playerQueue_${username}`;
    const albumNameKey = `playerAlbum_${username}`;

    const [albums, setAlbums] = useState([]);
    const [availableSongs, setAvailableSongs] = useState([]);
    const [selectedSongIds, setSelectedSongIds] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', coverUrl: '/images/music.png' });
    const [error, setError] = useState('');
    const [loadingSongs, setLoadingSongs] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                setAlbums(JSON.parse(stored));
            } catch {
                setAlbums([]);
            }
        }
    }, [storageKey]);

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(albums));
    }, [albums, storageKey]);

    useEffect(() => {
        if (!isLoggedIn) {
            setLoadingSongs(false);
            return;
        }

        const fetchSongs = async () => {
            try {
                const res = await axios.get('/api/songs');
                setAvailableSongs(res.data || []);
            } catch (err) {
                console.error('곡 목록 로딩 실패:', err);
                setAvailableSongs([]);
            } finally {
                setLoadingSongs(false);
            }
        };

        fetchSongs();
    }, [isLoggedIn]);

    const toggleSongSelection = (songId) => {
        setSelectedSongIds(prev =>
            prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]
        );
    };

    const handleCreateAlbum = (event) => {
        event.preventDefault();
        if (!form.title.trim()) {
            setError('앨범 제목을 입력해주세요.');
            return;
        }
        if (selectedSongIds.length === 0) {
            setError('앨범에 넣을 노래를 하나 이상 선택해주세요.');
            return;
        }

        setAlbums(prev => [
            {
                id: Date.now(),
                title: form.title.trim(),
                description: form.description.trim(),
                coverUrl: form.coverUrl.trim() || '/images/music.png',
                songIds: selectedSongIds,
                createdAt: new Date().toLocaleDateString('ko-KR'),
            },
            ...prev,
        ]);

        setForm({ title: '', description: '', coverUrl: '/images/music.png' });
        setSelectedSongIds([]);
        setError('');
    };

    const handleSendAlbumToPlayer = (album) => {
        localStorage.setItem(queueKey, JSON.stringify(album.songIds));
        localStorage.setItem(albumNameKey, album.title);
        navigate('/');
    };

    const handleRemoveAlbum = (id) => {
        setAlbums(prev => prev.filter(album => album.id !== id));
    };

    return (
        <div style={{ minHeight: '100vh', padding: '40px 16px', background: 'var(--bg)', color: 'var(--text)' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
                <section style={{ background: 'var(--surface)', borderRadius: '12px', padding: '24px', boxShadow: '0 16px 40px rgba(0,0,0,0.06)' }}>
                    <h2 style={{ marginBottom: '12px', fontSize: '22px' }}>나만의 앨범 보관함</h2>
                    <p style={{ marginBottom: '18px', color: 'var(--muted)' }}>
                        플레이어에 던져줄 음악 데이터를 직접 구성해보세요. 업로드된 곡 중에서 앨범을 만들고, 선택한 앨범을 곧바로 플레이어로 보낼 수 있습니다.
                    </p>

                    <form onSubmit={handleCreateAlbum} style={{ display: 'grid', gap: '12px' }}>
                        <label style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                            앨범 제목
                            <input
                                value={form.title}
                                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="앨범 제목을 입력하세요"
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-soft)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                            />
                        </label>
                        <label style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                            앨범 설명
                            <input
                                value={form.description}
                                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="간단한 앨범 설명"
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-soft)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                            />
                        </label>
                        <label style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                            표지 이미지 URL
                            <input
                                value={form.coverUrl}
                                onChange={(e) => setForm(prev => ({ ...prev, coverUrl: e.target.value }))}
                                placeholder="이미지 URL을 입력하거나 기본 이미지 사용"
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-soft)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                            />
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{ color: 'var(--muted)', fontSize: '13px' }}>
                                선택된 곡 {selectedSongIds.length}개
                            </div>
                            <button type="submit" style={{ padding: '12px 18px', background: 'var(--action-bg)', color: 'var(--action-text)', border: 'none', borderRadius: '8px', fontWeight: 600 }}>
                                앨범 저장
                            </button>
                        </div>
                        {error && <p style={{ color: 'var(--danger)', margin: 0, fontSize: '13px' }}>{error}</p>}
                    </form>

                    <div style={{ marginTop: '28px' }}>
                        <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>업로드된 곡 목록</p>
                            {loadingSongs && <span style={{ fontSize: '12px', color: 'var(--muted)' }}>로딩 중...</span>}
                        </div>
                        {availableSongs.length === 0 ? (
                            <div style={{ padding: '24px', borderRadius: '12px', background: 'var(--surface-alt)', color: 'var(--muted)' }}>
                                업로드된 음악이 없거나, 로그인 상태를 확인해주세요.
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {availableSongs.map(song => (
                                    <button
                                        key={song.id}
                                        type="button"
                                        onClick={() => toggleSongSelection(song.id)}
                                        style={{
                                            width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: '10px', border: selectedSongIds.includes(song.id) ? '1px solid var(--action-bg)' : '1px solid var(--border)',
                                            background: selectedSongIds.includes(song.id) ? 'var(--surface-strong)' : 'var(--surface-alt)', color: 'var(--text)', cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                                            <span>{song.title}</span>
                                            <span style={{ color: 'var(--muted)', fontSize: '12px' }}>{song.artist}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section style={{ display: 'grid', gap: '18px' }}>
                    {albums.length === 0 ? (
                        <div style={{ padding: '48px 24px', borderRadius: '16px', background: 'var(--surface)', border: '1px dashed var(--border)', color: 'var(--muted)' }}>
                            저장된 앨범이 없습니다. 왼쪽에서 앨범을 만들어보세요.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '18px' }}>
                            {albums.map(album => (
                                <article key={album.id} style={{ background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 12px 28px rgba(0,0,0,0.05)' }}>
                                    <div style={{ width: '100%', aspectRatio: '1 / 1', background: 'var(--surface-strong)' }}>
                                        <img
                                            src={album.coverUrl || '/images/music.png'}
                                            alt={album.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => { e.target.src = '/images/music.png'; }}
                                        />
                                    </div>
                                    <div style={{ padding: '18px', display: 'grid', gap: '10px' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 6px', fontSize: '18px' }}>{album.title}</h4>
                                            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13px' }}>{album.description || '앨범 설명이 없습니다.'}</p>
                                        </div>
                                        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '12px' }}>선택된 곡 {album.songIds.length}개 · 추가일 {album.createdAt}</p>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            <button
                                                type="button"
                                                onClick={() => handleSendAlbumToPlayer(album)}
                                                style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--action-bg)', color: 'var(--action-text)', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                                            >
                                                플레이어로 보내기
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAlbum(album.id)}
                                                style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', cursor: 'pointer' }}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
