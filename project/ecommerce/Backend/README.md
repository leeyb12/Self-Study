# Ecommerce Backend

전자상거래 프로젝트의 Spring Boot API 서버입니다.

## 주요 도메인

- `analytics`: 행동 로그, 일별 요약, RFM 분석
- `cart`: 장바구니와 장바구니 항목
- `member`: 회원 정보와 인증 대상
- `order`: 주문과 주문 항목
- `product`: 상품과 카테고리
- `review`: 상품 리뷰

## 계층과 데이터 개념

- Controller는 HTTP 입력을 검증 가능한 DTO로 받고 적절한 상태 코드로 결과를 반환합니다.
- Service는 주문 생성, 장바구니 변경처럼 여러 엔티티가 관련된 작업의 트랜잭션 경계를 만듭니다.
- JPA는 엔티티와 관계형 테이블을 연결하고 QueryDSL은 조건이 달라지는 조회를 타입 안전하게 구성합니다.
- 주문 금액과 상품 가격은 변경 시점과 저장 기준을 명확히 해야 과거 주문 내역이 달라지지 않습니다.
- RFM은 최근 구매 시점, 구매 빈도, 구매 금액으로 고객 행동을 구분하는 분석 방식입니다.

## 실행

```powershell
cd project\ecommerce\Backend
.\gradlew.bat bootRun
```

## 참고 파일

- `build.gradle`: 의존성과 빌드 설정
- `src/main/resources/application.properties`: DB와 서버 설정
- `src/main/java/com/pknu26/ecommerce`: 애플리케이션 소스
