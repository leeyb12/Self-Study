# React + Vite

전자상거래 프로젝트의 React 클라이언트입니다. 상품 탐색부터 장바구니, 결제, 주문 내역, 리뷰와 분석 화면까지 API와 연결합니다.

## 프로젝트 구조

- `pages/`: URL 단위 화면과 사용자 작업 흐름
- `components/`: 헤더, 레이아웃, 페이지네이션, 별점 같은 재사용 UI
- `api/`: 상품, 장바구니, 주문, 리뷰, 인증과 분석 API 모듈
- `store/authStore.js`: 여러 화면에서 공유하는 인증 상태

## 핵심 개념

React 컴포넌트는 상태가 바뀌면 다시 렌더링됩니다. 서버 데이터는 로딩·성공·실패 상태를 구분하고, 보호된 페이지는 인증 상태를 확인한 뒤 표시합니다. 장바구니와 주문 화면은 서버의 최신 가격과 수량을 기준으로 다시 검증해야 합니다.

## 실행

```powershell
npm install
npm run dev
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
