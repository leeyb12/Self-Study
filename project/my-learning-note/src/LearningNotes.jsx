import { useState, useEffect, useRef, useCallback } from "react";

// ──────────────────────────────────────────────────────────────
// 0. 상수 & 데이터
// ──────────────────────────────────────────────────────────────
const WMO_CODES = {
  0:["☀️","맑음"],1:["🌤️","대체로 맑음"],2:["⛅","구름 조금"],3:["☁️","흐림"],
  45:["🌫️","안개"],48:["🌫️","짙은 안개"],51:["🌦️","가랑비"],53:["🌦️","이슬비"],
  55:["🌧️","강한 이슬비"],61:["🌧️","약한 비"],63:["🌧️","비"],65:["🌧️","강한 비"],
  71:["🌨️","약한 눈"],73:["❄️","눈"],75:["❄️","강한 눈"],80:["🌦️","소나기"],
  81:["🌧️","강한 소나기"],82:["⛈️","폭우"],95:["⛈️","뇌우"],99:["⛈️","강한 우박 뇌우"],
};
const DAY_KO   = ["일","월","화","수","목","금","토"];
const MONTH_KO = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
const DAY_COLORS = ["#f87171","#4a9eff","#ff6b35","#34d399","#fbbf24","#a78bfa","#60a5fa"];
const DAY_BG    = ["rgba(248,113,113,.10)","rgba(74,158,255,.10)","rgba(255,107,53,.10)",
                   "rgba(52,211,153,.10)","rgba(251,191,36,.10)","rgba(167,139,250,.10)","rgba(96,165,250,.10)"];

const CODE_ONLY_EXTS = new Set(["py","js","css","txt","json","md"]);
const LANG_MAP = { html:"html", css:"css", js:"javascript", py:"python", json:"json", md:"markdown", txt:"plaintext" };
const LANG_LABEL = { html:"HTML", css:"CSS", javascript:"JS", python:"Python", plaintext:"TEXT" };
const LANG_CLS   = { html:"html", css:"css", javascript:"js", python:"py", plaintext:"text" };

const COL_META = {
  html: { accent:"#ff6b35", dimBg:"rgba(255,107,53,.10)", border:"rgba(255,107,53,.25)", label:"HTML" },
  css:  { accent:"#4a9eff", dimBg:"rgba(74,158,255,.10)",  border:"rgba(74,158,255,.25)",  label:"CSS"  },
  js:   { accent:"#fbbf24", dimBg:"rgba(251,191,36,.10)",  border:"rgba(251,191,36,.25)",  label:"JS"   },
  ex:   { accent:"#a78bfa", dimBg:"rgba(167,139,250,.10)", border:"rgba(167,139,250,.25)", label:"ex"   },
  list: { accent:"#34d399", dimBg:"rgba(52,211,153,.10)",  border:"rgba(52,211,153,.25)",  label:"README"},
};

