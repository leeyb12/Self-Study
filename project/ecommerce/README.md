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

## 도메인 흐름

상품을 장바구니에 담으면 상품 식별자, 수량과 현재 사용자 정보가 연결됩니다. 주문 생성 시에는 장바구니 항목을 주문 항목으로 확정하고 재고·금액·상태를 일관되게 처리해야 합니다. 리뷰는 구매 사용자와 상품의 관계를 기준으로 검증하며, 분석 기능은 거래와 행동 데이터를 집계해 지표로 변환합니다.

프론트엔드의 Zustand는 로그인과 장바구니처럼 여러 화면이 공유하는 상태를 관리하고, React Router는 URL과 페이지를 연결합니다. Axios API 모듈은 화면 컴포넌트에서 통신 코드를 분리합니다.

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
