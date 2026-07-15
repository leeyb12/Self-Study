# Ecommerce

전자상거래 서비스의 기본 흐름을 구현한 프로젝트입니다. 상품 탐색, 장바구니, 주문, 리뷰, 회원, 분석 대시보드 기능을 백엔드와 프론트엔드로 나누어 다룹니다.

## 구성

| 폴더 | 내용 |
| --- | --- |
| `Backend/` | Spring Boot API 서버 |
| `Frontend/` | React + Vite 클라이언트 |

## 주요 기능

- 회원 가입, 로그인, 인증 처리
- 카테고리와 상품 조회
- 장바구니 관리
- 주문 목록과 주문 상세
- 리뷰 작성/조회
- 분석 대시보드와 RFM 관련 기능

## 주요 기술

- Backend: Spring Boot, Spring Security, Spring Data JPA, QueryDSL, Gradle
- Frontend: React, Vite, Zustand, React Router, Recharts, Axios

## 실행 방법

Backend:

```powershell
cd project\ecommerce\Backend
.\gradlew.bat bootRun
```

Frontend:

```powershell
cd project\ecommerce\Frontend
npm install
npm run dev
```

DB 연결 정보와 보안 설정은 `Backend/src/main/resources/application.properties`를 확인합니다.
