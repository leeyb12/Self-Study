# Game Backend

게임 프로젝트의 Spring Boot 백엔드입니다. 점수 기록, AI 요청, 실시간 온라인 게임 통신을 담당합니다.

## 주요 영역

- `score`: 게임 점수 저장과 조회
- `ai`: AI 응답 요청 관련 API
- `realtime`: 온라인 틱택토, 퀴즈, 오목 실시간 상태 관리
- `config`: WebSocket과 보안 설정
- `db/`: DB 초기화 SQL

## 핵심 개념

- HTTP API는 점수 저장처럼 요청과 응답으로 끝나는 작업에 적합합니다.
- WebSocket은 연결을 유지하므로 상대의 수, 방 상태와 퀴즈 진행 상황을 즉시 전달할 수 있습니다.
- STOMP는 WebSocket 메시지를 목적지 기반의 발행·구독 방식으로 구성합니다.
- 온라인 게임의 서버는 잘못된 수를 검증하고 승패를 판정하는 최종 기준이 되어야 합니다.
- 방 종료와 연결 해제 시 남은 참가자와 메모리 상태를 정리해야 합니다.

## 실행

```powershell
cd project\Game\backend
.\gradlew.bat bootRun
```

설정 값은 `src/main/resources/application.properties`를 확인합니다.
