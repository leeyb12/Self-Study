# Phonebook Backend

연락처 관리 프로젝트의 Spring Boot API 서버입니다.

## 주요 영역

- `controller`: 인증과 연락처 API 엔드포인트
- `service`: 인증, 연락처, 그룹 비즈니스 로직
- `repository`: JPA Repository
- `entity`: 사용자, 연락처, 연락처 그룹 엔티티
- `security`: JWT 인증 필터와 토큰 제공자
- `sql/`: DB 스키마 또는 초기 SQL

## 요청 처리 흐름

1. 인증 필터가 요청 헤더의 JWT를 확인하고 사용자 정보를 보안 컨텍스트에 저장합니다.
2. Controller가 요청 DTO를 받고 Service에 작업을 위임합니다.
3. Service가 현재 사용자 소유의 연락처인지 확인한 뒤 Repository를 통해 조회하거나 변경합니다.
4. Entity를 응답 DTO로 변환해 필요한 데이터만 클라이언트에 반환합니다.

연락처와 그룹은 사용자별로 격리해야 하며 식별자만으로 조회하지 않고 소유자 조건을 함께 확인하는 것이 중요합니다.

## 실행

```powershell
cd project\phonebook\Backend
.\gradlew.bat bootRun
```

DB와 JWT 설정은 `src/main/resources/application.properties`를 확인합니다.
