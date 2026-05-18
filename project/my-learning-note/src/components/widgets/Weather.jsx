import { useState, useEffect, useCallback } from 'react';

// WMO 코드는 변하지 않는 값이므로 외부에 두는 것이 성능상 이득입니다.
const WMO = {
  0:['☀️','맑음'], 1:['🌤️','대체로 맑음'], 2:['⛅','구름 조금'], 3:['☁️','흐림'],
  45:['🌫️','안개'], 48:['🌫️','짙은 안개'], 51:['🌦️','가랑비'], 53:['🌦️','이슬비'],
  55:['🌧️','강한 이슬비'], 61:['🌧️','약한 비'], 63:['🌧️','비'], 65:['🌧️','강한 비'],
  71:['🌨️','약한 눈'], 73:['❄️','눈'], 75:['❄️','강한 눈'], 77:['🌨️','싸락눈'],
  80:['🌦️','소나기'], 81:['🌧️','강한 소나기'], 82:['⛈️','폭우'],
  85:['🌨️','눈 소나기'], 86:['❄️','강한 눈 소나기'],
  95:['⛈️','뇌우'], 96:['⛈️','우박 뇌우'], 99:['⛈️','강한 우박 뇌우'],
};

const Weather = () => {
  const [weather, setWeather] = useState({
    loading: true,
    error: false,
    icon: '',
    desc: '',
    city: '',
    temp: 0,
    feels: 0,
    humid: 0,
    wind: '0.0'
  });

  // 1. getCityName을 useCallback으로 감싸 의존성 에러를 방지합니다.
 const getCityName = useCallback(async (lat, lon) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ko`,
      { headers: { 'Accept-Language': 'ko' } }
    );
    const data = await res.json();
    const a = data.address;
    
    const cityName = a.city || a.province || a.state || a.borough || a.town || '내 위치';

    return cityName.replace(/(특별시|광역시|특별자치시|특별자치도|경기도|강원도|충청북도|충청남도|전라북도|전라남도|경상북도|경상남도)$/, "");
    
  } catch {
    return '현재 위치';
  }
}, []);

  const fetchWeather = useCallback(async (lat, lon, city) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&wind_speed_unit=ms&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      
      const d = (await res.json()).current;
      const [icon, desc] = WMO[d.weather_code] || ['🌡️','알 수 없음'];

      setWeather({
        loading: false,
        error: false,
        icon,
        desc,
        city,
        temp: Math.round(d.temperature_2m),
        feels: Math.round(d.apparent_temperature),
        humid: d.relative_humidity_2m,
        wind: d.wind_speed_10m.toFixed(1)
      });
    } catch {
      setWeather(prev => ({ ...prev, loading: false, error: true }));
    }
  }, []);

  const initWeather = useCallback(() => {
    setWeather(prev => ({ ...prev, loading: true, error: false }));

    if (!navigator.geolocation) {
      fetchWeather(37.5665, 126.9780, '서울');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude: lat, longitude: lon } }) => {
        const city = await getCityName(lat, lon);
        fetchWeather(lat, lon, city);
      },
      () => fetchWeather(37.5665, 126.9780, '서울'),
      { timeout: 8000 }
    );
  }, [fetchWeather, getCityName]); // getCityName 추가

  useEffect(() => {
  // 비동기 실행을 위한 즉시 실행 함수(IIFE) 또는 별도 함수 정의
  const loadInitialWeather = async () => {
    await initWeather(); 
  };

  loadInitialWeather(); // 직접 호출 대신 비동기 함수 호출

  const intervalId = setInterval(initWeather, 10 * 60 * 1000);
  return () => clearInterval(intervalId);
}, [initWeather]);

  // --- 렌더링 로직 ---
  if (weather.error) {
    return (
      <div className="weather-widget">
        <span className="weather-error" onClick={initWeather} style={{ cursor: 'pointer' }}>
          ⚠ 날씨 정보를 불러오지 못했습니다. (클릭하여 재시도)
        </span>
      </div>
    );
  }

  if (weather.loading) {
    return (
      <div className="weather-widget">
        <span className="weather-loading">날씨 정보를 가져오는 중...</span>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="weather-icon">{weather.icon}</div>
      <div className="weather-info">
        <span className="weather-temp">{weather.temp}°C</span>
        <span className="weather-desc">{weather.desc}</span>
        <span className="weather-location">📍{weather.cityName}</span>
      </div>
      <div className="weather-extra">
        <div className="weather-stat">
          <span className="weather-stat-val">{weather.feels}°</span>
          <span className="weather-stat-lbl">체감</span>
        </div>
        <div className="weather-stat">
          <span className="weather-stat-val">{weather.humid}%</span>
          <span className="weather-stat-lbl">습도</span>
        </div>
        <div className="weather-stat">
          <span className="weather-stat-val">{weather.wind}</span>
          <span className="weather-stat-lbl">풍속m/s</span>
        </div>
      </div>
    </div>
  );
};

export default Weather;