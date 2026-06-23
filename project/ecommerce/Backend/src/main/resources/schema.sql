-- ========================================
-- 이커머스 구매 행동 분석 플랫폼 Oracle DDL
-- Oracle XE 21c (IDENTITY 컬럼 지원)
-- 실행 전: CREATE USER ecommerce IDENTIFIED BY 1234;
--          GRANT DBA TO ecommerce;
-- 접속 후: conn ecommerce/1234
-- ========================================

-- 1. 회원
CREATE TABLE members (
    member_id   NUMBER(19)   GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email       VARCHAR2(100)  NOT NULL UNIQUE,
    password    VARCHAR2(255)  NOT NULL,
    name        VARCHAR2(50)   NOT NULL,
    phone       VARCHAR2(20),
    address     VARCHAR2(300),
    status      VARCHAR2(10)   DEFAULT 'ACTIVE'  NOT NULL,
    role        VARCHAR2(10)   DEFAULT 'USER'    NOT NULL,
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP
);

-- 2. 카테고리
CREATE TABLE categories (
    category_id  NUMBER(19)   GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name         VARCHAR2(100)  NOT NULL UNIQUE,
    description  VARCHAR2(500),
    created_at   TIMESTAMP,
    updated_at   TIMESTAMP
);

-- 3. 상품
CREATE TABLE products (
    product_id   NUMBER(19)   GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id  NUMBER(19)   NOT NULL,
    name         VARCHAR2(200)  NOT NULL,
    price        NUMBER(10)     NOT NULL,
    stock_qty    NUMBER(10)     DEFAULT 0,
    description  CLOB,
    status       VARCHAR2(10)   DEFAULT 'ON_SALE' NOT NULL,
    created_at   TIMESTAMP,
    updated_at   TIMESTAMP,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- 4. 장바구니
CREATE TABLE carts (
    cart_id     NUMBER(19) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    member_id   NUMBER(19) NOT NULL UNIQUE,
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP,
    CONSTRAINT fk_cart_member FOREIGN KEY (member_id) REFERENCES members(member_id)
);

-- 5. 장바구니 상품
CREATE TABLE cart_items (
    cart_item_id NUMBER(19) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cart_id      NUMBER(19)  NOT NULL,
    product_id   NUMBER(19)  NOT NULL,
    quantity     NUMBER(10)  NOT NULL,
    created_at   TIMESTAMP,
    updated_at   TIMESTAMP,
    CONSTRAINT fk_cart_item_cart    FOREIGN KEY (cart_id)    REFERENCES carts(cart_id),
    CONSTRAINT fk_cart_item_product FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT uq_cart_product      UNIQUE (cart_id, product_id)
);

-- 6. 주문
CREATE TABLE orders (
    order_id        NUMBER(19)   GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    member_id       NUMBER(19)   NOT NULL,
    total_price     NUMBER(12)   NOT NULL,
    status          VARCHAR2(15)   DEFAULT 'PENDING' NOT NULL,
    delivery_addr   VARCHAR2(300),
    payment_method  VARCHAR2(20),
    created_at      TIMESTAMP,
    updated_at      TIMESTAMP,
    CONSTRAINT fk_order_member FOREIGN KEY (member_id) REFERENCES members(member_id)
);

CREATE INDEX idx_order_member  ON orders(member_id);
CREATE INDEX idx_order_created ON orders(created_at);
CREATE INDEX idx_order_status  ON orders(status);

-- 7. 주문 상품
CREATE TABLE order_items (
    order_item_id NUMBER(19) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id      NUMBER(19)  NOT NULL,
    product_id    NUMBER(19)  NOT NULL,
    quantity      NUMBER(10)  NOT NULL,
    unit_price    NUMBER(10)  NOT NULL,
    created_at    TIMESTAMP,
    updated_at    TIMESTAMP,
    CONSTRAINT fk_order_item_order   FOREIGN KEY (order_id)   REFERENCES orders(order_id),
    CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 8. 리뷰
CREATE TABLE reviews (
    review_id   NUMBER(19)  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    member_id   NUMBER(19)  NOT NULL,
    product_id  NUMBER(19)  NOT NULL,
    rating      NUMBER(2)   NOT NULL,
    content     VARCHAR2(1000),
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP,
    CONSTRAINT fk_review_member  FOREIGN KEY (member_id)  REFERENCES members(member_id),
    CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT uq_member_product UNIQUE (member_id, product_id),
    CONSTRAINT chk_rating        CHECK (rating BETWEEN 1 AND 5)
);

-- 9. 행동 로그
CREATE TABLE behavior_logs (
    log_id          NUMBER(19)   GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    member_id       NUMBER(19),
    product_id      NUMBER(19),
    action_type     VARCHAR2(20)  NOT NULL,
    session_id      VARCHAR2(100),
    search_keyword  VARCHAR2(200),
    category_id     NUMBER(19),
    created_at      TIMESTAMP,
    updated_at      TIMESTAMP,
    CONSTRAINT fk_log_member  FOREIGN KEY (member_id)  REFERENCES members(member_id),
    CONSTRAINT fk_log_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE INDEX idx_behavior_member  ON behavior_logs(member_id);
CREATE INDEX idx_behavior_product ON behavior_logs(product_id);
CREATE INDEX idx_behavior_type    ON behavior_logs(action_type);
CREATE INDEX idx_behavior_created ON behavior_logs(created_at);

-- 10. RFM 점수 (구매 행동 분석)
CREATE TABLE rfm_scores (
    rfm_id        NUMBER(19)   GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    member_id     NUMBER(19)   NOT NULL UNIQUE,
    recency_days  NUMBER(10),
    frequency     NUMBER(10),
    monetary      NUMBER(15),
    r_score       NUMBER(2),
    f_score       NUMBER(2),
    m_score       NUMBER(2),
    rfm_score     VARCHAR2(3),
    segment       VARCHAR2(30),
    calculated_at TIMESTAMP,
    CONSTRAINT fk_rfm_member FOREIGN KEY (member_id) REFERENCES members(member_id)
);

CREATE INDEX idx_rfm_segment ON rfm_scores(segment);

-- 11. 일별 분석 집계 (배치 결과)
CREATE TABLE daily_analytics_summary (
    summary_id               NUMBER(19) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    summary_date             DATE       NOT NULL UNIQUE,
    total_orders             NUMBER(10) DEFAULT 0,
    total_revenue            NUMBER(15) DEFAULT 0,
    new_members              NUMBER(10) DEFAULT 0,
    view_count               NUMBER(15) DEFAULT 0,
    cart_add_count           NUMBER(15) DEFAULT 0,
    purchase_count           NUMBER(15) DEFAULT 0,
    cart_conversion_rate     NUMBER(5,2) DEFAULT 0,
    purchase_conversion_rate NUMBER(5,2) DEFAULT 0,
    created_at               TIMESTAMP,
    updated_at               TIMESTAMP
);

-- 샘플 카테고리 데이터
INSERT INTO categories (name, description) VALUES ('전자제품', '스마트폰, 노트북, 태블릿 등');
INSERT INTO categories (name, description) VALUES ('패션의류', '남성/여성 의류 및 잡화');
INSERT INTO categories (name, description) VALUES ('식품/음료', '신선식품 및 가공식품');
INSERT INTO categories (name, description) VALUES ('가구/인테리어', '소파, 침대, 조명 등');
INSERT INTO categories (name, description) VALUES ('도서', '국내외 도서 및 잡지');

COMMIT;