const COLUMNS_DATA = [
  {
    id:"html", colType:"html",
    folders:[
      { name:"ex01", items:[
        {num:"01",name:"헤딩 태그",src:"./ex01/ex01-01.html"},
        {num:"02",name:"하이퍼링크",src:"./ex01/ex01-02.html"},
        {num:"03",name:"띄어쓰기 & 엔터",src:"./ex01/ex01-03.html"},
        {num:"04",name:"자주 쓰는 태그와 특징",src:"./ex01/ex01-04.html"},
        {num:"05",name:"시맨틱 레이아웃",src:"./ex01/ex01-05.html"},
        {num:"06",name:"시맨틱 태그",src:"./ex01/ex01-06.html"},
        {num:"07",name:"링크",src:"./ex01/ex01-07.html"},
      ]},
      { name:"ex02", items:[
        {num:"01",name:"input 기능",src:"./ex02/ex02-01.html"},
        {num:"01-1",name:"input 기능-2",src:"./ex02/ex02-01a.html"},
        {num:"02",name:"input 응용",src:"./ex02/ex02-02.html"},
        {num:"02-1",name:"알림창",src:"./ex02/ex02-02a.html"},
        {num:"03",name:"패턴테스트",src:"./ex02/ex02-03.html"},
        {num:"04",name:"input 응용-2",src:"./ex02/ex02-04.html"},
        {num:"05",name:"리스트 응용",src:"./ex02/ex02-05.html"},
        {num:"06",name:"연습문제",src:"./ex02/ex02-06.html"},
        {num:"07",name:"리스트 응용-2",src:"./ex02/ex02-07.html"},
        {num:"08",name:"정의리스트",src:"./ex02/ex02-08.html"},
        {num:"09",name:"오디오와 비디오 삽입하기",src:"./ex02/ex02-09.html"},
        {num:"10",name:"표 구조",src:"./ex02/ex02-10.html"},
        {num:"11",name:"표 구조 응용",src:"./ex02/ex02-11.html"},
      ]},
    ],
  },
  {
    id:"css", colType:"css",
    folders:[
      { name:"ex03", items:[
        {num:"01",name:"테이블 구조",src:"./ex03/ex03-01.html"},
        {num:"02",name:"테이블 응용",src:"./ex03/ex03-02.html"},
        {num:"03",name:"태그 그외",src:"./ex03/ex03-03.html"},
        {num:"04",name:"외부스타일",src:"./ex03/ex03-04.html"},
        {num:"05",name:"div 응용",src:"./ex03/ex03-05.html"},
        {num:"06",name:"선택자 id, class",src:"./ex03/ex03-06.html"},
        {num:"07",name:"복합선택자",src:"./ex03/ex03-07.html"},
        {num:"08",name:"자식선택자",src:"./ex03/ex03-08.html"},
        {num:"09",name:"인접선택자",src:"./ex03/ex03-09.html"},
        {num:"10",name:"형제 선택자",src:"./ex03/ex03-10.html"},
        {num:"11",name:"CDN, 구글폰트",src:"./ex03/ex03-11.html"},
        {num:"12",name:"아이콘",src:"./ex03/ex03-12.html"},
      ]},
      { name:"ex04", items:[
        {num:"01",name:"속성선택자",src:"./ex04/ex04-01.html"},
        {num:"02",name:"가상선택자 응용",src:"./ex04/ex04-02.html"},
        {num:"03",name:"미니얼페이지",src:"./ex04/ex04-03.html"},
        {num:"04",name:"폰트",src:"./ex04/ex04-04.html"},
        {num:"05",name:"텍스트 정렬",src:"./ex04/ex04-05.html"},
        {num:"06",name:"줄간격",src:"./ex04/ex04-06.html"},
        {num:"07",name:"text-decoration",src:"./ex04/ex04-07.html"},
        {num:"08",name:"text-shadow",src:"./ex04/ex04-08.html"},
        {num:"09",name:"border-box",src:"./ex04/ex04-09.html"},
        {num:"10",name:"background",src:"./ex04/ex04-10.html"},
        {num:"11",name:"border",src:"./ex04/ex04-11.html"},
        {num:"12",name:"box position",src:"./ex04/ex04-12.html"},
        {num:"13",name:"프사만들기",src:"./ex04/ex04-13.html"},
        {num:"14",name:"position",src:"./ex04/ex04-14.html"},
        {num:"15",name:"float",src:"./ex04/ex04-15.html"},
        {num:"16",name:"리스트 응용",src:"./ex04/ex04-16.html"},
        {num:"17",name:"background 2",src:"./ex04/ex04-17.html"},
      ]},
      { name:"ex05", items:[
        {num:"01",name:"background(네이버아이콘)",src:"./ex05/ex05-01.html"},
        {num:"02",name:"position fixed",src:"./ex05/ex05-02.html"},
        {num:"03",name:"가운데 정렬",src:"./ex05/ex05-03.html"},
        {num:"04",name:"float 응용(레이아웃)",src:"./ex05/ex05-04.html"},
        {num:"05",name:"그라데이션",src:"./ex05/ex05-05.html"},
        {num:"06",name:"구조적가상클래스",src:"./ex05/ex05-06.html"},
        {num:"07",name:"가상클래스",src:"./ex05/ex05-07.html"},
        {num:"08",name:"가상요소선택자",src:"./ex05/ex05-08.html"},
        {num:"09",name:"가상요소선택자 응용",src:"./ex05/ex05-09.html"},
        {num:"10",name:"달력",src:"./ex05/ex05-10.html"},
        {num:"10-1",name:"4월 달력",src:"./ex05/April.html"},
      ]},
      { name:"ex06", items:[
        {num:"01",name:"word-wrap",src:"./ex06/ex06-01.html"},
        {num:"02",name:"로그인 창",src:"./ex06/ex06-02.html"},
        {num:"03",name:"z-index",src:"./ex06/ex06-03.html"},
        {num:"04",name:"transition",src:"./ex06/ex06-04.html"},
        {num:"05",name:"transform rotate",src:"./ex06/ex06-05.html"},
        {num:"06",name:"transform skew",src:"./ex06/ex06-06.html"},
        {num:"07",name:"transform scale",src:"./ex06/ex06-07.html"},
        {num:"08",name:"transform translate",src:"./ex06/ex06-08.html"},
        {num:"09",name:"애니메이션의 범위",src:"./ex06/ex06-09.html"},
        {num:"10",name:"keyframes",src:"./ex06/ex06-10.html"},
        {num:"11",name:"움직이는 공 만들기",src:"./ex06/ball.html"},
        {num:"12",name:"keyframes2",src:"./ex06/ex06-11.html"},
        {num:"13",name:"파일업로드",src:"./ex06/ex06-12.html"},
        {num:"14",name:"justify-content",src:"./ex06/ex06-13.html"},
        {num:"15",name:"align-items",src:"./ex06/ex06-14.html"},
        {num:"16",name:"flex-direction",src:"./ex06/ex06-15.html"},
        {num:"17",name:"flex wrap",src:"./ex06/ex06-16.html"},
        {num:"18",name:"프로필",src:"./ex06/ex06-17.html"},
      ]},
      { name:"ex07", items:[
        {num:"01",name:"간단한 쇼핑몰",src:"./ex07/ex07-01.html"},
        {num:"01-1",name:"간단한 쇼핑몰 2",src:"./ex07/ex07-01a.html"},
        {num:"02",name:"카드중첩",src:"./ex07/ex07-02.html"},
        {num:"03",name:"CSS 스켈레톤",src:"./ex07/ex07-03.html"},
        {num:"04",name:"GRID 테스트",src:"./ex07/ex07-04.html"},
        {num:"05",name:"채팅방",src:"./ex07/ex07-05.html"},
      ]},
    ],
  },
  {
    id:"js", colType:"js",
    folders:[
      { name:"ex07(JS)", items:[
        {num:"06",name:"console",src:"./ex07/ex07-06.html"},
        {num:"07",name:"js",src:"./ex07/ex07-07.html"},
        {num:"08",name:"인덱싱",src:"./ex07/ex07-08.html"},
        {num:"09",name:"블리언",src:"./ex07/ex07-09.html"},
        {num:"10",name:"불연산자",src:"./ex07/ex07-10.html"},
      ]},
      { name:"ex08", items:[
        {num:"01",name:"입력받기",src:"./ex08/ex08-01.html"},
        {num:"02",name:"숫자입력",src:"./ex08/ex08-02.html"},
        {num:"03",name:"증감연산자",src:"./ex08/ex08-03.html"},
        {num:"04",name:"null와 undefined",src:"./ex08/ex08-04.html"},
        {num:"05",name:"falsy, nullish coalescing",src:"./ex08/ex08-05.html"},
        {num:"06",name:"DOM",src:"./ex08/ex08-06.html"},
        {num:"07",name:"시간표현",src:"./ex08/ex08-07.html"},
        {num:"08",name:"시간표현 2",src:"./ex08/ex08-08.html"},
        {num:"09",name:"가위바위보",src:"./ex08/ex08-09.html"},
        {num:"10",name:"랜덤",src:"./ex08/ex08-10.html"},
        {num:"11",name:"for",src:"./ex08/ex08-11.html"},
        {num:"12",name:"for 응용",src:"./ex08/ex08-12.html"},
        {num:"13",name:"구구단 for",src:"./ex08/ex08-13.html"},
      ]},
      { name:"ex09", items:[
        {num:"01",name:"랜덤고급",src:"./ex09/ex09-01.html"},
        {num:"02",name:"소숫점",src:"./ex09/ex09-02.html"},
        {num:"03",name:"삼항연산자",src:"./ex09/ex09-03.html"},
        {num:"04",name:"switch 구문",src:"./ex09/ex09-04.html"},
        {num:"05",name:"생성자 함수",src:"./ex09/ex09-05.html"},
        {num:"06",name:"배열",src:"./ex09/ex09-06.html"},
        {num:"07",name:"todo",src:"./ex09/ex09-07.html"},
        {num:"09-1",name:"과일 상자 제거·추가",src:"./ex09/ex09-09a.html"},
        {num:"10",name:"반복문 while",src:"./ex09/ex09-10.html"},
        {num:"11-3",name:"주사위 시뮬레이션",src:"./ex09/ex09-11c.html"},
      ]},
      { name:"ex10", items:[
        {num:"01",name:"호이스팅",src:"./ex10/ex10-01.html"},
        {num:"02",name:"함수스코프",src:"./ex10/ex10-02.html"},
        {num:"04",name:"즉시실행함수(IIFE)",src:"./ex10/ex10-04.html"},
        {num:"05",name:"화살표 함수",src:"./ex10/ex10-05.html"},
        {num:"06",name:"실시간입력",src:"./ex10/ex10-06.html"},
        {num:"07",name:"글자수",src:"./ex10/ex10-07.html"},
        {num:"08",name:"함수선언식으로 게임",src:"./ex10/ex10-08.html"},
        {num:"11",name:"초 실행",src:"./ex10/ex10-11.html"},
      ]},
      { name:"ex11", items:[
        {num:"04",name:"forEach 실습",src:"./ex11/ex11-04.html"},
        {num:"06",name:"cssText",src:"./ex11/ex11-06.html"},
        {num:"10-1",name:"map와 filter 메소드체이닝",src:"./ex11/ex11-10a.html"},
        {num:"11",name:"reduce",src:"./ex11/ex11-11.html"},
        {num:"13",name:"문서객체 생성하기",src:"./ex11/ex11-13.html"},
        {num:"14",name:"동적생성 연습",src:"./ex11/ex11-14.html"},
      ]},
      { name:"ex12", items:[
        {num:"01",name:"클릭",src:"./ex12/ex12-01.html"},
        {num:"05-1",name:"Keyboard Move",src:"./ex12/ex12-05a.html"},
        {num:"06",name:"클래스 흉내",src:"./ex12/ex12-06.html"},
        {num:"06-3",name:"클래스",src:"./ex12/ex12-06c.html"},
        {num:"06-4",name:"클래스 필드",src:"./ex12/ex12-06d.html"},
      ]},
      { name:"ex13", items:[
        {num:"01",name:"modal",src:"./ex13/ex13-01.html"},
        {num:"01-1",name:"modal 2",src:"./ex13/ex13-01a.html"},
        {num:"02",name:"Todo List",src:"./ex13/ex13-02.html"},
      ]},
    ],
  },
  {
    id:"ex", colType:"ex",
    folders:[
      { name:"파일 모음", items:[
        {num:"01",name:"외부스타일 css",src:"./ex03/ex03-04.css"},
        {num:"02",name:"myreset CSS",src:"./myreset.css"},
        {num:"03",name:"console js",src:"./ex07/ex07-06.js"},
        {num:"04",name:"console py",src:"./ex07/ex07-06.py"},
        {num:"05",name:"증감연산자 js",src:"./ex08/ex08-03.js"},
        {num:"06",name:"랜덤고급 js",src:"./ex09/ex09-01.js"},
        {num:"07",name:"랜덤고급 py",src:"./ex09/ex09-01.py"},
        {num:"08",name:"생성자 함수 py",src:"./ex09/ex09-05.py"},
        {num:"09",name:"초 진행 js",src:"./ex10/ex10-09a.js"},
        {num:"10",name:"초 진행 js 2",src:"./ex10/ex10-09b.js"},
        {num:"13",name:"ex12-07-1 css",src:"./ex12/ex12-07b.css"},
        {num:"14",name:"ex12-07-1 js",src:"./ex12/ex12-07b.js"},
      ]},
    ],
  },
  {
    id:"list", colType:"list",
    folders:[
      { name:"HTML5 프로그래밍", items:[
        {num:"01",name:"웹 프로그래밍 이해하기",src:"./README/01.웹 프로그래밍 이해하기.pdf"},
        {num:"02",name:"웹페이지 기본문서 만들기",src:"./README/02.웹페이지 기본문서 만들기.pdf"},
      ]},
      { name:"준비 중", items:[{num:"—",name:"준비 중...",src:"",pending:true}]},
    ],
  },
];

