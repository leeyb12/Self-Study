# Note Backend

AI 노트 프로젝트의 Spring Boot 백엔드입니다. 노트, 폴더, 페이지, 첨부파일, 인증, AI 도구 기능을 담당합니다.

## 주요 영역

- `controller`: 인증, 노트, 폴더, 페이지, 첨부파일, AI API
- `service`: 비즈니스 로직과 파일 저장, 텍스트 추출, 요약 처리
- `repository`: JPA Repository
- `entity`: 사용자, 노트, 폴더, 페이지, 첨부파일
- `security`: JWT 인증 설정
- `src/main/resources/sql`: MariaDB 스키마와 마이그레이션 SQL

## 처리 흐름과 개념

- Controller는 인증 사용자와 요청값을 받아 Service의 유스케이스를 호출합니다.
- 노트·폴더·페이지 변경은 소유권을 확인하고 하나의 트랜잭션 안에서 관계를 유지합니다.
- 파일 업로드는 원본 이름, 저장 이름, MIME 타입과 크기를 메타데이터로 관리합니다.
- 텍스트 추출과 요약은 시간이 오래 걸릴 수 있으므로 실패와 타임아웃을 사용자에게 구분해 전달해야 합니다.
- Ollama 연동에서는 모델 주소와 이름을 설정으로 분리하고 입력 길이와 응답 오류를 처리합니다.

## 실행

```powershell
cd project\Note\Backend
.\gradlew.bat bootRun
```

Ollama, DB, 업로드 경로 설정은 `src/main/resources/application.properties`를 확인합니다.
