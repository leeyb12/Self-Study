import { useEffect, useState } from 'react'

interface Weather {
  temp: number
  code: number
  place: string
}

// WMO weather code → 아이콘/설명
function weatherInfo(code: number): { icon: string; label: string } {
  if (code === 0) return { icon: '☀️', label: '맑음' }
  if (code === 1 || code === 2) return { icon: '⛅', label: '구름 조금' }
  if (code === 3) return { icon: '☁️', label: '흐림' }
  if (code === 45 || code === 48) return { icon: '🌫️', label: '안개' }
  if (code >= 51 && code <= 57) return { icon: '🌦️', label: '이슬비' }
  if (code >= 61 && code <= 67) return { icon: '🌧️', label: '비' }
  if (code >= 71 && code <= 77) return { icon: '🌨️', label: '눈' }
  if (code >= 80 && code <= 82) return { icon: '🌦️', label: '소나기' }
  if (code === 85 || code === 86) return { icon: '🌨️', label: '소나기눈' }
  if (code >= 95) return { icon: '⛈️', label: '뇌우' }
  return { icon: '🌡️', label: '—' }
}

const SEOUL = { lat: 37.5665, lon: 126.978, place: '서울' }

export default function StatusWidget() {
  const [now, setNow] = useState(new Date())
  const [weather, setWeather] = useState<Weather | null>(null)
  const [weatherError, setWeatherError] = useState(false)

  // 1초마다 시계 갱신
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // 위치 기반 날씨 조회 (거부/실패 시 서울)
  useEffect(() => {
    let cancelled = false

    async function fetchWeather(lat: number, lon: number, place: string) {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}` +
          `&longitude=${lon}&current=temperature_2m,weather_code`
        const res = await fetch(url)
        if (!res.ok) throw new Error('weather')
        const data = await res.json()
        if (cancelled) return
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          code: data.current.weather_code,
          place,
        })
      } catch {
        if (!cancelled) setWeatherError(true)
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude, '현재 위치'),
        () => fetchWeather(SEOUL.lat, SEOUL.lon, SEOUL.place),
        { timeout: 5000 },
      )
    } else {
      fetchWeather(SEOUL.lat, SEOUL.lon, SEOUL.place)
    }

    return () => {
      cancelled = true
    }
  }, [])

  const time = now.toLocaleTimeString('ko-KR', { hour12: false })
  const date = now.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

  return (
    <div className="status-widget">
      <div className="status-time">{time}</div>
      <div className="status-date">{date}</div>
      <div className="status-weather">
        {weather ? (
          <>
            <span className="status-weather-icon">{weatherInfo(weather.code).icon}</span>
            <span className="status-temp">{weather.temp}°C</span>
            <span className="status-weather-label">
              {weatherInfo(weather.code).label} · {weather.place}
            </span>
          </>
        ) : weatherError ? (
          <span className="muted">날씨 정보를 불러올 수 없어요</span>
        ) : (
          <span className="muted">날씨 불러오는 중…</span>
        )}
      </div>
    </div>
  )
}
