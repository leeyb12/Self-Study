import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 개발 중 /api 요청을 Spring Boot 백엔드(8080)로 프록시한다.
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