// ──────────────────────────────────────────────────────────────
// 1. 커스텀 훅 — useTheme
// ──────────────────────────────────────────────────────────────
function useTheme() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") !== "light");
  const toggle = useCallback(() => {
    setIsDark(d => {
      const next = !d;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }, []);
  return { isDark, toggle };
}

// ──────────────────────────────────────────────────────────────
// 2. 커스텀 훅 — useClock
// ──────────────────────────────────────────────────────────────
function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad  = n => String(n).padStart(2,"0");
  const h24  = now.getHours();
  const ampm = h24 < 12 ? "AM" : "PM";
  const h12  = h24 % 12 || 12;
  const dow  = now.getDay();

  return {
    hh:   pad(h12),
    mm:   pad(now.getMinutes()),
    ss:   pad(now.getSeconds()),
    ampm,
    date: `${now.getFullYear()}년 ${MONTH_KO[now.getMonth()]} ${now.getDate()}일`,
    dayKo:  DAY_KO[dow] + "요일",
    dayColor: DAY_COLORS[dow],
    dayBg:    DAY_BG[dow],
  };
}

// ──────────────────────────────────────────────────────────────
// 3. 커스텀 훅 — useWeather
// ──────────────────────────────────────────────────────────────
function useWeather() {
  const [weather, setWeather] = useState({ status:"loading" });

  const load = useCallback(async () => {
    setWeather({ status:"loading" });
    const fetchData = async (lat, lon, city) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&wind_speed_unit=ms&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const d = (await res.json()).current;
        const [icon, desc] = WMO_CODES[d.weather_code] || ["🌡️","알 수 없음"];
        setWeather({
          status:"ok", icon, desc, city,
          temp:   Math.round(d.temperature_2m),
          feels:  Math.round(d.apparent_temperature),
          humid:  d.relative_humidity_2m,
          wind:   d.wind_speed_10m.toFixed(1),
        });
      } catch {
        setWeather({ status:"error" });
      }
    };

    const getCityName = async (lat, lon) => {
      try {
        const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ko`);
        const data = await res.json();
        const a    = data.address;
        return a.city || a.town || a.county || a.state || "현재 위치";
      } catch { return "현재 위치"; }
    };

    if (!navigator.geolocation) { fetchData(37.5665, 126.978, "서울"); return; }
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude: lat, longitude: lon } }) => {
        const city = await getCityName(lat, lon);
        fetchData(lat, lon, city);
      },
      () => fetchData(37.5665, 126.978, "서울"),
      { timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    const startId = setTimeout(load, 0);
    const intervalId = setInterval(load, 10 * 60 * 1000);

    return () => {
      clearTimeout(startId);
      clearInterval(intervalId);
    };
  }, [load]);

  return { weather, reload: load };

}

// ──────────────────────────────────────────────────────────────
// 4. 커스텀 훅 — useSearch
// ──────────────────────────────────────────────────────────────
function useSearch() {
  const [query, setQuery] = useState("");

  const allItems = COLUMNS_DATA.flatMap(col =>
    col.folders.flatMap(folder =>
      folder.items
        .filter(it => it.src && !it.pending)
        .map(it => ({ ...it, colType: col.colType, folder: folder.name }))
    )
  );

  const results = query.trim()
    ? allItems.filter(it =>
        it.name.toLowerCase().includes(query.toLowerCase()) ||
        it.src.toLowerCase().includes(query.toLowerCase()) ||
        it.folder.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return { query, setQuery, results, isSearching: !!query.trim() };
}

// ──────────────────────────────────────────────────────────────
// 5-A. ClockWidget 컴포넌트
// ──────────────────────────────────────────────────────────────
function ClockWidget({ isDark }) {
  const { hh, mm, ss, ampm, date, dayKo, dayColor, dayBg } = useClock();
  const [colonOn, setColonOn] = useState(true);
  useEffect(() => { const id = setInterval(() => setColonOn(p=>!p), 500); return ()=>clearInterval(id); }, []);

  const t = isDark;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
      <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:44, fontWeight:700, letterSpacing:-1, lineHeight:1, display:"flex", alignItems:"baseline", gap:2 }}>
          <span>{hh}</span>
          <span style={{ color: t?"#444":"#bbb", opacity: colonOn?1:0.12, transition:"opacity .1s" }}>:</span>
          <span>{mm}</span>
          <span style={{ color: t?"#444":"#bbb", opacity: colonOn?1:0.12, transition:"opacity .1s" }}>:</span>
          <span style={{ fontSize:"0.52em", color: t?"#666":"#999", fontWeight:400, alignSelf:"flex-end", paddingBottom:2 }}>{ss}</span>
        </div>
        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, fontWeight:700, letterSpacing:2, color:"#34d399", alignSelf:"flex-end", marginBottom:2 }}>{ampm}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"flex-end" }}>
        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10.5, color: t?"#666":"#999", letterSpacing:"1.5px" }}>{date}</span>
        <span style={{
          fontFamily:"'Space Mono',monospace", fontSize:9, fontWeight:700, letterSpacing:"1.5px",
          padding:"2px 7px", borderRadius:4, border:"1px solid",
          color: dayColor, background: dayBg, borderColor: dayColor+"44",
        }}>{dayKo}</span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 5-B. WeatherWidget 컴포넌트
// ──────────────────────────────────────────────────────────────
function WeatherWidget({ isDark }) {
  const { weather, reload } = useWeather();
  const surface = isDark ? "#141417" : "#ffffff";
  const border  = isDark ? "#2a2a32" : "#e4e0d8";
  const muted   = isDark ? "#5a5a68" : "#9a9488";
  const muted2  = isDark ? "#7a7a8a" : "#7a7268";
  const text    = isDark ? "#e8e6e0" : "#1a1814";

  const s = {
    wrapper: { display:"flex", alignItems:"center", gap:10, padding:"9px 14px",
      background:surface, border:`1px solid ${border}`, borderRadius:10, minHeight:48, minWidth:200 },
  };

  if (weather.status === "loading") return (
    <div style={s.wrapper}>
      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:muted, letterSpacing:1 }}>날씨 불러오는 중…</span>
    </div>
  );
  if (weather.status === "error") return (
    <div style={s.wrapper}>
      <span onClick={reload} style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:muted, cursor:"pointer", textDecoration:"underline dotted" }}>⚠ 날씨 오류 — 재시도</span>
    </div>
  );

  return (
    <div style={s.wrapper}>
      <span style={{ fontSize:24 }}>{weather.icon}</span>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2 }}>
        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:18, fontWeight:700, color:text }}>{weather.temp}°C</span>
        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:15, color:muted2 }}>{weather.desc}</span>
        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:15, color:muted }}>📍 {weather.city}</span>
      </div>
      <div style={{ display:"flex", gap:8, alignItems:"center", borderLeft:`1px solid ${border}`, paddingLeft:10 }}>
        {[["체감", `${weather.feels}°`], ["습도", `${weather.humid}%`], ["풍속", `${weather.wind}m/s`]].map(([lbl,val]) => (
          <div key={lbl} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:13, fontWeight:700, color:text }}>{val}</span>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:13, color:muted, letterSpacing:"0.5px" }}>{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 5-C. SearchBar 컴포넌트
// ──────────────────────────────────────────────────────────────
function SearchBar({ query, setQuery, isDark }) {
  const inputRef = useRef(null);
  const surface = isDark ? "#141417" : "#ffffff";
  const border  = isDark ? "#2a2a32" : "#e4e0d8";
  const muted   = isDark ? "#5a5a68" : "#9a9488";
  const text    = isDark ? "#e8e6e0" : "#1a1814";
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const handler = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); inputRef.current?.focus(); }
      if (!e.ctrlKey && !e.metaKey && e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault(); inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div style={{ position:"relative", marginBottom:24 }}>
      <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:14,
        color: focused ? "#4a9eff" : muted, pointerEvents:"none", zIndex:1, transition:"color .2s" }}>🔍</span>
      <input
        ref={inputRef}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={()=>setFocused(true)}
        onBlur={()=>setFocused(false)}
        onKeyDown={e => { if (e.key==="Escape") { setQuery(""); inputRef.current?.blur(); } }}
        placeholder="파일명이나 주제로 검색… (예: 헤딩, flexbox, grid)"
        style={{
          width:"100%", background:focused ? (isDark?"#1a1a1f":"#f0ece4") : surface,
          border:`1px solid ${focused?"#4a9eff":border}`,
          boxShadow: focused ? "0 0 0 3px rgba(74,158,255,.12)" : "none",
          borderRadius:12, padding:"13px 50px 13px 44px",
          fontFamily:"'Noto Sans KR',sans-serif", fontSize:14, color:text,
          outline:"none", transition:"all .2s",
        }}
        autoComplete="off" spellCheck="false"
      />
      {query && (
        <button onClick={() => { setQuery(""); inputRef.current?.focus(); }}
          style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)",
            background: isDark?"#2a2a32":"#e4e0d8", border:"none", borderRadius:6, color:muted,
            cursor:"pointer", fontSize:11, padding:"3px 8px", fontFamily:"'Space Mono',monospace" }}>
          ESC
        </button>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 5-D. SearchResults 컴포넌트
// ──────────────────────────────────────────────────────────────
function SearchResults({ results, query, isDark, onOpen, onPreview }) {
  const surface  = isDark ? "#141417" : "#ffffff";
  const border   = isDark ? "#2a2a32" : "#e4e0d8";
  const muted    = isDark ? "#5a5a68" : "#9a9488";
  const muted2   = isDark ? "#7a7a8a" : "#7a7268";
  const text     = isDark ? "#e8e6e0" : "#1a1814";

  const hl = (str) => {
    if (!query) return str;
    const esc = query.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    const parts = str.split(new RegExp(`(${esc})`,"gi"));
    return parts.map((p,i) =>
      p.toLowerCase() === query.toLowerCase()
        ? <mark key={i} style={{ background:"rgba(74,158,255,.25)", color:"#4a9eff", borderRadius:2, padding:"0 1px" }}>{p}</mark>
        : p
    );
  };

  if (results.length === 0) return (
    <div style={{ textAlign:"center", padding:"60px 20px", color:muted }}>
      <div style={{ fontSize:40, marginBottom:12, opacity:.5 }}>🔍</div>
      <p style={{ fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:1 }}>"{query}" 에 해당하는 파일을 찾지 못했어요</p>
    </div>
  );

  return (
    <>
      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:muted2, letterSpacing:"1.5px", textTransform:"uppercase", paddingBottom:14, display:"flex", gap:10 }}>
        <span style={{ color:"#4a9eff", fontWeight:700 }}>{results.length}</span>개 결과
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:8 }}>
        {results.map((it, i) => {
          const m = COL_META[it.colType] || COL_META.html;
          return (
            <div key={i}
              onClick={() => onOpen(it.src)}
              onMouseEnter={() => onPreview(it.src)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px",
                background:surface, border:`1px solid ${border}`, borderRadius:10, cursor:"pointer",
                position:"relative", overflow:"hidden", transition:"all .15s" }}
              onMouseOver={e=>{e.currentTarget.style.background=m.dimBg;e.currentTarget.style.borderColor=m.border;e.currentTarget.style.transform="translateY(-1px)";}}
              onMouseOut={e=>{e.currentTarget.style.background=surface;e.currentTarget.style.borderColor=border;e.currentTarget.style.transform="";}}
            >
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:m.accent, borderRadius:"3px 0 0 3px" }} />
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, fontWeight:700, padding:"3px 7px", borderRadius:4,
                background:m.dimBg, color:m.accent, border:`1px solid ${m.border}`, flexShrink:0, letterSpacing:"0.5px" }}>
                {m.label}
              </span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{hl(it.name)}</div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:muted, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{it.src}</div>
              </div>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:muted2, flexShrink:0 }}>{it.folder}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────
// 5-E. FolderGroup 컴포넌트
// ──────────────────────────────────────────────────────────────
function FolderGroup({ folder, colType, isDark, onOpen, onPreview, onLeavePreview }) {
  const [open, setOpen] = useState(true);
  const m = COL_META[colType];
  const border  = isDark ? "#2a2a32" : "#e4e0d8";
  const muted2  = isDark ? "#7a7a8a" : "#7a7268";
  const muted   = isDark ? "#5a5a68" : "#9a9488";

  return (
    <div style={{ borderBottom:`1px solid ${border}` }}>
      {/* 폴더 헤더 */}
      <div onClick={()=>setOpen(o=>!o)} style={{
        display:"flex", alignItems:"center", gap:8, padding:"9px 18px 8px",
        borderBottom: open ? `1px solid ${border}` : "none",
        cursor:"pointer", userSelect:"none", transition:"background .15s",
      }}
        onMouseOver={e=>e.currentTarget.style.background="rgba(128,128,128,.06)"}
        onMouseOut={e=>e.currentTarget.style.background="transparent"}
      >
        <span style={{ fontSize:9, color:muted, transition:"transform .22s ease", transform: open?"":"rotate(-90deg)", display:"inline-block" }}>▾</span>
        <span style={{ width:5, height:5, borderRadius:"50%", background:m.accent, flexShrink:0 }} />
        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:"9.5px", color:muted2, flex:1 }}>{folder.name}</span>
      </div>
      {/* 아이템 목록 */}
      <div style={{ overflow:"hidden", maxHeight: open ? 2000 : 0, opacity: open?1:0, transition:"max-height .3s cubic-bezier(.4,0,.2,1), opacity .25s ease" }}>
        {folder.items.map((item, i) => (
          <LinkItem key={i} item={item} colType={colType} isDark={isDark}
            onOpen={onOpen} onPreview={onPreview} onLeavePreview={onLeavePreview} />
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 5-F. LinkItem 컴포넌트
// ──────────────────────────────────────────────────────────────
function LinkItem({ item, colType, isDark, onOpen, onPreview, onLeavePreview }) {
  const [hovered, setHovered] = useState(false);
  const m = COL_META[colType];
  const border = isDark ? "#2a2a32" : "#e4e0d8";
  const muted  = isDark ? "#5a5a68" : "#9a9488";

  if (item.pending) return (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 18px",
      borderBottom:`1px solid ${border}`, opacity:.3 }}>
      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:muted, minWidth:22 }}>{item.num}</span>
      <span style={{ flex:1, fontSize:"12.5px", fontWeight:500 }}>{item.name}</span>
    </div>
  );

  return (
    <div
      onClick={() => item.src && onOpen(item.src)}
      onMouseEnter={() => { setHovered(true); item.src && onPreview(item.src); }}
      onMouseLeave={() => { setHovered(false); onLeavePreview(); }}
      style={{
        display:"flex", alignItems:"center", gap:10, padding:"10px 18px",
        borderBottom:`1px solid ${border}`, cursor:"pointer", position:"relative",
        background: hovered ? m.dimBg : "transparent",
        transition:"background .15s",
      }}
    >
      {/* 왼쪽 강조 바 */}
      <div style={{ position:"absolute", left:0, top:"20%", bottom:"20%", width:2, borderRadius:2,
        background:m.accent, opacity: hovered?1:0, transform: hovered?"scaleY(1)":"scaleY(.5)",
        transition:"opacity .2s, transform .2s" }} />
      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:muted, minWidth:22, flexShrink:0 }}>{item.num}</span>
      <span style={{ flex:1, fontSize:"12.5px", fontWeight: hovered?700:500,
        color: hovered ? (isDark?"#ffffff":m.accent) : (isDark?"#e8e6e0":"#1a1814"),
        transition:"color .15s, font-weight .1s" }}>{item.name}</span>
      <span style={{ fontSize:11, color:muted, opacity: hovered?1:0, transform: hovered?"translateX(2px)":"", transition:"opacity .2s, transform .2s" }}>→</span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 5-G. Column 컴포넌트
// ──────────────────────────────────────────────────────────────
function Column({ colData, isDark, delay, onOpen, onPreview, onLeavePreview }) {
  const m = COL_META[colData.colType];
  const surface  = isDark ? "#141417" : "#ffffff";
  const surface2 = isDark ? "#1a1a1f" : "#f0ece4";
  const border   = isDark ? "#2a2a32" : "#e4e0d8";
  const text     = isDark ? "#e8e6e0" : "#1a1814";

  return (
    <div style={{
      background:surface, border:`1px solid ${border}`, borderRadius:14, overflow:"hidden",
      animation:`slideUp .5s cubic-bezier(.16,1,.3,1) ${delay}s both`,
    }}>
      {/* 상단 컬러 바 */}
      <div style={{ height:2, background:`linear-gradient(90deg,${m.accent},transparent)` }} />
      {/* 헤더 */}
      <div style={{ padding:"14px 18px 12px", borderBottom:`1px solid ${border}`,
        display:"flex", alignItems:"center", gap:10, background:surface2 }}>
        <div style={{ width:44, height:30, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"'Space Mono',monospace", fontSize:9, fontWeight:700,
          background:m.dimBg, color:m.accent, border:`1px solid ${m.border}` }}>
          {m.label}
        </div>
        <span style={{ fontSize:13, fontWeight:700, color:text }}>
          {colData.colType==="html"?"HTML":colData.colType==="css"?"CSS":
           colData.colType==="js"?"JavaScript":colData.colType==="ex"?"예제 파일":"설명 자료"}
        </span>
      </div>
      {/* 폴더 목록 */}
      {colData.folders.map((folder, i) => (
        <FolderGroup key={i} folder={folder} colType={colData.colType} isDark={isDark}
          onOpen={onOpen} onPreview={onPreview} onLeavePreview={onLeavePreview} />
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 5-H. PreviewPanel 컴포넌트
// ──────────────────────────────────────────────────────────────
function PreviewPanel({ src, visible, isDark, onMouseEnter, onMouseLeave }) {
  const iframeRef = useRef(null);
  const prevSrc   = useRef("");
  const surface   = isDark ? "#141417" : "#ffffff";
  const surface2  = isDark ? "#1a1a1f" : "#f0ece4";
  const border    = isDark ? "#363640" : "#d0ccc4";
  const muted     = isDark ? "#5a5a68" : "#9a9488";
  const muted2    = isDark ? "#7a7a8a" : "#7a7268";

  useEffect(() => {
    if (visible && src && src !== prevSrc.current) {
      prevSrc.current = src;
      if (iframeRef.current) iframeRef.current.src = src;
    }
    if (!visible) { setTimeout(()=>{ if(iframeRef.current&&!visible) iframeRef.current.src=""; prevSrc.current=""; },350); }
  }, [src, visible]);

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
      style={{
        position:"fixed", top:0, right:0, width:"min(500px,42vw)", height:"100vh",
        background:surface, borderLeft:`1px solid ${border}`,
        boxShadow:"-12px 0 48px rgba(0,0,0,.5)",
        display:"flex", flexDirection:"column",
        zIndex:150, transform: visible?"translateX(0)":"translateX(100%)",
        transition:"transform .32s cubic-bezier(.4,0,.2,1)",
      }}>
      {/* 브라우저 바 */}
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px",
        background:surface2, borderBottom:`1px solid ${border}`, flexShrink:0 }}>
        <div style={{ display:"flex", gap:5 }}>
          {["#ff5f57","#febc2e","#28c840"].map(c=>(
            <div key={c} style={{ width:9, height:9, borderRadius:"50%", background:c }} />
          ))}
        </div>
        <div style={{ flex:1, background: isDark?"#0d0d0f":"#f7f5f0", border:`1px solid ${isDark?"#2a2a32":"#e4e0d8"}`,
          borderRadius:5, padding:"4px 10px", fontFamily:"'Space Mono',monospace", fontSize:9,
          color:muted2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{src || "—"}</div>
        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:muted, whiteSpace:"nowrap" }}>클릭 → 전체 보기</span>
      </div>
      <iframe ref={iframeRef} style={{ flex:1, width:"100%", border:"none", background:"#fff" }} title="preview" />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 5-I. ViewerView 컴포넌트 (풀스크린 — 미리보기 탭 / 코드 탭)
// ──────────────────────────────────────────────────────────────
function ViewerView({ src, visible, isDark, onClose }) {
  const [selectedTab, setSelectedTab] = useState("preview"); // "preview" | "code"
  const [code, setCode]       = useState({ status:"idle", text:"", lang:"" });
  const [copied, setCopied]   = useState(false);
  const iframeRef = useRef(null);
  const lastSrc   = useRef("");

  const isCodeOnly = (s) => CODE_ONLY_EXTS.has(s.split(".").pop().toLowerCase());
  const detectLang = (s) => LANG_MAP[s.split(".").pop().toLowerCase()] || "plaintext";

  const surface  = isDark ? "#141417" : "#ffffff";
  const surface2 = isDark ? "#1a1a1f" : "#f0ece4";
  const border   = isDark ? "#2a2a32" : "#e4e0d8";
  const border2  = isDark ? "#363640" : "#d0ccc4";
  const text     = isDark ? "#e8e6e0" : "#1a1814";
  const muted    = isDark ? "#5a5a68" : "#9a9488";
  const muted2   = isDark ? "#7a7a8a" : "#7a7268";
  const bg       = isDark ? "#0d0d0f" : "#f7f5f0";
  const codeOnly = src ? isCodeOnly(src) : false;
  const tab      = codeOnly ? "code" : selectedTab;

  // src 바뀔 때 미리보기 iframe만 동기화
  useEffect(() => {
    if (!src || !visible || codeOnly) return;
    if (iframeRef.current) iframeRef.current.src = src;
  }, [src, visible, codeOnly]);

  // 코드 로드
  const loadCode = useCallback(async (s) => {
    if (lastSrc.current === s) return;
    lastSrc.current = s;
    const lang = detectLang(s);
    setCode({ status:"loading", text:"", lang });
    try {
      const res = await fetch(s, { mode:"same-origin", cache:"no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const txt = await res.text();
      setCode({ status:"ok", text:txt, lang });
    } catch (e) {
      setCode({ status:"error", text:"", lang, msg:e.message });
    }
  }, []);

  useEffect(() => {
    if (tab !== "code" || !src) return;

    const id = setTimeout(() => loadCode(src), 0);
    return () => clearTimeout(id);
  }, [tab, src, loadCode]);

  const handleCopy = async () => {
    if (!code.text) return;
    try { await navigator.clipboard.writeText(code.text); setCopied(true); setTimeout(()=>setCopied(false),2000); }
    catch { /* ignore */ }
  };

  const lang = detectLang(src || "");
  const langLabel = LANG_LABEL[lang] || lang.toUpperCase();
  const langCls   = LANG_CLS[lang] || "text";
  const LANG_COLORS = { html:"#ff6b35", css:"#4a9eff", js:"#fbbf24", py:"#34d399", text:"#a78bfa" };
  const langColor = LANG_COLORS[langCls] || "#a78bfa";

  return (
    <div style={{
      position:"fixed", inset:0, display:"flex", flexDirection:"column",
      background:bg, zIndex:300,
      opacity: visible?1:0, pointerEvents: visible?"all":"none",
      transition:"opacity .25s ease",
    }}>
      {/* 상단 바 */}
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 20px",
        background:surface, borderBottom:`1px solid ${border}`, flexShrink:0 }}>
        {/* 홈 버튼 */}
        <button onClick={onClose} style={{
          display:"flex", alignItems:"center", gap:6, background:surface2, color:text,
          border:`1px solid ${border2}`, borderRadius:8, padding:"6px 14px",
          fontFamily:"'Noto Sans KR',sans-serif", fontSize:12, fontWeight:600, cursor:"pointer",
          transition:"background .15s", whiteSpace:"nowrap", flexShrink:0,
        }}
          onMouseOver={e=>e.currentTarget.style.background=border2}
          onMouseOut={e=>e.currentTarget.style.background=surface2}
        >⌂ 홈</button>

        <span style={{ fontSize:16, color:border2, flexShrink:0 }}>/</span>

        {/* URL 표시 */}
        <div style={{ flex:1, background:surface2, border:`1px solid ${border}`, borderRadius:6,
          padding:"6px 12px", fontFamily:"'Space Mono',monospace", fontSize:10, color:muted2,
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{src}</div>

        {/* 탭 버튼 */}
        <div style={{ display:"flex", gap:4, flexShrink:0 }}>
          {[["preview","미리보기"],["code","코드 보기"]].map(([t, label]) => (
            <button
              key={t}
              onClick={() => setSelectedTab(t)}
              disabled={t === "preview" && isCodeOnly(src || "")}
              style={{
                padding:"6px 14px",
                borderRadius:8,
                cursor: (t === "preview" && isCodeOnly(src || "")) ? "default" : "pointer",
                border: `1px solid ${tab === t ? "#4a9eff" : border}`,
                background: tab === t ? "#4a9eff" : "transparent",
                color: tab === t ? "#fff" : (t === "preview" && isCodeOnly(src || "")) ? muted : muted2,
                fontFamily:"'Space Mono',monospace",
                fontSize:10,
                fontWeight:700,
                opacity: (t === "preview" && isCodeOnly(src || "")) ? .35 : 1,
                transition:"all .15s",
                letterSpacing:"0.5px",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 새 탭 */}
        <a href={src||"#"} target="_blank" rel="noreferrer"
          style={{ background:"transparent", border:`1px solid ${border2}`, borderRadius:8,
            padding:"6px 14px", fontSize:11, color:muted2, cursor:"pointer",
            fontFamily:"'Noto Sans KR',sans-serif", fontWeight:500, textDecoration:"none",
            whiteSpace:"nowrap", transition:"all .15s", flexShrink:0 }}
          onMouseOver={e=>{e.currentTarget.style.background=surface2;e.currentTarget.style.color=text;}}
          onMouseOut={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=muted2;}}
        >↗ 새 탭</a>
      </div>

      {/* 미리보기 iframe */}
      <iframe
        ref={iframeRef}
        title="viewer"
        style={{ flex:1, width:"100%", border:"none", background:"#fff",
          display: tab==="preview" ? "" : "none" }}
      />

      {/* 코드 패널 */}
      {tab === "code" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:bg }}>
          {/* 코드 툴바 */}
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 20px",
            background:surface2, borderBottom:`1px solid ${border}`, flexShrink:0 }}>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, fontWeight:700, padding:"4px 10px",
              borderRadius:5, letterSpacing:1, textTransform:"uppercase",
              background:`${langColor}18`, color:langColor, border:`1px solid ${langColor}44` }}>
              {langLabel}
            </span>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:muted2, flex:1 }}>
              {(src||"").split("/").pop()}
            </span>
            <button onClick={handleCopy} style={{
              display:"flex", alignItems:"center", gap:6, padding:"6px 14px",
              background: copied ? `${langColor}18` : surface,
              border:`1px solid ${copied ? langColor+"66" : border2}`,
              borderRadius:7, color: copied ? langColor : muted2,
              fontFamily:"'Space Mono',monospace", fontSize:9, fontWeight:700, cursor:"pointer",
              letterSpacing:"0.5px", transition:"all .15s",
            }}>{copied ? "✅ 복사됨!" : "📋 복사"}</button>
          </div>

          {/* 코드 내용 */}
          <div style={{ flex:1, overflow:"auto", padding:"24px 28px" }}>
            {code.status === "loading" && (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                height:"100%", gap:14, color:muted }}>
                <div style={{ width:24, height:24, border:`2px solid ${border2}`, borderTopColor:"#4a9eff",
                  borderRadius:"50%", animation:"spin .7s linear infinite" }} />
                <p style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:1 }}>코드 불러오는 중...</p>
              </div>
            )}
            {code.status === "error" && (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                height:"100%", gap:10, color:muted }}>
                <span style={{ fontSize:32, opacity:.5 }}>⚠️</span>
                <p style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:1 }}>파일을 불러올 수 없어요</p>
                <p style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:muted2, marginTop:6 }}>
                  💡 VS Code Live Server 또는 로컬 서버가 필요해요
                </p>
              </div>
            )}
            {code.status === "ok" && (
              <pre style={{ margin:0, fontFamily:"'Space Mono',monospace", fontSize:13, lineHeight:1.7,
                color: isDark?"#abb2bf":"#383a42", whiteSpace:"pre-wrap", wordBreak:"break-all" }}>
                {code.text}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 6. App (루트 컴포넌트)
// ──────────────────────────────────────────────────────────────
export default function App() {
  const { isDark, toggle: toggleTheme } = useTheme();
  const { query, setQuery, results, isSearching } = useSearch();

  // 미리보기 패널 상태
  const [previewSrc, setPreviewSrc]     = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const hideTimerRef = useRef(null);
  const showTimerRef = useRef(null);

  // 뷰어 상태
  const [viewerSrc, setViewerSrc]       = useState("");
  const [viewerVisible, setViewerVisible] = useState(false);

  const handlePreview = useCallback((src) => {
    clearTimeout(hideTimerRef.current);
    showTimerRef.current = setTimeout(() => { setPreviewSrc(src); setPreviewVisible(true); }, 150);
  }, []);

  const handleLeavePreview = useCallback(() => {
    clearTimeout(showTimerRef.current);
    hideTimerRef.current = setTimeout(() => setPreviewVisible(false), 200);
  }, []);

  const handleOpen = useCallback((src) => {
    clearTimeout(hideTimerRef.current); clearTimeout(showTimerRef.current);
    setPreviewVisible(false);
    setViewerSrc(src); setViewerVisible(true);
  }, []);

  const handleCloseViewer = useCallback(() => { setViewerVisible(false); }, []);

  // 테마 변수
  const bg       = isDark ? "#0d0d0f" : "#f7f5f0";
  const text     = isDark ? "#e8e6e0" : "#1a1814";
  const muted2   = isDark ? "#7a7a8a" : "#7a7268";
  const muted    = isDark ? "#5a5a68" : "#9a9488";
  const surface2 = isDark ? "#1a1a1f" : "#f0ece4";
  const border2  = isDark ? "#363640" : "#d0ccc4";

  return (
    <div style={{ background:bg, color:text, minHeight:"100vh", fontFamily:"'Noto Sans KR',sans-serif", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        ::selection{background:rgba(74,158,255,.25)}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${isDark?"#363640":"#d0ccc4"};border-radius:3px}
        @keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* 홈 뷰 */}
      <div style={{ padding:"52px 36px 100px", minHeight:"100vh",
        opacity: viewerVisible ? 0 : 1, pointerEvents: viewerVisible ? "none" : "all",
        transition:"opacity .25s ease" }}>

        {/* 헤더 */}
        <header style={{ marginBottom:36, display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:24, flexWrap:"wrap" }}>
          <div>
            <p style={{ fontFamily:"'Space Mono',monospace", fontSize:13, letterSpacing:3, textTransform:"uppercase",
              color:muted2, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ display:"inline-block", width:20, height:1, background:muted }} />
              웹 개발 학습 노트
            </p>
            <h1 style={{ fontSize:"clamp(32px,5vw,54px)", fontWeight:900, letterSpacing:-2, lineHeight:1,
              fontFamily:"'Noto Sans KR',sans-serif" }}>
              HTML · CSS{" "}
              <span style={{ color:"#ff6b35", fontStyle:"italic", fontWeight:300 }}>&amp;</span>{" "}JS
            </h1>
          </div>

          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:12,
            animation:"slideUp .5s cubic-bezier(.16,1,.3,1) both" }}>
            <WeatherWidget isDark={isDark} />
            <ClockWidget isDark={isDark} />
          </div>
        </header>

        {/* 검색창 */}
        <SearchBar query={query} setQuery={setQuery} isDark={isDark} />

        {/* 검색 결과 or 컬럼 */}
        {isSearching ? (
          <SearchResults results={results} query={query} isDark={isDark}
            onOpen={handleOpen} onPreview={handlePreview} />
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:16, alignItems:"start" }}>
            {COLUMNS_DATA.map((col, i) => (
              <Column key={col.id} colData={col} isDark={isDark} delay={i*0.07}
                onOpen={handleOpen} onPreview={handlePreview} onLeavePreview={handleLeavePreview} />
            ))}
          </div>
        )}
      </div>

      {/* 테마 전환 버튼 */}
      <button onClick={toggleTheme} title="라이트/다크 모드 전환"
        style={{
          position:"fixed", bottom:28, right:28, zIndex:500,
          width:44, height:44, borderRadius:"50%",
          border:`1px solid ${border2}`, background:surface2, color:text,
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:18, boxShadow:`0 4px 20px rgba(0,0,0,${isDark?.25:.12})`,
          transition:"all .2s", padding:0,
        }}
        onMouseOver={e=>e.currentTarget.style.transform="scale(1.1)"}
        onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}
      >{isDark ? "🌙" : "☀️"}</button>

      {/* 미리보기 패널 */}
      <PreviewPanel src={previewSrc} visible={previewVisible} isDark={isDark}
        onMouseEnter={() => clearTimeout(hideTimerRef.current)}
        onMouseLeave={handleLeavePreview} />

      {/* 풀스크린 뷰어 */}
      <ViewerView src={viewerSrc} visible={viewerVisible} isDark={isDark} onClose={handleCloseViewer} />
    </div>
  );
}
