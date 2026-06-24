-- ============================================================
-- v4: 휴지통(소프트 삭제) 기능
--   mariadb -u root -p notes_app < migration_v4_trash(MariaDB).sql
-- ============================================================

USE notes_app;

-- deleted_at 이 NULL 이면 활성 노트, 값이 있으면 휴지통에 있는 노트.
ALTER TABLE notes
    ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL AFTER updated_at,
    ADD INDEX idx_notes_deleted_at (deleted_at);
