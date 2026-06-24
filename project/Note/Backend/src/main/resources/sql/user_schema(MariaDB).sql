-- MariaDB 버전

-- 데이터베이스 생성
CREATE DATABASE notes_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 전용 사용자 생성 (로컬 접속 기준, 원격이면 'note')
CREATE USER 'note'@'localhost' IDENTIFIED BY '1234';

-- 권한 부여 (DB 이름은 notes_app)
GRANT ALL PRIVILEGES ON notes_app.* TO 'note'@'localhost';

FLUSH PRIVILEGES;