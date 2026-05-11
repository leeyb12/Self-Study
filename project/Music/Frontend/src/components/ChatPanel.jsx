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

    useEffect(() => {
        if (!isOpen || !isLoggedIn) return;
        const ws = new WebSocket('ws://localhost:8080/ws/chat');
        wsRef.current = ws;

        ws.onopen = () => {
            setConnected(true);
            ws.send(JSON.stringify({ type: 'CONNECT', sender: username }));
        };

        ws.onmessage = (e) => {
            const dto = JSON.parse(e.data);

            if (dto.type === 'USER_LIST') {
                setUsers(
                    dto.message
                        ? dto.message.split(',').filter(u => u && u !== username)
                        : []
                );
                return;
            }

            if (dto.type === 'PRIVATE') {
                const roomKey = dto.sender === username ? dto.receiver : dto.sender;
                setRoomMessages(prev => ({
                    ...prev,
                    [roomKey]: [...(prev[roomKey] ?? []), dto],
                }));
            } else {
                setRoomMessages(prev => ({
                    ...prev,
                    public: [...(prev.public ?? []), dto],
                }));
            }
        };

        ws.onclose = () => setConnected(false);
        ws.onerror = () => setConnected(false);
        return () => ws.close();
    }, [isOpen, isLoggedIn, username]);

    // 탭 변경 또는 새 메시지 시 스크롤 하단 이동
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [roomMessages, activeTab]);

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
    };

    const currentMessages = roomMessages[activeTab] ?? [];

    return (
        <div style={{ ...panelStyle, transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>

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
            <div style={{ display: 'flex', borderBottom: '1px solid #f0ebe2', overflowX: 'auto', flexShrink: 0 }}>
                <button
                    onClick={() => setActiveTab('public')}
                    style={{
                        ...tabBtnStyle,
                        borderBottom: activeTab === 'public' ? '2px solid #1a1a1a' : '2px solid transparent',
                        color:        activeTab === 'public' ? '#1a1a1a' : '#aaa',
                    }}
                >
                    전체
                </button>
                {users.map(u => (
                    <button
                        key={u}
                        onClick={() => openDm(u)}
                        style={{
                            ...tabBtnStyle,
                            borderBottom: activeTab === u ? '2px solid #1a1a1a' : '2px solid transparent',
                            color:        activeTab === u ? '#1a1a1a' : '#aaa',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {u}
                    </button>
                ))}
            </div>

            {/* 접속자 정보 */}
            <div style={{ padding: '6px 16px', fontSize: '10px', color: '#bbb', borderBottom: '1px solid #f5f2ed', flexShrink: 0 }}>
                현재 접속자 {users.length + (connected ? 1 : 0)}명
                {activeTab !== 'public' && (
                    <span style={{ marginLeft: '8px', color: '#aaa' }}>
                        · {activeTab}님과 1:1 채팅
                    </span>
                )}
            </div>

            {/* 메시지 목록 */}
            <div style={messageListStyle}>
                {currentMessages.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#ccc', fontSize: '12px', marginTop: '40px' }}>
                        {activeTab === 'public'
                            ? '대화를 시작해보세요'
                            : `${activeTab}님에게 메시지 보내기`}
                    </p>
                )}
                {currentMessages.map((msg, i) => (
                    <div
                        key={i}
                        style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            gap: '6px',
                            justifyContent: msg.sender === username ? 'flex-end' : 'flex-start',
                        }}
                    >
                        {msg.sender !== username && (
                            <span style={{ fontSize: '10px', color: '#aaa', marginBottom: '2px' }}>
                                {msg.sender}
                            </span>
                        )}
                        <div style={{
                            maxWidth: '180px',
                            padding: '8px 12px',
                            fontSize: '13px',
                            lineHeight: '1.5',
                            wordBreak: 'break-word',
                            background:   msg.sender === username ? '#1a1a1a' : '#f0ebe2',
                            color:        msg.sender === username ? '#f5f0e8' : '#1a1a1a',
                            borderRadius: msg.sender === username
                                ? '12px 12px 2px 12px'
                                : '12px 12px 12px 2px',
                        }}>
                            {msg.message}
                        </div>
                        <span style={{ fontSize: '10px', color: '#ccc', whiteSpace: 'nowrap' }}>
                            {msg.time}
                        </span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* 입력창 */}
            {isLoggedIn ? (
                <div style={{ padding: '12px 16px', borderTop: '1px solid #f0ebe2', display: 'flex', gap: '8px', flexShrink: 0 }}>
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
                        placeholder={activeTab === 'public' ? '전체에게 메시지...' : `${activeTab}에게...`}
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
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#aaa', padding: '16px', flexShrink: 0 }}>
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
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexShrink: 0,
};
const messageListStyle = {
    flex: 1, overflowY: 'auto',
    padding: '16px',
    display: 'flex', flexDirection: 'column', gap: '10px',
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
const closeBtnStyle = {
    background: 'transparent',
    border: 'none',
    fontSize: '14px',
    color: '#aaa',
    cursor: 'pointer',
};