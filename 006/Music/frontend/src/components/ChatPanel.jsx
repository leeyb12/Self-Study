import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ChatPanel({ isOpen, onClose }) {
    const { isLoggedIn, username } = useAuth();
    const wsRef     = useRef(null);
    const bottomRef = useRef(null);

    const [messages,  setMessages]  = useState([]);
    const [input,     setInput]     = useState('');
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const ws = new WebSocket('ws://localhost:8080/ws/chat');
        wsRef.current = ws;
        ws.onopen    = () => setConnected(true);
        ws.onmessage = (e) => setMessages(prev => [...prev, JSON.parse(e.data)]);
        ws.onclose   = () => setConnected(false);
        ws.onerror   = () => setConnected(false);
        return () => ws.close();
    }, [isOpen]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() || !wsRef.current) return;
        if (wsRef.current.readyState !== WebSocket.OPEN) return;
        wsRef.current.send(JSON.stringify({ sender: username, message: input.trim() }));
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    return (
        <div style={{ ...panelStyle, transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>
            <div style={headerStyle}>
                <span style={{ fontSize: '13px', letterSpacing: '0.06em', color: '#1a1a1a' }}>실시간 채팅</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: connected ? '#27ae60' : '#ccc', display: 'inline-block' }} />
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '14px', color: '#aaa', cursor: 'pointer' }}>✕</button>
                </div>
            </div>

            <div style={messageListStyle}>
                {messages.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#ccc', fontSize: '12px', marginTop: '40px' }}>대화를 시작해보세요</p>
                )}
                {messages.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', justifyContent: msg.sender === username ? 'flex-end' : 'flex-start' }}>
                        {msg.sender !== username && (
                            <span style={{ fontSize: '10px', color: '#aaa' }}>{msg.sender}</span>
                        )}
                        <div style={{
                            maxWidth: '180px', padding: '8px 12px', fontSize: '13px', lineHeight: '1.5', wordBreak: 'break-word',
                            background:   msg.sender === username ? '#1a1a1a' : '#f0ebe2',
                            color:        msg.sender === username ? '#f5f0e8' : '#1a1a1a',
                            borderRadius: msg.sender === username ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                        }}>
                            {msg.message}
                        </div>
                        <span style={{ fontSize: '10px', color: '#ccc', whiteSpace: 'nowrap' }}>{msg.time}</span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {isLoggedIn ? (
                <div style={{ padding: '12px 16px', borderTop: '1px solid #f0ebe2', display: 'flex', gap: '8px' }}>
                    <input
                        style={{ flex: 1, padding: '8px 10px', border: '1px solid #e0dbd2', borderRadius: '2px', fontSize: '12px', outline: 'none', background: '#faf9f6' }}
                        placeholder="메시지 입력..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={!connected}
                    />
                    <button onClick={sendMessage} disabled={!connected || !input.trim()}
                        style={{ padding: '8px 14px', background: '#1a1a1a', color: '#f5f0e8', border: 'none', borderRadius: '2px', fontSize: '12px', cursor: 'pointer' }}>
                        전송
                    </button>
                </div>
            ) : (
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#aaa', padding: '16px' }}>
                    로그인 후 채팅에 참여할 수 있습니다
                </p>
            )}
        </div>
    );
}

const panelStyle       = { position: 'fixed', top: 0, right: 0, width: '300px', height: '100vh', background: '#fff', boxShadow: '-4px 0 20px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease', zIndex: 100 };
const headerStyle      = { padding: '16px 20px', borderBottom: '1px solid #f0ebe2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const messageListStyle = { flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' };