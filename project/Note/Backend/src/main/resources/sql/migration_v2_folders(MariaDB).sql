-- ============================================================
-- v2: 폴더 기능 추가 (root 또는 note 계정으로 실행)
--   mariadb -u root -p notes_app < migration_v2_folders(MariaDB).sql
-- ============================================================

USE notes_app;

-- 1) 폴더 테이블
CREATE TABLE IF NOT EXISTS folders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_folders_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    INDEX idx_folders_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2) notes 에 folder_id 추가 (NULL = 미분류). 폴더 삭제 시 노트는 미분류로 이동.
ALTER TABLE notes
    ADD COLUMN folder_id BIGINT NULL AFTER user_id,
    ADD CONSTRAINT fk_notes_folder
        FOREIGN KEY (folder_id) REFERENCES folders(id)
        ON DELETE SET NULL,
    ADD INDEX idx_notes_folder_id (folder_id);
