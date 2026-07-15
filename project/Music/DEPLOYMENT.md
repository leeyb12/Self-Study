# Music Deployment

Music은 Oracle DB를 유지합니다. Oracle에 SQL을 적용한 뒤 Spring Boot 백엔드를 배포하고, GitHub Pages 프론트엔드가 배포된 백엔드 주소를 바라보게 합니다.

## 1. Oracle DB 준비

Oracle XE 또는 Oracle Cloud의 Oracle DB를 준비합니다.

DBA 계정으로 사용자 생성 SQL을 먼저 실행합니다.

```text
sql/music_project_schema.sql
```

그 다음 `music_project` 사용자로 접속해 테이블/시퀀스 SQL을 실행합니다.

```text
sql/music_project_table and sequence_ schema.sql
```

## 2. Backend 환경변수

배포 서비스(Render, Railway, VPS 등)에 아래 값을 등록합니다.

| 변수 | 예시 |
| --- | --- |
| `PORT` | `8080` |
| `DB_URL` | `jdbc:oracle:thin:@oracle-host:1521:xe` |
| `DB_USERNAME` | `music_project` |
| `DB_PASSWORD` | `strong-password` |
| `JWT_SECRET` | 최소 32바이트 이상의 긴 랜덤 문자열 |
| `CORS_ALLOWED_ORIGIN_PATTERNS` | `https://<user>.github.io` |
| `MUSIC_STORAGE_DIR` | `/data/music_storage` |

Oracle Cloud Autonomous Database를 사용할 경우 wallet/TCPS 설정이 추가로 필요합니다. 가장 단순한 배포는 Oracle XE가 떠 있는 VPS 또는 Oracle Cloud VM에 백엔드를 함께 올리는 방식입니다.

## 3. Docker 배포

`Backend/` 폴더를 Docker build context로 사용합니다.

```bash
docker build -t music-backend ./Backend
docker run -p 8080:8080 \
  -e DB_URL="jdbc:oracle:thin:@oracle-host:1521:xe" \
  -e DB_USERNAME="music_project" \
  -e DB_PASSWORD="strong-password" \
  -e JWT_SECRET="replace-with-long-secret" \
  -e CORS_ALLOWED_ORIGIN_PATTERNS="https://<user>.github.io" \
  -e MUSIC_STORAGE_DIR="/data/music_storage" \
  -v music-files:/data/music_storage \
  music-backend
```

## 4. GitHub Pages 연결

백엔드 배포 URL을 GitHub 저장소 변수에 등록합니다.

```text
MUSIC_API_BASE_URL=https://music-backend.example.com
MUSIC_WS_BASE_URL=wss://music-backend.example.com
```

등록 후 `Deploy Music and Note to GitHub Pages` 워크플로를 다시 실행합니다.
