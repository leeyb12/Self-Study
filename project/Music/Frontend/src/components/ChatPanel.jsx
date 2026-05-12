import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ChatPanel({ isOpen, onClose }) {
    const { isLoggedIn, username } = useAuth();
    const wsRef     = useRef(null);
    const bottomRef = useRef(null);

    const [input,        setInput]        = useState('');
    const [connected,    setConnected]    = useState(false);
    const [users,        setUsers]        = useState([]);
    const [activeTab,    setActiveTab]    = useState('public');
    const [roomMessages, setRoomMessages] = useState({ public: [] });
    const [unread,       setUnread]       = useState({});

    useEffect(() => {
        if (!isOpen || !isLoggedIn) return;

        const ws = new WebSocket('ws://localhost:8080/ws/chat');
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
    }, [isOpen, isLoggedIn, username]);

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
                <span style={{ fontSize: '13px', letterSpacing: '0.06em', color: '#1a1a1a' }}>
                    채팅
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: connected ? '#27ae60' : '#ccc',
                        display: 'inline-block',
                    }} />
                    <button onClick={onClose} style={closeBtnStyle}>✕</button>
                </div>
            </div>

            {/* 탭 — 전체 + 1:1 */}
            <div style={{
                display: 'flex',
                borderBottom: '1px solid #f0ebe2',
                overflowX: 'auto',
                flexShrink: 0,
            }}>
                {/* 전체 탭 */}
                <button
                    onClick={() => setActiveTab('public')}
                    style={{
                        ...tabBtnStyle,
                        borderBottom: activeTab === 'public'
                            ? '2px solid #1a1a1a' : '2px solid transparent',
                        color: activeTab === 'public' ? '#1a1a1a' : '#aaa',
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
                                ? '2px solid #1a1a1a' : '2px solid transparent',
                            color: activeTab === u ? '#1a1a1a' : '#aaa',
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
                color: '#bbb',
                borderBottom: '1px solid #f5f2ed',
                flexShrink: 0,
            }}>
                접속자 {users.length + (connected ? 1 : 0)}명
                {activeTab !== 'public' && (
                    <span style={{ marginLeft: '8px', color: '#aaa' }}>
                        · {activeTab}님과 1:1 채팅 중
                    </span>
                )}
                {activeTab === 'public' && users.length === 0 && connected && (
                    <span style={{ marginLeft: '8px', color: '#ccc' }}>
                        · 다른 사용자가 없습니다
                    </span>
                )}
            </div>

            {/* 메시지 목록 */}
            <div style={messageListStyle}>
                {currentMessages.length === 0 && (
                    <p style={{
                        textAlign: 'center', color: '#ccc',
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
                                    <span style={{ fontSize: '10px', color: '#aaa', marginBottom: '2px' }}>
                                        {msg.sender}
                                    </span>
                                    <div style={{ ...bubbleStyle, background: '#f0ebe2', color: '#1a1a1a', borderRadius: '12px 12px 12px 2px' }}>
                                        {msg.message}
                                    </div>
                                </div>
                            )}

                            {!isMine && activeTab !== 'public' && (
                                <div style={{ ...bubbleStyle, background: '#f0ebe2', color: '#1a1a1a', borderRadius: '12px 12px 12px 2px' }}>
                                    {msg.message}
                                </div>
                            )}

                            {isMine && (
                                <div style={{ ...bubbleStyle, background: '#1a1a1a', color: '#f5f0e8', borderRadius: '12px 12px 2px 12px' }}>
                                    {msg.message}
                                </div>
                            )}

                            <span style={{ fontSize: '10px', color: '#ccc', whiteSpace: 'nowrap' }}>
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
                    borderTop: '1px solid #f0ebe2',
                    display: 'flex',
                    gap: '8px',
                    flexShrink: 0,
                }}>
                    <input
                        style={{
                            flex: 1,
                            padding: '8px 10px',
                            border: '1px solid #e0dbd2',
                            borderRadius: '2px',
                            fontSize: '12px',
                            outline: 'none',
                            background: '#faf9f6',
                            fontFamily: 'inherit',
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
                            background: '#1a1a1a',
                            color: '#f5f0e8',
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
    background: '#fff',
    boxShadow: '-4px 0 20px rgba(0,0,0,0.08)',
    display: 'flex', flexDirection: 'column',
    transition: 'transform 0.3s ease',
    zIndex: 100,
};

const headerStyle = {
    padding: '16px 20px',
    borderBottom: '1px solid #f0ebe2',
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
    color: '#aaa',
    cursor: 'pointer',
};

const badgeStyle = {
    position: 'absolute',
    top: '4px',
    right: '2px',
    background: '#c0392b',
    color: '#fff',
    borderRadius: '50%',
    width: '14px',
    height: '14px',
    fontSize: '9px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
};