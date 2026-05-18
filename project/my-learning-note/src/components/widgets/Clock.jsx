import { useState, useEffect } from 'react';

// 매번 새로 생성될 필요가 없는 고정 데이터는 컴포넌트 외부로 분리하는 것이 좋습니다.
const DAY_CLASSES = ['day-sun', 'day-mon', 'day-tue', 'day-wed', 'day-thu', 'day-fri', 'day-sat'];
const DAY_KO = ['일', '월', '화', '수', '목', '금', '토'];
const MONTH_KO = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

function pad(n) { 
  return String(n).padStart(2, '0'); 
}

const Clock = () => {
  // 1. 현재 시간 전체를 하나의 state로 관리합니다.
  const [now, setNow] = useState(new Date());

  // 2. 타이머나 외부 API 연동 등은 반드시 useEffect 안에서 처리해야 합니다.
  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date()); // 1초마다 현재 시간을 갱신 -> 컴포넌트 리렌더링
    }, 1000);

    // [중요] 컴포넌트가 화면에서 사라질 때(Unmount) 타이머를 청소(Clean-up)해줍니다.
    return () => clearInterval(timerId);
  }, []);

  // 3. 시간 데이터 계산 (렌더링될 때마다 자동으로 계산됨)
  const h24 = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();
  const dow = now.getDay();
  
  const ampm = h24 < 12 ? 'AM' : 'PM';
  const h12 = h24 % 12 || 12; // 12시간제 변환

  return (
    <div className="clock-widget">
      {/* 날짜 영역 */}
      <div className="clock-date-container">
        <span id="clockDate">
          {`${now.getFullYear()}년 ${MONTH_KO[now.getMonth()]} ${now.getDate()}일`}
        </span>
        {/* 요일 배지 (클래스명이 동적으로 변경됨) */}
        <span id="clockDay" className={`clock-day-badge ${DAY_CLASSES[dow]}`}>
          {DAY_KO[dow]}요일
        </span>
      </div>

      {/* 시간 영역 */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <div className="clock-time">
          <span id="clockHH">{pad(h12)}</span>
          <span className="colon">:</span>
          <span id="clockMM">{pad(min)}</span>
          <span className="colon">:</span>
          <span id="clockSS" className="seconds">{pad(sec)}</span>
        </div>
        <span id="clockAmpm" className="clock-ampm">{ampm}</span>
      </div>
    </div>
  );
};

export default Clock;