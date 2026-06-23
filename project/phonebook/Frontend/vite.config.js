import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // 자주 안 바뀌는 라이브러리를 별도 청크로 분리해 캐싱 효율을 높이고
        // 메인 번들 크기 경고를 해소한다. (rolldown 기반 Vite는 함수 형태를 사용)
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui') || id.includes('@emotion')) return 'mui-vendor';
            if (id.includes('react')) return 'react-vendor';
            return 'vendor';
          }
        },
      },
    },
  },
})
