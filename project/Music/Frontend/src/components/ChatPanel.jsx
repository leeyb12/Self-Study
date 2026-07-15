import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function chatUrl(token) {
    const explicitUrl = process.env.REACT_APP_WS_BASE_URL?.replace(/\/$/, '');
    if (explicitUrl) {
        return `${explicitUrl}/ws/chat?token=${encodeURIComponent(token)}`;
    }

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, '');
    if (apiBaseUrl) {
        return `${apiBaseUrl.replace(/^http/, 'ws')}/ws/chat?token=${encodeURIComponent(token)}`;
    }

    return `ws://localhost:8080/ws/chat?token=${encodeURIComponent(token)}`;
}

export default function ChatPanel({ isOpen, onClose }) {
    const { isLoggedIn, username, token } = useAuth();
    const wsRef     = useRef(null);
    const bottomRef = useRef(null);

    const [input,        setInput]        = useState('');
    const [connected,    setConnected]    = useState(false);
    const [users,        setUsers]        = useState([]);
    const [activeTab,    setActiveTab]    = useState('public');
    const [roomMessages, setRoomMessages] = useState({ public: [] });
    const [unread,       setUnread]       = useState({});

    useEffect(() => {
        if (!isOpen || !isLoggedIn || !token) return;

        const ws = new WebSocket(chatUrl(token));
        wsRef.current = ws;

        ws.onopen = () => {
            setConnected(true);
            ws.send(JSON.stringify({
                type:   'CONNECT',
                sender: username,
            }));
        };

        ws.onmessage = (e) => {
            const dto = JSON.parse(e.data);

            // 접속자 목록 갱신
            if (dto.type === 'USER_LIST') {
                const list = dto.message
                    ? dto.message.split(',').filter(u => u && u !== username)
                    : [];
                setUsers(list);
                return;
            }

            // 1:1 메시지
            if (dto.type === 'PRIVATE') {
                const roomKey = dto.sender === username
                    ? dto.receiver
                    : dto.sender;

                setRoomMessages(prev => ({
                    ...prev,
                    [roomKey]: [...(prev[roomKey] ?? []), dto],
                }));

                // 현재 탭이 아닌 방에 메시지 오면 미읽음 표시
                setActiveTab(current => {
                    if (current !== roomKey) {
                        setUnread(u => ({ ...u, [roomKey]: (u[roomKey] ?? 0) + 1 }));
                    }
                    return current;
                });
                return;
            }

            // 전체 메시지
            setRoomMessages(prev => ({
                ...prev,
                public: [...(prev.public ?? []), dto],
            }));

            setActiveTab(current => {
                if (current !== 'public') {
                    setUnread(u => ({ ...u, public: (u.public ?? 0) + 1 }));
                }
                return current;
            });
        };

        ws.onclose = () => {
            setConnected(false);
            setUsers([]);
        };
        ws.onerror = () => setConnected(false);

        return () => ws.close();
    }, [isOpen, isLoggedIn, username, token]);

    // 탭 전환 시 스크롤 + 미읽음 초기화
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        setUnread(prev => ({ ...prev, [activeTab]: 0 }));
    }, [activeTab, roomMessages]);

    const sendMessage = () => {
        if (!input.trim() || !wsRef.current) return;
        if (wsRef.current.readyState !== WebSocket.OPEN) return;

        wsRef.current.send(JSON.stringify({
            type:     activeTab === 'public' ? 'PUBLIC' : 'PRIVATE',
            sender:   username,
            receiver: activeTab === 'public' ? null : activeTab,
            message:  input.trim(),
        }));
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const openDm = (user) => {
        setActiveTab(user);
        setRoomMessages(prev => ({ ...prev, [user]: prev[user] ?? [] }));
        setUnread(prev => ({ ...prev, [user]: 0 }));
    };

    const currentMessages = roomMessages[activeTab] ?? [];

    return (
        <div style={{
            ...panelStyle,
            transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}>
            {/* 헤더 */}
            <div style={headerStyle}>
                <span style={{ fontSize: '13px', letterSpacing: '0.06em', color: 'var(--text)' }}>
                    채팅
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: connected ? 'var(--success)' : 'var(--muted)',
                        display: 'inline-block',
                    }} />
                    <button onClick={onClose} style={closeBtnStyle}>✕</button>
                </div>
            </div>

            {/* 탭 — 전체 + 1:1 */}
                <div style={{
                display: 'flex',
                borderBottom: '1px solid var(--surface-strong)',
                overflowX: 'auto',
                flexShrink: 0,
            }}>
                {/* 전체 탭 */}
                <button
                    onClick={() => setActiveTab('public')}
                    style={{
                        ...tabBtnStyle,
                        borderBottom: activeTab === 'public'
                            ? '2px solid var(--text)' : '2px solid transparent',
                        color: activeTab === 'public' ? 'var(--text)' : 'var(--muted)',
                        position: 'relative',
                    }}
                >
                    전체
                    {(unread.public ?? 0) > 0 && (
                        <span style={badgeStyle}>{unread.public}</span>
                    )}
                </button>

                {/* 1:1 탭 — 접속자별 */}
                {users.map(u => (
                    <button
                        key={u}
                        onClick={() => openDm(u)}
                        style={{
                            ...tabBtnStyle,
                            borderBottom: activeTab === u
                                ? '2px solid var(--text)' : '2px solid transparent',
                            color: activeTab === u ? 'var(--text)' : 'var(--muted)',
                            whiteSpace: 'nowrap',
                            position: 'relative',
                        }}
                    >
                        {u}
                        {(unread[u] ?? 0) > 0 && (
                            <span style={badgeStyle}>{unread[u]}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* 접속 정보 */}
            <div style={{
                padding: '6px 16px',
                fontSize: '10px',
                color: 'var(--muted)',
                borderBottom: '1px solid var(--surface-strong)',
                flexShrink: 0,
            }}>
                접속자 {users.length + (connected ? 1 : 0)}명
                {activeTab !== 'public' && (
                    <span style={{ marginLeft: '8px', color: 'var(--muted)' }}>
                        · {activeTab}님과 1:1 채팅 중
                    </span>
                )}
                {activeTab === 'public' && users.length === 0 && connected && (
                    <span style={{ marginLeft: '8px', color: 'var(--muted)' }}>
                        · 다른 사용자가 없습니다
                    </span>
                )}
            </div>

            {/* 메시지 목록 */}
            <div style={messageListStyle}>
                {currentMessages.length === 0 && (
                    <p style={{
                            textAlign: 'center', color: 'var(--muted)',
                            fontSize: '12px', marginTop: '40px',
                        }}>
                        {activeTab === 'public'
                            ? '전체 채팅을 시작해보세요'
                            : `${activeTab}님에게 메시지를 보내보세요`}
                    </p>
                )}

                {currentMessages.map((msg, i) => {
                    const isMine = msg.sender === username;
                    return (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                gap: '6px',
                                justifyContent: isMine ? 'flex-end' : 'flex-start',
                            }}
                        >
                            {/* 상대방 이름 */}
                            {!isMine && activeTab === 'public' && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '2px' }}>
                                        {msg.sender}
                                    </span>
                                    <div style={{ ...bubbleStyle, background: 'var(--surface-alt)', color: 'var(--text)', borderRadius: '12px 12px 12px 2px' }}>
                                        {msg.message}
                                    </div>
                                </div>
                            )}

                            {!isMine && activeTab !== 'public' && (
                                <div style={{ ...bubbleStyle, background: 'var(--surface-alt)', color: 'var(--text)', borderRadius: '12px 12px 12px 2px' }}>
                                    {msg.message}
                                </div>
                            )}

                            {isMine && (
                                <div style={{ ...bubbleStyle, background: 'var(--action-bg)', color: 'var(--action-text)', borderRadius: '12px 12px 2px 12px' }}>
                                    {msg.message}
                                </div>
                            )}

                            <span style={{ fontSize: '10px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                                {msg.time}
                            </span>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* 입력창 */}
            {isLoggedIn ? (
                <div style={{
                    padding: '12px 16px',
                    borderTop: '1px solid var(--surface-strong)',
                    display: 'flex',
                    gap: '8px',
                    flexShrink: 0,
                }}>
                    <input
                        style={{
                            flex: 1,
                            padding: '8px 10px',
                            border: '1px solid var(--border-soft)',
                            borderRadius: '2px',
                            fontSize: '12px',
                            outline: 'none',
                            background: 'var(--surface-alt)',
                            fontFamily: 'inherit',
                            color: 'var(--text)'
                        }}
                        placeholder={
                            activeTab === 'public'
                                ? '전체에게 메시지...'
                                : `${activeTab}에게...`
                        }
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={!connected}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!connected || !input.trim()}
                        style={{
                            padding: '8px 14px',
                            background: 'var(--action-bg)',
                            color: 'var(--action-text)',
                            border: 'none',
                            borderRadius: '2px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                        }}
                    >
                        전송
                    </button>
                </div>
            ) : (
                <p style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#aaa',
                    padding: '16px',
                    flexShrink: 0,
                }}>
                    로그인 후 채팅에 참여할 수 있습니다
                </p>
            )}
        </div>
    );
}

/* ── 스타일 ── */
const panelStyle = {
    position: 'fixed', top: 0, right: 0,
    width: '300px', height: '100vh',
    background: 'var(--surface)',
    boxShadow: `-4px 0 20px var(--shadow)`,
    display: 'flex', flexDirection: 'column',
    transition: 'transform 0.3s ease',
    zIndex: 100,
};

const headerStyle = {
    padding: '16px 20px',
    borderBottom: '1px solid var(--surface-strong)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
};

const messageListStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
};

const tabBtnStyle = {
    padding: '8px 14px',
    background: 'transparent',
    border: 'none',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: '0.04em',
    marginBottom: '-1px',
};

const bubbleStyle = {
    maxWidth: '180px',
    padding: '8px 12px',
    fontSize: '13px',
    lineHeight: '1.5',
    wordBreak: 'break-word',
};

const closeBtnStyle = {
    background: 'transparent',
    border: 'none',
    fontSize: '14px',
    color: 'var(--muted)',
    cursor: 'pointer',
};

const badgeStyle = {
    position: 'absolute',
    top: '4px',
    right: '2px',
    background: 'var(--danger)',
    color: 'var(--action-text)',
    borderRadius: '50%',
    width: '14px',
    height: '14px',
    fontSize: '9px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
};
