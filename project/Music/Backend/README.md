# Music Backend

음악 프로젝트의 Spring Boot 백엔드입니다. 회원 인증, 음악 업로드/조회, 게시판, 댓글, 채팅 기능을 담당합니다.

## 주요 영역

- `controller`: 인증, 음악, 게시판 API
- `service`: 사용자, 음악, 게시판 비즈니스 로직
- `repository`: JPA Repository
- `entity`: 사용자, 음악, 게시글, 댓글, 게시글 파일
- `security`: JWT 필터와 WebSocket 인증 처리
- `handler`: 채팅 WebSocket 핸들러

## 실행

```powershell
cd project\Music\Backend
.\gradlew.bat bootRun
```

설정 값은 `src/main/resources/application.properties`를 확인합니다.
