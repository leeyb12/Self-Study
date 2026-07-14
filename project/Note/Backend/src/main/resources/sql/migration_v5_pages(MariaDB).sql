-- ============================================================
-- v5: 책 표지/종이 스타일 + 페이지 단위 노트
--   mariadb -u root -p notes_app < migration_v5_pages(MariaDB).sql
-- ============================================================

USE notes_app;

-- 1) 노트에 표지(cover) / 종이 스타일(paper) 추가
ALTER TABLE notes
    ADD COLUMN cover VARCHAR(30) NOT NULL DEFAULT 'classic' AFTER title,
    ADD COLUMN paper VARCHAR(30) NOT NULL DEFAULT 'plain' AFTER cover;

-- 2) 페이지 테이블 (page_no 는 1부터 시작하는 연속 번호)
CREATE TABLE IF NOT EXISTS pages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    note_id BIGINT NOT NULL,
    page_no INT NOT NULL,
    content TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pages_note
        FOREIGN KEY (note_id) REFERENCES notes(id)
        ON DELETE CASCADE,
    INDEX idx_pages_note_no (note_id, page_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3) 기존 노트 본문(notes.content)을 1페이지로 이전
--    (notes.content 컬럼은 레거시로 남겨두고 더 이상 사용하지 않는다)
INSERT INTO pages (note_id, page_no, content)
SELECT n.id, 1, n.content
FROM notes n
WHERE NOT EXISTS (SELECT 1 FROM pages p WHERE p.note_id = n.id);
