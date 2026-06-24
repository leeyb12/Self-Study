-- ============================================================
-- v3: 첨부파일 기능 추가
--   mariadb -u root -p notes_app < migration_v3_attachments(MariaDB).sql
-- ============================================================

USE notes_app;

CREATE TABLE IF NOT EXISTS attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    note_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    original_name VARCHAR(255) NOT NULL,   -- 사용자가 올린 원본 파일명
    stored_name VARCHAR(255) NOT NULL,     -- 디스크에 저장된 고유 파일명
    content_type VARCHAR(150),
    size_bytes BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachments_note
        FOREIGN KEY (note_id) REFERENCES notes(id)
        ON DELETE CASCADE,
    INDEX idx_attachments_note_id (note_id),
    INDEX idx_attachments_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
