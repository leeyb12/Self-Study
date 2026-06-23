CREATE SEQUENCE users_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

CREATE SEQUENCE song_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

CREATE SEQUENCE board_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

CREATE SEQUENCE comments_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

CREATE SEQUENCE board_file_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- users
CREATE TABLE users (
    id       NUMBER        NOT NULL,
    username VARCHAR2(100) NOT NULL,
    password VARCHAR2(255) NOT NULL,
    role     VARCHAR2(50)  DEFAULT 'ROLE_USER' NOT NULL,
    CONSTRAINT pk_users     PRIMARY KEY (id),
    CONSTRAINT uq_users_name UNIQUE (username)
);

-- song
CREATE TABLE song (
    id         NUMBER        NOT NULL,
    title      VARCHAR2(255) NOT NULL,
    artist     VARCHAR2(255) NOT NULL,
    file_path  VARCHAR2(500) NOT NULL,
    image_path VARCHAR2(500),
    lyrics     CLOB,
    user_id    NUMBER,
    CONSTRAINT pk_song      PRIMARY KEY (id),
    CONSTRAINT fk_song_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE SET NULL
);

-- board
CREATE TABLE board (
    id         NUMBER        NOT NULL,
    title      VARCHAR2(255) NOT NULL,
    content    CLOB          NOT NULL,
    created_at TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL,
    user_id    NUMBER,
    CONSTRAINT pk_board      PRIMARY KEY (id),
    CONSTRAINT fk_board_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE SET NULL
);

-- comments
CREATE TABLE comments (
    id         NUMBER         NOT NULL,
    board_id   NUMBER,
    content    VARCHAR2(1000) NOT NULL,
    user_id    NUMBER,
    created_at TIMESTAMP      DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT pk_comments       PRIMARY KEY (id),
    CONSTRAINT fk_comments_board FOREIGN KEY (board_id)
        REFERENCES board(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_user  FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE SET NULL
);

-- board_file
CREATE TABLE board_file (
    id        NUMBER        NOT NULL,
    board_id  NUMBER,
    file_name VARCHAR2(500) NOT NULL,
    file_path VARCHAR2(500) NOT NULL,
    file_type VARCHAR2(50)  NOT NULL,
    CONSTRAINT pk_board_file       PRIMARY KEY (id),
    CONSTRAINT fk_board_file_board FOREIGN KEY (board_id)
        REFERENCES board(id) ON DELETE CASCADE
);