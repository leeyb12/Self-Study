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