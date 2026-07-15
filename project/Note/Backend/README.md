# Note Backend

AI 노트 프로젝트의 Spring Boot 백엔드입니다. 노트, 폴더, 페이지, 첨부파일, 인증, AI 도구 기능을 담당합니다.

## 주요 영역

- `controller`: 인증, 노트, 폴더, 페이지, 첨부파일, AI API
- `service`: 비즈니스 로직과 파일 저장, 텍스트 추출, 요약 처리
- `repository`: JPA Repository
- `entity`: 사용자, 노트, 폴더, 페이지, 첨부파일
- `security`: JWT 인증 설정
- `src/main/resources/sql`: MariaDB 스키마와 마이그레이션 SQL

## 실행

```powershell
cd project\Note\Backend
.\gradlew.bat bootRun
```

Ollama, DB, 업로드 경로 설정은 `src/main/resources/application.properties`를 확인합니다.
