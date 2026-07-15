# Phonebook Backend

연락처 관리 프로젝트의 Spring Boot API 서버입니다.

## 주요 영역

- `controller`: 인증과 연락처 API 엔드포인트
- `service`: 인증, 연락처, 그룹 비즈니스 로직
- `repository`: JPA Repository
- `entity`: 사용자, 연락처, 연락처 그룹 엔티티
- `security`: JWT 인증 필터와 토큰 제공자
- `sql/`: DB 스키마 또는 초기 SQL

## 실행

```powershell
cd project\phonebook\Backend
.\gradlew.bat bootRun
```

DB와 JWT 설정은 `src/main/resources/application.properties`를 확인합니다.
