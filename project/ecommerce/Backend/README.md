# Ecommerce Backend

전자상거래 프로젝트의 Spring Boot API 서버입니다.

## 주요 도메인

- `analytics`: 행동 로그, 일별 요약, RFM 분석
- `cart`: 장바구니와 장바구니 항목
- `member`: 회원 정보와 인증 대상
- `order`: 주문과 주문 항목
- `product`: 상품과 카테고리
- `review`: 상품 리뷰

## 실행

```powershell
cd project\ecommerce\Backend
.\gradlew.bat bootRun
```

## 참고 파일

- `build.gradle`: 의존성과 빌드 설정
- `src/main/resources/application.properties`: DB와 서버 설정
- `src/main/java/com/pknu26/ecommerce`: 애플리케이션 소스
