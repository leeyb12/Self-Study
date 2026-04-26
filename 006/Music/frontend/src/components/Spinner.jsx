export default function Spinner({ text = '로딩 중...' }) {
    return (
        <div style={wrapStyle}>
            <div style={discStyle} />
            <p style={textStyle}>{text}</p>
        </div>
    );
}

const wrapStyle = {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '16px', padding: '40px 0',
};
const discStyle = {
    width: '32px', height: '32px',
    borderRadius: '50%',
    border: '2px solid #e0dbd2',
    borderTopColor: '#1a1a1a',
    animation: 'spinSmall 0.8s linear infinite',
};
const textStyle = {
    fontSize: '12px', color: '#aaa',
    letterSpacing: '0.06em', margin: 0,
};