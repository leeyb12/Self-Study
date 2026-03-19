import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // SPA 라우팅: 새로고침해도 index.html 서빙
  // (배포 시 서버에서 /* → index.html 설정 필요)
});