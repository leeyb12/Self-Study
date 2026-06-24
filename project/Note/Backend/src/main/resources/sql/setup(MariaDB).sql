-- ============================================================
-- Note 앱 DB 초기 셋업 (root 계정으로 1회 실행)
--   실행 예) mariadb -u root -p < setup(MariaDB).sql
-- ============================================================

-- 1) 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS notes_app
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2) 전용 사용자 생성 (이미 있으면 무시)
CREATE USER IF NOT EXISTS 'note'@'localhost' IDENTIFIED BY '1234';

-- 3) notes_app DB 권한 부여 (★ 기존 오류 원인: note.* 가 아니라 notes_app.* 여야 함)
GRANT ALL PRIVILEGES ON notes_app.* TO 'note'@'localhost';
FLUSH PRIVILEGES;

-- 4) 테이블 생성
USE notes_app;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_notes_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    INDEX idx_notes_user_id (user_id),
    INDEX idx_notes_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
