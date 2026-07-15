# Game Backend

게임 프로젝트의 Spring Boot 백엔드입니다. 점수 기록, AI 요청, 실시간 온라인 게임 통신을 담당합니다.

## 주요 영역

- `score`: 게임 점수 저장과 조회
- `ai`: AI 응답 요청 관련 API
- `realtime`: 온라인 틱택토, 퀴즈, 오목 실시간 상태 관리
- `config`: WebSocket과 보안 설정
- `db/`: DB 초기화 SQL

## 실행

```powershell
cd project\Game\backend
.\gradlew.bat bootRun
```

설정 값은 `src/main/resources/application.properties`를 확인합니다.
