import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh', background: '#f5f0e8',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: '16px',
                }}>
                    <p style={{ fontSize: '14px', color: '#999', letterSpacing: '0.06em' }}>
                        문제가 발생했습니다
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '9px 20px', background: '#1a1a1a',
                            color: '#f5f0e8', border: 'none', borderRadius: '2px',
                            fontSize: '12px', cursor: 'pointer', letterSpacing: '0.06em',
                        }}
                    >
                        새로고침
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}