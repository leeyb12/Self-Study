-- =====================================================================
-- 미니게임 백엔드 데이터베이스 초기화 스크립트 (MariaDB)
-- 실행: mysql -u root -p < init.sql   (또는 DBeaver/HeidiSQL에서 실행)
--
-- 참고: 앱의 JPA 설정이 ddl-auto=update 라서, DB와 계정만 만들어 두면
--       scores 테이블은 앱 최초 실행 시 Hibernate가 자동 생성한다.
--       (아래 CREATE TABLE 은 구조를 명시적으로 보여주기 위한 것이며,
--        Hibernate가 만드는 스키마와 동일하다. 미리 만들어 둬도 무방.)
-- =====================================================================

-- 1) 데이터베이스 (한글 이름/이모지 대비 utf8mb4)
CREATE DATABASE IF NOT EXISTS gamedb
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2) 애플리케이션 전용 계정 (application.properties 의 game / 1234 와 일치)
--    실제 배포에서는 비밀번호를 반드시 바꾸고 환경변수로 주입할 것.
CREATE USER IF NOT EXISTS 'game'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON gamedb.* TO 'game'@'localhost';
-- TCP(127.0.0.1)로 붙어 접속이 거부되면 아래 줄의 주석을 풀어 함께 부여:
-- CREATE USER IF NOT EXISTS 'game'@'127.0.0.1' IDENTIFIED BY '1234';
-- GRANT ALL PRIVILEGES ON gamedb.* TO 'game'@'127.0.0.1';
FLUSH PRIVILEGES;

USE gamedb;

-- 3) 점수/랭킹 테이블 (엔티티 com.pknu26.game.score.Score 와 1:1 매핑)
--    컬럼명은 Spring Boot 기본 네이밍 전략(camelCase -> snake_case)을 따른다.
CREATE TABLE IF NOT EXISTS scores (
  id          BIGINT       NOT NULL AUTO_INCREMENT,           -- @Id @GeneratedValue(IDENTITY)
  game_id     VARCHAR(50)  NOT NULL,                          -- gameId  (예: snake-130, quiz-ai)
  player_name VARCHAR(20)  NOT NULL,                          -- playerName
  score       BIGINT       NOT NULL,                          -- score (점수 또는 시간/시도수 등)
  created_at  DATETIME(6)  NOT NULL,                          -- createdAt (Instant -> datetime(6))
  PRIMARY KEY (id),
  KEY idx_game_score (game_id, score)                         -- gameId별 랭킹 정렬용 인덱스
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- =====================================================================
-- (선택) 향후 확장용 — 아직 코드에 엔티티가 없으므로 지금은 만들지 않아도 됨.
-- 사용자 인증/서버 저장 전적을 붙일 때 참고용 스케치.
-- =====================================================================
-- CREATE TABLE users (
--   id            BIGINT       NOT NULL AUTO_INCREMENT,
--   username      VARCHAR(30)  NOT NULL,
--   password_hash VARCHAR(100) NOT NULL,
--   created_at    DATETIME(6)  NOT NULL,
--   PRIMARY KEY (id),
--   UNIQUE KEY uq_users_username (username)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--
-- CREATE TABLE match_records (   -- AI 대전 전적을 사용자 기반으로 서버 저장할 때
--   id       BIGINT      NOT NULL AUTO_INCREMENT,
--   user_id  BIGINT      NOT NULL,
--   game_id  VARCHAR(50) NOT NULL,
--   result   VARCHAR(10) NOT NULL,   -- win / lose / draw
--   played_at DATETIME(6) NOT NULL,
--   PRIMARY KEY (id),
--   KEY idx_user_game (user_id, game_id),
--   CONSTRAINT fk_records_user FOREIGN KEY (user_id) REFERENCES users(id)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
