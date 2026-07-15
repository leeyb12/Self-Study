# Note Deployment

Note는 MariaDB에 SQL을 적용한 뒤 Spring Boot 백엔드를 배포하고, GitHub Pages 프론트엔드가 그 백엔드 주소를 바라보게 하면 됩니다.

## 1. MariaDB 준비

MariaDB 서버를 만들고 아래 SQL을 순서대로 실행합니다.

```text
Backend/src/main/resources/sql/setup(MariaDB).sql
Backend/src/main/resources/sql/migration_v2_folders(MariaDB).sql
Backend/src/main/resources/sql/migration_v3_attachments(MariaDB).sql
Backend/src/main/resources/sql/migration_v4_trash(MariaDB).sql
Backend/src/main/resources/sql/migration_v5_pages(MariaDB).sql
```

호스팅 DB에서 `CREATE USER` 권한이 없다면 `setup(MariaDB).sql`의 DB/사용자 생성 부분은 건너뛰고, 제공받은 DB에 테이블 생성 SQL만 적용합니다.

## 2. Backend 환경변수

배포 서비스(Render, Railway, VPS 등)에 아래 값을 등록합니다.

| 변수 | 예시 |
| --- | --- |
| `PORT` | `8080` |
| `DB_URL` | `jdbc:mariadb://host:3306/notes_app?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Seoul` |
| `DB_USERNAME` | `note` |
| `DB_PASSWORD` | `strong-password` |
| `JWT_SECRET` | 최소 32바이트 이상의 긴 랜덤 문자열 |
| `CORS_ALLOWED_ORIGINS` | `https://<user>.github.io` 또는 GitHub Pages 전체 URL |
| `UPLOAD_DIR` | `/data/uploads` |
| `OLLAMA_BASE_URL` | Ollama 서버 주소. 없으면 로컬 기본값 |
| `OLLAMA_MODEL` | `gemma` 등 사용할 모델명 |

## 3. Docker 배포

`Backend/` 폴더를 Docker build context로 사용합니다.

```bash
docker build -t note-backend ./Backend
docker run -p 8080:8080 \
  -e DB_URL="jdbc:mariadb://host:3306/notes_app?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Seoul" \
  -e DB_USERNAME="note" \
  -e DB_PASSWORD="strong-password" \
  -e JWT_SECRET="replace-with-long-secret" \
  -e CORS_ALLOWED_ORIGINS="https://<user>.github.io" \
  -v note-uploads:/data/uploads \
  note-backend
```

## 4. GitHub Pages 연결

백엔드 배포 URL을 GitHub 저장소 변수에 등록합니다.

```text
NOTE_API_BASE_URL=https://note-backend.example.com
```

등록 후 `Deploy Music and Note to GitHub Pages` 워크플로를 다시 실행합니다.
